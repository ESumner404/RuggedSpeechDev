import { expect, test } from '@playwright/test';
import { completeFirstRun, launchApp, makeUserDataDir } from './helpers';

// With the text size turned right up, the buttons grow and the screen has less
// room. Nothing may be hidden with no way to reach it: the grids scroll.

test.describe('Large text', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('large-text');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('at twice the text size the bottom rows can still be reached', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await app.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0]!;
      win.unmaximize();
      win.setSize(1280, 800);
    });
    await completeFirstRun(page, '1234');
    await page.evaluate(() => document.documentElement.style.setProperty('--text-scale', '2'));

    // Talk: the grid scrolls, and Home and Back stay on screen below it
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    const grid = page.locator('.talk-screen__grid');
    await expect(grid.locator('.board-button').first()).toBeVisible();
    expect(await grid.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    // Pictures can finish loading after the first look and change the heights, so scroll to the
    // last button the way a person would, and check that it can be reached.
    await grid.locator('.board-button').last().scrollIntoViewIfNeeded();
    await expect(grid.locator('.board-button').last()).toBeInViewport();
    await expect(page.locator('.talk-screen__nav-button').first()).toBeInViewport();
    await page.locator('.home-button').click();

    // Feelings: the three "how much" buttons are reachable below the words
    await page.locator('.home-screen__tile', { hasText: 'Feelings' }).click();
    await expect(page.locator('.feelings-help-screen__grid .board-button').first()).toBeVisible();
    await page.locator('.intensity-row__button').last().scrollIntoViewIfNeeded();
    await expect(page.locator('.intensity-row__button').last()).toBeInViewport();
    await page.locator('.home-button').click();

    // Keyboard: Speak stays in view, and the last row of keys can be reached
    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await expect(page.locator('.on-screen-keyboard')).toBeVisible();
    await expect(page.locator('.keyboard-screen__actions .sentence-strip__speak')).toBeInViewport();
    await page.locator('.on-screen-keyboard__key--backspace').scrollIntoViewIfNeeded();
    await expect(page.locator('.on-screen-keyboard__key--backspace')).toBeInViewport();

    await app.close();
  });
});
