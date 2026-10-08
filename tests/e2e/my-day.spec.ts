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
  await page.locator('.page-tabs__tab', { hasText: 'My Day' }).click();
}

async function spyOnSpeech(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __spoken: string[] }).__spoken = [];
    window.speechSynthesis.speak = (utterance: SpeechSynthesisUtterance) => {
      (window as unknown as { __spoken: string[] }).__spoken.push(utterance.text);
    };
  });
}

async function allSpoken(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken);
}

// The activity name lives inside an <input value="...">, which doesn't
// contribute to an element's textContent, hasText can't find a row by
// name. The Remove button's aria-label does stay in sync with the live
// name, so rows are found through that instead.
function builderRow(page: Page, name: string) {
  return page.locator('.day-builder-tab__activity').filter({
    has: page.locator(`[aria-label="Remove ${name}"]`),
  });
}

async function addActivity(page: Page, name: string): Promise<void> {
  await page.locator('input[placeholder="New activity name"]').fill(name);
  await page.locator('.day-builder-tab__add-form').locator('button[type="submit"]').click();
  await expect(builderRow(page, name)).toBeVisible();
}

test.describe('Phase 5. My Day', () => {
  let userDataDir: string;

  test.beforeEach(() => {
    userDataDir = mkdtempSync(join(tmpdir(), 'mywords-e2e-myday-'));
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

  test('a built day appears on the child screen with the current activity distinct, and only for today', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await enterParentModeFresh(page, '1234');

    const dateInput = page.locator('.day-builder-tab__controls input[type="date"]');
    const todayValue = await dateInput.inputValue();

    await addActivity(page, 'Breakfast');
    await addActivity(page, 'School');

    // A plan for a different date must not show on the child's Today screen.
    await dateInput.fill('2099-01-01');
    await addActivity(page, 'Not today');
    await dateInput.fill(todayValue);
    await page.locator('.parent-mode-screen__exit').click();

    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await expect(page.locator('.day-activity', { hasText: 'Breakfast' })).toBeVisible();
    await expect(page.locator('.day-activity--current', { hasText: 'Breakfast' })).toBeVisible();
    await expect(page.locator('.day-activity', { hasText: 'Not today' })).toHaveCount(0);

    await app.close();
  });

  test('tapping an activity and asking each question speaks the right answer, and Finished moves it', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await spyOnSpeech(page);
    await enterParentModeFresh(page, '4321');

    await addActivity(page, 'Swimming');
    const row = builderRow(page, 'Swimming');
    await row.locator('input[type="time"]').fill('14:30');
    await row.locator('input[placeholder="Location"]').fill('Leisure Centre');
    await row.locator('input[placeholder="Who with"]').fill('Dad');
    await page.locator('.parent-mode-screen__exit').click();

    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await page.locator('.day-activity', { hasText: 'Swimming' }).click();

    await page.locator('.day-ask-overlay__questions button', { hasText: 'When?' }).click();
    expect(await allSpoken(page)).toEqual(['Swimming at 2:30pm']);

    await page.locator('.day-ask-overlay__questions button', { hasText: 'Where?' }).click();
    await page.locator('.day-ask-overlay__questions button', { hasText: 'Who with?' }).click();
    expect(await allSpoken(page)).toEqual([
      'Swimming at 2:30pm',
      'Swimming is at Leisure Centre',
      'Swimming with Dad',
    ]);

    await page.locator('.day-ask-overlay__questions button', { hasText: 'Finished' }).click();
    await expect(page.locator('.day-section--finished .day-activity', { hasText: 'Swimming' })).toBeVisible();

    await app.close();
  });

  test('a change of plan announces once and shows the old name struck through', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await spyOnSpeech(page);
    await enterParentModeFresh(page, '1111');

    await addActivity(page, 'Lunch');
    await page.locator('.parent-mode-screen__exit').click();
    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await expect(page.locator('.day-activity', { hasText: 'Lunch' })).toBeVisible();

    // The adult edits the plan from Parent Mode while the child's screen
    // (still open, in the background) is showing the old plan, the whole
    // point of "change of plan" is that this reaches the child immediately.
    await page.locator('.parent-mode-button').click();
    await setUpPin(page, '1111');
    await page.locator('.page-tabs__tab', { hasText: 'My Day' }).click();
    const nameInput = builderRow(page, 'Lunch').locator('.parent-mode-screen__label-input');
    await nameInput.fill("Grandma's");
    await page.locator('.parent-mode-screen__exit').click();

    await expect(page.locator('.day-activity__struck')).toHaveText('Lunch');
    await expect(page.locator('.day-activity__name')).toContainText("Grandma's");
    await expect.poll(() => allSpoken(page)).toEqual([
      "The plan has changed. We are going to Grandma's instead.",
    ]);

    await app.close();
  });

  test('countdown warnings default off; turning them on is a deliberate, persisted choice', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await enterParentModeFresh(page, '5555');

    const checkbox = page.locator('.day-builder-tab__countdown-toggle input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();
    await page.locator('.parent-mode-screen__exit').click();

    await page.locator('.parent-mode-button').click();
    await setUpPin(page, '5555');
    await page.locator('.page-tabs__tab', { hasText: 'My Day' }).click();
    await expect(page.locator('.day-builder-tab__countdown-toggle input[type="checkbox"]')).toBeChecked();

    await app.close();
  });

  test('switching to the Now / Next / Later view is a deliberate adult choice reflected on the child screen', async () => {
    const app = await launch();
    const page = await app.firstWindow();
    await enterParentModeFresh(page, '2468');

    await addActivity(page, 'Breakfast');
    await addActivity(page, 'School');
    await addActivity(page, 'Home');
    await page.locator('.day-builder-tab__controls select').selectOption('nowNextLater');
    await page.locator('.parent-mode-screen__exit').click();

    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await expect(page.locator('.my-day-screen__now-next-later')).toBeVisible();
    const sections = page.locator('.day-section');
    await expect(sections.nth(0)).toContainText('Breakfast');
    await expect(sections.nth(1)).toContainText('School');
    await expect(sections.nth(2)).toContainText('Home');

    await app.close();
  });
});
