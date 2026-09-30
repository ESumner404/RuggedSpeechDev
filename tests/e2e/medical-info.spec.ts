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

function launch(userDataDir: string) {
  return electron.launch({
    executablePath: resolveExecutablePath(),
    args: [`--user-data-dir=${userDataDir}`],
  });
}

test.describe('Feature review — Medical Info', () => {
  test('is reachable from the Home screen with no PIN, before and after being set up', async () => {
    const userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-medical-'));
    try {
      const app = await launch(userDataDir);
      const page = await app.firstWindow();
      await completeFirstRun(page, '1234');

      // Nothing set up yet — no PIN prompt, just a plain "not set up" message.
      await page.locator('.medical-info-button').click();
      await expect(page.locator('.medical-info-overlay__empty')).toContainText('No medical information');
      await page.locator('.medical-info-overlay__close').click();
      await expect(page.locator('.medical-info-overlay')).toHaveCount(0);

      // An adult fills it in via Parent Mode.
      await enterParentModeExisting(page, '1234');
      await page.locator('.page-tabs__tab', { hasText: 'Medical' }).click();
      await page.locator('.medical-info-tab__field input[type="text"]').fill('Sam');
      await page.locator('.medical-info-tab__field textarea').first().fill('Peanuts, penicillin');
      await page.locator('.medical-info-tab__contacts button', { hasText: 'Add a contact' }).click();
      const contactRow = page.locator('.medical-info-tab__contact-row').first();
      await contactRow.locator('input[placeholder="Name"]').fill('Mum');
      await contactRow.locator('input[placeholder="Phone"]').fill('07700 900001');
      await expect(page.locator('.medical-info-tab__qr svg')).toBeVisible();
      await page.locator('.parent-mode-screen__exit').click();

      // Reachable again from wherever we ended up, still no PIN — the same
      // press that worked before setup works after it too.
      await page.locator('.medical-info-button').click();
      await expect(page.locator('.medical-info-overlay__qr svg')).toBeVisible();
      await expect(page.locator('.medical-info-overlay__text')).toContainText('Sam');
      await expect(page.locator('.medical-info-overlay__text')).toContainText('Peanuts, penicillin');
      await expect(page.locator('.medical-info-overlay__text')).toContainText('Mum 07700 900001');

      await app.close();
    } finally {
      rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('survives a relaunch and a backup/restore round trip', async () => {
    const sourceDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-medical-src-'));
    const cleanDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-medical-clean-'));
    const backupDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-medical-file-'));
    const backupFile = join(backupDir, 'test.mwbackup');

    try {
      let app = await launch(sourceDataDir);
      let page = await app.firstWindow();
      await completeFirstRun(page, '2468');
      await enterParentModeExisting(page, '2468');
      await page.locator('.page-tabs__tab', { hasText: 'Medical' }).click();
      await page.locator('.medical-info-tab__field input[type="text"]').fill('Alex');
      await page.locator('.medical-info-tab__field textarea').nth(1).fill('Epilepsy');

      // Relaunch first — confirm the setting itself survives a restart.
      await app.close();
      app = await launch(sourceDataDir);
      page = await app.firstWindow();
      await page.locator('.medical-info-button').click();
      await expect(page.locator('.medical-info-overlay__text')).toContainText('Alex');
      await expect(page.locator('.medical-info-overlay__text')).toContainText('Epilepsy');
      await page.locator('.medical-info-overlay__close').click();

      // Back up, then restore onto a genuinely clean profile.
      await enterParentModeExisting(page, '2468');
      await page.locator('.page-tabs__tab', { hasText: 'Backup' }).click();
      await app.evaluate(async ({ dialog }, path) => {
        dialog.showSaveDialog = (async () => ({ canceled: false, filePath: path })) as typeof dialog.showSaveDialog;
      }, backupFile);
      await page.locator('button', { hasText: 'Save backup…' }).click();
      await expect(page.locator('.backup-tab__status')).toHaveText('Backup saved.');
      await app.close();

      const cleanApp = await launch(cleanDataDir);
      const cleanPage = await cleanApp.firstWindow();
      await completeFirstRun(cleanPage, '1357');
      await enterParentModeExisting(cleanPage, '1357');
      await cleanPage.locator('.page-tabs__tab', { hasText: 'Backup' }).click();
      await cleanApp.evaluate(async ({ dialog }, path) => {
        dialog.showOpenDialog = (async () => ({
          canceled: false,
          filePaths: [path],
        })) as typeof dialog.showOpenDialog;
      }, backupFile);
      await cleanPage.locator('button', { hasText: 'Choose backup file…' }).click();
      await cleanPage.locator('button', { hasText: 'Yes, replace everything' }).click();
      await expect(cleanPage.locator('.backup-tab__status')).toHaveText('Backup restored.');

      await cleanPage.locator('.parent-mode-screen__exit').click();
      await cleanPage.locator('.medical-info-button').click();
      await expect(cleanPage.locator('.medical-info-overlay__text')).toContainText('Alex');
      await expect(cleanPage.locator('.medical-info-overlay__text')).toContainText('Epilepsy');

      await cleanApp.close();
    } finally {
      rmSync(sourceDataDir, { recursive: true, force: true });
      rmSync(cleanDataDir, { recursive: true, force: true });
      rmSync(backupDir, { recursive: true, force: true });
    }
  });
});
