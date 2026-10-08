import { expect, test, type Page } from '@playwright/test';
import { completeFirstRun, launchApp, makeUserDataDir, setUpPin } from './helpers';

// The PIN screens are the one place a child, a parent and a stranger all meet.
// Nothing on them may sit on top of anything else, at any sensible window size.

type Box = { name: string; x: number; y: number; w: number; h: number };

async function boxesOf(page: Page, selectors: string[]): Promise<Box[]> {
  return page.evaluate((list) => {
    const out: Box[] = [];
    for (const selector of list) {
      for (const el of Array.from(document.querySelectorAll(selector))) {
        const r = (el as HTMLElement).getBoundingClientRect();
        if (r.width > 0 && r.height > 0) out.push({ name: selector, x: r.x, y: r.y, w: r.width, h: r.height });
      }
    }
    return out;
  }, selectors);
}

function overlaps(boxes: Box[]): string[] {
  const found: string[] = [];
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i]!;
      const b = boxes[j]!;
      const across = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const down = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (across > 1 && down > 1) found.push(`${a.name} overlaps ${b.name}`);
    }
  }
  return found;
}

const PARTS = [
  '.pin-gate__prompt',
  '.pin-gate__error',
  '.pin-gate__dots',
  '.pin-gate__keypad',
  '.pin-gate__link',
  '.pin-gate__cancel',
  '.pin-gate__recovery-code',
  '.pin-gate__note',
  '.pin-gate__button',
  '.first-run-wizard__title',
  '.first-run-wizard__hint',
  '.first-run-wizard__button--back',
  '.first-run-wizard__progress',
];

const SIZES: [number, number][] = [
  [1280, 800],
  [1024, 640],
  [800, 600],
];

test.describe('PIN screens', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('pin-layout');
  });

  test.afterEach(() => {
    user.remove();
  });

  async function resize(app: Awaited<ReturnType<typeof launchApp>>, page: Page, width: number, height: number) {
    await app.evaluate(({ BrowserWindow }, size) => {
      const win = BrowserWindow.getAllWindows()[0]!;
      win.unmaximize();
      win.setContentSize(size[0]!, size[1]!);
    }, [width, height]);
    await page.setViewportSize({ width, height });
  }

  test('during set-up, the PIN entry, the recovery code and the Back button never overlap, and all stay on screen', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    while ((await page.locator('.first-run-wizard__title').textContent()) !== 'Set a Parent PIN') {
      await page.locator('.first-run-wizard__button--primary').click();
    }
    for (const [width, height] of SIZES) {
      await resize(app, page, width, height);
      expect(overlaps(await boxesOf(page, PARTS)), `${width}x${height} entry`).toEqual([]);
      const keypad = (await boxesOf(page, ['.pin-gate__keypad']))[0]!;
      expect(keypad.x, `${width}x${height} keypad left`).toBeGreaterThanOrEqual(-1);
      expect(keypad.x + keypad.w, `${width}x${height} keypad right`).toBeLessThanOrEqual(width + 1);
    }
    await setUpPin(page, '1357');
    await setUpPin(page, '1357');
    await expect(page.locator('.pin-gate__recovery-code')).toBeVisible();
    for (const [width, height] of SIZES) {
      await resize(app, page, width, height);
      expect(overlaps(await boxesOf(page, PARTS)), `${width}x${height} recovery`).toEqual([]);
    }
    await app.close();
  });

  test('over the child\'s screen, the Parent Mode PIN box fits the window and nothing in it overlaps', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1357');
    for (const [width, height] of SIZES) {
      await resize(app, page, width, height);
      await page.locator('.parent-mode-button').click();
      await expect(page.locator('.pin-gate')).toBeVisible();
      const gate = (await boxesOf(page, ['.pin-gate']))[0]!;
      expect(gate.x, `${width}x${height} left`).toBeGreaterThanOrEqual(-1);
      expect(gate.y, `${width}x${height} top`).toBeGreaterThanOrEqual(-1);
      expect(gate.x + gate.w, `${width}x${height} right`).toBeLessThanOrEqual(width + 1);
      expect(gate.y + gate.h, `${width}x${height} bottom`).toBeLessThanOrEqual(height + 1);
      expect(overlaps(await boxesOf(page, PARTS)), `${width}x${height}`).toEqual([]);
      // Forgotten PIN is a second layout.
      await page.locator('.pin-gate__link').click();
      expect(overlaps(await boxesOf(page, PARTS)), `${width}x${height} recovery entry`).toEqual([]);
      await page.locator('.pin-gate__cancel').click();
    }
    await app.close();
  });
});
