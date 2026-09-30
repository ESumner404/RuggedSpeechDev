// External keyboard navigation: arrows plus enter through the grid
// (PLAN.md Phase 7). Pure — moves a row/column cursor spatially, skipping
// empty or hidden cells in a straight line, clamping at the edge rather
// than wrapping (predictable for a first-time keyboard user).

export type Direction = 'up' | 'down' | 'left' | 'right';

const DELTAS: Record<Direction, readonly [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export function moveFocus(
  from: { row: number; column: number },
  direction: Direction,
  shape: { rows: number; columns: number; isSelectable: (row: number, column: number) => boolean },
): { row: number; column: number } {
  const [dRow, dCol] = DELTAS[direction];
  let row = from.row;
  let column = from.column;

  for (;;) {
    row += dRow;
    column += dCol;
    if (row < 0 || row >= shape.rows || column < 0 || column >= shape.columns) {
      return from;
    }
    if (shape.isSelectable(row, column)) return { row, column };
  }
}
