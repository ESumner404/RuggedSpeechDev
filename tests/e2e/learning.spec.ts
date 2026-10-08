import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  allSpoken,
  boardButton,
  completeFirstRun,
  enterParentMode,
  exitParentMode,
  launchApp,
  makeUserDataDir,
  openDetails,
  openTab,
  spyOnSpeech,
  stubSaveDialog,
} from './helpers';

test.describe('Learning: word stages, focus words, word counts (speech and language therapy)', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('learning');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('a word held back by its stage leaves its slot empty and returns in exactly the same place; a focus word is outlined', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1357');

    await enterParentMode(page, '1357');
    const want = await openDetails(page, 'want');
    await want.locator('.button-details__field', { hasText: 'Word stage' }).locator('select').selectOption('3');
    const go = await openDetails(page, 'go');
    await go.locator('.button-details__check', { hasText: 'Focus word' }).locator('input').check();

    await openTab(page, /^Learning$/);
    const stageSection = page.locator('.learning-tab__section', { hasText: 'Word stage' });
    await stageSection.locator('select').selectOption('1');
    await expect(stageSection).toContainText('1 word is held back right now.');
    await expect(page.locator('.learning-tab__section', { hasText: 'Focus words' })).toContainText('go');
    await exitParentMode(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await expect(boardButton(page, 'want')).toHaveCount(0);
    await expect(boardButton(page, 'like')).toBeVisible();
    const likeWhileHeld = await boardButton(page, 'like').boundingBox();
    await expect(boardButton(page, 'go')).toHaveClass(/board-button--target/);

    // Back to all words: "want" returns, and nothing else has moved.
    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();
    await enterParentMode(page, '1357');
    await openTab(page, /^Learning$/);
    await page.locator('.learning-tab__section', { hasText: 'Word stage' }).locator('select').selectOption('0');
    await exitParentMode(page);
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await expect(boardButton(page, 'want')).toBeVisible();
    expect(await boardButton(page, 'like').boundingBox()).toEqual(likeWhileHeld);

    await app.close();
  });

  test('word counts are off until switched on, then count presses, export a spreadsheet, and clear', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '2468');

    // Off by default: pressing words records nothing.
    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();
    await enterParentMode(page, '2468');
    await openTab(page, /^Learning$/);
    const counts = page.locator('.learning-tab__section', { hasText: 'Word counts' });
    await expect(counts.locator('table')).toHaveCount(0);

    await counts.locator('input[type="checkbox"]').check();
    await exitParentMode(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'want').click();
    await page.locator('.talk-screen__nav-button', { hasText: 'Home' }).click();

    await enterParentMode(page, '2468');
    await openTab(page, /^Learning$/);
    const rows = counts.locator('tbody tr');
    await expect(rows).toHaveText(['i2', 'want1']);
    await expect(counts).toContainText('3 presses of 2 different words.');

    const csvPath = join(user.dir, 'counts.csv');
    await stubSaveDialog(app, csvPath);
    await counts.locator('button', { hasText: 'Save the counts as a spreadsheet' }).click();
    await expect(counts).toContainText('Saved.');
    const csv = readFileSync(csvPath, 'utf-8');
    expect(csv.split('\n')[0]).toBe('date,word,count');
    expect(csv).toMatch(/,i,2\n/);
    expect(csv).toMatch(/,want,1\n/);

    await counts.locator('button', { hasText: 'Clear the counts' }).click();
    await counts.locator('button', { hasText: 'Yes, clear them' }).click();
    await expect(counts).toContainText('0 presses of 0 different words.');

    await app.close();
  });

  test('"clear the sentence once it has been spoken" empties the strip after Speak', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '9753');

    await enterParentMode(page, '9753');
    await openTab(page, /^Learning$/);
    await page.locator('.learning-tab__section', { hasText: 'After speaking' }).locator('input').check();
    await exitParentMode(page);
    await spyOnSpeech(page);

    await page.locator('.home-screen__tile', { hasText: 'Talk' }).click();
    await boardButton(page, 'I').click();
    await boardButton(page, 'want').click();
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(2);
    await page.locator('.sentence-strip__speak').click();

    expect(await allSpoken(page)).toEqual(['I want']);
    await expect(page.locator('.sentence-strip__chip')).toHaveCount(0);

    await app.close();
  });
});
