import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MyDayScreen } from './MyDayScreen';
import { getDateString } from './dayLogic';
import { getDayPlan, resetDBConnectionForTests, saveDayPlan, setDaySettings } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function stubSpeech(): string[] {
  const spoken: string[] = [];
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string;
    rate = 1;
    pitch = 1;
    voice = null;
    constructor(text: string) {
      this.text = text;
    }
  };
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => [],
    cancel: () => {},
    speak: (utterance: { text: string }) => spoken.push(utterance.text),
  };
  return spoken;
}

const today = getDateString(new Date());

describe('MyDayScreen', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    // MyDayScreen reacts to the module-level dayPlanVersion signal for
    // live "change of plan" updates, an un-unmounted instance left over
    // from a previous test keeps reacting to later tests' saves too
    // (found the hard way: duplicate announcements that scaled with how
    // many earlier tests had run). Unmounting clears its effects.
    render(null, container);
  });

  it('shows an empty state when nothing has been planned', async () => {
    render(<MyDayScreen />, container);
    await waitFor(() => container.querySelector('.my-day-screen__empty') !== null);
    expect(container.querySelector('.my-day-screen__empty')?.textContent).toContain('No plan for today');
  });

  it('shows the current activity visually distinct in the Today view', async () => {
    await saveDayPlan({
      date: today,
      activities: [
        { id: 'breakfast', name: 'Breakfast' },
        { id: 'school', name: 'School' },
      ],
    });
    render(<MyDayScreen />, container);
    await waitFor(() => container.querySelectorAll('.day-activity').length > 0);

    const current = container.querySelector('.day-activity--current');
    expect(current?.textContent).toContain('Breakfast');
  });

  it('tapping an activity and asking "Where?" speaks its location', async () => {
    const spoken = stubSpeech();
    await saveDayPlan({
      date: today,
      activities: [{ id: 'school', name: 'School', location: 'Oak Street' }],
    });
    render(<MyDayScreen />, container);
    await waitFor(() => container.querySelectorAll('.day-activity').length > 0);

    act(() => {
      container.querySelector<HTMLButtonElement>('.day-activity')?.click();
    });
    const whereButton = Array.from(container.querySelectorAll('button')).find(
      (el) => el.textContent === 'Where?',
    );
    act(() => whereButton?.click());

    expect(spoken).toEqual(['School is at Oak Street']);
  });

  it('Finished marks the activity finished and it moves out of the active list', async () => {
    stubSpeech();
    await saveDayPlan({
      date: today,
      activities: [{ id: 'breakfast', name: 'Breakfast' }],
    });
    render(<MyDayScreen />, container);
    await waitFor(() => container.querySelectorAll('.day-activity').length > 0);

    act(() => {
      container.querySelector<HTMLButtonElement>('.day-activity')?.click();
    });
    const finishedButton = Array.from(container.querySelectorAll('button')).find(
      (el) => el.textContent === 'Finished',
    );
    act(() => finishedButton?.click());
    await waitFor(() => container.querySelector('.day-section--finished') !== null);

    expect(container.querySelector('.day-section--finished .day-activity')?.textContent).toContain('Breakfast');

    const plan = await getDayPlan(today);
    expect(plan.activities[0]?.finished).toBe(true);
  });

  it('a change of plan shows the old name struck through and speaks the change once', async () => {
    const spoken = stubSpeech();
    await saveDayPlan({
      date: today,
      activities: [{ id: 'lunch', name: "Grandma's", changedFrom: 'Lunch' }],
    });
    render(<MyDayScreen />, container);

    await waitFor(() => spoken.length > 0);
    expect(spoken).toEqual(["The plan has changed. We are going to Grandma's instead."]);
    expect(container.querySelector('.day-activity__struck')?.textContent).toBe('Lunch');

    // The acknowledgement persists, so it doesn't repeat on a later load.
    const start = Date.now();
    let acknowledged = false;
    while (!acknowledged && Date.now() - start < 2000) {
      acknowledged = !(await getDayPlan(today)).activities[0]?.changedFrom;
      if (!acknowledged) await new Promise((resolve) => setTimeout(resolve, 5));
    }
    expect(acknowledged).toBe(true);
  });

  it('Now/Next/Later view classifies sequentially', async () => {
    await setDaySettings({ view: 'nowNextLater', countdownEnabled: false });
    await saveDayPlan({
      date: today,
      activities: [
        { id: 'a', name: 'Breakfast' },
        { id: 'b', name: 'School' },
        { id: 'c', name: 'Home' },
      ],
    });
    render(<MyDayScreen />, container);
    await waitFor(() => container.querySelector('.my-day-screen__now-next-later') !== null);

    const sections = Array.from(container.querySelectorAll('.day-section'));
    expect(sections[0]?.textContent).toContain('Breakfast');
    expect(sections[1]?.textContent).toContain('School');
    expect(sections[2]?.textContent).toContain('Home');
  });
});
