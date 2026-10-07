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

async function enterParentMode(page: Page, pin: string): Promise<void> {
  await page.locator('.parent-mode-button').click();
  await setUpPin(page, pin);
  await expect(page.locator('.parent-mode-screen')).toBeVisible();
}

function launch(userDataDir: string) {
  return electron.launch({
    executablePath: resolveExecutablePath(),
    args: [`--user-data-dir=${userDataDir}`],
  });
}

function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${label}$`) }),
  });
}

const barLabels = (page: Page) => page.locator('.quick-access-bar__button').allTextContents();

type Spoken = { text: string; pitch: number };

async function spyOnSpeech(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as { __spoken: Spoken[] };
    w.__spoken = [];
    window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
      w.__spoken.push({ text: utterance.text, pitch: utterance.pitch });
    };
  });
}

const allSpoken = (page: Page) => page.evaluate(() => (window as unknown as { __spoken: Spoken[] }).__spoken);

test.describe('Quick Access, press mode and pitch (PLAN.md Phases 1-2)', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-qa-'));
  });

  test.afterEach(() => {
    rmSync(userDataDir, { recursive: true, force: true });
  });

  test('an adult can rearrange the Quick Access bar; Help can never leave it; the layout survives a relaunch', async () => {
    let app = await launch(userDataDir);
    let page = await app.firstWindow();
    await completeFirstRun(page, '1357');
    expect(await barLabels(page)).toEqual(['Home', 'Help', 'Yes', 'No', 'Favourites', 'Keyboard']);

    await enterParentMode(page, '1357');
    await page.locator('.page-tabs__tab', { hasText: 'Quick Access' }).click();
    const slots = page.locator('.quick-access-tab__slot select');

    await slots.nth(5).selectOption('talk');
    await expect(slots.nth(5)).toHaveValue('talk');

    // Taking Help off the bar is refused, with the reason shown.
    await slots.nth(1).selectOption('myday');
    await expect(page.locator('.parent-mode-screen__error')).toContainText('Help');
    await expect(slots.nth(1)).toHaveValue('help');

    await page.locator('.parent-mode-screen__exit').click();
    expect(await barLabels(page)).toEqual(['Home', 'Help', 'Yes', 'No', 'Favourites', 'Talk']);

    await page.locator('.quick-access-bar__button', { hasText: 'Talk' }).click();
    await expect(page.locator('.talk-screen')).toBeVisible();
    // Help is still one press away from here.
    await page.locator('.quick-access-bar__button', { hasText: 'Help' }).click();
    await expect(page.locator('.page-tabs__tab[aria-pressed="true"]')).toHaveText('Help');

    await app.close();

    app = await launch(userDataDir);
    page = await app.firstWindow();
    await expect(page.locator('.home-screen__tile').first()).toBeVisible();
    expect(await barLabels(page)).toEqual(['Home', 'Help', 'Yes', 'No', 'Favourites', 'Talk']);

    await app.close();
  });

  test('press mode "speaks straight away" and voice pitch reaches the utterance', async () => {
    const app = await launch(userDataDir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '2468');

    await enterParentMode(page, '2468');
    await page.locator('.page-tabs__tab', { hasText: /^Access$/ }).click();
    await page
      .locator('.access-tab__section', { hasText: 'When a button is pressed' })
      .locator('select')
      .selectOption('speak');
    await page.locator('.access-tab__section', { hasText: 'Voice pitch' }).locator('input[type="range"]').fill('1.25');
    await page.locator('.parent-mode-screen__exit').click();
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();

    await expect.poll(() => allSpoken(page)).toEqual([{ text: 'I', pitch: 1.25 }]);
    // Spoken straight away, so nothing was added to the sentence.
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(0);

    await app.close();
  });
});
