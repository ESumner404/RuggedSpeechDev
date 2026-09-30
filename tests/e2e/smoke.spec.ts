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
  await page.locator('.first-run-wizard__button--primary').click();
  await page.locator('.first-run-wizard__button--primary').click();
  await setUpPin(page, pin);
  await setUpPin(page, pin);
  await page.locator('.pin-gate__button').click();
  await expect(page.locator('.home-screen__tile').first()).toBeVisible();
}

test.describe('Skeleton', () => {
  test('opens maximised on the home screen, no menu, no devtools, secure context', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-smoke-'));
    const app = await electron.launch({
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

    const menu = await app.evaluate(({ Menu }) => Menu.getApplicationMenu());
    expect(menu).toBeNull();

    const devToolsOpened = await app.evaluate(
      ({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.webContents.isDevToolsOpened() ?? false,
    );
    expect(devToolsOpened).toBe(false);

    const isSecureContext = await page.evaluate(() => window.isSecureContext);
    expect(isSecureContext).toBe(true);

    await app.close();
    rmSync(userDataDir, { recursive: true, force: true });
  });

  test.skip(
    'second launch focuses the existing window instead of opening a new one',
    () => {
      // Single-instance lock is process-level: exercising it needs two OS
      // processes racing for the same lock file, which Playwright's
      // electron harness doesn't model (each launch gets an isolated
      // userData dir). Verify manually on the target machine per DEVICE.md
      // until this has a real automated equivalent.
    },
  );
});
