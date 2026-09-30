import { describe, expect, it } from 'vitest';
import {
  acknowledgeChange,
  addActivity,
  moveActivity,
  removeActivity,
  updateActivity,
} from './dayEditing';
import type { DayActivity } from '../store/types';

function activity(id: string, overrides: Partial<DayActivity> = {}): DayActivity {
  return { id, name: id, ...overrides };
}

describe('addActivity', () => {
  it('appends to the end', () => {
    const result = addActivity([activity('a')], activity('b'));
    expect(result.map((x) => x.id)).toEqual(['a', 'b']);
  });
});

describe('removeActivity', () => {
  it('removes only the targeted activity', () => {
    const result = removeActivity([activity('a'), activity('b')], 'a');
    expect(result.map((x) => x.id)).toEqual(['b']);
  });
});

describe('moveActivity', () => {
  it('swaps with the previous activity when moving up', () => {
    const result = moveActivity([activity('a'), activity('b')], 'b', 'up');
    expect(result.map((x) => x.id)).toEqual(['b', 'a']);
  });

  it('is a no-op at either end', () => {
    const activities = [activity('a'), activity('b')];
    expect(moveActivity(activities, 'a', 'up')).toEqual(activities);
    expect(moveActivity(activities, 'b', 'down')).toEqual(activities);
  });
});

describe('updateActivity', () => {
  it('records changedFrom when the name changes', () => {
    const result = updateActivity([activity('a', { name: 'Lunch' })], 'a', { name: "Grandma's" });
    expect(result[0]).toMatchObject({ name: "Grandma's", changedFrom: 'Lunch' });
  });

  it('does not record changedFrom for non-name edits', () => {
    const result = updateActivity([activity('a', { name: 'Lunch' })], 'a', { location: 'Kitchen' });
    expect(result[0]?.changedFrom).toBeUndefined();
  });

  it('does not record changedFrom when the "new" name is the same as the old one', () => {
    const result = updateActivity([activity('a', { name: 'Lunch' })], 'a', { name: 'Lunch' });
    expect(result[0]?.changedFrom).toBeUndefined();
  });
});

describe('acknowledgeChange', () => {
  it('clears changedFrom for the targeted activity only', () => {
    const activities = [
      activity('a', { changedFrom: 'Old name' }),
      activity('b', { changedFrom: 'Other old name' }),
    ];
    const result = acknowledgeChange(activities, 'a');
    expect(result.find((x) => x.id === 'a')?.changedFrom).toBeUndefined();
    expect(result.find((x) => x.id === 'b')?.changedFrom).toBe('Other old name');
  });
});
