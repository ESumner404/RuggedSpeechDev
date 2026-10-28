import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TimerScreen } from './TimerScreen';
import { TIMER_BLOCKS, blocksLeft, isFinished } from './timer';

describe('the blocks left', () => {
  it('starts full, empties one block at a time, and ends empty', () => {
    const total = 10 * 60_000;
    expect(blocksLeft(0, total)).toBe(TIMER_BLOCKS);
    expect(blocksLeft(total / 10 + 1, total)).toBe(9);
    expect(blocksLeft(total / 2, total)).toBe(5);
    expect(blocksLeft(total - 1, total)).toBe(1);
    expect(blocksLeft(total, total)).toBe(0);
    expect(blocksLeft(total * 3, total)).toBe(0);
  });

  it('copes with nothing set, and with a clock that runs backwards', () => {
    expect(blocksLeft(5, 0)).toBe(0);
    expect(blocksLeft(-100, 1000)).toBe(TIMER_BLOCKS);
  });

  it('knows when time is up', () => {
    expect(isFinished(999, 1000)).toBe(false);
    expect(isFinished(1000, 1000)).toBe(true);
    expect(isFinished(5, 0)).toBe(false);
  });
});

describe('the timer screen', () => {
  let container: HTMLElement;
  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
  });
  afterEach(() => {
    render(null, container);
    vi.useRealTimers();
  });

  it('waits to be pressed, then loses a block at a time, silently, and says when time is up', async () => {
    render(<TimerScreen />, container);
    expect(container.querySelectorAll('.timer-screen__block')).toHaveLength(0);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '1 minute')!.click());
    expect(container.querySelectorAll('.timer-screen__block--on')).toHaveLength(TIMER_BLOCKS);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(31_000);
    });
    expect(container.querySelectorAll('.timer-screen__block--on')).toHaveLength(5);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(31_000);
    });
    expect(container.querySelectorAll('.timer-screen__block--on')).toHaveLength(0);
    expect(container.textContent).toContain('Time is up');
  });

  it('can be stopped, and goes back to asking how long', async () => {
    render(<TimerScreen />, container);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '5 minutes')!.click());
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Stop')!.click());
    expect(container.textContent).toContain('How long?');
  });
});
