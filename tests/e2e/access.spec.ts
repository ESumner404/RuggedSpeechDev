import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';

function parentModeButton(page: Page) {
  return page.locator('.parent-mode-button');
}

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

/** The first-run wizard (PLAN.md Phase 8) is mandatory and blocks
 * everything else — it sets the Parent PIN as its own third screen, so a
 * fresh profile already has a PIN by the time Home is reachable at all. */
async function completeFirstRun(page: Page, pin: string): Promise<void> {
  await page.locator('.first-run-wizard__button--primary').click();
  await page.locator('.first-run-wizard__button--primary').click();
  await setUpPin(page, pin);
  await setUpPin(page, pin);
  await page.locator('.pin-gate__button').click();
  await expect(page.locator('.home-screen__tile').first()).toBeVisible();
}

async function enterParentModeExisting(page: Page, pin: string): Promise<void> {
  await parentModeButton(page).click();
  await setUpPin(page, pin);
  await expect(page.locator('.parent-mode-screen')).toBeVisible();
}

async function spyOnSpeech(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __spoken: string[] }).__spoken = [];
    window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
      (window as unknown as { __spoken: string[] }).__spoken.push(utterance.text);
    };
  });
}

async function allSpoken(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
}

/** Presses the app-level Space-as-focus-advance fallback (PLAN.md Phase
 * 7's "operable with two switches and nothing else") until the focused
 * element's own text is the one wanted, rather than hardcoding a press
 * count tied to the exact DOM order. */
async function pressSpaceUntilFocused(page: Page, expectedText: string, maxPresses = 30): Promise<void> {
  for (let i = 0; i < maxPresses; i += 1) {
    const current = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? null);
    if (current === expectedText) return;
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
  }
  throw new Error(`Never focused an element with text "${expectedText}" after ${maxPresses} Space presses`);
}

