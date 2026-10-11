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

/** The first-run wizard (docs/build-plan.md Phase 8) is mandatory and blocks
 * everything else, it sets the Parent PIN as its own third screen, so a
 * fresh profile already has a PIN by the time Home is reachable at all. */
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

/** The row whose label input currently holds this value, not a CSS
 * `[value=...]` selector, which matches the initial HTML attribute rather
 * than a controlled input's live value. The parent-mode-screen div renders
 * as soon as Parent Mode is entered, before its board data has finished
 * loading, so this polls rather than taking one snapshot. */
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

test.describe('Phase 4. Parent Mode and the PIN gate', () => {
  // Every test gets its own userData dir. Without this, Electron falls
  // back to the same default profile across launches, which is exactly
  // what caused these tests to hang the first time round: a PIN set up by
  // an earlier run (or an `open`'d dev instance) was still there, so
  // "Set up Parent Mode" never appeared and a later step waited forever.
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-parent-'));
  });

  test.afterEach(() => {
    removeDir(userDataDir);
  });

  function launch() {
    return launchElectron({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${userDataDir}`],
    });
  }

  test('a single press of the Parent Mode button opens the PIN gate immediately', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await expect(parentModeButton(page)).toHaveText('Parent Mode');
    await expect(page.locator('.pin-gate-overlay')).toHaveCount(0);

    // A standard button, one press, no hold gesture. Parent Mode itself
    // still requires the correct PIN behind this (invariant I4), so this
    // doesn't skip any protection; it only gets an adult to the PIN screen
    // faster (feature review, Sep 2026: the earlier hold-to-open design
    // was replaced after repeated reports that it read as broken).
    await parentModeButton(page).click();
    await expect(page.locator('.pin-gate-overlay')).toHaveCount(1);

    await app.close();
  });

  test('enters Parent Mode with the PIN set during first run, hides a button, and the child board reflects it', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    // First run's own third screen is exactly this setup flow, reused
    // here rather than duplicated, since the Parent Mode button's "no PIN
    // yet" path is no longer reachable once first run has completed.
    await completeFirstRun(page, '1234');

    await parentModeButton(page).click();
    await expect(page.locator('.pin-gate__prompt')).toHaveText('Enter the Parent Mode PIN');
    await setUpPin(page, '1234');

    await expect(page.locator('.parent-mode-screen')).toBeVisible();

    const helpRow = await rowWithLabel(page, 'help');
    await helpRow.locator('input[type="checkbox"]').click();

    await page.locator('.parent-mode-screen__exit').click();
    await expect(page.locator('.home-screen')).toBeVisible();

    // The hidden button is gone from the child's Talk board, but its slot
    // stays empty rather than the grid reflowing (invariant I3).
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await expect(page.locator('.board-button', { hasText: 'help' })).toHaveCount(0);
    const iPosition = await page
      .locator('.board-button')
      .filter({ has: page.locator('.board-button__label', { hasText: /^I$/ }) })
      .boundingBox();
    expect(iPosition).not.toBeNull();

    await app.close();
  });

  test('rejects the wrong PIN and unlocks with the right one on a later launch', async () => {
    let app = await launch();
    let page = await app.firstWindow();
    await completeFirstRun(page, '4321'); // ends back on Home, not inside Parent Mode
    await app.close();

    // Relaunch against the same profile, the PIN must survive a restart.
    app = await launch();
    page = await app.firstWindow();

    await parentModeButton(page).click();
    await expect(page.locator('.pin-gate__prompt')).toHaveText('Enter the Parent Mode PIN');

    await setUpPin(page, '0000');
    await expect(page.locator('.pin-gate__error')).toContainText('Wrong PIN');

    await setUpPin(page, '4321');
    await expect(page.locator('.parent-mode-screen')).toBeVisible();

    await app.close();
  });

  test('toggles fullscreen from Parent Mode', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1111');

    await parentModeButton(page).click();
    await setUpPin(page, '1111');

    // Asked through the same bridge the app itself uses. In a normal run
    // that is the real window state; the hidden test mode keeps a stand-in
    // instead, so a test never takes over the screen with real fullscreen.
    const isFullscreen = () =>
      page.evaluate(() =>
        (window as unknown as { myWords: { parentMode: { isFullscreen: () => Promise<boolean> } } }).myWords.parentMode.isFullscreen(),
      );

    expect(await isFullscreen()).toBe(false);
    await page.locator('.parent-mode-screen__header-actions .parent-mode-screen__button').first().click();
    await expect.poll(isFullscreen).toBe(true);

    // Leave it as found.
    await page.locator('.parent-mode-screen__header-actions .parent-mode-screen__button').first().click();
    await expect.poll(isFullscreen).toBe(false);

    await app.close();
  });
});
