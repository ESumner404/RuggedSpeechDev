import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, type ElectronApplication, type Page } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';
import { removeDir, launchElectron } from './cleanup';

export async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

export async function completeFirstRun(page: Page, pin: string): Promise<void> {
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

/** Opens Parent Mode with the Parent PIN, from the child's screen. */
export async function enterParentMode(page: Page, pin: string): Promise<void> {
  await page.locator('.parent-mode-button').click();
  await setUpPin(page, pin);
  await expect(page.locator('.parent-mode-screen')).toBeVisible();
}

export async function openTab(page: Page, label: string | RegExp): Promise<void> {
  await page.locator('.page-tabs__tab', { hasText: label }).click();
}

export async function exitParentMode(page: Page): Promise<void> {
  await page.locator('.parent-mode-screen__exit').click();
  await expect(page.locator('.app-shell')).toBeVisible();
}

export function boardButton(page: Page, label: string) {
  return page.locator('.board-button').filter({
    has: page.locator('.board-button__label', { hasText: new RegExp(`^${label}$`) }),
  });
}

/** The button row whose own label box currently holds this value (a
 * controlled input's live value, not the HTML attribute), polled because
 * lists load asynchronously. Looks inside each row, so other text boxes on
 * the same tab (a page name, say) can't throw it off. */
export async function rowWithLabel(page: Page, label: string, timeoutMs = 5000) {
  const start = Date.now();
  for (;;) {
    const rows = page.locator('.parent-mode-screen__button-row');
    const count = await rows.count();
    for (let i = 0; i < count; i += 1) {
      const row = rows.nth(i);
      if ((await row.locator('.parent-mode-screen__label-input').first().inputValue()) === label) return row;
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`No button row labelled "${label}" after ${timeoutMs}ms`);
    }
    await page.waitForTimeout(50);
  }
}

/** Opens a button's Details panel and returns it. */
export async function openDetails(page: Page, label: string) {
  const row = await rowWithLabel(page, label);
  await row.locator('.parent-mode-screen__details-toggle').click();
  return row.locator('.button-details');
}

export function launchApp(userDataDir: string): Promise<ElectronApplication> {
  return launchElectron({
    executablePath: resolveExecutablePath(),
    args: [`--user-data-dir=${userDataDir}`],
  });
}

export function makeUserDataDir(name: string): { dir: string; remove: () => void } {
  const dir = mkdtempSync(join(tmpdir(), `mywords-e2e-${name}-`));
  return { dir, remove: () => removeDir(dir) };
}

/** Points the native save dialog at a fixed path with no UI. */
export async function stubSaveDialog(app: ElectronApplication, filePath: string): Promise<void> {
  await app.evaluate(async ({ dialog }, path) => {
    dialog.showSaveDialog = (async () => ({ canceled: false, filePath: path })) as typeof dialog.showSaveDialog;
  }, filePath);
}

/** Points the native open dialog at a fixed path with no UI. */
export async function stubOpenDialog(app: ElectronApplication, filePath: string): Promise<void> {
  await app.evaluate(async ({ dialog }, path) => {
    dialog.showOpenDialog = (async () => ({
      canceled: false,
      filePaths: [path],
    })) as typeof dialog.showOpenDialog;
  }, filePath);
}

export async function spyOnSpeech(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __spoken: string[] }).__spoken = [];
    window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
      (window as unknown as { __spoken: string[] }).__spoken.push(utterance.text);
    };
  });
}

export const allSpoken = (page: Page) =>
  page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
