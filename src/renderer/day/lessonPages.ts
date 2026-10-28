import type { DayActivity, MyPage, WeeklyRoutine } from '../store/types';

// A timetable activity can point at one of the child's pages, so that when it is the child's turn at "Maths", the words
// for maths are one press away from My Day. Nothing moves: it only adds a button to the question box on My Day.

const clean = (text: string): string => text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * The page that most likely belongs to an activity, by name: "Maths" goes with "Maths lesson", "Lunch" with
 * "Lunchtime". Nothing is guessed from a very short name, and an activity that matches several pages gets none,
 * because a wrong page is worse than no page.
 */
export function suggestPage(activityName: string, pages: MyPage[]): MyPage | undefined {
  const name = clean(activityName);
  if (name.length < 3) return undefined;
  const matches = pages.filter((page) => {
    const pageName = clean(page.name);
    return pageName === name || pageName.includes(name) || name.includes(pageName);
  });
  return matches.length === 1 ? matches[0] : undefined;
}

/** The weekly routine with a page set on every activity that has none and has a clear match. */
export function linkLessonPages(routine: WeeklyRoutine, pages: MyPage[]): { routine: WeeklyRoutine; linked: number } {
  let linked = 0;
  const next = { ...routine };
  for (const day of Object.keys(routine) as Array<keyof WeeklyRoutine>) {
    next[day] = routine[day].map((activity: DayActivity) => {
      if (activity.pageId) return activity;
      const page = suggestPage(activity.name, pages);
      if (!page) return activity;
      linked += 1;
      return { ...activity, pageId: page.id };
    });
  }
  return { routine: next, linked };
}
