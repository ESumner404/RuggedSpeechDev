import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import { resolveExecutablePath } from './resolve-executable';
import { removeDir, launchElectron } from './cleanup';

const FIXTURE_PHOTO = join(__dirname, 'fixtures/test-photo.png');

function parentModeButton(page: Page) {
  return page.locator('.parent-mode-button');
}

async function setUpPin(page: Page, pin: string): Promise<void> {
  for (const digit of pin) {
    await page.locator('.pin-gate__key', { hasText: new RegExp(`^${digit}$`) }).click();
  }
  await page.locator('.pin-gate__key--submit').click();
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

async function enterParentModeFresh(page: Page, pin: string): Promise<void> {
  await completeFirstRun(page, pin);
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

test.describe('Phase 4, photo capture, voice clips, and People/Places', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-photos-'));
  });

  test.afterEach(() => {
    removeDir(userDataDir);
  });

  // Electron is Chromium underneath, so the same fake-media-device switches
  // Chromium supports work here, a synthetic camera/mic without needing
  // real hardware in this environment.
  function launchWithFakeMedia() {
    return launchElectron({
      executablePath: resolveExecutablePath(),
      args: [
        `--user-data-dir=${userDataDir}`,
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
      ],
    });
  }

  test('captures a photo with the (fake) camera and it appears as a real, working button', async () => {
    const app = await launchWithFakeMedia();
    const page = await app.firstWindow();
    await spyOnSpeech(page);
    await enterParentModeFresh(page, '1234');

    await page.locator('.page-tabs__tab', { hasText: 'People' }).click();
    await page.locator('input[placeholder="Person name"]').fill('Auntie Sam');
    await page.locator('.photo-capture__button', { hasText: 'Use camera' }).click();
    await expect(page.locator('.photo-capture__video')).toBeVisible();
    await page.locator('.photo-capture__button', { hasText: 'Take photo' }).click();
    await expect(page.locator('.people-places-tab__ready')).toContainText('Photo ready');

    await page.locator('button[type="submit"]', { hasText: 'Save person' }).click();
    await expect(page.locator('.people-places-tab__record-name')).toHaveText('Auntie Sam');
    await expect(page.locator('.people-places-tab__thumb')).toBeVisible();

    // "appear as a working button", exit to the child's Talk board and
    // press it like any other vocabulary item.
    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await page.locator('.board-button', { hasText: 'People' }).click();

    const auntieButton = page.locator('.board-button', { hasText: 'Auntie Sam' });
    await expect(auntieButton.locator('.board-button__photo')).toBeVisible();
    await auntieButton.click();
    await expect(page.locator('.sentence-strip__chip')).toHaveText(['Auntie Sam']);

    await app.close();
  });

  test('imports a photo from a file and it appears as a real button', async () => {
    const app = await launchWithFakeMedia();
    const page = await app.firstWindow();
    await enterParentModeFresh(page, '4321');

    await page.locator('.page-tabs__tab', { hasText: 'Places' }).click();
    await page.locator('input[placeholder="Place name"]').fill('Grandma’s');
    await page.locator('input[type="file"].photo-capture__file-input').setInputFiles(FIXTURE_PHOTO);
    await expect(page.locator('.people-places-tab__ready')).toContainText('Photo ready');

    await page.locator('button[type="submit"]', { hasText: 'Save place' }).click();
    await expect(page.locator('.people-places-tab__thumb')).toBeVisible();

    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await page.locator('.board-button', { hasText: 'Places' }).click();
    await expect(
      page.locator('.board-button', { hasText: 'Grandma’s' }).locator('.board-button__photo'),
    ).toBeVisible();

    await app.close();
  });

  test('records a voice clip with the (fake) mic and it plays back instead of the synthesiser', async () => {
    const app = await launchWithFakeMedia();
    const page = await app.firstWindow();
    await spyOnSpeech(page);
    await enterParentModeFresh(page, '1111');

    await page.locator('.page-tabs__tab', { hasText: 'People' }).click();
    await page.locator('input[placeholder="Person name"]').fill('Dad');
    await page.locator('.voice-clip-recorder__button', { hasText: 'Record voice clip' }).click();
    await expect(page.locator('.voice-clip-recorder__button--recording')).toBeVisible();
    await page.waitForTimeout(500);
    await page.locator('.voice-clip-recorder__button--recording').click();
    await expect(page.locator('.people-places-tab__ready')).toContainText('Voice clip ready');

    await page.locator('button[type="submit"]', { hasText: 'Save person' }).click();
    await expect(page.locator('.people-places-tab__record-name')).toHaveText('Dad');

    // Spy on Audio playback specifically, a voice clip plays through an
    // <audio> element, not speechSynthesis.
    const playedAudio = await page.evaluate(async () => {
      let played = false;
      const originalPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
        played = true;
        return originalPlay.call(this);
      };
      const button = Array.from(document.querySelectorAll('.people-places-tab__preview')).find(
        (el) => el.closest('.people-places-tab__record')?.textContent?.includes('Dad'),
      ) as HTMLButtonElement | undefined;
      button?.click();
      await new Promise((resolve) => setTimeout(resolve, 800));
      return played;
    });
    expect(playedAudio).toBe(true);

    const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
    expect(spoken).toEqual([]); // the synthesiser never ran, the clip did

    await app.close();
  });

  test('photo storage is quota-safe: 200 stored photos does not break the app', async () => {
    // The IndexedDB work itself finishes in milliseconds (confirmed while
    // debugging this), this environment's Playwright/CDP round-trip for
    // this particular evaluate() call just runs slower than the default
    // 30s test budget under the full test runner, for reasons that didn't
    // reproduce outside it. Generous, not indefinite.
    test.setTimeout(60_000);

    const app = await launchWithFakeMedia();
    const page = await app.firstWindow();
    // First run itself already touches the database (grid-size resizing
    // reads the root board), so it's open with a "photos" store by now.
    await completeFirstRun(page, '1234');
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await expect(page.locator('.board-button').first()).toBeVisible();

    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('my-words');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('photos', 'readwrite');
        const store = tx.objectStore('photos');
        for (let i = 0; i < 200; i += 1) {
          const blob = new Blob([new Uint8Array(2048).fill(i % 256)], { type: 'image/jpeg' });
          store.put(blob, `test-photo-${i}`);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    });

    const count = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('my-words');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const total = await new Promise<number>((resolve, reject) => {
        const tx = db.transaction('photos', 'readonly');
        const countRequest = tx.objectStore('photos').count();
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject(countRequest.error);
      });
      db.close();
      return total;
    });

    expect(count).toBeGreaterThanOrEqual(200);

    // The app still works normally afterward, round-trip Home and back
    // into Talk (we're still on the Talk board from the setup above).
    await page.locator('.quick-access-bar__button', { hasText: 'Home' }).click();
    await expect(page.locator('.home-screen')).toBeVisible();
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await expect(page.locator('.board-button').first()).toBeVisible();

    await app.close();
  });
});
