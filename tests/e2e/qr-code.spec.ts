import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import jsQR from 'jsqr';
import { resolveExecutablePath } from './resolve-executable';
import { removeDir, launchElectron } from './cleanup';

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
}

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

/** Reads the pixels of a screenshot back through the browser's own image
 * decoder, so no extra PNG library is needed to feed them to the QR reader. */
async function pixelsOf(page: Page, png: Buffer): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const base64 = png.toString('base64');
  const raw = await page.evaluate(async (encoded) => {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(bitmap, 0, 0);
    const image = context.getImageData(0, 0, bitmap.width, bitmap.height);
    return { width: bitmap.width, height: bitmap.height, data: Array.from(image.data) };
  }, base64);
  return { width: raw.width, height: raw.height, data: Uint8ClampedArray.from(raw.data) };
}

test.describe('Medical Info QR code', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-qr-'));
  });

  test.afterEach(() => {
    removeDir(userDataDir);
  });

  test('the code on screen scans back to exactly the details entered, even with an accented name and dark high-contrast mode on', async () => {
    const app = await launchElectron({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${userDataDir}`],
    });
    const page = await app.firstWindow();
    await completeFirstRun(page, '4242');

    await page.locator('.parent-mode-button').click();
    await setUpPin(page, '4242');

    // The nastiest conditions first: dark high-contrast, which must not
    // invert the code (a scanner needs dark on light).
    await page.locator('.page-tabs__tab', { hasText: /^Access$/ }).click();
    await page.locator('.access-tab__section', { hasText: 'Visual' }).locator('select').first().selectOption('dark');

    await page.locator('.page-tabs__tab', { hasText: /^Medical$/ }).click();
    const fields = page.locator('.medical-info-tab__field');
    await fields.nth(0).locator('input').fill('Zoë Müller');
    await fields.nth(1).locator('textarea').fill('Peanuts, crème fraîche');
    await fields.nth(2).locator('textarea').fill('Autism; epilepsy (carries medication)');
    await page.locator('.medical-info-tab__contacts button', { hasText: 'Add a contact' }).click();
    await page.locator('.medical-info-tab__contact-row input[placeholder="Name"]').fill('Mum');
    await page.locator('.medical-info-tab__contact-row input[placeholder="Phone"]').fill('07700 900001');

    const expected = [
      'MEDICAL INFORMATION - Zoë Müller',
      'Allergies: Peanuts, crème fraîche',
      'Conditions: Autism; epilepsy (carries medication)',
      'Emergency contact: Mum 07700 900001',
    ].join('\n');
    await expect(page.locator('.medical-info-tab__text')).toHaveText(expected);

    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.medical-info-button').click();
    const qr = page.locator('.medical-info-overlay__qr');
    await expect(qr.locator('svg')).toBeVisible();

    // What is actually on screen, in the colours it is actually drawn in.
    const picture = await qr.screenshot();
    const { data, width, height } = await pixelsOf(page, picture);
    const decoded = jsQR(data, width, height);

    expect(decoded, 'the QR code on screen could not be read').not.toBeNull();
    expect(decoded!.data).toBe(expected);

    // Big enough to scan from a distance, and square.
    const box = (await qr.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(200);
    expect(Math.abs(box.width - box.height)).toBeLessThan(2);

    await app.close();
  });
});
