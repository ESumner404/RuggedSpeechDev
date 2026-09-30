import { describe, expect, it } from 'vitest';
import { classifyNowNextLater, formatTime, getDateString, markFinished } from './dayLogic';
import type { DayActivity } from '../store/types';

function activity(id: string, overrides: Partial<DayActivity> = {}): DayActivity {
  return { id, name: id, ...overrides };
}

describe('getDateString', () => {
  it('formats in local time, zero-padded', () => {
    expect(getDateString(new Date(2026, 2, 5, 23, 59))).toBe('2026-03-05');
  });

  it('rolls over at local midnight', () => {
    const beforeMidnight = new Date(2026, 2, 5, 23, 59, 59);
    const afterMidnight = new Date(beforeMidnight.getTime() + 2000);
    expect(getDateString(beforeMidnight)).toBe('2026-03-05');
    expect(getDateString(afterMidnight)).toBe('2026-03-06');
  });
});

describe('formatTime', () => {
  it('formats morning and afternoon times', () => {
    expect(formatTime('09:05')).toBe('9:05am');
    expect(formatTime('13:30')).toBe('1:30pm');
  });

  it('formats midnight and noon correctly', () => {
    expect(formatTime('00:00')).toBe('12:00am');
    expect(formatTime('12:00')).toBe('12:00pm');
  });
});

describe('classifyNowNextLater', () => {
  it('is sequential, not clock-driven: now/next are the first two unfinished activities in order', () => {
    const activities = [activity('a'), activity('b'), activity('c'), activity('d')];
    const result = classifyNowNextLater(activities);
    expect(result.now?.id).toBe('a');
    expect(result.next?.id).toBe('b');
    expect(result.later.map((x) => x.id)).toEqual(['c', 'd']);
  });

  it('skips finished activities', () => {
    const activities = [
      activity('a', { finished: true }),
      activity('b'),
      activity('c'),
    ];
    const result = classifyNowNextLater(activities);
    expect(result.now?.id).toBe('b');
    expect(result.next?.id).toBe('c');
    expect(result.later).toEqual([]);
  });

  it('handles an empty or fully-finished day', () => {
    expect(classifyNowNextLater([])).toEqual({ now: null, next: null, later: [] });
    expect(classifyNowNextLater([activity('a', { finished: true })])).toEqual({
      now: null,
      next: null,
      later: [],
    });
  });
});

describe('markFinished', () => {
  it('marks only the targeted activity', () => {
    const activities = [activity('a'), activity('b')];
    const result = markFinished(activities, 'a');
    expect(result.find((x) => x.id === 'a')?.finished).toBe(true);
    expect(result.find((x) => x.id === 'b')?.finished).toBeFalsy();
  });
});
