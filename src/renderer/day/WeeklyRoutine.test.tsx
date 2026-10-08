import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MyDayScreen } from './MyDayScreen';
import { WeeklyRoutineEditor } from './WeeklyRoutineEditor';
import { DayBuilderTab } from './DayBuilderTab';
import { getDateString } from './dayLogic';
import { WEEKDAY_LABELS, weekdayOf } from './routine';
import {
  EMPTY_ROUTINE,
  getDayPlan,
  getEffectiveDayPlan,
  resetDBConnectionForTests,
  saveDayPlan,
  weeklyRoutineSetting,
} from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

const TODAY = getDateString(new Date());
const TODAY_KEY = weekdayOf(TODAY);

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
});

describe('which plan a date uses', () => {
  it("is the date's own plan when one has been saved, even an empty one", async () => {
    await weeklyRoutineSetting.set({ ...EMPTY_ROUTINE, [TODAY_KEY]: [{ id: 'maths', name: 'Maths' }] });
    await saveDayPlan({ date: TODAY, activities: [] });
    const result = await getEffectiveDayPlan(TODAY);
    expect(result.fromRoutine).toBe(false);
    expect(result.plan.activities).toEqual([]);
  });

  it("falls back to that weekday's routine when the date has no plan", async () => {
    await weeklyRoutineSetting.set({ ...EMPTY_ROUTINE, [TODAY_KEY]: [{ id: 'maths', name: 'Maths', time: '09:00' }] });
    const result = await getEffectiveDayPlan(TODAY);
    expect(result.fromRoutine).toBe(true);
    expect(result.plan.activities.map((a) => a.name)).toEqual(['Maths']);
    // Looking is not saving.
    expect((await getDayPlan(TODAY)).activities).toEqual([]);
  });
});

describe('WeeklyRoutineEditor', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    render(<WeeklyRoutineEditor />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const dayButton = (label: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('.weekly-routine__day')).find((b) => b.textContent === label)!;
  const typeInto = (input: HTMLInputElement, value: string) =>
    act(() => {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

  it('builds a day, keeps it, and keeps each weekday separate', async () => {
    typeInto(container.querySelector('input[aria-label="New routine activity"]')!, 'Maths');
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => weeklyRoutineSetting.signal.value.mon.length === 1);

    typeInto(container.querySelector('input[aria-label="Time"]')!, '09:00');
    await waitFor(() => weeklyRoutineSetting.signal.value.mon[0]?.time === '09:00');

    act(() => dayButton('Tuesday').click());
    expect(container.textContent).toContain('Nothing planned on Tuesdays yet.');
    expect(weeklyRoutineSetting.signal.value.tue).toEqual([]);

    resetDBConnectionForTests();
    expect((await weeklyRoutineSetting.get()).mon).toMatchObject([{ name: 'Maths', time: '09:00' }]);
  });

  it('copies one day to Monday through Friday', async () => {
    typeInto(container.querySelector('input[aria-label="New routine activity"]')!, 'Registration');
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => weeklyRoutineSetting.signal.value.mon.length === 1);

    act(() => {
      Array.from(container.querySelectorAll('button'))
        .find((b) => b.textContent?.includes('to every weekday'))!
        .click();
    });
    await waitFor(() => weeklyRoutineSetting.signal.value.fri.length === 1);
    expect(weeklyRoutineSetting.signal.value.sat).toEqual([]);
  });
});

describe('My Day with a weekly routine', () => {
  let container: HTMLElement;

  afterEach(() => {
    render(null, container);
  });

  it("shows today's routine to the child with no plan built, and finishing one saves just today", async () => {
    const routine = { ...EMPTY_ROUTINE, [TODAY_KEY]: [{ id: 'maths', name: 'Maths' }, { id: 'pe', name: 'PE' }] };
    await weeklyRoutineSetting.set(routine);

    container = document.createElement('div');
    render(<MyDayScreen />, container);
    await waitFor(() => container.querySelectorAll('.day-activity').length === 2);

    act(() => container.querySelector<HTMLButtonElement>('.day-activity')!.click());
    const finished = Array.from(container.querySelectorAll<HTMLButtonElement>('.day-ask-overlay__questions button')).find(
      (b) => b.textContent === 'Finished',
    )!;
    act(() => finished.click());

    await waitFor(async () => (await getDayPlan(TODAY)).activities.some((a) => a.finished));
    expect((await getDayPlan(TODAY)).activities.map((a) => a.id)).toEqual(['maths', 'pe']);
    // The routine itself is untouched, so next week starts clean.
    expect((await weeklyRoutineSetting.get())[TODAY_KEY].some((a) => a.finished)).toBe(false);
  });

  it('the builder explains where a routine day came from, then owns it once something is changed', async () => {
    await weeklyRoutineSetting.set({ ...EMPTY_ROUTINE, [TODAY_KEY]: [{ id: 'maths', name: 'Maths' }] });
    container = document.createElement('div');
    render(<DayBuilderTab />, container);
    await waitFor(() => container.textContent?.includes('This day uses the weekly routine') === true);

    const name = container.querySelector<HTMLInputElement>('.day-builder-tab__activity input')!;
    act(() => {
      name.value = 'Numeracy';
      name.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getDayPlan(TODAY)).activities.length === 1);
    expect(container.textContent).not.toContain('This day uses the weekly routine');
    expect((await weeklyRoutineSetting.get())[TODAY_KEY][0]?.name).toBe('Maths');
  });

  it("follows the routine as it is edited below, so the builder always shows what the child will see", async () => {
    container = document.createElement('div');
    render(<DayBuilderTab />, container);
    await waitFor(() => container.querySelector('.weekly-routine') !== null);
    expect(container.querySelectorAll('.day-builder-tab__activity')).toHaveLength(0);

    const day = Array.from(container.querySelectorAll<HTMLButtonElement>('.weekly-routine__day')).find(
      (b) => b.textContent === WEEKDAY_LABELS[TODAY_KEY],
    )!;
    act(() => day.click());
    const input = container.querySelector<HTMLInputElement>('input[aria-label="New routine activity"]')!;
    act(() => {
      input.value = 'Registration';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container.querySelector('.weekly-routine__add-form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    await waitFor(() => container.querySelectorAll('.day-builder-tab__activity').length === 1);
    expect(container.textContent).toContain('This day uses the weekly routine');
  });
});
