import { describe, expect, it } from 'vitest';
import { TREE_SLOTS, TREE_TOOLS, isTreeDesign, place } from './tree';

const slot = (id: string) => TREE_SLOTS.find((s) => s.id === id)!;

describe('the tree', () => {
  it('has places that never overlap and stay inside the picture', () => {
    expect(new Set(TREE_SLOTS.map((s) => s.id)).size).toBe(TREE_SLOTS.length);
    for (const s of TREE_SLOTS) {
      expect(s.x).toBeGreaterThan(5);
      expect(s.x).toBeLessThan(95);
      expect(s.y).toBeGreaterThan(3);
      expect(s.y).toBeLessThan(97);
    }
    expect(TREE_SLOTS.filter((s) => s.kind === 'top')).toHaveLength(1);
    expect(TREE_SLOTS.filter((s) => s.kind === 'floor').length).toBeGreaterThanOrEqual(3);
  });

  it('offers a decoration for every kind of place, and a way to take one off', () => {
    const kinds = new Set(TREE_TOOLS.map((t) => t.kind));
    expect(kinds).toEqual(new Set(['top', 'tree', 'floor', 'any']));
  });

  it('hangs, replaces and takes off, and says where a thing cannot go', () => {
    let result = place({}, slot('t1'), 'red');
    expect(result.design).toEqual({ t1: 'red' });
    result = place(result.design, slot('t1'), 'blue');
    expect(result.design).toEqual({ t1: 'blue' });
    result = place(result.design, slot('t1'), 'star');
    expect(result.design).toEqual({ t1: 'blue' });
    expect(result.message).toBe('The star goes on the very top.');
    result = place(result.design, slot('f1'), 'bell');
    expect(result.message).toBe('That goes on the tree.');
    result = place(result.design, slot('t1'), 'off');
    expect(result.design).toEqual({});
  });

  it('checks a saved tree before using it', () => {
    expect(isTreeDesign({ t1: 'red', top: 'star' })).toBe(true);
    expect(isTreeDesign({})).toBe(true);
    expect(isTreeDesign({ nowhere: 'red' })).toBe(false);
    expect(isTreeDesign({ t1: 'rocket' })).toBe(false);
    expect(isTreeDesign({ t1: 'off' })).toBe(false);
    expect(isTreeDesign(['t1'])).toBe(false);
  });
});
