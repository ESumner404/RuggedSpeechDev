// Calm down / sensory break (feature review, Aug 2026): "breathing
// exercises or a countdown timer". No CSS animation drives the pacing
// (CLAUDE.md §8: "Do not add animation") — the phase label is plain text
// that swaps, and the pacing itself is spoken, the same way My Day's
// countdown warnings speak on a timer once a person has deliberately
// started something (PLAN.md Phase 5).

export type BreathPhase = 'in' | 'hold' | 'out';

export type BreathStep = {
  phase: BreathPhase;
  label: string;
  spoken: string;
  durationMs: number;
};

// A slightly longer exhale than inhale is a well-known calming pattern.
export const BREATH_CYCLE: BreathStep[] = [
  { phase: 'in', label: 'Breathe in', spoken: 'Breathe in', durationMs: 4000 },
  { phase: 'hold', label: 'Hold', spoken: 'Hold', durationMs: 4000 },
  { phase: 'out', label: 'Breathe out', spoken: 'Breathe out', durationMs: 6000 },
];

export function nextBreathStepIndex(current: number): number {
  return (current + 1) % BREATH_CYCLE.length;
}

export const QUIET_TIME_DURATIONS_MIN = [1, 2, 5] as const;
export type QuietTimeDurationMin = (typeof QUIET_TIME_DURATIONS_MIN)[number];

/** mm:ss, always two digits of seconds — 65 -> "1:05", not "1:5". */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
