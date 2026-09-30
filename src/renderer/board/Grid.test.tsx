import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Grid } from './Grid';
import { resetDBConnectionForTests, setAccessSettings } from '../store/db';
import type { AccessSettings, Board } from '../store/types';

const board: Board = {
  id: 'test',
  name: 'Test',
  grid: {
    rows: 2,
    columns: 2,
    order: [
      ['a', 'b'],
      [null, null],
    ],
  },
  buttons: [
    { id: 'a', label: 'Apple' },
    { id: 'b', label: 'Banana', hidden: true },
  ],
};

const scanBoard: Board = {
  id: 'scan-test',
  name: 'Scan Test',
  grid: {
    rows: 2,
    columns: 2,
    order: [
      ['a', 'b'],
      ['c', null],
    ],
  },
  buttons: [
    { id: 'a', label: 'Apple' },
    { id: 'b', label: 'Banana' },
    { id: 'c', label: 'Carrot' },
  ],
};

const DEFAULT: AccessSettings = {
  dwellMs: 0,
  repeatSuppressMs: 0,
  scanningMode: 'off',
  scanIntervalMs: 1500,
  highContrast: 'off',
  textScale: 1,
  reduceMotion: false,
  lowArousalPalette: false,
};

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

// A signal-driven re-render commits on a microtask, not synchronously
// within act() — a real timer tick reliably lands after that.
async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
}

