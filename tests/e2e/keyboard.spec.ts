import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';

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

function key(page: Page, char: string) {
  return page.locator('.on-screen-keyboard__key', { hasText: new RegExp(`^${char}$`, 'i') });
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

test.describe('Phase 3. Keyboard, prediction, and the stammering features', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-keyboard-'));
  });

  test.afterEach(() => {
    rmSync(userDataDir, { recursive: true, force: true });
  });

  function launch() {
    return electron.launch({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${userDataDir}`],
    });
  }

  test('Give me time fires in one press from the home screen', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.give-me-time-bar').click();
    expect(await allSpoken(page)).toEqual(['I know what I want to say. Please give me a moment.']);

    await app.close();
  });

  test('Give me time fires mid-typing without disturbing what has been typed', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await key(page, 'h').click();
    await key(page, 'i').click();
    await page.locator('.give-me-time-bar').click();

    expect(await allSpoken(page)).toEqual(['I know what I want to say. Please give me a moment.']);
    await expect(page.locator('.keyboard-screen__textbox')).toHaveText('hi');

    await app.close();
  });

  test('typing and a tapped suggestion build and speak the expected text', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await key(page, 'i').click();
    await page.locator('.on-screen-keyboard__key--space').click();
    await page.locator('.prediction-bar__suggestion', { hasText: 'want' }).click();

    await expect(page.locator('.keyboard-screen__textbox')).toHaveText('i want ');

    await page.locator('.sentence-strip__speak').click();
    expect(await allSpoken(page)).toEqual(['i want']);

    await app.close();
  });

  test("Show speaks nothing and displays the text large enough to read at arm's length", async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await key(page, 'h').click();
    await key(page, 'i').click();
    await page.locator('.keyboard-screen__show').click();

    await expect(page.locator('.show-overlay__text')).toHaveText('hi');
    const fontSize = await page
      .locator('.show-overlay__text')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThan(40); // comfortably arm's-length readable

    expect(await allSpoken(page)).toEqual([]);

    await app.close();
  });

  test('the personal phrase bank persists a saved phrase across a relaunch', async () => {
    let app = await launch();
    let page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Phrases' }).click();
    const nameInput = page.locator('#phrase-name');
    await nameInput.fill('Sam');
    await nameInput.blur();

    await app.close();

    app = await launch();
    page = await app.firstWindow();
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Phrases' }).click();
    await expect(page.locator('#phrase-name')).toHaveValue('Sam');

    await page
      .locator('.phrase-bank-tab__row', { hasText: 'Name' })
      .locator('.phrase-bank-tab__speak')
      .click();
    expect(await allSpoken(page)).toEqual(['Sam']);

    await app.close();
  });

  test('a conversation starter speaks the exact phrase shown', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Starters' }).click();
    await page.locator('.starters-tab__phrase', { hasText: 'How are you?' }).click();

    expect(await allSpoken(page)).toEqual(['How are you?']);

    await app.close();
  });
});
