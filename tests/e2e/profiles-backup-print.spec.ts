import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { _electron as electron, expect, type ElectronApplication, type Page, test } from '@playwright/test';
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

/** The row whose label input currently holds this value, a controlled
 * input's live value, not the static HTML attribute, and the board list
 * itself loads asynchronously, so this polls rather than snapshotting once. */
async function rowWithLabel(page: Page, label: string, timeoutMs = 5000) {
  const start = Date.now();
  for (;;) {
    const inputs = page.locator('.parent-mode-screen__label-input');
    const count = await inputs.count();
    for (let i = 0; i < count; i += 1) {
      if ((await inputs.nth(i).inputValue()) === label) {
        return page.locator('.parent-mode-screen__button-row').nth(i);
      }
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`No button row labelled "${label}" after ${timeoutMs}ms`);
    }
    await page.waitForTimeout(50);
  }
}

/** The first-run wizard (docs/build-plan.md Phase 8) is mandatory and blocks
 * everything else, it sets the Parent PIN as its own third screen, so a
 * fresh profile already has a PIN by the time Home is reachable at all. */
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

async function enterParentModeExisting(page: Page, pin: string): Promise<void> {
  await parentModeButton(page).click();
  await setUpPin(page, pin);
  await expect(page.locator('.parent-mode-screen')).toBeVisible();
}

async function spyOnSpeech(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.speechSynthesis.speak = () => {};
  });
}

function launch(userDataDir: string) {
  return electron.launch({
    executablePath: resolveExecutablePath(),
    args: [`--user-data-dir=${userDataDir}`],
  });
}

/** Points the main process's native save dialog at a fixed path with no UI,
 * so the test never waits on a real OS file picker. */
async function stubSaveDialog(app: ElectronApplication, filePath: string): Promise<void> {
  await app.evaluate(async ({ dialog }, path) => {
    dialog.showSaveDialog = (async () => ({ canceled: false, filePath: path })) as typeof dialog.showSaveDialog;
  }, filePath);
}

async function stubOpenDialog(app: ElectronApplication, filePath: string): Promise<void> {
  await app.evaluate(async ({ dialog }, path) => {
    dialog.showOpenDialog = (async () => ({
      canceled: false,
      filePaths: [path],
    })) as typeof dialog.showOpenDialog;
  }, filePath);
}

