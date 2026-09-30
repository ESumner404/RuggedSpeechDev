import { describe, expect, it } from 'vitest';
import { getDueWarning } from './countdown';
import type { DayActivity } from '../store/types';

const baseNow = new Date(2026, 2, 5, 12, 0, 0);

function activityAt(hhmm: string, countdownMinutes: 5 | 30 | 60 = 30): DayActivity {
  return { id: 'lunch', name: 'Lunch', time: hhmm, countdownMinutes };
}

describe('getDueWarning', () => {
  it('is null with no countdown set', () => {
    const activity: DayActivity = { id: 'a', name: 'a', time: '12:01' };
    expect(getDueWarning(activity, baseNow)).toBeNull();
  });

  it('is null with no time set, even with a countdown configured', () => {
    const activity: DayActivity = { id: 'a', name: 'a', countdownMinutes: 30 };
    expect(getDueWarning(activity, baseNow)).toBeNull();
  });

  it('is null outside the countdown window', () => {
    // 40 minutes away, but the window is only 30.
    expect(getDueWarning(activityAt('12:40', 30), baseNow)).toBeNull();
  });

  it('is null well inside the window but more than 2 minutes out', () => {
    expect(getDueWarning(activityAt('12:10', 30), baseNow)).toBeNull();
  });

  it('warns at exactly the two-minute mark', () => {
    expect(getDueWarning(activityAt('12:02', 30), baseNow)).toBe('twoMinutes');
  });

  it('warns at exactly the one-minute mark', () => {
    expect(getDueWarning(activityAt('12:01', 30), baseNow)).toBe('oneMinute');
  });

  it('is null once the activity has started', () => {
    expect(getDueWarning(activityAt('12:00', 30), baseNow)).toBeNull();
    expect(getDueWarning(activityAt('11:55', 30), baseNow)).toBeNull();
  });

  it('never fires for a finished activity', () => {
    const activity: DayActivity = { ...activityAt('12:01', 30), finished: true };
    expect(getDueWarning(activity, baseNow)).toBeNull();
  });
});
