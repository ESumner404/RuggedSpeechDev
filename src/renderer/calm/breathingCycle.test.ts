import { describe, expect, it } from 'vitest';
import { BREATH_CYCLE, formatCountdown, nextBreathStepIndex } from './breathingCycle';

describe('breathing cycle (feature review, Aug 2026)', () => {
  it('cycles in, hold, out and wraps back to the start', () => {
    expect(BREATH_CYCLE.map((step) => step.phase)).toEqual(['in', 'hold', 'out']);
    expect(nextBreathStepIndex(0)).toBe(1);
    expect(nextBreathStepIndex(1)).toBe(2);
    expect(nextBreathStepIndex(2)).toBe(0);
  });
});

describe('formatCountdown', () => {
  it('pads single-digit seconds to two digits', () => {
    expect(formatCountdown(65)).toBe('1:05');
  });

  it('handles a whole number of minutes', () => {
    expect(formatCountdown(120)).toBe('2:00');
  });

  it('handles under a minute', () => {
    expect(formatCountdown(9)).toBe('0:09');
  });

  it('handles zero', () => {
    expect(formatCountdown(0)).toBe('0:00');
  });
});
