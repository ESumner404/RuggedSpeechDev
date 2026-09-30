import { describe, expect, it } from 'vitest';
import { advanceScan, initialScanPhase, selectScan, type GridShape, type ScanPhase } from './scanning';

// A 3×3 grid with the middle cell of the middle row missing (empty slot)
// and the last row entirely empty (e.g. every button in it hidden).
function shape(): GridShape {
  const selectable = new Set(['0,0', '0,1', '0,2', '1,0', '1,2']);
  return {
    rows: 3,
    columns: 3,
    isSelectable: (row, column) => selectable.has(`${row},${column}`),
  };
}

describe('scanning (PLAN.md Phase 7)', () => {
  it('starts on the first row that has anything selectable', () => {
    expect(initialScanPhase(shape())).toEqual({ kind: 'row', row: 0 });
  });

  it('advance cycles through rows that have at least one selectable cell, skipping empty rows', () => {
    let phase = initialScanPhase(shape());
    phase = advanceScan(phase, shape());
    expect(phase).toEqual({ kind: 'row', row: 1 });
    // Row 2 is entirely empty — skipped straight back to row 0.
    phase = advanceScan(phase, shape());
    expect(phase).toEqual({ kind: 'row', row: 0 });
  });

  it('select locks a row and enters cell-scan at its first selectable column', () => {
    const result = selectScan({ kind: 'row', row: 1 }, shape());
    expect(result).toEqual({ kind: 'enteredRow', phase: { kind: 'cell', row: 1, column: 0 } });
  });

  it('advance within a row visits every selectable column, skipping gaps, then a trailing "back" stop', () => {
    let phase: ScanPhase = { kind: 'cell', row: 1, column: 0 };
    phase = advanceScan(phase, shape());
    expect(phase).toEqual({ kind: 'cell', row: 1, column: 2 }); // column 1 is empty, skipped
    phase = advanceScan(phase, shape());
    expect(phase).toEqual({ kind: 'cell', row: 1, column: 'back' });
    phase = advanceScan(phase, shape());
    expect(phase).toEqual({ kind: 'cell', row: 1, column: 0 }); // wraps back to the first column
  });

  it('selecting a real cell activates it', () => {
    const result = selectScan({ kind: 'cell', row: 1, column: 2 }, shape());
    expect(result).toEqual({ kind: 'activate', row: 1, column: 2 });
  });

  it('selecting "back" returns to row-scan without activating anything', () => {
    const result = selectScan({ kind: 'cell', row: 1, column: 'back' }, shape());
    expect(result).toEqual({ kind: 'backToRows', phase: { kind: 'row', row: 0 } });
  });

  it('a completely empty grid does not throw and stays put', () => {
    const empty: GridShape = { rows: 2, columns: 2, isSelectable: () => false };
    const start = initialScanPhase(empty);
    expect(advanceScan(start, empty)).toEqual(start);
  });
});
