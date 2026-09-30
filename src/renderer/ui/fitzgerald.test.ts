import { describe, expect, it } from 'vitest';
import { FITZGERALD_COLORS, LOW_AROUSAL_COLORS, resolveBackgroundColor } from './fitzgerald';

describe('resolveBackgroundColor (PLAN.md Phase 7)', () => {
  it('returns the stored colour unchanged when low-arousal is off', () => {
    expect(resolveBackgroundColor(FITZGERALD_COLORS.people, false)).toBe(FITZGERALD_COLORS.people);
  });

  it('swaps a known Fitzgerald colour for its low-arousal equivalent', () => {
    expect(resolveBackgroundColor(FITZGERALD_COLORS.people, true)).toBe(LOW_AROUSAL_COLORS.people);
    expect(resolveBackgroundColor(FITZGERALD_COLORS.noStop, true)).toBe(LOW_AROUSAL_COLORS.noStop);
  });

  it('leaves an unrecognised colour and undefined alone even with low-arousal on', () => {
    expect(resolveBackgroundColor('#123456', true)).toBe('#123456');
    expect(resolveBackgroundColor(undefined, true)).toBeUndefined();
  });

  it('every Fitzgerald class has a low-arousal equivalent', () => {
    expect(Object.keys(LOW_AROUSAL_COLORS).sort()).toEqual(Object.keys(FITZGERALD_COLORS).sort());
  });
});
