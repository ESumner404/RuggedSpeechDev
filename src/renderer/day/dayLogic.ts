import type { DayActivity } from '../store/types';

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * "YYYY-MM-DD" in LOCAL time, not UTC, the day plan must roll over at
 * local midnight, not somewhere else in the world (docs/build-plan.md Phase 5
 * acceptance: "rolls over correctly at midnight").
 */
export function getDateString(now: Date): string {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

export function formatTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? 'pm' : 'am';
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelveHour}:${pad2(minutes)}${period}`;
}

export type NowNextLater = {
  now: DayActivity | null;
  next: DayActivity | null;
  later: DayActivity[];
};

/**
 * Sequential, not clock-driven, matches how a physical Now/Next board
 * actually gets used: it advances when something is marked finished, not
 * by comparing to a clock (which would need every activity to carry an
 * exact time, and drifts messily around real life).
 */
export function classifyNowNextLater(activities: DayActivity[]): NowNextLater {
  const unfinished = activities.filter((activity) => !activity.finished);
  return {
    now: unfinished[0] ?? null,
    next: unfinished[1] ?? null,
    later: unfinished.slice(2),
  };
}

export function markFinished(activities: DayActivity[], activityId: string): DayActivity[] {
  return activities.map((activity) =>
    activity.id === activityId ? { ...activity, finished: true } : activity,
  );
}
