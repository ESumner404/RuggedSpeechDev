import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  allSpoken,
  boardButton,
  completeFirstRun,
  enterParentMode,
  exitParentMode,
  launchApp,
  makeUserDataDir,
  openTab,
  setUpPin,
  spyOnSpeech,
  stubSaveDialog,
} from './helpers';

const PIN = '2468';

test.describe('newer features, in the real app', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('new-features');
  });

  test.afterEach(() => {
    user.remove();
  });

  const tile = (page: Page, name: string) => page.locator('.home-screen__tile', { hasText: name });
  const goHome = (page: Page) => page.locator('.home-button').click();

  test('drawn symbols are used to begin with, emoji are one choice away, and the choice is kept', async () => {
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    expect(await page.evaluate(() => document.documentElement.dataset['symbols'])).toBe('drawn');
    await tile(page, 'Talk').click();
    const picture = boardButton(page, 'want').locator('.board-button__emoji');
    await expect(picture).toHaveJSProperty('tagName', 'IMG');
    expect(await picture.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    await goHome(page);

    await enterParentMode(page, PIN);
    await openTab(page, /^Look$/);
    await page.locator('.picture-choices__option', { hasText: 'Emoji' }).click();
    await page.locator('.picture-choices__option', { hasText: 'Pictures only' }).click();
    await exitParentMode(page);
    await tile(page, 'Talk').click();
    await expect(boardButton(page, 'want').locator('.board-button__emoji')).toHaveText('🤲');
    // "Pictures only" hides the word for a screen, but not from a screen reader.
    await expect(boardButton(page, 'want').locator('.board-button__label')).toBeAttached();
    expect(await boardButton(page, 'want').locator('.board-button__label').evaluate((el) => el.getBoundingClientRect().width)).toBeLessThan(3);

    await app.close();
    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await expect(page.locator('.splash')).toHaveCount(0);
    await expect(page.locator('.home-screen')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.dataset['symbols'])).toBe('emoji');
    expect(await page.evaluate(() => document.documentElement.dataset['labels'])).toBe('pictures');
    await app.close();
  });

  test('a Home button is on every screen but Home, and the loading screen gives way to the app', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await expect(page.locator('.home-button')).toHaveCount(0);
    for (const name of ['Talk', 'Keyboard', 'My Day', 'Favourites', 'My Pages', 'Feelings & Help']) {
      await tile(page, name).click();
      await expect(page.locator('.home-button')).toBeVisible();
      await goHome(page);
      await expect(page.locator('.home-screen')).toBeVisible();
    }
    await app.close();
  });

  test('My body: pointing says a sentence, and the figure and its equipment follow what an adult chose', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);

    await enterParentMode(page, PIN);
    await openTab(page, /^My body$/);
    await page.locator('[aria-label="Figure"] button', { hasText: 'Girl' }).click();
    await page.locator('label.access-tab__checkbox', { hasText: 'Uses a wheelchair' }).locator('input').check();
    await page.locator('label.access-tab__checkbox', { hasText: 'Insulin pump' }).locator('input').check();
    await expect(page.locator('.body-tab__preview ellipse[ry="64"]')).toHaveCount(2); // the chair's big wheels
    await exitParentMode(page);

    await spyOnSpeech(page);
    await tile(page, 'Feelings & Help').click();
    await page.locator('.page-tabs__tab', { hasText: 'My body' }).click();
    await expect(page.locator('.body-figure ellipse[ry="64"]')).toHaveCount(2);
    await expect(page.locator('.my-body__part', { hasText: 'Pump' })).toBeVisible();
    await page.locator('.my-body__part', { hasText: 'Pump' }).click();
    await page.locator('.my-body__feeling', { hasText: 'Not working' }).click();
    await expect(page.locator('.my-body__sentence')).toHaveText('My pump is not working.');
    await page.locator('.my-body__say').click();
    expect(await allSpoken(page)).toEqual(['My pump.', 'My pump is not working.']);

    // The private area is only ever "under my pants".
    await page.locator('.my-body__part', { hasText: 'Under my pants' }).click();
    await expect(page.locator('.my-body__sentence')).toContainText('under my pants');
    await app.close();
  });

  test('traffic light: shown along the top on every screen without a word, and kept after a relaunch', async () => {
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('traffic');
    await exitParentMode(page);
    await spyOnSpeech(page);

    await page.locator('.quick-access-bar__button', { hasText: 'Traffic light' }).click();
    await page.locator('.traffic-light', { hasText: 'Please leave me' }).click();
    await goHome(page);
    await expect(page.locator('.traffic-chip')).toHaveText('Please leave me');
    await tile(page, 'Talk').click();
    await expect(page.locator('.traffic-chip')).toBeVisible();
    expect(await allSpoken(page)).toEqual([]);

    await app.close();
    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await expect(page.locator('.traffic-chip')).toHaveText('Please leave me');
    await app.close();
  });

  test('Lost mode covers everything, reads out on request, and only the PIN turns it off', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Lost mode$/);
    await expect(page.locator('button', { hasText: 'Turn Lost mode on' })).toBeDisabled();
    await page.locator('label.about-tab__field', { hasText: 'Return it to' }).locator('input').fill('Mrs Patel, Oakfield School');
    await page.locator('label.about-tab__field', { hasText: 'Phone number' }).locator('input').fill('01234 567890');
    await page.locator('button', { hasText: 'Turn Lost mode on' }).click();
    await page.locator('.parent-mode-screen__exit').click();

    await expect(page.locator('.lost-mode')).toContainText('This is a critical communication device.');
    await expect(page.locator('.lost-mode')).toContainText('Mrs Patel, Oakfield School');
    await expect(page.locator('.lost-mode')).toContainText('01234 567890');
    await expect(page.locator('.home-screen')).toHaveCount(0);

    await spyOnSpeech(page);
    expect(await allSpoken(page)).toEqual([]);
    await page.locator('.lost-mode__button', { hasText: 'Read this out' }).click();
    expect((await allSpoken(page))[0]).toContain('Please return it to Mrs Patel, Oakfield School');

    await page.locator('.lost-mode__button', { hasText: 'Owner: turn off' }).click();
    await setUpPin(page, '0000');
    await expect(page.locator('.pin-gate__error')).toContainText('Wrong PIN');
    await expect(page.locator('.pin-gate')).toBeVisible();
    await setUpPin(page, PIN);
    await expect(page.locator('.app-shell')).toBeVisible();
    await app.close();
  });

  test('the PIN keypad makes you wait after five wrong tries, even for the right PIN', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await page.locator('.parent-mode-button').click();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await setUpPin(page, '0000');
      await expect(page.locator('.pin-gate__error')).toContainText('Wrong PIN');
      await page.waitForTimeout(120);
    }
    await expect(page.locator('.pin-gate__wait')).toContainText('Please wait');
    await setUpPin(page, PIN);
    await page.waitForTimeout(400);
    await expect(page.locator('.parent-mode-screen')).toHaveCount(0);
    await app.close();
  });

  test('the activity log is off until turned on, counts what is said, saves a spreadsheet, and clears', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await spyOnSpeech(page);
    await tile(page, 'Talk').click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'want').click();
    await page.locator('.sentence-strip__speak').click(); // not logged: the log is off
    await goHome(page);

    await enterParentMode(page, PIN);
    await openTab(page, /^Activity$/);
    await expect(page.locator('.activity-tab')).toContainText('Nothing is being kept.');
    await page.locator('label.access-tab__checkbox', { hasText: 'Keep an activity log' }).locator('input').check();
    await exitParentMode(page);

    await tile(page, 'Talk').click();
    await boardButton(page, 'more').click();
    await page.locator('.sentence-strip__speak').click();
    await goHome(page);
    await page.locator('.quick-access-bar__button', { hasText: 'Yes' }).click();

    await enterParentMode(page, PIN);
    await openTab(page, /^Activity$/);
    const row = page.locator('.activity-tab__table tbody tr');
    await expect(row.filter({ hasText: 'Said' }).filter({ hasText: 'more' })).toHaveCount(1);
    await expect(row.filter({ hasText: 'Said' }).filter({ hasText: 'yes' })).toHaveCount(1);
    await expect(row.filter({ hasText: 'Opened' }).filter({ hasText: 'Talk' })).toHaveCount(1);
    // What was said before the log was turned on is not in it. (The sentence in the strip was still there, so the next Speak says it all.)
    await expect(row.filter({ hasText: 'Said' }).filter({ hasText: 'I want more' })).toHaveCount(1);
    await expect(row.filter({ hasText: /Said\s*I want$/ })).toHaveCount(0);
    const total = page.locator('.activity-tab__totals div', { hasText: 'Today' }).locator('dd');
    expect(Number(await total.textContent())).toBeGreaterThanOrEqual(3);

    for (const period of ['Hours', 'Days', 'Weeks', 'Months']) {
      await page.locator('.activity-tab__chip', { hasText: period }).click();
      await expect(page.locator('.activity-tab__bar')).toHaveCount(period === 'Hours' ? 24 : period === 'Days' ? 14 : period === 'Weeks' ? 8 : 6);
    }

    const csv = join(user.dir, 'activity.csv');
    await stubSaveDialog(app, csv);
    await page.locator('button', { hasText: 'Save as a spreadsheet' }).click();
    await expect(page.locator('.activity-tab')).toContainText('Saved.');
    const { readFileSync } = await import('node:fs');
    expect(readFileSync(csv, 'utf-8')).toContain('"Said","I want more"');

    await page.locator('button', { hasText: 'Clear the log' }).click();
    await page.locator('button', { hasText: 'Yes, empty it' }).click();
    await expect(page.locator('.activity-tab')).toContainText('The activity log is empty.');
    await expect(row).toHaveCount(0);
    await app.close();
  });

  test('School Mode: school details, targets, notes and a handover sheet that bring them together', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^School$/);
    await page.locator('button', { hasText: 'Turn School Mode on' }).click();
    await setUpPin(page, '1357');
    await setUpPin(page, '1357');
    await expect(page.locator('.school-tab')).toContainText('School Mode is on');
    await exitParentMode(page);

    await page.locator('.school-mode-button').click();
    await setUpPin(page, '1357');
    await expect(page.locator('.school-mode-screen')).toBeVisible();
    const open = (name: string) => page.locator('.parent-nav__tab', { hasText: new RegExp(`^${name}$`) }).click();

    await open('Pupil and school');
    await page.locator('.school-tab__fields input').nth(0).fill('Oakfield Primary');
    await open('Safeguarding');
    await page.locator('.school-tab__fields input').nth(0).fill('Mrs Okafor');
    await expect(page.locator('.safeguarding-tab__lead')).toContainText('Mrs Okafor');
    await open('Classroom set-up');
    await page.locator('button', { hasText: 'Start from a typical school day' }).click();
    await expect(page.locator('button', { hasText: 'Start from a typical school day' })).toBeDisabled();

    await open('Targets');
    await page.locator('.targets-tab__form input[type="text"]').fill('Asks for more, with a word');
    await page.locator('.targets-tab__form').evaluate((f) => f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await expect(page.locator('.targets-tab__target')).toHaveCount(1);
    await open('Notes');
    await page.locator('.notes-tab__form input').fill('Mr Khan');
    await page.locator('.notes-tab__form select').selectOption('success');
    await page.locator('.notes-tab__form textarea').fill('Chose juice with two words.');
    await page.locator('.notes-tab__form').evaluate((f) => f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await expect(page.locator('.notes-tab__note')).toContainText('Chose juice with two words.');
    await expect(page.locator('.notes-tab__note')).toContainText('Something that went well');

    await open('Today');
    await expect(page.locator('.today-tab')).toContainText('Registration');
    await expect(page.locator('.today-tab')).toContainText('Chose juice with two words.');
    await expect(page.locator('.today-tab__big').first()).toBeVisible();

    await open('Reports');
    await expect(page.locator('.staff-sheet')).toContainText('Oakfield Primary');
    await expect(page.locator('.staff-sheet')).toContainText('Asks for more, with a word');
    await page.locator('.activity-tab__chip', { hasText: 'Review report' }).click();
    await expect(page.locator('.staff-sheet')).toContainText('Chose juice with two words.');

    await page.locator('.parent-mode-screen__exit').click();
    await expect(page.locator('.app-shell')).toBeVisible();
    await app.close();
  });

  test('the guide is in Parent Mode, can be searched, and has its pictures with no internet', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^User guide$/);
    await expect(page.locator('.guide__page h1')).toContainText('Getting started: parents and carers');
    await expect(page.locator('.guide__figure img').first()).toBeVisible();
    expect(await page.locator('.guide__figure img').first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(100);

    await page.locator('.activity-tab__chip', { hasText: 'The whole guide' }).click();
    await page.locator('.guide__search input').fill('wheelchair');
    await expect(page.locator('.guide__content')).toContainText('wheelchair');
    await page.locator('.guide__search input').fill('qqqzzz');
    await expect(page.locator('.guide__none')).toBeVisible();
    await app.close();
  });

  test('games: snap, the rollercoaster, draw (kept across a relaunch), jokes and the piano', async () => {
    test.setTimeout(90_000);
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('game');
    await exitParentMode(page);
    await spyOnSpeech(page);
    await page.locator('.quick-access-bar__button', { hasText: 'Games' }).click();
    await expect(page.locator('.games-menu__label')).toHaveText(['Find the word', 'Snap', 'Rollercoaster', 'Draw', 'Jokes', 'Music', 'Piano', 'Seasons', 'Make a tree']);
    expect(await allSpoken(page)).toEqual([]);

    // Snap
    await page.locator('.games-menu__tile', { hasText: 'Snap' }).click();
    await page.locator('.snap-screen__turn').click();
    await expect(page.locator('.snap-card__label')).toHaveCount(1);
    await page.locator('.games-shell__back').click();

    // Rollercoaster: two words, a short ride, to the end
    await page.locator('.games-menu__tile', { hasText: 'Rollercoaster' }).click();
    await page.locator('.ride-setup__choice', { hasText: 'Two words' }).click();
    await page.locator('.ride-setup__choice', { hasText: 'Short ride' }).click();
    await page.locator('.ride-setup__go').click();
    for (let hill = 0; hill < 3; hill += 1) {
      await page.locator('.ride-screen__choice', { hasText: /^want$/ }).click();
      // Press words until the sentence has its second word (the hint points to it after two wrong tries).
      for (let attempt = 0; attempt < 4; attempt += 1) {
        if ((await page.locator('.ride-screen__sentence').textContent())!.trim().split(' ').length === 2) break;
        const options = page.locator('.ride-screen__choice');
        const count = await options.count();
        const hinted = page.locator('.ride-screen__choice--hint');
        await (((await hinted.count()) > 0 ? hinted.first() : options.nth(attempt % count))).click();
      }
      await page.locator('.ride-screen__choice', { hasText: hill === 2 ? 'To the end' : 'Next hill' }).click();
    }
    await expect(page.locator('.game-screen__message')).toHaveText('You have been all the way round the track.');
    await expect(page.locator('.ride-screen__ticket')).toHaveCount(3);
    await page.locator('.games-shell__back').click();

    // Draw: a real stroke changes the picture, and a kept picture survives a relaunch
    await page.locator('.games-menu__tile', { hasText: 'Draw' }).click();
    const canvas = page.locator('.draw-screen__canvas');
    const box = (await canvas.boundingBox())!;
    const ink = () => canvas.evaluate((c: HTMLCanvasElement) => {
      const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i + 1]! < 200) n += 1;
      return n;
    });
    expect(await ink()).toBe(0);
    await page.locator('.draw-screen__colour[aria-label="red"]').click();
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5, { steps: 10 });
    await page.mouse.up();
    expect(await ink()).toBeGreaterThan(500);
    await page.locator('.draw-screen__button', { hasText: 'Undo' }).click();
    expect(await ink()).toBe(0);
    await expect(page.locator('.draw-screen__button', { hasText: 'Undo' })).toBeDisabled(); // nothing more to undo
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 8 });
    await page.mouse.up();
    await page.locator('.draw-screen__button', { hasText: 'Keep' }).click();
    await expect(page.locator('.draw-screen__message')).toHaveText('Kept.');
    await app.close();

    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await page.locator('.quick-access-bar__button', { hasText: 'Games' }).click();
    await page.locator('.games-menu__tile', { hasText: 'Draw' }).click();
    await page.locator('.draw-screen__button', { hasText: 'My pictures' }).click();
    await expect(page.locator('.draw-screen__thumb')).toHaveCount(1);
    await page.locator('.draw-screen__thumb').click();
    await page.waitForTimeout(300);
    const kept = await page.locator('.draw-screen__canvas').evaluate((c: HTMLCanvasElement) => {
      const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i + 1]! < 200) n += 1;
      return n;
    });
    expect(kept).toBeGreaterThan(500);
    await page.locator('.games-shell__back').click();

    // Jokes
    await spyOnSpeech(page);
    await page.locator('.games-menu__tile', { hasText: 'Jokes' }).click();
    await page.locator('button', { hasText: 'Say the question' }).click();
    await page.locator('button', { hasText: 'Show the answer' }).click();
    await page.locator('button', { hasText: 'Say the answer' }).click();
    expect((await allSpoken(page)).length).toBe(2);
    await page.locator('.games-shell__back').click();

    // Piano: pressing a key sounds it; following a tune points at the next key
    await page.locator('.games-menu__tile', { hasText: 'Piano' }).click();
    await page.locator('.piano-screen__tune', { hasText: 'Twinkle' }).click();
    await expect(page.locator('.piano-key--next')).toHaveCount(1);
    await page.locator('.piano-key').first().click();
    await page.locator('.piano-key').first().click();
    await expect(page.locator('.piano-key--next')).toHaveAttribute('aria-label', 'G');
    await app.close();
  });

  test('music: a song added from a file turns up for the child, with no streaming service in sight', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Music$/);
    await expect(page.locator('.music-tab')).toContainText('There is no Spotify or Apple Music');

    // A very short, silent WAV.
    const wav = join(user.dir, '03 - Row_Row_Row.wav');
    const samples = 800;
    const buffer = Buffer.alloc(44 + samples * 2);
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + samples * 2, 4);
    buffer.write('WAVEfmt ', 8);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(8000, 24);
    buffer.writeUInt32LE(16000, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(samples * 2, 40);
    writeFileSync(wav, buffer);
    await page.locator('.music-tab__file').setInputFiles(wav);
    await expect(page.locator('.music-tab__song input[aria-label^="Name of"]')).toHaveValue('Row Row Row');
    await exitParentMode(page);

    await page.locator('.home-screen__tile').first().waitFor();
    await enterParentMode(page, PIN);
    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('music');
    await exitParentMode(page);
    await page.locator('.quick-access-bar__button', { hasText: 'Music' }).click();
    await expect(page.locator('.music-screen__title')).toHaveText(['Row Row Row']);
    await expect(page.locator('.music-screen__now')).toHaveText('Press a song to play it.');
    await app.close();
  });

  test('Medical Info shows the longer details, and a long record still has a code that fits', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, PIN);
    await enterParentMode(page, PIN);
    await openTab(page, /^Medical$/);
    await page.locator('.medical-info-tab__field input').first().fill('Sam');
    const area = (label: string) => page.locator('label.medical-info-tab__field', { hasText: label }).locator('textarea');
    await area('Allergies').fill('Peanuts');
    await area('Medicines').fill('Inhaler, two puffs');
    await area('In an emergency').fill('Sit me up and call 999');
    await area('Eating and drinking').fill('x'.repeat(1300));
    await exitParentMode(page);

    await page.locator('.medical-info-button').click();
    const text = page.locator('.medical-info-overlay__text');
    await expect(text).toContainText('Medicines: Inhaler, two puffs');
    await expect(text).toContainText('In an emergency: Sit me up and call 999');
    await expect(text).toContainText('Eating and drinking:');
    await expect(page.locator('.medical-info-overlay__qr svg')).toBeVisible();
    await app.close();
  });
});
