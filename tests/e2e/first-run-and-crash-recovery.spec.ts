import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${escapeRegExp(label)}$`) }),
  });
}

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

test.describe('Phase 8 — first run and crash recovery', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-firstrun-'));
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

  test('the first-run wizard walks voice, grid size, then PIN, and only then shows Home', async () => {
    const app = await launch();
    const page = await app.firstWindow();

    await expect(page.locator('.home-screen__tile')).toHaveCount(0);
    await expect(page.locator('.first-run-wizard__title')).toHaveText('Choose a voice');

    await page.locator('.first-run-wizard__button--primary').click();
    await expect(page.locator('.first-run-wizard__title')).toHaveText('Choose a grid size');

    await page.locator('.first-run-wizard__button--primary').click();
    await expect(page.locator('.first-run-wizard__title')).toHaveText('Set a Parent PIN');
    await expect(page.locator('.pin-gate__prompt')).toContainText('Set up Parent Mode');

    await setUpPin(page, '2468');
    await setUpPin(page, '2468');
    await expect(page.locator('.pin-gate__recovery-code')).toBeVisible();
    await page.locator('.pin-gate__button').click();

    await expect(page.locator('.home-screen__tile')).toHaveCount(6);

    // A PIN now exists — the Parent Mode button leads straight to entry, not setup.
    await page.locator('.parent-mode-button').click();
    await expect(page.locator('.pin-gate__prompt')).toHaveText('Enter the Parent Mode PIN');

    await app.close();
  });

  test('an unclean shutdown mid-conversation is recovered on the next launch', async () => {
    let app = await launch();
    let page = await app.firstWindow();

    // Clear the wizard with defaults — this test cares about Talk state,
    // not the wizard's own choices.
    await page.locator('.first-run-wizard__button--primary').click();
    await page.locator('.first-run-wizard__button--primary').click();
    await setUpPin(page, '1234');
    await setUpPin(page, '1234');
    await page.locator('.pin-gate__button').click();
    await expect(page.locator('.home-screen__tile')).toHaveCount(6);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'like').click();
    await boardButton(page, 'Food').click();
    await expect(boardButton(page, 'apple')).toBeVisible();

    // No Home/Back press, no app.close() — kill the process outright, the
    // closest a test harness can get to "pulling the power".
    const pid = app.process().pid;
    expect(pid).toBeDefined();
    process.kill(pid!, 'SIGKILL');
    await new Promise((resolve) => setTimeout(resolve, 500));

    app = await launch();
    page = await app.firstWindow();

    // First run already completed — straight to Home, then Talk restores
    // exactly where the sentence and the page were left.
    await expect(page.locator('.home-screen__tile')).toHaveCount(6);
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();

    await expect(page.locator('.sentence-strip__chip')).toHaveText(['I', 'like']);
    await expect(boardButton(page, 'apple')).toBeVisible();

    await app.close();
  });

  test('pressing Home deliberately does not leave anything to recover', async () => {
    let app = await launch();
    let page = await app.firstWindow();

    await page.locator('.first-run-wizard__button--primary').click();
    await page.locator('.first-run-wizard__button--primary').click();
    await setUpPin(page, '5555');
    await setUpPin(page, '5555');
    await page.locator('.pin-gate__button').click();

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();
    await expect(page.locator('.home-screen')).toBeVisible();

    await app.close();

    app = await launch();
    page = await app.firstWindow();

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(0);

    await app.close();
  });
});
