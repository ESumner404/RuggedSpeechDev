import { expect, test } from '@playwright/test';
import {
  boardButton,
  completeFirstRun,
  enterParentMode,
  exitParentMode,
  launchApp,
  makeUserDataDir,
  openTab,
} from './helpers';

type Spoken = { text: string; volume: number };

test.describe('More features: voice, templates, keyboard, schedule, First and Then', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('more');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('a ready-made page is spoken at the chosen volume, with names said the way an adult asked', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1357');
    await enterParentMode(page, '1357');

    await openTab(page, /^Access$/);
    await page.locator('.access-tab__section', { hasText: 'Voice volume' }).locator('input[type="range"]').fill('0.5');
    const say = page.locator('.access-tab__section', { hasText: 'Say it like this' });
    await say.locator('button', { hasText: 'Add a word' }).click();
    await say.locator('input[aria-label="Written as"]').fill('water');
    await say.locator('input[aria-label="Say it as"]').fill('wotter');

    await openTab(page, /^My Pages$/);
    await page.locator('.my-pages-tab__template select').selectOption('drinks');
    await page.locator('.my-pages-tab__template button', { hasText: 'Make this page' }).click();
    await expect(page.locator('.my-pages-tab__share-message')).toContainText('Made the page “Drink choices”');
    await expect(page.locator('.parent-mode-screen__button-row')).toHaveCount(4);
    await exitParentMode(page);

    await page.evaluate(() => {
      const w = window as unknown as { __spoken: Spoken[] };
      w.__spoken = [];
      window.speechSynthesis.speak = (u: SpeechSynthesisUtterance) => {
        w.__spoken.push({ text: u.text, volume: u.volume });
      };
    });

    await page.locator('.home-screen__tile', { hasText: 'My Pages' }).click();
    await boardButton(page, 'water').click();
    await page.locator('.sentence-strip__speak').click();
    const spoken = await page.evaluate(() => (window as unknown as { __spoken: Spoken[] }).__spoken);
    expect(spoken).toEqual([{ text: 'I want wotter', volume: 0.5 }]);
    // What is written on the button is untouched.
    await expect(boardButton(page, 'water')).toBeVisible();

    await app.close();
  });

  test('the keyboard can be alphabetical, and suggests the names of people who have been added', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '2468');
    await enterParentMode(page, '2468');

    await openTab(page, /^People$/);
    await page.locator('input[placeholder="Person name"]').fill('Grandad');
    await page.locator('form button', { hasText: 'Save person' }).click();
    await expect(page.locator('.people-places-tab__record')).toHaveCount(1);

    await openTab(page, /^Access$/);
    await page
      .locator('.access-tab__section', { hasText: 'Keyboard and sentence' })
      .locator('select')
      .selectOption('alphabetical');
    await page.locator('.access-tab__section', { hasText: 'Keyboard and sentence' }).locator('input[type="checkbox"]').check();
    await exitParentMode(page);

    await page.locator('.home-screen__tile', { hasText: 'Keyboard' }).click();
    const rows = await page.locator('.on-screen-keyboard__row').evaluateAll((els) =>
      els.map((row) => Array.from(row.querySelectorAll('.on-screen-keyboard__key')).map((k) => k.textContent).join('')),
    );
    expect(rows.slice(0, 4)).toEqual(['1234567890', 'abcdefghi', 'jklmnopqr', 'stuvwxyz']);

    for (const letter of ['g', 'r', 'a']) {
      await page.locator('.on-screen-keyboard__key', { hasText: new RegExp(`^${letter}$`) }).click();
    }
    await expect(page.locator('.prediction-bar__suggestion', { hasText: /^Grandad$/ })).toBeVisible();
    await expect(page.locator('.keyboard-screen__textbox')).toHaveText('gra'); // only ever a suggestion

    // And the sentence strip shows each word's picture when asked.
    await page.locator('.quick-access-bar__button', { hasText: 'Home' }).click();
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await expect(page.locator('.sentence-strip__chip .sentence-strip__picture')).toHaveCount(1);

    await app.close();
  });

  test('an activity can have a picture, and the day prints as a numbered visual schedule', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '9753');
    await enterParentMode(page, '9753');

    await openTab(page, /^My Day$/);
    for (const name of ['Breakfast', 'Swimming']) {
      await page.locator('.day-builder-tab__add-form input[placeholder="New activity name"]').fill(name);
      await page.locator('.day-builder-tab__add-form button[type="submit"]').click();
      await expect(page.locator('.day-builder-tab__activity', { has: page.locator(`input[aria-label="Emoji for ${name}"]`) })).toBeVisible();
    }
    for (const [name, emoji] of [['Breakfast', '🥣'], ['Swimming', '🏊']] as const) {
      const row = page.locator('.day-builder-tab__activity', { has: page.locator(`input[aria-label="Emoji for ${name}"]`) });
      await row.locator('summary').click();
      await row.locator(`input[aria-label="Emoji for ${name}"]`).fill(emoji);
      await expect(row.locator('summary')).toHaveText(emoji);
    }

    await openTab(page, /^Print$/);
    await page.locator('.print-tab__controls select').first().selectOption('schedule');
    const cards = page.locator('.print-schedule__card');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText('Breakfast');
    await expect(cards.nth(0).locator('.print-card__emoji')).toHaveText('🥣');
    await expect(cards.nth(1).locator('.print-schedule__step')).toHaveText('2');
    await exitParentMode(page);

    // The child sees the same pictures on My Day.
    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await expect(page.locator('.day-activity__emoji').first()).toHaveText('🥣');

    await app.close();
  });

  test('First and Then: set up by an adult, shown from the top bar, finished by the child, and kept across a relaunch', async () => {
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, '1122');
    await enterParentMode(page, '1122');

    await openTab(page, /^My Day$/);
    const cards = page.locator('.first-then-editor__card');
    await cards.nth(0).locator('.first-then-editor__input').fill('Brush teeth');
    await cards.nth(1).locator('.first-then-editor__input').fill('Tablet time');
    await page.locator('input[aria-label="First emoji"]').fill('🪥');

    await openTab(page, /^Quick Access$/);
    await page.locator('.quick-access-tab__slot select').nth(5).selectOption('firstthen');
    await exitParentMode(page);

    await page.evaluate(() => {
      const w = window as unknown as { __spoken: string[] };
      w.__spoken = [];
      window.speechSynthesis.speak = (u: SpeechSynthesisUtterance) => void w.__spoken.push(u.text);
    });
    await page.locator('.quick-access-bar__button', { hasText: 'First / Then' }).click();
    await expect(page.locator('.first-then-card--first')).toContainText('Brush teeth');
    await expect(page.locator('.first-then-card--first')).toHaveClass(/first-then-card--now/);

    await page.locator('.first-then-screen__button', { hasText: 'First is finished' }).click();
    await expect(page.locator('.first-then-card--first')).toHaveClass(/first-then-card--done/);
    await expect(page.locator('.first-then-card--then')).toHaveClass(/first-then-card--now/);
    expect(await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken)).toEqual([
      'All done. Now Tablet time',
    ]);
    await app.close();

    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await page.locator('.quick-access-bar__button', { hasText: 'First / Then' }).click();
    await expect(page.locator('.first-then-card--first')).toHaveClass(/first-then-card--done/);
    await page.locator('.first-then-screen__button', { hasText: 'Start again' }).click();
    await expect(page.locator('.first-then-card--first')).toHaveClass(/first-then-card--now/);

    await app.close();
  });
});
