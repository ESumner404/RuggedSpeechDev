import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { completeFirstRun, enterParentMode, exitParentMode, launchApp, makeUserDataDir, openTab } from './helpers';

const PIN = '2468';

test.describe('other apps and videos, in the real app', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('apps-videos');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('a link to another app can be added and pressed, and a web address is refused everywhere', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);

    // The main process refuses a web address even if the page were to ask.
    const fromPage = await page.evaluate(async () => {
      const apps = (window as unknown as { myWords: { apps: { open: (link: string) => Promise<boolean> } } }).myWords.apps;
      return { web: await apps.open('https://example.com'), file: await apps.open('file:///etc/hosts'), app: await apps.open('tel:') };
    });
    expect(fromPage).toEqual({ web: false, file: false, app: true });

    await openTab(page, /^My apps$/);
    const form = page.locator('.apps-tab__form');
    await form.locator('input').nth(0).fill('Calls');
    await form.locator('input').nth(2).fill('https://example.com');
    await form.getByRole('button', { name: 'Add app' }).click();
    await expect(page.locator('.apps-tab [role="status"]')).toContainText('web address');
    await form.locator('input').nth(2).fill('tel:');
    await form.getByRole('button', { name: 'Add app' }).click();
    await expect(page.locator('.apps-tab__form + p, .apps-tab [role="status"]').first()).toContainText('Added Calls');

    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('apps');
    await exitParentMode(page);

    await page.locator('.quick-access-bar__button', { hasText: 'Apps' }).click();
    await expect(page.locator('.apps-screen__tile', { hasText: 'Calls' })).toBeVisible();
    await page.locator('.apps-screen__tile', { hasText: 'Calls' }).click();
    await expect(page.locator('.apps-screen [role="status"]')).toHaveCount(0);
    await app.close();
  });

  test('a video added on a computer is kept in the app, plays only when pressed, and is gone when removed', async () => {
    const clip = join(user.dir, 'School trip.mp4');
    writeFileSync(clip, Buffer.from('not really a film, but a file is a file'));
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Movies$/);

    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Add videos' }).click();
    await (await chooser).setFiles(clip);
    await expect(page.locator('.movies-tab [role="status"]')).toContainText('Added the movie');
    await expect(page.locator('.movies-tab__list input[aria-label="Name"]')).toHaveValue('School trip');

    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('movies');
    await exitParentMode(page);
    await page.locator('.quick-access-bar__button', { hasText: 'Movies' }).click();
    await expect(page.locator('video')).toHaveCount(0);
    await page.locator('.movies-screen__tile', { hasText: 'School trip' }).click();
    const video = page.locator('video.movies-player__video');
    await expect(video).toBeVisible();
    expect(await video.getAttribute('autoplay')).toBeNull();
    expect(await video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
    await page.locator('.movies-player__close').click();
    await expect(page.locator('video')).toHaveCount(0);

    // It is still there after the app is closed and opened again.
    await app.close();
    const again = await launchApp(user.dir);
    const second = await again.firstWindow();
    await second.locator('.quick-access-bar__button', { hasText: 'Movies' }).click();
    await expect(second.locator('.movies-screen__tile', { hasText: 'School trip' })).toBeVisible();
    await again.close();
  });
});
