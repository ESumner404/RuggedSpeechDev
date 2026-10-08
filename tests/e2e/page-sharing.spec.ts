import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  completeFirstRun,
  enterParentMode,
  exitParentMode,
  launchApp,
  makeUserDataDir,
  openDetails,
  openTab,
  stubOpenDialog,
  stubSaveDialog,
} from './helpers';

const PHOTO = join(__dirname, 'fixtures/test-photo.png');

test.describe('Sharing a page between devices (Open Board Format)', () => {
  let user: ReturnType<typeof makeUserDataDir>;
  let other: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('share-a');
    other = makeUserDataDir('share-b');
  });

  test.afterEach(() => {
    user.remove();
    other.remove();
  });

  test('a page with a photo, a spoken phrase and a word stage saves to a file and arrives intact on a different device', async () => {
    const file = join(user.dir, 'zoo.obf');

    // Device one: build the page.
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    // A step that cannot be done fails with its own message, not a bare
    // test timeout.
    page.setDefaultTimeout(8_000);
    await completeFirstRun(page, '1234');
    await enterParentMode(page, '1234');
    await openTab(page, /^My Pages$/);

    await page.locator('.my-pages-tab__add-page input').fill('Zoo');
    await page.locator('.my-pages-tab__add-page button', { hasText: 'Add page' }).click();

    const addForm = page.locator('.parent-mode-screen__add-button-form');
    await addForm.locator('.parent-mode-screen__label-input').fill('seal');
    await addForm.locator('.photo-capture__file-input').setInputFiles(PHOTO);
    await expect(addForm).toContainText('Photo ready');
    await addForm.locator('button[type="submit"]').click();
    await expect(page.locator('.parent-mode-screen__button-row')).toHaveCount(1);

    const details = await openDetails(page, 'seal');
    await details.locator('.button-details__field', { hasText: 'What it says' }).locator('input').fill('a seal please');
    await details.locator('.button-details__field', { hasText: 'Word stage' }).locator('select').selectOption('2');
    await details.locator('.button-details__check', { hasText: 'Focus word' }).locator('input').check();

    await stubSaveDialog(app, file);
    await page.locator('button', { hasText: 'Share this page' }).click();
    await expect(page.locator('.my-pages-tab__share-message')).toContainText('Saved “Zoo”');

    // The file is standard Open Board Format, with the picture inside it.
    const obf = JSON.parse(readFileSync(file, 'utf-8'));
    expect(obf).toMatchObject({ format: 'open-board-0.1', name: 'Zoo' });
    expect(obf.images).toHaveLength(1);
    expect(obf.images[0].data).toMatch(/^data:image\//);
    expect(obf.buttons[0]).toMatchObject({
      label: 'seal',
      vocalization: 'a seal please',
      ext_my_speech_stage: 2,
      ext_my_speech_target: true,
    });
    await app.close();

    // Device two: nothing there, then the file is opened.
    app = await launchApp(other.dir);
    page = await app.firstWindow();
    await completeFirstRun(page, '4321');
    await enterParentMode(page, '4321');
    await openTab(page, /^My Pages$/);
    await expect(page.locator('.my-pages-tab__empty')).toBeVisible();

    await stubOpenDialog(app, file);
    await page.locator('button', { hasText: 'Add a shared page' }).click();
    await expect(page.locator('.my-pages-tab__share-message')).toContainText('Added “Zoo” as a new page.');
    await expect(page.locator('.my-pages-tab__page-button', { hasText: 'Zoo' })).toBeVisible();
    await expect(page.locator('.parent-mode-screen__button-row')).toHaveCount(1);

    // Its own copy of the picture, on this device, and the child can use it.
    await exitParentMode(page);
    await page.locator('.home-screen__tile', { hasText: 'My Pages' }).click();
    const photo = page.locator('.board-button__photo');
    await expect(photo).toBeVisible();
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.board-button', { hasText: 'seal' })).toHaveClass(/board-button--target/);

    await app.close();
  });

  test('a file that is not a page is refused plainly and adds nothing', async () => {
    const bad = join(user.dir, 'not-a-page.obf');
    (await import('node:fs')).writeFileSync(bad, 'this is not a page');

    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await enterParentMode(page, '1234');
    await openTab(page, /^My Pages$/);

    await stubOpenDialog(app, bad);
    await page.locator('button', { hasText: 'Add a shared page' }).click();
    await expect(page.locator('.parent-mode-screen__error')).toContainText("isn't a page");
    await expect(page.locator('.my-pages-tab__empty')).toBeVisible();

    await app.close();
  });
});
