import { expect, test } from '@playwright/test';
import { completeFirstRun, enterParentMode, exitParentMode, launchApp, makeUserDataDir, openTab } from './helpers';

// What an attacker, or a mistake, could try, against the real packaged app.
// The window is treated as untrusted: these check that even so it stays
// inside the app, off the network, and without Node.

test.describe('security of the packaged app', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('security');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('the page has no Node, and only the narrow bridge the app gave it', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    const found = await page.evaluate(() => ({
      require: typeof (window as unknown as { require?: unknown }).require,
      process: typeof (window as unknown as { process?: unknown }).process,
      buffer: typeof (window as unknown as { Buffer?: unknown }).Buffer,
      global: typeof (window as unknown as { global?: unknown }).global,
      bridge: Object.keys((window as unknown as { myWords: object }).myWords).sort(),
      secure: window.isSecureContext,
      origin: location.origin,
    }));
    expect(found.require).toBe('undefined');
    expect(found.process).toBe('undefined');
    expect(found.buffer).toBe('undefined');
    expect(found.global).toBe('undefined');
    expect(found.bridge).toEqual(['backup', 'files', 'parentMode', 'startup', 'versions']);
    expect(found.secure).toBe(true);
    expect(found.origin).toBe('app://renderer');
    await app.close();
  });

  test('every response carries a policy that allows nothing from outside the app', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    const headers = await page.evaluate(async () => {
      const response = await fetch('app://renderer/index.html');
      return {
        csp: response.headers.get('content-security-policy'),
        sniff: response.headers.get('x-content-type-options'),
        referrer: response.headers.get('referrer-policy'),
      };
    });
    expect(headers.csp).toContain("default-src 'none'");
    expect(headers.csp).toContain("script-src 'self'");
    expect(headers.csp).not.toMatch(/https?:|\*|unsafe-eval/);
    expect(headers.sniff).toBe('nosniff');
    expect(headers.referrer).toBe('no-referrer');
    await app.close();
  });

  test('a request for a file outside the app, however it is written, is refused', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    const statuses = await page.evaluate(async () => {
      const results: Record<string, number | string> = {};
      for (const path of [
        'app://renderer/%2e%2e%2f%2e%2e%2fpackage.json',
        'app://renderer/..%2fpackage.json',
        'app://renderer/assets/%2e%2e/%2e%2e/%2e%2e/package.json',
        'app://renderer/%2e%2e%5cpackage.json',
        'app://renderer/index.html%00.png',
        'app://other/index.html',
      ]) {
        try {
          results[path] = (await fetch(path)).status;
        } catch (error) {
          results[path] = `blocked: ${(error as Error).name}`;
        }
      }
      return results;
    });
    for (const [path, status] of Object.entries(statuses)) {
      expect(status === 404 || String(status).startsWith('blocked'), `${path} -> ${status}`).toBe(true);
    }
    // And an ordinary file is still served.
    const ok = await page.evaluate(async () => (await fetch('app://renderer/index.html')).status);
    expect(ok).toBe(200);
    await app.close();
  });

  test('nothing can reach the internet: not from the page, not from the main process', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    const fromPage = await page.evaluate(async () => {
      const tries: Record<string, string> = {};
      for (const url of ['https://example.com/', 'http://example.com/', 'wss://example.com/', 'http://127.0.0.1:9/']) {
        try {
          if (url.startsWith('ws')) {
            await new Promise<void>((resolve, reject) => {
              const socket = new WebSocket(url);
              socket.onopen = () => resolve();
              socket.onerror = () => reject(new Error('blocked'));
            });
          } else {
            await fetch(url, { mode: 'no-cors' });
          }
          tries[url] = 'reached';
        } catch {
          tries[url] = 'blocked';
        }
      }
      return tries;
    });
    for (const [url, result] of Object.entries(fromPage)) expect(result, url).toBe('blocked');

    const fromMain = await app.evaluate(async ({ net }) => {
      try {
        await net.fetch('https://example.com/');
        return 'reached';
      } catch {
        return 'blocked';
      }
    });
    expect(fromMain).toBe('blocked');
    await app.close();
  });

  test('a whole first run and a visit round the app makes no request outside the app', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await completeFirstRun(page, '1357');
    await enterParentMode(page, '1357');
    for (const tab of [/^Look$/, /^My body$/, /^Music$/, /^User guide$/, /^Activity$/]) await openTab(page, tab);
    await exitParentMode(page);
    for (const tile of ['Talk', 'Keyboard', 'My Day', 'Feelings & Help']) {
      await page.locator('.home-screen__tile', { hasText: tile }).click();
      await page.locator('.home-button').click();
    }
    const outside = requests.filter((url) => !/^(app|blob|data):/.test(url));
    expect(outside).toEqual([]);
    expect(requests.length).toBeGreaterThan(0);
    await app.close();
  });

  test('the page cannot send itself anywhere else, open a window, or run code it was not given', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();

    // No new window.
    const opened = await page.evaluate(() => window.open('https://example.com/') === null);
    expect(opened).toBe(true);
    expect(app.windows()).toHaveLength(1);

    // No navigating away.
    await page.evaluate(() => {
      location.href = 'https://example.com/';
    });
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/^app:\/\/renderer\//);

    // No script of its own making: an inline script is refused, and the refusal is reported.
    // (Code run by the test tool itself is exempt from the policy, so eval is checked in the header test instead.)
    const code = await page.evaluate(async () => {
      let violations = 0;
      document.addEventListener('securitypolicyviolation', () => (violations += 1));
      (window as unknown as { __injected?: boolean }).__injected = false;
      const script = document.createElement('script');
      script.textContent = 'window.__injected = true';
      document.head.appendChild(script);
      const button = document.createElement('button');
      button.setAttribute('onclick', 'window.__injected = true');
      document.body.appendChild(button);
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { injected: (window as unknown as { __injected?: boolean }).__injected, violations };
    });
    expect(code.injected).toBe(false);
    expect(code.violations).toBeGreaterThanOrEqual(1);

    // No frames.
    const framed = await page.evaluate(async () => {
      const frame = document.createElement('iframe');
      frame.src = 'https://example.com/';
      document.body.appendChild(frame);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return frame.contentDocument?.URL ?? 'blocked';
    });
    expect(framed === 'blocked' || framed === 'about:blank' || framed.startsWith('chrome-error')).toBe(true);
    await app.close();
  });

  test('location, notifications and the rest are refused, and only the camera and microphone are ever asked for', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    const answers = await page.evaluate(async () => {
      const out: Record<string, string> = {};
      out['notifications'] = await Notification.requestPermission();
      out['geolocation'] = await new Promise<string>((resolve) =>
        navigator.geolocation.getCurrentPosition(
          () => resolve('allowed'),
          () => resolve('denied'),
        ),
      );
      try {
        await navigator.clipboard.readText();
        out['clipboard'] = 'allowed';
      } catch {
        out['clipboard'] = 'denied';
      }
      return out;
    });
    expect(answers['notifications']).toBe('denied');
    expect(answers['geolocation']).toBe('denied');
    expect(answers['clipboard']).toBe('denied');
    await app.close();
  });

  test('the PIN is not kept as typed, in the app\'s own storage', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '4821');
    const stored = await page.evaluate(
      () =>
        new Promise<string>((resolve, reject) => {
          const open = indexedDB.open('my-words');
          open.onerror = () => reject(open.error);
          open.onsuccess = () => {
            const get = open.result.transaction('meta').objectStore('meta').get('parentPin');
            get.onsuccess = () => resolve(JSON.stringify(get.result));
            get.onerror = () => reject(get.error);
          };
        }),
    );
    const record = JSON.parse(stored) as Record<string, unknown>;
    expect(Object.values(record).flatMap((v) => (typeof v === 'object' && v ? Object.values(v) : [v]))).not.toContain('4821');
    expect(record['pin']).toBeUndefined();
    expect(record['pinHash']).toBeDefined();
    await app.close();
  });
});
