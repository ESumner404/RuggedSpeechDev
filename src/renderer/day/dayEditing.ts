import type { DayActivity } from '../store/types';

export function addActivity(activities: DayActivity[], activity: DayActivity): DayActivity[] {
  return [...activities, activity];
}

export function removeActivity(activities: DayActivity[], id: string): DayActivity[] {
  return activities.filter((activity) => activity.id !== id);
}

export function moveActivity(
  activities: DayActivity[],
  id: string,
  direction: 'up' | 'down',
): DayActivity[] {
  const index = activities.findIndex((activity) => activity.id === id);
  if (index === -1) return activities;
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= activities.length) return activities;

  const next = [...activities];
  const a = next[index]!;
  const b = next[swapWith]!;
  next[index] = b;
  next[swapWith] = a;
  return next;
}

/**
 * Editing the name of an already-built activity records what it used to
 * be called, so the child's My Day screen can show the old one struck
 * through next to the new one and speak the change once (PLAN.md Phase 5:
 * "change of plan").
 */
export function updateActivity(
  activities: DayActivity[],
  id: string,
  updates: Partial<Omit<DayActivity, 'id' | 'changedFrom'>>,
): DayActivity[] {
  return activities.map((activity) => {
    if (activity.id !== id) return activity;
    const next: DayActivity = { ...activity, ...updates };
    if (updates.name === undefined || updates.name === activity.name) return next;

    // Typing a new name arrives one keystroke at a time. The name to show
    // struck through is the one the child last saw — the oldest unannounced
    // one — not whatever half-typed word came just before this keystroke.
    // Typing back to that original name means nothing has changed after all.
    const original = activity.changedFrom ?? activity.name;
    if (updates.name === original) {
      delete next.changedFrom;
      return next;
    }
    return { ...next, changedFrom: original };
  });
}

/** Clears changedFrom once the child's screen has shown and spoken it. */
export function acknowledgeChange(activities: DayActivity[], id: string): DayActivity[] {
  return activities.map((activity) => {
    if (activity.id !== id) return activity;
    const copy = { ...activity };
    delete copy.changedFrom;
    return copy;
  });
}
