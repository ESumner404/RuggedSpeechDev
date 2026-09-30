// Switch access: row/column scanning (PLAN.md Phase 7). Pure state machine
// over a grid shape — no DOM, no timers — so the whole sweep sequence is
// unit-testable. A UI layer drives it with two inputs: "advance" and
// "select", mapped to Space and Enter so any keyboard-emulating switch
// interface works.

// How many mounted Grids currently own Space/Enter for their own row/
// column scan. The app-level Space-as-focus-advance fallback (for
// everything outside a grid — Home, nav buttons, Parent Mode) checks this
// so the two mechanisms never both act on the same keypress. A plain
// mutable counter, not a signal — nothing ever renders from this, it's
// only read inside an imperative keydown handler, and writing a signal
// from inside an unmounting effect's own cleanup is enough to trip a real
// Preact/signals interaction bug (confirmed by removing it).
export const gridScanningActive = { count: 0 };

export type GridShape = {
  rows: number;
  columns: number;
  isSelectable: (row: number, column: number) => boolean;
};

export type ScanPhase = { kind: 'row'; row: number } | { kind: 'cell'; row: number; column: number | 'back' };

function selectableColumnsInRow(shape: GridShape, row: number): number[] {
  const columns: number[] = [];
  for (let c = 0; c < shape.columns; c += 1) {
    if (shape.isSelectable(row, c)) columns.push(c);
  }
  return columns;
}

function rowsWithSelectable(shape: GridShape): number[] {
  const rows: number[] = [];
  for (let r = 0; r < shape.rows; r += 1) {
    if (selectableColumnsInRow(shape, r).length > 0) rows.push(r);
  }
  return rows;
}

export function initialScanPhase(shape: GridShape): ScanPhase {
  const rows = rowsWithSelectable(shape);
  return { kind: 'row', row: rows[0] ?? 0 };
}

/** "Advance" input — Space. Moves the highlight to the next row, or the
 * next cell (including a trailing "back to rows" stop) within a locked row. */
export function advanceScan(phase: ScanPhase, shape: GridShape): ScanPhase {
  if (phase.kind === 'row') {
    const rows = rowsWithSelectable(shape);
    if (rows.length === 0) return phase;
    const index = rows.indexOf(phase.row);
    const next = (index + 1 + rows.length) % rows.length;
    return { kind: 'row', row: rows[next]! };
  }

  const columns = selectableColumnsInRow(shape, phase.row);
  const sequence: (number | 'back')[] = [...columns, 'back'];
  const index = phase.column === 'back' ? columns.length : columns.indexOf(phase.column);
  const next = (index + 1) % sequence.length;
  return { kind: 'cell', row: phase.row, column: sequence[next]! };
}

export type ScanSelectResult =
  | { kind: 'enteredRow'; phase: ScanPhase }
  | { kind: 'backToRows'; phase: ScanPhase }
  | { kind: 'activate'; row: number; column: number };

/** "Select" input — Enter (or the single switch, in one-switch timed mode). */
export function selectScan(phase: ScanPhase, shape: GridShape): ScanSelectResult {
  if (phase.kind === 'row') {
    const columns = selectableColumnsInRow(shape, phase.row);
    return { kind: 'enteredRow', phase: { kind: 'cell', row: phase.row, column: columns[0] ?? 'back' } };
  }

  if (phase.column === 'back') {
    return { kind: 'backToRows', phase: initialScanPhase(shape) };
  }

  return { kind: 'activate', row: phase.row, column: phase.column };
}
