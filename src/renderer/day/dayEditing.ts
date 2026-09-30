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
    const nameChanged = updates.name !== undefined && updates.name !== activity.name;
    return {
      ...activity,
      ...updates,
      ...(nameChanged ? { changedFrom: activity.name } : {}),
    };
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
