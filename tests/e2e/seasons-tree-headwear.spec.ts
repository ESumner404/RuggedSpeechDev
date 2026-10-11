import { expect, test } from '@playwright/test';
import { allSpoken, completeFirstRun, enterParentMode, exitParentMode, launchApp, makeUserDataDir, openTab, spyOnSpeech } from './helpers';

const PIN = '1234';

test.describe('Seasons, the Christmas tree and head coverings', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('seasons');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('seasonal words speak when pressed, and a decorated tree is still there after closing the app', async () => {
    test.setTimeout(90_000);
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('game');
    await exitParentMode(page);
    await spyOnSpeech(page);

    await page.locator('.quick-access-bar__button', { hasText: 'Games' }).click();
    await page.locator('.games-menu__tile', { hasText: 'Seasons' }).click();
    expect(await allSpoken(page)).toEqual([]);
    await page.locator('.seasons-screen__choice', { hasText: 'Christmas' }).click();
    await page.locator('.seasons-screen__word', { hasText: 'present' }).click();
    expect(await allSpoken(page)).toEqual(['present']);
    await page.locator('.games-shell__back').click();

    await page.locator('.games-menu__tile', { hasText: 'Make a tree' }).click();
    await page.locator('.tree-screen__tool', { hasText: 'Gold bauble' }).click();
    await page.locator('.tree-screen__slot').nth(1).click();
    await page.locator('.tree-screen__tool', { hasText: 'Star' }).click();
    await page.locator('.tree-screen__slot').nth(0).click();
    await expect(page.locator('.tree-screen__slot--full')).toHaveCount(2);
    await app.close();

    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await page.locator('.quick-access-bar__button', { hasText: 'Games' }).click();
    await page.locator('.games-menu__tile', { hasText: 'Make a tree' }).click();
    await expect(page.locator('.tree-screen__slot--full')).toHaveCount(2);
    await app.close();
  });

  test('a head covering chosen in Parent Mode is on the figure the child points to', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^My body$/);
    const shapes = () => page.locator('.body-figure').first().locator('> path, > circle, > ellipse, > rect').count();
    const before = await shapes();
    await page.locator('[aria-label="Head covering"] button', { hasText: 'Hijab' }).click();
    await expect(page.locator('[aria-label="Head covering"] button', { hasText: 'Hijab' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[aria-label="Head covering colour"]')).toBeVisible();
    expect(await shapes()).toBeLessThanOrEqual(before);
    await exitParentMode(page);
    await page.locator('.home-screen__tile', { hasText: 'Feelings' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'My body' }).click();
    await expect(page.locator('.my-body .body-figure path[fill-rule="evenodd"]')).toHaveCount(1);
    await app.close();
  });

  test('an adult leaves a celebration out and changes its words, and it stays that way after closing the app', async () => {
    test.setTimeout(90_000);
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('game');
    await openTab(page, /^Seasons$/);
    await expect(page.locator('.seasons-tab h2').first()).toHaveText('The year');
    await page.locator('.seasons-tab__show', { hasText: 'Christmas' }).locator('input').uncheck();
    await page.getByRole('button', { name: 'Change the words for Eid' }).click();
    await page.getByLabel('Word 1 of Eid', { exact: true }).fill('crescent moon');
    await page.getByLabel('The new word', { exact: true }).fill('henna');
    await page.getByRole('button', { name: 'Add word' }).click();
    await exitParentMode(page);
    await app.close();

    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await spyOnSpeech(page);
    await page.locator('.quick-access-bar__button', { hasText: 'Games' }).click();
    await page.locator('.games-menu__tile', { hasText: 'Seasons' }).click();
    const christmas = page.locator('.seasons-screen__choice', { hasText: 'Christmas' });
    await expect(christmas).toBeDisabled();
    await expect(page.locator('.seasons-screen__choice')).toHaveCount(11);
    await page.locator('.seasons-screen__choice', { hasText: 'Eid' }).click();
    await expect(page.locator('.seasons-screen__word-label').first()).toHaveText('crescent moon');
    await page.locator('.seasons-screen__word', { hasText: 'henna' }).click();
    expect(await allSpoken(page)).toEqual(['henna']);
    await app.close();
  });
});
