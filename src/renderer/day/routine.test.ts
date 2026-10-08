import { describe, expect, it } from 'vitest';
import {
  addRoutineActivity,
  copyToWeekdays,
  editRoutineActivity,
  moveRoutineActivity,
  removeRoutineActivity,
  routineForDate,
  weekdayOf,
} from './routine';
import { EMPTY_ROUTINE } from '../store/db';
import type { WeeklyRoutine } from '../store/types';

const MATHS = { id: 'maths', name: 'Maths', time: '09:00' };
const PE = { id: 'pe', name: 'PE', time: '10:30' };

describe('weekdayOf', () => {
  it('finds the weekday of a calendar date, with Monday first', () => {
    expect(weekdayOf('2026-09-07')).toBe('mon');
    expect(weekdayOf('2026-09-08')).toBe('tue');
    expect(weekdayOf('2026-09-12')).toBe('sat');
    expect(weekdayOf('2026-09-13')).toBe('sun');
  });

  it('is not thrown out by a month or year boundary', () => {
    expect(weekdayOf('2026-12-31')).toBe('thu');
    expect(weekdayOf('2027-01-01')).toBe('fri');
  });
});

describe('routineForDate', () => {
  const routine: WeeklyRoutine = { ...EMPTY_ROUTINE, mon: [MATHS, { ...PE, finished: true, changedFrom: 'Games' }] };

  it("returns that weekday's activities as clean copies", () => {
    const today = routineForDate(routine, '2026-09-07');
    expect(today).toEqual([MATHS, { id: 'pe', name: 'PE', time: '10:30' }]);
    expect(today[0]).not.toBe(MATHS);
  });

  it('is empty for a day with nothing in the routine', () => {
    expect(routineForDate(routine, '2026-09-08')).toEqual([]);
  });
});

describe('editing the routine', () => {
  const base: WeeklyRoutine = { ...EMPTY_ROUTINE, tue: [MATHS, PE] };

  it('adds, edits, moves and removes activities on one day only', () => {
    let routine = addRoutineActivity(base, 'tue', { id: 'art', name: 'Art' });
    expect(routine.tue.map((a) => a.id)).toEqual(['maths', 'pe', 'art']);
    expect(routine.mon).toEqual([]);

    routine = editRoutineActivity(routine, 'tue', 'art', { name: 'Art club', location: 'Room 4' });
    expect(routine.tue[2]).toEqual({ id: 'art', name: 'Art club', location: 'Room 4' });

    routine = moveRoutineActivity(routine, 'tue', 'art', 'up');
    expect(routine.tue.map((a) => a.id)).toEqual(['maths', 'art', 'pe']);
    expect(moveRoutineActivity(routine, 'tue', 'maths', 'up')).toBe(routine);

    routine = removeRoutineActivity(routine, 'tue', 'art');
    expect(routine.tue.map((a) => a.id)).toEqual(['maths', 'pe']);
  });

  it('renaming here is not a change of plan, so nothing is struck through', () => {
    const renamed = editRoutineActivity(base, 'tue', 'maths', { name: 'Numeracy' });
    expect(renamed.tue[0]?.changedFrom).toBeUndefined();
  });

  it('copies one day across Monday to Friday and leaves the weekend alone', () => {
    const copied = copyToWeekdays({ ...base, sat: [PE] }, 'tue');
    for (const day of ['mon', 'tue', 'wed', 'thu', 'fri'] as const) {
      expect(copied[day].map((a) => a.id)).toEqual(['maths', 'pe']);
    }
    expect(copied.sat).toEqual([PE]);
    expect(copied.sun).toEqual([]);
    expect(copied.mon[0]).not.toBe(copied.tue[0]);
  });
});