test.describe('Phase 6. Profiles, backup, print', () => {
  test('switching profile opens Talk at the new page, and never disturbs Home layout or history', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-profiles-'));
    try {
      const app = await launch(userDataDir);
      const page = await app.firstWindow();
      await completeFirstRun(page, '7777');
      await spyOnSpeech(page);

      const homeTilesBefore = await page.locator('.home-screen__tile').allTextContents();

      // Build some communication history before switching profile.
      await page.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
      await page.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
      await page.locator('.recent-screen__toggle').click();
      await page.locator('.quick-access-bar__button', { hasText: 'Yes' }).click();

      // Exiting Parent Mode returns to whatever screen the Parent Mode
      // button was pressed from, back to Home first, so the comparison
      // below is a true like-for-like Home layout check.
      await page.locator('.quick-access-bar__button', { hasText: 'Home' }).click();
      await enterParentModeExisting(page, '7777');
      await page.locator('.page-tabs__tab', { hasText: 'Profiles' }).click();
      // hasText on the row would also match the board picker's own "School"
      // option in every other row, filter on the name label specifically.
      const schoolRow = page
        .locator('.profiles-tab__row')
        .filter({ has: page.locator('.profiles-tab__name', { hasText: /^School$/ }) });
      await schoolRow.getByRole('button', { name: 'Use this profile' }).click();
      await expect(schoolRow.locator('.profiles-tab__active')).toBeVisible();
      await page.locator('.parent-mode-screen__exit').click();

      // Home layout is exactly what it was before, no button moved.
      const homeTilesAfter = await page.locator('.home-screen__tile').allTextContents();
      expect(homeTilesAfter).toEqual(homeTilesBefore);

      // Talk now opens at the School board, not the root Talk board.
      await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
      await expect(page.locator('.board-button', { hasText: 'pencil' })).toBeVisible();
      await expect(page.locator('.board-button', { hasText: 'want' })).toHaveCount(0);
      await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();

      // History recorded before the switch is untouched.
      await page.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
      await page.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
      await expect(page.locator('.recent-screen__entry')).toHaveText(['yes']);

      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('a backup made on one machine restores identically on a clean one', async () => {
    const sourceDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-backup-src-'));
    const cleanDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-backup-clean-'));
    const backupDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-backup-file-'));
    const backupFile = join(backupDir, 'test.mwbackup');

    try {
      // --- Seed real data on the source machine ---
      const sourceApp = await launch(sourceDataDir);
      const sourcePage = await sourceApp.firstWindow();
      await completeFirstRun(sourcePage, '2468');

      await sourcePage.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
      await sourcePage.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
      await sourcePage.locator('.recent-screen__toggle').click();
      await sourcePage.locator('.quick-access-bar__button', { hasText: 'Yes' }).click();

      await enterParentModeExisting(sourcePage, '2468');

      await sourcePage.locator('.page-tabs__tab', { hasText: 'People' }).click();
      await sourcePage.locator('input[placeholder="Person name"]').fill('Grandma');
      await sourcePage.locator('input[placeholder="Relationship (e.g. Mum, teacher)"]').fill('Grandma');
      await sourcePage.locator('button[type="submit"]', { hasText: 'Save person' }).click();
      await expect(sourcePage.locator('.people-places-tab__record-name')).toHaveText('Grandma');

      await sourcePage.locator('.page-tabs__tab', { hasText: 'Boards' }).click();
      const helpRow = await rowWithLabel(sourcePage, 'help');
      await helpRow.locator('input[type="checkbox"]').click();

      await sourcePage.locator('.page-tabs__tab', { hasText: 'Backup' }).click();
      await stubSaveDialog(sourceApp, backupFile);
      await sourcePage.locator('button', { hasText: 'Save backup…' }).click();
      await expect(sourcePage.locator('.backup-tab__status')).toHaveText('Backup saved.');

      await sourceApp.close();

      // --- Restore on a genuinely clean machine ---
      const cleanApp = await launch(cleanDataDir);
      const cleanPage = await cleanApp.firstWindow();
      await completeFirstRun(cleanPage, '1357');
      await enterParentModeExisting(cleanPage, '1357');
      await cleanPage.locator('.page-tabs__tab', { hasText: 'Backup' }).click();
      await stubOpenDialog(cleanApp, backupFile);
      await cleanPage.locator('button', { hasText: 'Choose backup file…' }).click();
      await expect(cleanPage.locator('.backup-tab__warning')).toBeVisible();
      await cleanPage.locator('button', { hasText: 'Yes, replace everything' }).click();
      await expect(cleanPage.locator('.backup-tab__status')).toHaveText('Backup restored.');

      // The restored person record is there.
      await cleanPage.locator('.page-tabs__tab', { hasText: 'People' }).click();
      await expect(cleanPage.locator('.people-places-tab__record-name')).toHaveText('Grandma');

      // The restored hidden button is still hidden.
      await cleanPage.locator('.page-tabs__tab', { hasText: 'Boards' }).click();
      const restoredHelpRow = await rowWithLabel(cleanPage, 'help');
      await expect(restoredHelpRow.locator('input[type="checkbox"]')).toBeChecked();

      // The restored communication history is there, with history still on.
      await cleanPage.locator('.parent-mode-screen__exit').click();
      await cleanPage.locator('.quick-access-bar__button', { hasText: 'Favourites' }).click();
      await cleanPage.locator('.page-tabs__tab', { hasText: 'Recent' }).click();
      await expect(cleanPage.locator('.recent-screen__toggle')).toHaveText('Recent history: On');
      await expect(cleanPage.locator('.recent-screen__entry')).toHaveText(['yes']);

      await cleanApp.close();
    } finally {
      rmSync(sourceDataDir, { recursive: true, force: true });
      rmSync(cleanDataDir, { recursive: true, force: true });
      rmSync(backupDir, { recursive: true, force: true });
    }
  });

  test('a passphrase-protected backup requires the correct passphrase to restore', async () => {
    const sourceDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-backup-enc-src-'));
    const cleanDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-backup-enc-clean-'));
    const backupDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-backup-enc-file-'));
    const backupFile = join(backupDir, 'encrypted.mwbackup');

    try {
      const sourceApp = await launch(sourceDataDir);
      const sourcePage = await sourceApp.firstWindow();
      await completeFirstRun(sourcePage, '9999');
      await enterParentModeExisting(sourcePage, '9999');
      await sourcePage.locator('.page-tabs__tab', { hasText: 'Backup' }).click();

      await sourcePage.locator('.backup-tab__checkbox input').click();
      const passInputs = sourcePage.locator('.backup-tab__passphrase-fields input');
      await passInputs.nth(0).fill('family secret');
      await passInputs.nth(1).fill('family secret');

      await stubSaveDialog(sourceApp, backupFile);
      await sourcePage.locator('button', { hasText: 'Save backup…' }).click();
      await expect(sourcePage.locator('.backup-tab__status')).toHaveText('Backup saved.');
      await sourceApp.close();

      const cleanApp = await launch(cleanDataDir);
      const cleanPage = await cleanApp.firstWindow();
      await completeFirstRun(cleanPage, '9999');
      await enterParentModeExisting(cleanPage, '9999');
      await cleanPage.locator('.page-tabs__tab', { hasText: 'Backup' }).click();
      await stubOpenDialog(cleanApp, backupFile);
      await cleanPage.locator('button', { hasText: 'Choose backup file…' }).click();

      const restorePassInput = cleanPage.locator('[aria-label="Backup passphrase"]');
      await expect(restorePassInput).toBeVisible();

      await restorePassInput.fill('wrong guess');
      await cleanPage.locator('button', { hasText: 'Continue' }).click();
      await cleanPage.locator('button', { hasText: 'Yes, replace everything' }).click();
      await expect(cleanPage.locator('.parent-mode-screen__error')).toContainText('not correct');

      await cleanPage.locator('button', { hasText: 'Cancel' }).click();
      await stubOpenDialog(cleanApp, backupFile);
      await cleanPage.locator('button', { hasText: 'Choose backup file…' }).click();
      await cleanPage.locator('[aria-label="Backup passphrase"]').fill('family secret');
      await cleanPage.locator('button', { hasText: 'Continue' }).click();
      await cleanPage.locator('button', { hasText: 'Yes, replace everything' }).click();
      await expect(cleanPage.locator('.backup-tab__status')).toHaveText('Backup restored.');

      await cleanApp.close();
    } finally {
      rmSync(sourceDataDir, { recursive: true, force: true });
      rmSync(cleanDataDir, { recursive: true, force: true });
      rmSync(backupDir, { recursive: true, force: true });
    }
  });

  test('printed cards render at the stated physical size', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-print-'));
    try {
      const app = await launch(userDataDir);
      const page = await app.firstWindow();
      await completeFirstRun(page, '4444');
      await enterParentModeExisting(page, '4444');
      await page.locator('.page-tabs__tab', { hasText: 'Print' }).click();

      const sizeSelect = page.locator('.print-tab__controls select').nth(2);
      await sizeSelect.selectOption('30');

      await page.emulateMedia({ media: 'print' });
      const card = page.locator('.print-card').first();
      const widthPx = await card.evaluate((el) => parseFloat(getComputedStyle(el).width));
      const heightPx = await card.evaluate((el) => parseFloat(getComputedStyle(el).height));

      // 1mm = 96/25.4 CSS px.
      const expectedPx = 30 * (96 / 25.4);
      expect(widthPx).toBeCloseTo(expectedPx, 0);
      expect(heightPx).toBeCloseTo(expectedPx, 0);

      await page.emulateMedia({ media: 'screen' });
      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });
});
