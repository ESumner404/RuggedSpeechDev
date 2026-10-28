import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { classifyNowNextLater, formatTime, getDateString, type NowNextLater } from './dayLogic';
import { dayPlanVersion, getEffectiveDayPlan, weeklyRoutineSetting } from '../store/db';
import type { DayActivity } from '../store/types';

// What is happening at school right now, worked out from today's plan (or the timetable, if nobody has planned today
// separately). Used by the strip on the child's Home screen and by the "This lesson" button, so the words for a lesson are
// one press away without going through My Day. It only reads: nothing here changes the plan or speaks.

export type SchoolNow = NowNextLater & {
  /** Whether there is anything planned today at all. */
  planned: boolean;
};

export async function readSchoolNow(now: Date = new Date()): Promise<SchoolNow> {
  const { plan } = await getEffectiveDayPlan(getDateString(now));
  return { ...classifyNowNextLater(plan.activities), planned: plan.activities.length > 0 };
}

/** "Maths, 9:00am" or just "Maths". */
export function activityText(activity: DayActivity): string {
  return activity.time ? `${activity.name}, ${formatTime(activity.time)}` : activity.name;
}

/** Today's now and next, kept up to date as the plan or the timetable changes and as the day rolls over. */
export function useSchoolNow(): SchoolNow | null {
  const state = useSignal<SchoolNow | null>(null);
  const day = useSignal(getDateString(new Date()));
  // Reading these subscribes to an adult's edits in Parent Mode or School Mode, and to the child marking something finished.
  const version = dayPlanVersion.value;
  const routine = weeklyRoutineSetting.signal.value;

  useEffect(() => {
    void readSchoolNow().then((now) => (state.value = now));
  }, [version, routine, day.value]);

  useEffect(() => {
    const timer = setInterval(() => {
      const today = getDateString(new Date());
      if (today !== day.value) day.value = today;
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  return state.value;
}