describe('Grid', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    // Real focus (document.activeElement) only tracks elements connected
    // to the document — the external-keyboard-navigation tests need this.
    document.body.appendChild(container);
  });

  afterEach(() => {
    render(null, container);
    container.remove();
  });

  it('renders a visible button normally', () => {
    render(<Grid board={board} onPress={() => {}} />, container);
    expect(container.textContent).toContain('Apple');
  });

  it("leaves a hidden button's slot empty rather than closing the gap", () => {
    render(<Grid board={board} onPress={() => {}} />, container);

    expect(container.textContent).not.toContain('Banana');
    // Still four cells — the hidden button's slot is an empty cell, not
    // removed, so every other button keeps its position (invariant I3).
    const cells = container.querySelectorAll('.board-button, .board-grid__empty');
    expect(cells).toHaveLength(4);
  });

  describe('hold-to-select (PLAN.md Phase 7)', () => {
    it('activates immediately on click when dwell is off (default)', () => {
      const presses: string[] = [];
      render(<Grid board={board} onPress={(item) => presses.push(item.id)} />, container);

      act(() => container.querySelector<HTMLButtonElement>('#board-button-a')!.click());
      expect(presses).toEqual(['a']);
    });

    // jsdom doesn't implement PointerEvent, so onPointerEnter/onPointerLeave
    // silently don't fire here the way they do in a real browser — these
    // exercise the equivalent onFocus/onBlur dwell trigger instead; the
    // pointer path is covered in tests/e2e/access.spec.ts.
    it('ignores click and activates only after the dwell time when dwell is on', async () => {
      await setAccessSettings({ ...DEFAULT, dwellMs: 40 });
      const presses: string[] = [];
      render(<Grid board={board} onPress={(item) => presses.push(item.id)} />, container);
      await tick();

      const button = container.querySelector<HTMLButtonElement>('#board-button-a')!;
      act(() => button.click());
      expect(presses).toEqual([]); // click alone does nothing once dwell is on

      // Grid's own arrow-nav-on-mount effect already focused this cell, so
      // a bare focus() here would be a no-op (already the active element,
      // no new 'focus' event) — blur first to force a genuine transition.
      act(() => button.blur());
      act(() => button.focus());
      await waitFor(() => presses.length > 0, 500);
      expect(presses).toEqual(['a']);
    });

    it('cancels the dwell timer if focus leaves before it completes', async () => {
      await setAccessSettings({ ...DEFAULT, dwellMs: 200 });
      const presses: string[] = [];
      render(<Grid board={board} onPress={(item) => presses.push(item.id)} />, container);
      await tick();

      const button = container.querySelector<HTMLButtonElement>('#board-button-a')!;
      act(() => button.blur());
      act(() => button.focus());
      act(() => button.blur());
      await new Promise((resolve) => setTimeout(resolve, 260));
      expect(presses).toEqual([]);
    });
  });

  describe('repeat-press suppression (PLAN.md Phase 7)', () => {
    it('ignores a second press of the same button within the suppression window', async () => {
      await setAccessSettings({ ...DEFAULT, repeatSuppressMs: 300 });
      const presses: string[] = [];
      render(<Grid board={board} onPress={(item) => presses.push(item.id)} />, container);
      await tick();

      const button = container.querySelector<HTMLButtonElement>('#board-button-a')!;
      act(() => button.click());
      act(() => button.click());
      expect(presses).toEqual(['a']);
    });
  });

  describe('external keyboard navigation (PLAN.md Phase 7)', () => {
    it('starts focus on the first selectable cell', async () => {
      render(<Grid board={board} onPress={() => {}} />, container);
      await waitFor(() => document.activeElement?.id === 'board-button-a');
    });

    it('ArrowRight moves focus to the next selectable cell, skipping gaps', async () => {
      render(<Grid board={scanBoard} onPress={() => {}} />, container);
      await waitFor(() => document.activeElement?.id === 'board-button-a');

      act(() => {
        document
          .getElementById('board-button-a')!
          .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      });
      await waitFor(() => document.activeElement?.id === 'board-button-b');
    });

    it('ArrowDown then ArrowRight skips the empty cell and clamps at the edge', async () => {
      render(<Grid board={scanBoard} onPress={() => {}} />, container);
      await waitFor(() => document.activeElement?.id === 'board-button-a');

      act(() => {
        document
          .getElementById('board-button-a')!
          .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      });
      await waitFor(() => document.activeElement?.id === 'board-button-c');

      act(() => {
        document
          .getElementById('board-button-c')!
          .dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      });
      // The only cell to the right of c is empty, and below b is empty —
      // nothing selectable that direction, so focus stays on c.
      await tick();
      expect(document.activeElement?.id).toBe('board-button-c');
    });
  });

  describe('switch scanning (PLAN.md Phase 7)', () => {
    it('two-switch stepped: Space advances the highlight, Enter selects, and every button is out of tab order', async () => {
      await setAccessSettings({ ...DEFAULT, scanningMode: 'twoSwitchStepped', scanIntervalMs: 100_000 });
      const presses: string[] = [];
      render(<Grid board={scanBoard} onPress={(item) => presses.push(item.id)} />, container);
      await waitFor(() => container.querySelector('.board-grid__scan-status') !== null);
      await tick();

      for (const button of Array.from(container.querySelectorAll('button'))) {
        expect(button.tabIndex).toBe(-1);
      }

      // Row 0 is highlighted first; Space moves to row 1.
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      });
      await tick();
      // Enter locks row 1 and enters cell-scan at its first cell (c).
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
      });
      await tick();
      // Selecting the currently-highlighted cell (c) activates it.
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
      });
      await tick();

      expect(presses).toEqual(['c']);
    });

    it('one-switch timed: Space alone locks a row, then selects the highlighted cell', async () => {
      // A long interval keeps the auto-advance timer from interfering with
      // this specific sequence — the timer itself is covered separately.
      await setAccessSettings({ ...DEFAULT, scanningMode: 'oneSwitchTimed', scanIntervalMs: 100_000 });
      const presses: string[] = [];
      render(<Grid board={scanBoard} onPress={(item) => presses.push(item.id)} />, container);
      await waitFor(() => container.querySelector('.board-grid__scan-status') !== null);
      await tick();

      // First Space locks row 0 and enters cell-scan at its first cell (a).
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      });
      await tick();
      // Second Space selects the highlighted cell (a).
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      });
      await tick();

      expect(presses).toEqual(['a']);
    });

    it('an auxiliary control (e.g. Speak) is reachable in the same scan sweep, past the board rows', async () => {
      await setAccessSettings({ ...DEFAULT, scanningMode: 'twoSwitchStepped', scanIntervalMs: 100_000 });
      let spoken = false;
      render(
        <Grid
          board={scanBoard}
          onPress={() => {}}
          auxiliaryControls={[{ label: 'Speak', onActivate: () => (spoken = true) }]}
        />,
        container,
      );
      await waitFor(() => container.querySelector('.board-grid__scan-status') !== null);
      await tick();

      // Starts on row 0; two Space presses reach row 1, then the auxiliary row.
      for (let i = 0; i < 2; i += 1) {
        act(() => {
          document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
        });
        await tick();
      }
      expect(container.querySelector('.board-grid__scan-status')?.textContent).toBe('Scanning: more controls');

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
      });
      await tick();
      expect(container.querySelector('.board-grid__scan-status')?.textContent).toBe('Scanning: Speak');

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
      });
      await tick();

      expect(spoken).toBe(true);
    });

    it('one-switch timed: the highlight auto-advances on its own without any input', async () => {
      await setAccessSettings({ ...DEFAULT, scanningMode: 'oneSwitchTimed', scanIntervalMs: 20 });
      render(<Grid board={scanBoard} onPress={() => {}} />, container);
      await waitFor(() => container.querySelector('.board-grid__scan-status') !== null);
      await tick();

      const initialStatus = container.querySelector('.board-grid__scan-status')!.textContent;
      await waitFor(
        () => container.querySelector('.board-grid__scan-status')!.textContent !== initialStatus,
        1000,
      );
    });
  });
});
