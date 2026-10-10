import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';
import { removeDir, launchElectron } from './cleanup';

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

test.describe('Skeleton', () => {
  test('opens maximised on the home screen, no menu, no devtools, secure context', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-smoke-'));
    const app = await launchElectron({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${userDataDir}`],
    });
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await expect(page.locator('.home-screen__tile')).toHaveCount(6);
    await expect(page.locator('.home-screen__tile').first()).toHaveText('Talk');

    const isMaximized = await app.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0]?.isMaximized() ?? false,
    );
    expect(isMaximized).toBe(true);

    // Windows has no menu at all. A Mac cannot, so it has only Hide, Quit and the editing shortcuts.
    const menuLabels = await app.evaluate(({ Menu }) => Menu.getApplicationMenu()?.items.map((item) => item.label) ?? null);
    if (process.platform === 'darwin') expect(menuLabels).toEqual(['Rugged Speech Test', 'Edit']);
    else expect(menuLabels).toBeNull();

    const devToolsOpened = await app.evaluate(
      ({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.webContents.isDevToolsOpened() ?? false,
    );
    expect(devToolsOpened).toBe(false);

    const isSecureContext = await page.evaluate(() => window.isSecureContext);
    expect(isSecureContext).toBe(true);

    await app.close();
    removeDir(userDataDir);
  });

  test.skip(
    'second launch focuses the existing window instead of opening a new one',
    () => {
      // Single-instance lock is process-level: exercising it needs two OS
      // processes racing for the same lock file, which Playwright's
      // electron harness doesn't model (each launch gets an isolated
      // userData dir). Verify manually on the target machine per docs/device-checks.md
      // until this has a real automated equivalent.
    },
  );
});