function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${label}$`) }),
  });
}

/** Presses a key and waits for the scan-status live region to actually
 * reach the expected text, rather than a fixed sleep — self-verifying
 * (a real logic bug shows up as a clear mismatch) and immune to however
 * slow a heavily-loaded CI run happens to be. */
async function pressKeyExpectStatus(page: Page, key: string, expectedStatus: string): Promise<void> {
  await page.keyboard.press(key);
  await expect(page.locator('.board-grid__scan-status')).toHaveText(expectedStatus, { timeout: 5000 });
}

function launch(userDataDir: string) {
  return electron.launch({
    executablePath: resolveExecutablePath(),
    args: [`--user-data-dir=${userDataDir}`],
  });
}

test.describe('Phase 7 — Access', () => {
  test('the whole app is operable with two switches (Space, Enter) and nothing else: Home to a spoken sentence', async () => {
    // This is the longest, most step-heavy journey in the whole suite —
    // full wizard, Parent Mode, then a real scanning sweep — and cold
    // start occasionally runs well past the default 30s budget under this
    // environment's repeated-rebuild load, for reasons that didn't
    // reproduce in isolation. Generous, not indefinite.
    test.setTimeout(60_000);
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-access-'));
    try {
      const app = await launch(userDataDir);
      const page = await app.firstWindow();
      await completeFirstRun(page, '2580');
      await spyOnSpeech(page);

      // An adult turns on two-switch scanning — the only mouse/touch use
      // in this whole test, since setting it up is itself a Parent Mode
      // action, not part of the "two switches" journey being tested.
      await enterParentModeExisting(page, '2580');
      await page.locator('.page-tabs__tab', { hasText: /^Access$/ }).click();
      const scanSelect = page.locator('.access-tab__section', { hasText: 'Switch scanning' }).locator('select');
      await scanSelect.selectOption('twoSwitchStepped');
      await page.locator('.parent-mode-screen__exit').click();

      // Home screen: Space advances focus (the app-level fallback, since no
      // Grid is mounted here), Enter activates — reach and open Talk.
      await pressSpaceUntilFocused(page, 'Talk');
      await page.keyboard.press('Enter');
      await expect(page.locator('.board-grid__scan-status')).toBeVisible();

      // Talk screen: the board grid's own dedicated row/column scan now
      // owns Space (advance) and Enter (select). Root board row 0 is
      // I / want / like / more — pick "I" then "want".
      await pressKeyExpectStatus(page, 'Enter', 'Scanning: I'); // lock row 0
      await pressKeyExpectStatus(page, 'Enter', 'Scanning row 1'); // select "I" (already the first cell)
      await pressKeyExpectStatus(page, 'Enter', 'Scanning: I'); // lock row 0 again
      await pressKeyExpectStatus(page, 'Space', 'Scanning: want'); // advance to "want"
      await pressKeyExpectStatus(page, 'Enter', 'Scanning row 1'); // select "want"
      await expect(page.locator('.sentence-strip')).toContainText('I');
      await expect(page.locator('.sentence-strip')).toContainText('want');

      // Sweep past the remaining board rows to the auxiliary row (Clear
      // all, then Speak) and select Speak — still only Space and Enter.
      await pressKeyExpectStatus(page, 'Space', 'Scanning row 2');
      await pressKeyExpectStatus(page, 'Space', 'Scanning row 3');
      await pressKeyExpectStatus(page, 'Space', 'Scanning row 4');
      await pressKeyExpectStatus(page, 'Space', 'Scanning: more controls');
      await pressKeyExpectStatus(page, 'Enter', 'Scanning: Clear all');
      await pressKeyExpectStatus(page, 'Space', 'Scanning: Speak');
      await pressKeyExpectStatus(page, 'Enter', 'Scanning row 1');

      expect(await allSpoken(page)).toEqual(['I want']);

      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('high contrast and text size apply immediately and survive a relaunch', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-access-visual-'));
    try {
      let app = await launch(userDataDir);
      let page = await app.firstWindow();
      await completeFirstRun(page, '1111');

      await enterParentModeExisting(page, '1111');
      await page.locator('.page-tabs__tab', { hasText: /^Access$/ }).click();

      const contrastSelect = page.locator('.access-tab__section', { hasText: 'Visual' }).locator('select');
      await contrastSelect.selectOption('dark');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.dataset['contrast']))
        .toBe('dark');

      const textScaleSlider = page.locator('.access-tab__section', { hasText: 'Visual' }).locator('input[type="range"]');
      await textScaleSlider.fill('2');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--text-scale')))
        .toBe('2');

      const rootFontSize = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
      expect(rootFontSize).toBeCloseTo(32, 0); // 16px base × 2

      await app.close();

      app = await launch(userDataDir);
      page = await app.firstWindow();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.dataset['contrast']))
        .toBe('dark');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--text-scale')))
        .toBe('2');

      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('low-arousal palette swaps a board button\'s colour without changing its word class', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-access-palette-'));
    try {
      const app = await launch(userDataDir);
      const page = await app.firstWindow();
      await completeFirstRun(page, '3333');

      await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
      const before = await boardButton(page, 'I').evaluate((el) => getComputedStyle(el).backgroundColor);
      await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();

      await enterParentModeExisting(page, '3333');
      await page.locator('.page-tabs__tab', { hasText: /^Access$/ }).click();
      const checkbox = page
        .locator('.access-tab__checkbox', { hasText: 'Low-arousal' })
        .locator('input[type="checkbox"]');
      await checkbox.check();
      await page.locator('.parent-mode-screen__exit').click();

      await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
      await expect
        .poll(() => boardButton(page, 'I').evaluate((el) => getComputedStyle(el).backgroundColor))
        .not.toBe(before);

      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('speech rate applies to what gets spoken and survives a relaunch', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-access-rate-'));
    try {
      let app = await launch(userDataDir);
      let page = await app.firstWindow();
      await completeFirstRun(page, '4444');

      await enterParentModeExisting(page, '4444');
      await page.locator('.page-tabs__tab', { hasText: /^Access$/ }).click();
      const rateSlider = page.locator('.access-tab__section', { hasText: 'Speech rate' }).locator('input[type="range"]');
      await rateSlider.fill('0.75');
      await page.locator('.parent-mode-screen__exit').click();

      await page.evaluate(() => {
        (window as unknown as { __rates: number[] }).__rates = [];
        window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
          (window as unknown as { __rates: number[] }).__rates.push(utterance.rate);
        };
      });
      await page.locator('.quick-access-bar__button', { hasText: 'Yes' }).click();
      const rates = await page.evaluate(() => (window as unknown as { __rates: number[] }).__rates);
      expect(rates).toEqual([0.75]);

      await app.close();

      app = await launch(userDataDir);
      page = await app.firstWindow();
      await page.evaluate(() => {
        (window as unknown as { __rates: number[] }).__rates = [];
        window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
          (window as unknown as { __rates: number[] }).__rates.push(utterance.rate);
        };
      });
      await page.locator('.quick-access-bar__button', { hasText: 'Yes' }).click();
      expect(await page.evaluate(() => (window as unknown as { __rates: number[] }).__rates)).toEqual([0.75]);

      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });
});
