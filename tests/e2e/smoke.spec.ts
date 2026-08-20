import { _electron as electron, expect, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';

test.describe('Phase 0 skeleton', () => {
  test('opens maximised showing hello, no menu, no devtools, secure context', async () => {
    const app = await electron.launch({ executablePath: resolveExecutablePath() });
    const window = await app.firstWindow();

    await expect(window.locator('.hello')).toHaveText('hello');

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

    const isSecureContext = await window.evaluate(() => window.isSecureContext);
    expect(isSecureContext).toBe(true);

    await app.close();
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
