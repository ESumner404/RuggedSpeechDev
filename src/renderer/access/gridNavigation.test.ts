import { describe, expect, it } from 'vitest';
import { moveFocus } from './gridNavigation';

// A 3×3 grid missing its centre cell (e.g. hidden).
function shape() {
  return {
    rows: 3,
    columns: 3,
    isSelectable: (row: number, column: number) => !(row === 1 && column === 1),
  };
}

describe('gridNavigation (PLAN.md Phase 7)', () => {
  it('moves one step in the given direction when the neighbour is selectable', () => {
    expect(moveFocus({ row: 0, column: 0 }, 'right', shape())).toEqual({ row: 0, column: 1 });
    expect(moveFocus({ row: 0, column: 0 }, 'down', shape())).toEqual({ row: 1, column: 0 });
  });

  it('skips an unselectable cell in a straight line and lands on the next real one', () => {
    expect(moveFocus({ row: 1, column: 0 }, 'right', shape())).toEqual({ row: 1, column: 2 });
  });

  it('clamps at the edge rather than wrapping', () => {
    expect(moveFocus({ row: 0, column: 0 }, 'up', shape())).toEqual({ row: 0, column: 0 });
    expect(moveFocus({ row: 0, column: 0 }, 'left', shape())).toEqual({ row: 0, column: 0 });
    expect(moveFocus({ row: 2, column: 2 }, 'down', shape())).toEqual({ row: 2, column: 2 });
    expect(moveFocus({ row: 2, column: 2 }, 'right', shape())).toEqual({ row: 2, column: 2 });
  });

  it('stays put if every cell in that direction is unselectable', () => {
    const allButOrigin = {
      rows: 2,
      columns: 2,
      isSelectable: (row: number, column: number) => row === 0 && column === 0,
    };
    expect(moveFocus({ row: 0, column: 0 }, 'right', allButOrigin)).toEqual({ row: 0, column: 0 });
    expect(moveFocus({ row: 0, column: 0 }, 'down', allButOrigin)).toEqual({ row: 0, column: 0 });
  });
});
