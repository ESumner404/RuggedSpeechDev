import { expect, test } from '@playwright/test';
import {
  allSpoken,
  completeFirstRun,
  enterParentMode,
  exitParentMode,
  launchApp,
  makeUserDataDir,
  openTab,
  setUpPin,
  spyOnSpeech,
} from './helpers';

const barLabels = (page: import('@playwright/test').Page) => page.locator('.quick-access-bar__button').allTextContents();

test.describe('School mode and Parent Mode extras', () => {
  let user: ReturnType<typeof makeUserDataDir>;

  test.beforeEach(() => {
    user = makeUserDataDir('school');
  });

  test.afterEach(() => {
    user.remove();
  });

  test('School Mode is its own place: a button beside Parent Mode, a School PIN chosen afterwards, and the top bar left alone until staff change it', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    // Set-up asked for one PIN only, the Parent PIN. There is no School Mode yet.
    await expect(page.locator('.parent-mode-button')).toHaveText('Parent Mode');
    await expect(page.locator('.school-mode-button')).toHaveCount(0);
    await expect(page.locator('.about-me-button')).toHaveCount(0);

    // Parent Mode turns it on, and chooses the School PIN there and then.
    await enterParentMode(page, '1234');
    await openTab(page, /^School$/);
    await expect(page.locator('.school-tab')).toContainText('School Mode is off');
    await page.locator('button', { hasText: 'Turn School Mode on' }).click();
    await expect(page.locator('.pin-gate__prompt')).toContainText('School PIN');
    await setUpPin(page, '5678');
    await expect(page.locator('.pin-gate__prompt')).toHaveText('Enter the same PIN again');
    await setUpPin(page, '5678');
    await expect(page.locator('.school-tab')).toContainText('School Mode is on');
    await expect(page.locator('.pin-gate__recovery-code')).toHaveCount(0); // no recovery code: Parent Mode can reset it
    await expect(page.locator('.parent-mode-screen__title')).toHaveText('Parent Mode');
    await exitParentMode(page);

    // Its own button, right next to Parent Mode, and nothing on the child's screen moved.
    const toolbar = await page.locator('.app-shell__toolbar button').allTextContents();
    expect(toolbar[toolbar.indexOf('Parent Mode') + 1]).toBe('School Mode');
    expect(await barLabels(page)).toEqual(['Home', 'Help', 'Yes', 'No', 'Favourites', 'Keyboard']);

    // The School PIN opens it; the Parent PIN does not.
    await page.locator('.school-mode-button').click();
    await expect(page.locator('.pin-gate__prompt')).toHaveText('Enter the School Mode PIN');
    await setUpPin(page, '1234');
    await expect(page.locator('.pin-gate__error')).toContainText('Wrong PIN');
    await expect(page.locator('.school-mode-screen')).toHaveCount(0);
    await setUpPin(page, '5678');
    await expect(page.locator('.school-mode-screen')).toBeVisible();
    await expect(page.locator('.parent-mode-screen__title')).toHaveText('School Mode');
    await expect(page.locator('.today-tab')).toBeVisible();

    // Staff choose to change the top bar, on purpose.
    await page.locator('.parent-nav__tab', { hasText: 'Classroom set-up' }).click();
    await page.locator('button', { hasText: 'Use the school top bar' }).click();
    await page.locator('button', { hasText: 'Yes, change them' }).click();
    await expect(page.locator('.classroom-tab')).toContainText('The top bar is now Home, Help, Yes, No, Break and Question');
    await page.locator('.parent-nav__tab', { hasText: 'About me' }).click();
    await page.locator('.about-tab__field', { hasText: 'What I like to be called' }).locator('input').fill('Sam');
    await page.locator('.about-tab__field', { hasText: 'How I communicate' }).locator('textarea').fill('I use this app and a few words.');
    await page.locator('.parent-mode-screen__exit').click();
    await expect(page.locator('.app-shell')).toBeVisible();
    expect(await barLabels(page)).toEqual(['Home', 'Help', 'Yes', 'No', 'Break', 'Question']);

    await spyOnSpeech(page);
    await page.locator('.quick-access-bar__button', { hasText: 'Break' }).click();
    await page.locator('.quick-access-bar__button', { hasText: 'Question' }).click();
    expect(await allSpoken(page)).toEqual(['I need a break', 'I have a question']);

    // About me is on the child's screen for supply staff, with no PIN.
    await page.locator('.about-me-button').click();
    await expect(page.locator('.about-me-overlay__heading')).toHaveText('About Sam');
    await page.locator('.medical-info-overlay__close').click();

    // Parent Mode can turn it off, which hides the button and keeps the PIN.
    await enterParentMode(page, '1234');
    await openTab(page, /^School$/);
    await page.locator('button', { hasText: 'Turn School Mode off' }).click();
    await exitParentMode(page);
    await expect(page.locator('.school-mode-button')).toHaveCount(0);

    await app.close();
  });

  test('School Mode and its PIN survive closing the app', async () => {
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    await enterParentMode(page, '1234');
    await openTab(page, /^School$/);
    await page.locator('button', { hasText: 'Turn School Mode on' }).click();
    await setUpPin(page, '5678');
    await setUpPin(page, '5678');
    await expect(page.locator('.school-tab')).toContainText('School Mode is on');
    await app.close();

    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await expect(page.locator('.school-mode-button')).toBeVisible();
    await page.locator('.school-mode-button').click();
    await setUpPin(page, '5678');
    await expect(page.locator('.school-mode-screen')).toBeVisible();
    await app.close();
  });

  test('a favourite colour washes the whole app, and is still there after closing it', async () => {
    let app = await launchApp(user.dir);
    let page = await app.firstWindow();
    await completeFirstRun(page, '1234');
    const background = () => page.evaluate(() => document.documentElement.style.getPropertyValue('--color-background'));
    expect(await background()).toBe('');
    await enterParentMode(page, '1234');
    await openTab(page, /^Look$/);
    await page.locator('.look-tab__fun', { hasText: 'Orange' }).click();
    await expect(page.locator('.look-tab__fun--chosen')).toHaveText('Orange');
    await expect.poll(background).toMatch(/^#f/i);
    const orange = await background();
    await exitParentMode(page);
    await app.close();

    app = await launchApp(user.dir);
    page = await app.firstWindow();
    await expect(page.locator('.home-screen__tile').first()).toBeVisible();
    await expect.poll(background).toBe(orange);
    await app.close();
  });

  test('a weekly routine fills in the child\'s My Day for any day with no plan of its own', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]!;

    await expect(page.locator('.home-screen__tile', { hasText: 'My Day' })).toBeVisible();
    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await expect(page.locator('.my-day-screen__empty')).toBeVisible();
    await page.locator('.quick-access-bar__button', { hasText: 'Home' }).click();

    await enterParentMode(page, '1234');
    await openTab(page, /^My Day$/);
    const routine = page.locator('.weekly-routine');
    await routine.locator('.weekly-routine__day', { hasText: today }).click();
    for (const [index, name] of ['Maths', 'PE'].entries()) {
      await routine.locator('input[aria-label="New routine activity"]').fill(name);
      await routine.locator('button', { hasText: `Add to ${today}` }).click();
      await expect(routine.locator('.weekly-routine__activity')).toHaveCount(index + 1);
    }
    // Today's own plan in the builder shows the routine, and says why.
    await expect(page.locator('.day-builder-tab__routine-note')).toContainText('weekly routine');
    await exitParentMode(page);

    await page.locator('.home-screen__tile', { hasText: 'My Day' }).click();
    await expect(page.locator('.day-activity')).toHaveCount(2);
    await expect(page.locator('.day-activity').first()).toContainText('Maths');

    await app.close();
  });

  test('the PIN can be changed from inside Parent Mode: the new one works and the old one does not', async () => {
    const app = await launchApp(user.dir);
    const page = await app.firstWindow();
    await completeFirstRun(page, '1234');

    await enterParentMode(page, '1234');
    await openTab(page, /^General$/);
    await page.locator('button', { hasText: 'Change the PIN' }).click();
    await expect(page.locator('.pin-gate__prompt')).toContainText('Choose a new');
    await setUpPin(page, '5566');
    await setUpPin(page, '5566');
    await expect(page.locator('.pin-gate__recovery-code')).toBeVisible();
    await page.locator('.pin-gate__button').click();
    await expect(page.locator('.general-tab')).toContainText('The PIN has been changed');
    await exitParentMode(page);

    await page.locator('.parent-mode-button').click();
    await setUpPin(page, '1234');
    await expect(page.locator('.pin-gate__error')).toContainText('Wrong PIN');
    await setUpPin(page, '5566');
    await expect(page.locator('.parent-mode-screen')).toBeVisible();

    await app.close();
  });
});
