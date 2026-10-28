import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomeScreen } from '../app/HomeScreen';
import { NowStrip } from './NowStrip';
import { readSchoolNow } from './schoolDay';
import { getDateString } from './dayLogic';
import { resetDBConnectionForTests, saveDayPlan } from '../store/db';
import type { DayActivity } from '../store/types';

const waitFor = async (check: () => boolean) => {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > 2000) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
};

const activity = (id: string, name: string, extra: Partial<DayActivity> = {}): DayActivity => ({ id, name, ...extra }) as DayActivity;

describe('the school day on Home', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  it('works out now and next from today, skipping what is finished', async () => {
    await saveDayPlan({
      date: getDateString(new Date()),
      activities: [activity('a', 'Registration', { finished: true }), activity('b', 'Maths', { time: '09:15', pageId: 'p1' }), activity('c', 'Break')],
    });
    const today = await readSchoolNow();
    expect(today.now?.name).toBe('Maths');
    expect(today.next?.name).toBe('Break');
    expect(today.planned).toBe(true);
  });

  it('shows now, next and the words for the lesson, and opens them when pressed', async () => {
    await saveDayPlan({
      date: getDateString(new Date()),
      activities: [activity('b', 'Maths', { time: '09:15', pageId: 'p1' }), activity('c', 'Break')],
    });
    const openDay = vi.fn();
    const openPage = vi.fn();
    render(<NowStrip onOpenDay={openDay} onOpenPage={openPage} />, container);
    await waitFor(() => container.textContent?.includes('Maths') === true);
    expect(container.querySelector('.now-strip__now')?.textContent).toBe('Maths, 9:15am');
    expect(container.querySelector('.now-strip__next')?.textContent).toBe('Next: Break');
    act(() => container.querySelector<HTMLButtonElement>('.now-strip__words')!.click());
    expect(openPage).toHaveBeenCalledWith('p1');
    act(() => container.querySelector<HTMLButtonElement>('.now-strip__day')!.click());
    expect(openDay).toHaveBeenCalled();
  });

  it('offers no words button when the lesson has no page, and says so plainly when nothing is planned', async () => {
    render(<NowStrip onOpenDay={() => {}} onOpenPage={() => {}} />, container);
    await waitFor(() => container.textContent?.includes('Nothing planned') === true);
    expect(container.querySelector('.now-strip__words')).toBeNull();
  });

  it('is part of Home only when a school asks for it, and the six buttons stay as they were', async () => {
    const plain = document.createElement('div');
    render(<HomeScreen onSelect={() => {}} />, plain);
    expect(plain.querySelector('.now-strip')).toBeNull();
    expect(plain.querySelectorAll('.home-screen__tile')).toHaveLength(6);

    render(<HomeScreen onSelect={() => {}} schoolDay={{ onOpenDay: () => {}, onOpenPage: () => {} }} />, container);
    expect(container.querySelector('.now-strip')).not.toBeNull();
    expect(Array.from(container.querySelectorAll('.home-screen__tile')).map((t) => t.textContent)).toEqual(
      Array.from(plain.querySelectorAll('.home-screen__tile')).map((t) => t.textContent),
    );
  });
});
