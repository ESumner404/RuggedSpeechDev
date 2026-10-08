import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';

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
  await page.locator('.parent-mode-button').click();
  await setUpPin(page, pin);
  await expect(page.locator('.parent-mode-screen')).toBeVisible();
}

function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${label}$`) }),
  });
}

/** The row whose label input currently holds this value (a controlled
 * input's live value, not the HTML attribute), polled because the list
 * loads asynchronously. */
async function rowWithLabel(page: Page, label: string, timeoutMs = 5000) {
  const start = Date.now();
  for (;;) {
    const inputs = page.locator('.parent-mode-screen__label-input');
    const count = await inputs.count();
    for (let i = 0; i < count; i += 1) {
      if ((await inputs.nth(i).inputValue()) === label) {
        return page.locator('.parent-mode-screen__button-row').nth(i);
      }
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`No button row labelled "${label}" after ${timeoutMs}ms`);
    }
    await page.waitForTimeout(50);
  }
}

async function chooseBoard(page: Page, name: string): Promise<void> {
  await page.locator('.parent-mode-screen__board-picker select').selectOption({ label: name });
}

async function openFood(page: Page): Promise<void> {
  await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
  await boardButton(page, 'Food').click();
  await expect(boardButton(page, 'apple')).toBeVisible();
}

test.describe('Board editing: drag-and-drop and folders (docs/build-plan.md Phase 4)', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-editing-'));
  });

  test.afterEach(() => {
    rmSync(userDataDir, { recursive: true, force: true });
  });

  function launch() {
    return electron.launch({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${userDataDir}`],
    });
  }

  test('dragging one button onto another swaps just those two on the child board', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1122');

    await openFood(page);
    const labels = await page.locator('.board-button__label').allTextContents();
    const [first, second, third] = labels;
    expect(third).toBeDefined();
    const box = async (label: string) => (await boardButton(page, label).boundingBox())!;
    const before = { first: await box(first!), second: await box(second!), third: await box(third!) };

    // Talk's own Home button, not the Quick Access one: that leaves Talk
    // resuming mid-folder next time, which is what the second visit below
    // must not do.
    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();
    await enterParentMode(page, '1122');
    await chooseBoard(page, 'Food');

    const handle = (await rowWithLabel(page, first!)).locator('.parent-mode-screen__drag-handle');
    const target = await rowWithLabel(page, second!);
    await handle.dragTo(target);

    await page.locator('.parent-mode-screen__exit').click();
    await openFood(page);

    expect(await box(first!)).toEqual(before.second);
    expect(await box(second!)).toEqual(before.first);
    // Nothing else moved (invariant I3).
    expect(await box(third!)).toEqual(before.third);

    await app.close();
  });

  test('a new folder opens from the board, can hold its own buttons, and Back returns', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '3344');

    await enterParentMode(page, '3344');
    await chooseBoard(page, 'Food');

    const folderForm = page.locator('.parent-mode-screen__add-folder');
    await folderForm.locator('input[aria-label="New folder name"]').fill('Sweets');
    await folderForm.locator('button[type="submit"]').click();

    // The new folder is now a board of its own that can be filled.
    await expect(page.locator('.parent-mode-screen__board-picker select option', { hasText: 'Sweets' })).toHaveCount(1);
    await chooseBoard(page, 'Sweets');
    const wordForm = page.locator('.parent-mode-screen__add-form:not(.parent-mode-screen__add-folder)');
    await wordForm.locator('.parent-mode-screen__label-input').fill('toffee');
    await wordForm.locator('button[type="submit"]').click();
    await expect(page.locator('.parent-mode-screen__button-row')).toHaveCount(1);

    await page.locator('.parent-mode-screen__exit').click();
    await openFood(page);
    await boardButton(page, 'Sweets').click();
    await expect(boardButton(page, 'toffee')).toBeVisible();
    await expect(boardButton(page, 'apple')).toHaveCount(0);

    await page.locator('.talk-screen__nav-button', { hasText: 'Back' }).click();
    await expect(boardButton(page, 'apple')).toBeVisible();

    await app.close();
  });
});
