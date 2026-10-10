import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { boardButton, enterParentMode, exitParentMode, launchApp, makeUserDataDir, openTab, setUpPin } from './helpers';

// Takes the pictures used in the guides, from the real packaged app, with no
// window shown. It only runs when asked, so ordinary test runs never rewrite
// the pictures:   SCREENSHOTS=1 npx playwright test tests/e2e/screenshots.spec.ts
const OUT = join(__dirname, '..', '..', 'docs', 'images');

test.skip(!process.env['SCREENSHOTS'], 'only run when making the pictures for the guides');

test('pictures for the guides', async () => {
  test.setTimeout(420_000);
  mkdirSync(OUT, { recursive: true });
  const user = makeUserDataDir('screenshots');
  const app = await launchApp(user.dir);
  const page = await app.firstWindow();
  await app.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0]!;
    win.unmaximize();
    win.setContentSize(1280, 800);
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  const shot = async (name: string) => {
    await page.waitForTimeout(250);
    await page.screenshot({ path: join(OUT, `${name}.png`) });
  };
  const next = () => page.locator('.first-run-wizard__button--primary').click();
  const title = page.locator('.first-run-wizard__title');

  // ---- Setting up
  await expect(title).toHaveText('Welcome to Rugged Speech Test');
  await shot('setup-1-welcome');
  await next();
  await page.locator('.first-run-wizard__field input').first().fill('Lucy');
  await shot('setup-2-whose-device');
  await next();
  await expect(title).toHaveText('Choose a voice');
  await shot('setup-3-voice');
  await next();
  await expect(title).toHaveText('Choose a grid size');
  await shot('setup-4-grid');
  await next();
  await expect(title).toHaveText('Pictures and words');
  await shot('setup-5-pictures');
  await next();
  await expect(title).toHaveText('What should pressing a word do?');
  await shot('setup-6-press');
  await next();
  await expect(title).toHaveText('Choose the colours');
  await shot('setup-7-colours');
  await next();
  await expect(title).toHaveText('Set a Parent PIN');
  await setUpPin(page, '1357');
  await setUpPin(page, '1357');
  await expect(page.locator('.pin-gate__recovery-code')).toBeVisible();
  await shot('setup-8-pin-and-code');
  await page.locator('.pin-gate__button').click();
  await expect(title).toHaveText("Lucy's device is ready");
  await shot('setup-9-ready');
  await next();
  await expect(page.locator('.home-screen__tile').first()).toBeVisible();

  // ---- The child's screens
  await shot('home');
  await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
  await shot('talk');
  await boardButton(page, 'I').click();
  await boardButton(page, 'want').click();
  await boardButton(page, 'Food').click();
  await boardButton(page, 'apple').click();
  await shot('talk-sentence');
  await page.locator('.home-button').click();

  await page.locator('.home-screen__tile', { hasText: 'Feelings & Help' }).click();
  await shot('feelings');
  await page.locator('.page-tabs__tab', { hasText: 'Help' }).click();
  await shot('help');
  await page.locator('.page-tabs__tab', { hasText: 'Calm' }).click();
  await shot('calm');
  await page.locator('.page-tabs__tab', { hasText: 'My body' }).click();
  await page.locator('.my-body__part', { hasText: /^Tummy$/ }).click();
  await page.locator('.my-body__feeling', { hasText: 'Hurts' }).click();
  await page.locator('.my-body__amount', { hasText: 'a lot' }).click();
  await shot('body-pointing');
  await page.locator('.my-body__turn').click();
  await shot('body-back');
  await page.locator('.home-button').click();

  await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
  await page.locator('.on-screen-keyboard__key', { hasText: /^h$/ }).click();
  await page.locator('.on-screen-keyboard__key', { hasText: /^e$/ }).click();
  await shot('keyboard');
  await page.locator('.home-button').click();

  // ---- Putting Games and Traffic light on the top bar, in Parent Mode
  await enterParentMode(page, '1357');
  await shot('parent-guide');
  await openTab(page, /^Quick Access$/);
  const slots = page.locator('.quick-access-tab__slot select');
  await slots.nth(4).selectOption('game');
  await slots.nth(5).selectOption('traffic');
  await shot('parent-quick-access');
  await openTab(page, /^User$/);
  await shot('parent-user');
  await openTab(page, /^About me$/);
  await page.locator('.about-tab__textarea').nth(0).fill('I use this device and some signs. Please give me time to answer.');
  await page.locator('.about-tab__textarea').nth(1).fill('A warning before changes, and a quiet place.');
  await shot('parent-about-me');
  await openTab(page, /^Medical$/);
  await page.locator('.medical-info-tab__field textarea').nth(0).fill('Peanuts');
  await page.locator('.medical-info-tab__field textarea').nth(1).fill('Epilepsy');
  await shot('parent-medical');
  await openTab(page, /^My body$/);
  await page.locator('[aria-label="Figure"] button', { hasText: 'Girl' }).click();
  await page.locator('label.access-tab__checkbox', { hasText: 'Uses a wheelchair' }).locator('input').check();
  await page.locator('label.access-tab__checkbox', { hasText: 'Hearing aids' }).locator('input').check();
  await page.locator('label.access-tab__checkbox', { hasText: 'Insulin pump' }).locator('input').check();
  await shot('parent-my-body');
  await openTab(page, /^Boards$/);
  await shot('parent-boards');
  await openTab(page, /^My Pages$/);
  await shot('parent-my-pages');
  await openTab(page, /^My Day$/);
  await shot('parent-my-day');
  await openTab(page, /^Access$/);
  await shot('parent-access');
  await openTab(page, /^Look$/);
  await shot('parent-look');
  await openTab(page, /^Music$/);
  await shot('parent-music');
  await openTab(page, /^Seasons$/);
  await page.getByRole('button', { name: 'Change the words for Eid' }).click();
  await shot('parent-seasons');
  await openTab(page, /^Learning$/);
  await shot('parent-learning');
  await openTab(page, /^Backup$/);
  await shot('parent-backup');
  await openTab(page, /^Lost mode$/);
  await page.locator('label.about-tab__field', { hasText: 'Return it to' }).locator('input').fill('Mrs Patel, Oakfield School');
  await page.locator('label.about-tab__field', { hasText: 'Phone number' }).locator('input').fill('01234 567890');
  await shot('parent-lost-mode');
  await openTab(page, /^Activity$/);
  await page.locator('label.access-tab__checkbox', { hasText: 'Keep an activity log' }).locator('input').check();
  await exitParentMode(page);

  // ---- Games and the rest of the top bar
  await page.locator('.quick-access-bar__button', { hasText: 'Games' }).click();
  await shot('games');
  await page.locator('.games-menu__tile', { hasText: 'Find the word' }).click();
  await shot('game-find');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Snap' }).click();
  await page.locator('.snap-screen__turn').click();
  await page.locator('.snap-screen__turn').click();
  await shot('game-snap');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Rollercoaster' }).click();
  await page.locator('.ride-setup__go').click();
  await page.locator('.ride-screen__choice', { hasText: /^I$/ }).click();
  await page.locator('.ride-screen__choice', { hasText: /^want$/ }).click();
  await shot('game-rollercoaster');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Piano' }).click();
  await page.locator('.piano-screen__tune', { hasText: 'Twinkle' }).click();
  await shot('game-piano');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Seasons' }).click();
  await page.locator('.seasons-screen__choice', { hasText: 'Christmas' }).click();
  await shot('game-seasons');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Make a tree' }).click();
  for (const [tool, slot] of [['Star', 0], ['Red bauble', 1], ['Gold bauble', 3], ['Light', 5], ['Blue bauble', 8], ['Bell', 12], ['Pink bauble', 10], ['Purple bauble', 17], ['Red present', 19], ['Blue present', 21]] as const) {
    await page.locator('.tree-screen__tool', { hasText: tool }).click();
    await page.locator('.tree-screen__slot').nth(slot).click();
  }
  await shot('game-tree');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Draw' }).click();
  const canvas = page.locator('.draw-screen__canvas');
  const box = (await canvas.boundingBox())!;
  const draw = async (colour: string, points: [number, number][]) => {
    await page.locator(`.draw-screen__colour[aria-label="${colour}"]`).click();
    await page.mouse.move(box.x + points[0]![0] * box.width, box.y + points[0]![1] * box.height);
    await page.mouse.down();
    for (const [x, y] of points.slice(1)) await page.mouse.move(box.x + x * box.width, box.y + y * box.height, { steps: 6 });
    await page.mouse.up();
  };
  await page.locator('.draw-screen__size[aria-label="thick"]').click();
  await draw('red', [[0.2, 0.7], [0.25, 0.4], [0.3, 0.7], [0.2, 0.7]]);
  await draw('green', [[0.45, 0.65], [0.55, 0.35], [0.65, 0.65]]);
  await draw('blue', [[0.15, 0.85], [0.5, 0.8], [0.85, 0.85]]);
  await draw('yellow', [[0.8, 0.2], [0.85, 0.15], [0.8, 0.1], [0.75, 0.15], [0.8, 0.2]]);
  await shot('game-draw');
  await page.locator('.games-shell__back').click();
  await page.locator('.games-menu__tile', { hasText: 'Jokes' }).click();
  await page.locator('button', { hasText: 'Show the answer' }).click();
  await shot('game-jokes');
  await page.locator('.games-shell__back').click();

  await page.locator('.quick-access-bar__button', { hasText: 'Traffic light' }).click();
  await page.locator('.traffic-light').first().click();
  await shot('traffic-light');
  await page.locator('.traffic-light').nth(2).click();
  await page.locator('.home-button').click();

  await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
  await page.locator('.home-button').click();

  await page.locator('.medical-info-button').click();
  await shot('medical-info');
  await page.locator('.medical-info-overlay__close').click();

  // ---- Colour: a favourite colour, then a dark scheme
  await enterParentMode(page, '1357');
  await openTab(page, /^Look$/);
  await page.locator('.look-tab__fun', { hasText: 'Pink' }).click();
  await shot('parent-look-pink');
  await exitParentMode(page);
  await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
  await shot('talk-pink');
  await page.locator('.home-button').click();
  await enterParentMode(page, '1357');
  await openTab(page, /^Look$/);
  await page.locator('.look-tab__preset', { hasText: 'Night' }).click();
  await exitParentMode(page);
  await shot('home-night');
  await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
  await page.locator('.home-button').click();
  await enterParentMode(page, '1357');
  await openTab(page, /^Look$/);
  await page.locator('.look-tab__preset', { hasText: 'Standard' }).click();
  await page.locator('.picture-choices__option', { hasText: 'Emoji' }).click();
  await exitParentMode(page);
  await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
  await shot('talk-emoji');
  await page.locator('.home-button').click();
  await enterParentMode(page, '1357');
  await openTab(page, /^Look$/);
  await page.locator('.picture-choices__option', { hasText: 'Drawn symbols' }).click();

  // ---- School Mode: its own button, its own PIN
  await openTab(page, /^School$/);
  await shot('parent-school');
  await page.locator('button', { hasText: 'Turn School Mode on' }).click();
  await expect(page.locator('.pin-gate__prompt')).toContainText('School PIN');
  await setUpPin(page, '2468');
  await setUpPin(page, '2468');
  await expect(page.locator('.school-tab')).toContainText('School Mode is on');
  await exitParentMode(page);
  await shot('school-button');
  await page.locator('.school-mode-button').click();
  await shot('school-pin-entry');
  await setUpPin(page, '2468');
  await expect(page.locator('.school-mode-screen')).toBeVisible();
  const school = (name: string) => page.locator('.parent-nav__tab', { hasText: new RegExp(`^${name}$`) }).click();
  await school('Pupil and school');
  await page.locator('.school-tab__fields input').nth(0).fill('Oakfield Primary');
  await page.locator('.school-tab__fields input').nth(1).fill('Year 2, Robins');
  await page.locator('.school-tab__fields input').nth(3).fill('Mr Khan');
  await shot('school-pupil');
  await school('Safeguarding');
  await page.locator('.school-tab__fields input').nth(0).fill('Mrs Okafor');
  await page.locator('.school-tab__fields input').nth(1).fill('01234 000111');
  await shot('school-safeguarding');
  await school('Classroom set-up');
  await page.locator('button', { hasText: 'Start from a typical school day' }).click();
  await shot('school-classroom');
  await school('Targets');
  await page.locator('.targets-tab__form input[type="text"]').fill('Uses "I want" and a word to ask for what they need, four times a day.');
  await page.locator('.targets-tab__form').evaluate((form) => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await shot('staff-targets');
  await school('Notes');
  await page.locator('.notes-tab__form input').fill('Mrs Ali');
  await page.locator('.notes-tab__form select').selectOption('success');
  await page.locator('.notes-tab__form textarea').fill('Chose juice with two words at snack time. Needed one reminder to look for the "more" button.');
  await page.locator('.notes-tab__form').evaluate((form) => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await shot('staff-notes');
  await school('Today');
  await shot('school-today');
  await school('Timetable');
  await shot('school-timetable');
  await school('Lesson pages');
  await shot('school-lessons');
  await school('Vocabulary');
  await shot('school-vocabulary');
  await school('Activity');
  await shot('staff-activity');
  await school('Reports');
  await shot('staff-handover');
  await page.locator('.activity-tab__chip', { hasText: 'Review report' }).click();
  await shot('staff-review');
  await school('School guide');
  await shot('school-guide');
  await page.locator('.parent-mode-screen__exit').click();
  await expect(page.locator('.app-shell')).toBeVisible();

  // ---- Lost mode, on and off again
  await enterParentMode(page, '1357');
  await openTab(page, /^Lost mode$/);
  await page.locator('button', { hasText: 'Turn Lost mode on' }).click();
  await exitParentMode(page).catch(() => undefined);
  await expect(page.locator('.lost-mode')).toBeVisible();
  await shot('lost-mode');
  await page.locator('.lost-mode__button', { hasText: 'Owner: turn off' }).click();
  await setUpPin(page, '1357');
  await expect(page.locator('.app-shell')).toBeVisible();

  await app.close();
  user.remove();
});
