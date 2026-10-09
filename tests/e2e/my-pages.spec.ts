import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';
import { removeDir, launchElectron } from './cleanup';

function parentModeButton(page: Page) {
  return page.locator('.parent-mode-button');
}

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

async function completeFirstRun(page: Page, pin: string): Promise<void> {
  // welcome, whose device, voice, grid size, pictures, what a press does and colours: each is optional, so just go on
  for (let step = 0; step < 7; step += 1) {
    await page.locator('.first-run-wizard__button--primary').click();
  }
  await setUpPin(page, pin);
  await setUpPin(page, pin);
  await page.locator('.pin-gate__button').click();
  await page.locator('.first-run-wizard__button--primary').click(); // the "you are ready" tour
  await expect(page.locator('.home-screen__tile').first()).toBeVisible();
}

async function enterParentMode(page: Page, pin: string): Promise<void> {
  await parentModeButton(page).click();
  await setUpPin(page, pin);
  await expect(page.locator('.parent-mode-screen')).toBeVisible();
}

function launch(userDataDir: string) {
  return launchElectron({
    executablePath: resolveExecutablePath(),
    args: [`--user-data-dir=${userDataDir}`],
  });
}

function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${label}$`) }),
  });
}

test.describe('My Pages, fully custom pages (feature review follow-up, Sep 2026)', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-mypages-'));
  });

  test.afterEach(() => {
    removeDir(userDataDir);
  });

  test('an adult-built page appears on the child screen and speaks the words placed on it', async () => {
    const app = await launch(userDataDir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await page.evaluate(() => {
      window.speechSynthesis.speak = () => {};
    });

    // Before any page exists, the child screen explains there's nothing
    // here yet rather than showing an empty grid.
    await page.locator('.home-screen__tile', { hasText: 'My Pages' }).click();
    await expect(page.locator('.my-pages-screen__empty-title')).toHaveText('No pages yet');
    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();

    await enterParentMode(page, '1234');
    await page.locator('.page-tabs__tab', { hasText: 'My Pages' }).click();

    await page.locator('.my-pages-tab__add-page input').fill('Dinosaurs');
    await page.locator('.my-pages-tab__add-page button', { hasText: 'Add page' }).click();
    await expect(page.locator('.my-pages-tab__page-button', { hasText: 'Dinosaurs' })).toBeVisible();

    const addForm = page.locator('.parent-mode-screen__add-form');
    await addForm.locator('.parent-mode-screen__label-input').fill('stomp');
    await addForm.locator('.parent-mode-screen__emoji-input').fill('🦖');
    await addForm.locator('button[type="submit"]').click();
    await expect(page.locator('.parent-mode-screen__button-row')).toHaveCount(1);

    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.home-screen__tile', { hasText: 'My Pages' }).click();

    // Exactly one page, opens straight to it, no picker tap needed.
    await expect(boardButton(page, 'stomp')).toBeVisible();
    await boardButton(page, 'stomp').click();
    await page.locator('.sentence-strip__speak').click();

    await app.close();
  });

  test('more than one page shows a picker on the child screen, and deleting a page removes it immediately', async () => {
    const app = await launch(userDataDir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await enterParentMode(page, '1234');
    await page.locator('.page-tabs__tab', { hasText: 'My Pages' }).click();

    for (const name of ['Dinosaurs', 'Space']) {
      await page.locator('.my-pages-tab__add-page input').fill(name);
      await page.locator('.my-pages-tab__add-page button', { hasText: 'Add page' }).click();
      await expect(page.locator('.my-pages-tab__page-button', { hasText: name })).toBeVisible();
    }

    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.home-screen__tile', { hasText: 'My Pages' }).click();

    await expect(page.locator('.my-pages-screen__picker-button', { hasText: 'Dinosaurs' })).toBeVisible();
    await expect(page.locator('.my-pages-screen__picker-button', { hasText: 'Space' })).toBeVisible();

    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();
    await enterParentMode(page, '1234');
    await page.locator('.page-tabs__tab', { hasText: 'My Pages' }).click();
    await page
      .locator('.my-pages-tab__list-row', { hasText: 'Space' })
      .locator('.my-pages-tab__delete-button')
      .click();
    await expect(page.locator('.my-pages-tab__page-button', { hasText: 'Space' })).toHaveCount(0);

    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.home-screen__tile', { hasText: 'My Pages' }).click();

    // Only one page left, straight in, no picker.
    await expect(page.locator('.my-pages-screen__picker')).toHaveCount(0);
    await expect(page.locator('.talk-screen__grid')).toBeVisible();

    await app.close();
  });
});
