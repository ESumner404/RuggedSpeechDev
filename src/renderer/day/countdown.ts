import type { DayActivity } from '../store/types';

export type CountdownWarningLevel = 'twoMinutes' | 'oneMinute';

function minutesUntil(activity: DayActivity, now: Date): number | null {
  if (!activity.time) return null;
  const parts = activity.time.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const mins = parts[1] ?? 0;
  const target = new Date(now);
  target.setHours(hours, mins, 0, 0);
  return (target.getTime() - now.getTime()) / 60_000;
}

/**
 * Which warning (if any) is due right now for this activity. Off by
 * default (docs/build-plan.md Phase 5), callers only invoke this when an adult has
 * deliberately turned countdowns on. The adult's chosen countdownMinutes
 * controls how far ahead the countdown window opens; the two spoken
 * warnings themselves are always fixed at 2 and 1 minutes before start,
 * regardless of that window's length.
 */
export function getDueWarning(activity: DayActivity, now: Date): CountdownWarningLevel | null {
  if (!activity.time || !activity.countdownMinutes || activity.finished) return null;
  const remaining = minutesUntil(activity, now);
  if (remaining === null || remaining > activity.countdownMinutes) return null;
  if (remaining <= 1 && remaining > 0) return 'oneMinute';
  if (remaining <= 2 && remaining > 1) return 'twoMinutes';
  return null;
}
