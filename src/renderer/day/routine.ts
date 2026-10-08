import { WEEKDAYS, type DayActivity, type Weekday, type WeeklyRoutine } from '../store/types';

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/** Which weekday a "YYYY-MM-DD" date falls on, in local time. */
export function weekdayOf(date: string): Weekday {
  const [year, month, day] = date.split('-').map(Number);
  const jsDay = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1).getDay(); // 0 = Sunday
  return WEEKDAYS[(jsDay + 6) % 7]!;
}

/**
 * The routine's activities for one date, as fresh copies. A day with no plan
 * of its own uses these; the moment anything is changed or finished on the
 * day, the copy is saved as that day's own plan, so editing the routine later
 * never rewrites a day that has already happened.
 */
export function routineForDate(routine: WeeklyRoutine, date: string): DayActivity[] {
  return routine[weekdayOf(date)].map((activity) => {
    const copy = { ...activity };
    delete copy.finished;
    delete copy.changedFrom;
    return copy;
  });
}

/** Changes one routine activity. Unlike a day's own plan, renaming here is not a "change of plan". */
export function editRoutineActivity(
  routine: WeeklyRoutine,
  day: Weekday,
  id: string,
  updates: Partial<Omit<DayActivity, 'id' | 'changedFrom' | 'finished'>>,
): WeeklyRoutine {
  return { ...routine, [day]: routine[day].map((a) => (a.id === id ? { ...a, ...updates } : a)) };
}

export function addRoutineActivity(routine: WeeklyRoutine, day: Weekday, activity: DayActivity): WeeklyRoutine {
  return { ...routine, [day]: [...routine[day], activity] };
}

export function removeRoutineActivity(routine: WeeklyRoutine, day: Weekday, id: string): WeeklyRoutine {
  return { ...routine, [day]: routine[day].filter((a) => a.id !== id) };
}

export function moveRoutineActivity(
  routine: WeeklyRoutine,
  day: Weekday,
  id: string,
  direction: 'up' | 'down',
): WeeklyRoutine {
  const list = routine[day];
  const index = list.findIndex((a) => a.id === id);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= list.length) return routine;
  const next = [...list];
  [next[index], next[swapWith]] = [next[swapWith]!, next[index]!];
  return { ...routine, [day]: next };
}

/** Makes Monday to Friday the same as `from`, for a school timetable that repeats. */
export function copyToWeekdays(routine: WeeklyRoutine, from: Weekday): WeeklyRoutine {
  const next = { ...routine };
  for (const day of ['mon', 'tue', 'wed', 'thu', 'fri'] as const) {
    if (day !== from) next[day] = routine[from].map((activity) => ({ ...activity }));
  }
  return next;
}
