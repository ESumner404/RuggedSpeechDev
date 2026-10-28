// A visual timer: a row of blocks that go one at a time, so a child can SEE how much time is left without reading a clock.
// Nothing moves in between (a block is there or it is not), nothing speaks, and nothing is counted down in numbers. It is
// started by a press, and it can be stopped at any time.

export const TIMER_BLOCKS = 10;
export const TIMER_PRESETS_MINUTES = [1, 2, 5, 10, 15] as const;

/** How many blocks are still showing, from all of them to none. */
export function blocksLeft(elapsedMs: number, totalMs: number, blocks: number = TIMER_BLOCKS): number {
  if (totalMs <= 0) return 0;
  const fraction = Math.min(1, Math.max(0, elapsedMs / totalMs));
  return Math.max(0, Math.min(blocks, Math.ceil(blocks * (1 - fraction))));
}

export const isFinished = (elapsedMs: number, totalMs: number): boolean => totalMs > 0 && elapsedMs >= totalMs;
