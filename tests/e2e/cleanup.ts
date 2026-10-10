import { rmSync } from 'node:fs';
import { _electron as electron, type ElectronApplication } from '@playwright/test';

/**
 * Removes a temporary folder. On Windows the app can still be letting go of its
 * files for a moment after it closes (EBUSY), so try a few times, and if it still
 * will not go, leave it for the system to clear: it is only a temporary folder.
 */
export function removeDir(path: string): void {
  try {
    rmSync(path, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    /* a temporary folder that is still in use; the system clears it later */
  }
}

type LaunchOptions = Parameters<typeof electron.launch>[0];

/**
 * Starts the app. Now and then, on a build computer, the connection Playwright makes
 * to the app's debug port is reset and the start never finishes, though the window has
 * opened (the log shows ECONNRESET), and starting it again straight away works. So
 * each try is given only a short time, and a start that does not finish is thrown away
 * and tried again, rather than waiting out the whole test.
 */
export async function launchElectron(options: LaunchOptions): Promise<ElectronApplication> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    let app: ElectronApplication | undefined;
    try {
      app = await electron.launch({ ...options, timeout: options?.timeout ?? 12_000 });
      // A start that gives no window is as good as one that never finished.
      await app.firstWindow({ timeout: 12_000 });
      return watch(app);
    } catch (error) {
      lastError = error;
      // The first failure of a run is shown in full (Playwright's own call log says where it stopped).
      console.log(`[launch] attempt ${attempt + 1} did not finish: ${String(error).slice(0, attempt === 0 ? 2500 : 160)}`);
      await app?.close().catch(() => undefined);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  throw lastError;
}

/**
 * On a build server only: say what the app is doing when a test has been
 * running too long, so a stuck run can be read from its log instead of guessed at.
 * It prints what the window shows and anything the page reported, and nothing else.
 */
function watch(app: ElectronApplication): ElectronApplication {
  if (!process.env['CI']) return app;
  app.on('window', (page) => {
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') console.log(`[page ${message.type()}] ${message.text().slice(0, 300)}`);
    });
    page.on('pageerror', (error) => console.log(`[page error] ${error.message.slice(0, 300)}`));
    page.on('crash', () => console.log('[page crashed]'));
  });
  app.process().on('exit', (code) => console.log(`[app exited] code ${code}`));
  const timer = setTimeout(async () => {
    console.log(`[still open after 40s] ${app.windows().length} window(s)`);
    for (const page of app.windows()) {
      const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 500)).catch((e: Error) => `(could not read the page: ${e.message.slice(0, 120)})`);
      console.log(`[still open after 40s] ${page.url()} :: ${text}`);
    }
  }, 40_000);
  app.on('close', () => clearTimeout(timer));
  return app;
}
