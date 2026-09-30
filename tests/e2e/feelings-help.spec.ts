import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${escapeRegExp(label)}$`) }),
  });
}

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

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

/** The first-run wizard (PLAN.md Phase 8) is mandatory and blocks
 * everything else — every fresh-profile test has to clear it first. */
async function completeFirstRun(page: Page, pin: string): Promise<void> {
  await page.locator('.first-run-wizard__button--primary').click();
  await page.locator('.first-run-wizard__button--primary').click();
  await setUpPin(page, pin);
  await setUpPin(page, pin);
  await page.locator('.pin-gate__button').click();
  await expect(page.locator('.home-screen__tile').first()).toBeVisible();
}

test.describe('Phase 2 — Feelings, Help, and fast access', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-feelings-'));
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

  test('composes and speaks an intensity-modified feeling', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Feelings & Help' }).click();
    await boardButton(page, 'worried').click();
    expect(await lastSpoken(page)).toBe('I feel worried');

    await page.locator('.intensity-row__button', { hasText: 'a lot' }).click();
    expect(await lastSpoken(page)).toBe('I feel worried, a lot');

    await app.close();
  });

  test('Help is one press away via Quick Access from deep inside a Talk folder', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'Food').click();
    await boardButton(page, 'Drinks').click();
    await expect(boardButton(page, 'juice')).toBeVisible();

    await page.locator('.quick-access-bar__button', { hasText: 'Help' }).click();
    await expect(page.locator('.page-tabs__tab[aria-pressed="true"]')).toHaveText('Help');

    await page.locator('.board-button', { hasText: "Don't touch me" }).click();
    expect(await lastSpoken(page)).toBe("Don't touch me");

    await app.close();
  });

  test('Recent history is off by default, records once enabled, survives a relaunch, and Clear empties it', async () => {
    let app = await launch();
    let page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await page.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
    await expect(page.locator('.recent-screen__toggle')).toHaveText('Recent history: Off');
    await expect(page.locator('.recent-screen__empty')).toContainText('Recent history is off');

    await page.locator('.recent-screen__toggle').click();
    await expect(page.locator('.recent-screen__toggle')).toHaveText('Recent history: On');

    await page.locator('.quick-access-bar__button', { hasText: 'Yes' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
    await expect(page.locator('.recent-screen__entry')).toHaveText(['yes']);

    await app.close();

    // Relaunch against the same profile directory — this is what "survives
    // a restart" actually means, not just "the variable is still in scope".
    app = await launch();
    page = await app.firstWindow();

    await page.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
    await expect(page.locator('.recent-screen__toggle')).toHaveText('Recent history: On');
    await expect(page.locator('.recent-screen__entry')).toHaveText(['yes']);

    await page.locator('.recent-screen__clear').click();
    await expect(page.locator('.recent-screen__entry')).toHaveCount(0);
    await expect(page.locator('.recent-screen__empty')).toContainText('Nothing said yet');

    await app.close();
  });

  test('Calm: breathing speaks its phases, and Quiet time counts down and can be stopped early', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Feelings & Help' }).click();
    await page.locator('.page-tabs__tab', { hasText: 'Calm' }).click();
    await expect(page.locator('.calm-tab__phase')).toHaveText('Ready when you are');

    await page.locator('.calm-tab__button', { hasText: 'Start' }).click();
    await expect(page.locator('.calm-tab__phase')).toHaveText('Breathe in');
    expect(await lastSpoken(page)).toBe('Breathe in');

    // Real time, not simulated — proves the phase genuinely advances on
    // its own once started, not just that the first press worked.
    await expect(page.locator('.calm-tab__phase')).toHaveText('Hold', { timeout: 6000 });

    await page.locator('.calm-tab__section', { hasText: 'Breathing' }).locator('button', { hasText: 'Stop' }).click();
    await expect(page.locator('.calm-tab__phase')).toHaveText('Ready when you are');

    const quietSection = page.locator('.calm-tab__section', { hasText: 'Quiet time' });
    await quietSection.locator('button', { hasText: '1 min' }).click();
    await expect(quietSection.locator('.calm-tab__countdown')).toHaveText('1:00');
    await expect(quietSection.locator('.calm-tab__countdown')).toHaveText('0:59', { timeout: 2000 });

    await quietSection.locator('button', { hasText: 'Stop' }).click();
    await expect(quietSection.locator('.calm-tab__countdown')).toHaveCount(0);
    await expect(quietSection.locator('button', { hasText: '1 min' })).toBeVisible();

    await app.close();
  });
});
