import { execFileSync } from 'node:child_process';
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
  // On Windows build computers about half of the starts do not finish, so each is given less time and more tries.
  const slowStarts = Boolean(process.env['CI']) && process.platform === 'win32';
  const tries = slowStarts ? 12 : 6;
  const waitFor = slowStarts ? 6_000 : 12_000;
  for (let attempt = 0; attempt < tries; attempt += 1) {
    let app: ElectronApplication | undefined;
    try {
      app = await electron.launch({ ...options, timeout: options?.timeout ?? waitFor });
      // A start that gives no window is as good as one that never finished.
      await app.firstWindow({ timeout: waitFor });
      return closeSurely(watch(app));
    } catch (error) {
      lastError = error;
      // The first failure of a run is shown in full (Playwright's own call log says where it stopped).
      console.log(`[launch] attempt ${attempt + 1} did not finish: ${String(error).slice(0, attempt === 0 ? 2500 : 160)}`);
      await app?.close().catch(() => undefined);
      clearLeftovers(options?.args);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  throw lastError;
}

/**
 * Now and then the app's window closes on a Mac build computer but the program never exits, so a test waits
 * on app.close() until it times out and the leftover program then stalls the whole run's teardown (the log
 * shows 0 windows still open). A close that has not finished in ten seconds is ended outright; the app has
 * nothing left to save by then, because every test that cares has already read what it needed.
 */
function closeSurely(app: ElectronApplication): ElectronApplication {
  const close = app.close.bind(app);
  app.close = async () => {
    const pid = app.process().pid;
    const timer = setTimeout(() => {
      console.log('[close] the app did not exit in 10s; ending it');
      if (pid) {
        try {
          killOutright(pid);
        } catch {
          /* already gone */
        }
      }
    }, 10_000);
    try {
      await close();
    } finally {
      clearTimeout(timer);
    }
  };
  return app;
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

/**
 * Ends the app outright, the closest a test can get to pulling the power. On Windows the
 * program's helper processes are separate and carry on holding the profile folder after the
 * main one is killed, so the next start of the app on that folder fails; kill the whole group.
 */
export function killOutright(pid: number): void {
  if (process.platform === 'win32') {
    try {
      execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } catch {
      /* already gone */
    }
  } else {
    process.kill(pid, 'SIGKILL');
  }
}

/**
 * On Windows a start that failed leaves the program's helper processes running (as when one
 * is killed outright), and they pile up and slow or block the starts after it. Tests run one at
 * a time here, so after a failed start anything left over is stray: end it.
 */
function clearLeftovers(args: string[] | undefined): void {
  if (process.platform !== 'win32') {
    // A start that timed out is never handed back, so its program keeps running on the same profile folder and the
    // next start finds it already there. End whatever is using this attempt's folder (it is a one-off temporary one).
    const profile = args?.find((arg) => arg.startsWith('--user-data-dir='));
    if (!profile) return;
    try {
      execFileSync('pkill', ['-9', '-f', profile], { stdio: 'ignore' });
    } catch {
      /* none left */
    }
    return;
  }
  try {
    execFileSync('taskkill', ['/F', '/T', '/IM', 'Rugged Speech.exe'], { stdio: 'ignore' });
  } catch {
    /* none left */
  }
}
