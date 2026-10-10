import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';
import { removeDir, launchElectron } from './cleanup';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

/** The first-run wizard (docs/build-plan.md Phase 8) is mandatory and blocks
 * everything else, every fresh-profile test has to clear it first. */
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

// board-button labels are short words ("I", "no") that would false-positive
// on substring matching against other buttons ("biscuit" contains "i"), so
// every lookup here matches the label text exactly.
function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${escapeRegExp(label)}$`) }),
  });
}

// Spies on speechSynthesis.speak so tests can assert what text the app
// dispatched without depending on real system TTS voices being present in
// this environment. speak.ts looks up window.speechSynthesis fresh on every
// call, so it's fine to install this after the app has already loaded.
async function spyOnSpeech(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __spoken: string[] }).__spoken = [];
    window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
      (window as unknown as { __spoken: string[] }).__spoken.push(utterance.text);
    };
  });
}

async function lastSpoken(page: Page): Promise<string | undefined> {
  return page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.at(-1));
}

test.describe('Phase 1, the core board', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-talk-'));
  });

  test.afterEach(() => {
    removeDir(userDataDir);
  });

  function launch() {
    return launchElectron({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${userDataDir}`],
    });
  }

  test('builds "I want a drink" and hears it, offline, from a cold start', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'want').click();
    await boardButton(page, 'Food').click();
    await boardButton(page, 'a drink').click();

    await expect(page.locator('.sentence-strip__chip')).toHaveText(['I', 'want', 'a drink']);

    await page.locator('.sentence-strip__speak').click();
    expect(await lastSpoken(page)).toBe('I want a drink');

    await app.close();
  });

  test('navigates two folders deep and builds a three-word sentence', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'like').click();
    await boardButton(page, 'Food').click();
    await boardButton(page, 'Drinks').click();
    await boardButton(page, 'juice').click();

    await expect(page.locator('.sentence-strip__chip')).toHaveText(['I', 'like', 'juice']);

    await page.locator('.sentence-strip__speak').click();
    expect(await lastSpoken(page)).toBe('I like juice');

    await app.close();
  });

  test('a button keeps the same screen position across folder navigation', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    const before = await boardButton(page, 'I').boundingBox();

    await boardButton(page, 'Food').click();
    await expect(boardButton(page, 'apple')).toBeVisible();
    await page.locator('.talk-screen__nav-button', { hasText: 'Back' }).click();

    const after = await boardButton(page, 'I').boundingBox();
    expect(after).toEqual(before);

    await app.close();
  });

  test('removing a chip drops it from what gets spoken', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'no').click();
    await page.locator('.sentence-strip__chip', { hasText: 'no' }).click();

    await expect(page.locator('.sentence-strip__chip')).toHaveText(['I']);

    await page.locator('.sentence-strip__speak').click();
    expect(await lastSpoken(page)).toBe('I');

    await app.close();
  });

  test('Clear all empties the sentence strip in one press', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'want').click();
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(2);

    await page.locator('.sentence-strip__clear').click();
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(0);

    await app.close();
  });

  test('a long press on a board button adds it to Favourites instead of the sentence', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    // "go" is not one of the seeded default favourites, unlike most of the
    // root board, a real test of the long press, not a pre-existing one.
    const goButton = boardButton(page, 'go');
    await goButton.dispatchEvent('pointerdown');
    await page.waitForTimeout(900);
    await goButton.dispatchEvent('pointerup');

    expect(await lastSpoken(page)).toBe('Added to Favourites');
    // The long press must not also have added "go" to the sentence.
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(0);

    await page.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
    await expect(boardButton(page, 'go')).toBeVisible();

    await app.close();
  });
});
