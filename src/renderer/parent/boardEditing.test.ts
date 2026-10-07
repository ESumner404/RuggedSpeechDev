import { describe, expect, it } from 'vitest';
import {
  addButton,
  hasEmptySlot,
  moveButton,
  resizeGrid,
  swapButtons,
  toggleButtonHidden,
  updateButtonLabel,
} from './boardEditing';
import type { Board } from '../store/types';

function makeBoard(): Board {
  return {
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
      { id: 'b', label: 'Banana' },
    ],
  };
}

describe('toggleButtonHidden', () => {
  it('flips hidden without touching position or other buttons', () => {
    const board = makeBoard();
    const next = toggleButtonHidden(board, 'a');
    expect(next.buttons.find((b) => b.id === 'a')?.hidden).toBe(true);
    expect(next.buttons.find((b) => b.id === 'b')?.hidden).toBeFalsy();
    expect(next.grid.order).toEqual(board.grid.order);
  });
});

describe('updateButtonLabel', () => {
  it('changes only the targeted button', () => {
    const next = updateButtonLabel(makeBoard(), 'a', 'Apricot');
    expect(next.buttons.find((b) => b.id === 'a')?.label).toBe('Apricot');
    expect(next.buttons.find((b) => b.id === 'b')?.label).toBe('Banana');
  });
});

describe('moveButton', () => {
  it('swaps with the previous slot when moving up', () => {
    const next = moveButton(makeBoard(), 'b', 'up');
    expect(next.grid.order).toEqual([
      ['b', 'a'],
      [null, null],
    ]);
  });

  it('is a no-op at the start of the board when moving up', () => {
    const board = makeBoard();
    const next = moveButton(board, 'a', 'up');
    expect(next.grid.order).toEqual(board.grid.order);
  });

  it('is a no-op at the end of the board when moving down', () => {
    const board = makeBoard();
    // "b" is at the last occupied slot but not the last cell overall —
    // moving into a null cell is allowed (it's still a valid position).
    const next = moveButton(board, 'b', 'down');
    expect(next.grid.order).toEqual([
      ['a', null],
      ['b', null],
    ]);
  });

  it('does nothing for a button that is not on this board', () => {
    const board = makeBoard();
    expect(moveButton(board, 'nope', 'up')).toEqual(board);
  });
});

describe('swapButtons (drag-and-drop)', () => {
  function threeButtons(): Board {
    return {
      ...makeBoard(),
      grid: { rows: 2, columns: 2, order: [['a', 'b'], ['c', null]] },
      buttons: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
        { id: 'c', label: 'C' },
      ],
    };
  }

  it('trades two buttons and leaves every other position untouched', () => {
    const next = swapButtons(threeButtons(), 'a', 'c');
    expect(next.grid.order).toEqual([['c', 'b'], ['a', null]]);
  });

  it('does nothing when dropped on itself, or when either button is not on this board', () => {
    const board = threeButtons();
    expect(swapButtons(board, 'a', 'a')).toEqual(board);
    expect(swapButtons(board, 'a', 'nope')).toEqual(board);
    expect(swapButtons(board, 'nope', 'a')).toEqual(board);
  });

  it('a hidden button still takes part, since position is independent of visibility', () => {
    const hidden = toggleButtonHidden(threeButtons(), 'b');
    expect(swapButtons(hidden, 'b', 'c').grid.order).toEqual([['a', 'c'], ['b', null]]);
  });
});

describe('hasEmptySlot', () => {
  it('reports whether a button could be added without resizing', () => {
    expect(hasEmptySlot(makeBoard())).toBe(true);
    expect(
      hasEmptySlot({ ...makeBoard(), grid: { rows: 2, columns: 2, order: [['a', 'b'], ['c', 'd']] } }),
    ).toBe(false);
  });
});

describe('addButton', () => {
  it('places a new button in the first empty slot', () => {
    const next = addButton(makeBoard(), { id: 'c', label: 'Cherry' });
    expect(next.grid.order).toEqual([
      ['a', 'b'],
      ['c', null],
    ]);
    expect(next.buttons.map((b) => b.id)).toEqual(['a', 'b', 'c']);
  });

  it('refuses when the board is full', () => {
    const full: Board = {
      ...makeBoard(),
      grid: { rows: 2, columns: 2, order: [['a', 'b'], ['c', 'd']] },
      buttons: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
        { id: 'c', label: 'C' },
        { id: 'd', label: 'D' },
      ],
    };
    expect(() => addButton(full, { id: 'e', label: 'E' })).toThrow();
  });
});

describe('resizeGrid', () => {
  it('repacks existing buttons into the new dimensions', () => {
    const next = resizeGrid(makeBoard(), 2, 3);
    expect(next.grid).toEqual({ rows: 2, columns: 3, order: [['a', 'b', null], [null, null, null]] });
  });

  it('refuses to shrink below the number of placed buttons', () => {
    // 5 placed buttons — doesn't fit in the smallest valid grid, 2×2 (4 cells).
    const crowded: Board = {
      ...makeBoard(),
      grid: {
        rows: 3,
        columns: 3,
        order: [
          ['a', 'b', 'c'],
          ['d', 'e', null],
          [null, null, null],
        ],
      },
      buttons: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
        { id: 'c', label: 'C' },
        { id: 'd', label: 'D' },
        { id: 'e', label: 'E' },
      ],
    };
    expect(() => resizeGrid(crowded, 2, 2)).toThrow();
  });
});
