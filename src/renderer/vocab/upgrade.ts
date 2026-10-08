import type { Board, GridSize, Item } from '../store/types';
import { VALID_GRID_SIZES } from '../store/types';
import { STARTER_BOARDS } from './starter';

/** Whether this device is missing any of the starter pages, so the adult
 * can be offered the newer words. */
export function newStarterWordsAvailable(boards: Board[]): boolean {
  const have = new Set(boards.map((board) => board.id));
  return STARTER_BOARDS.some((starter) => !have.has(starter.id));
}

function atLeast(size: number, wanted: GridSize): GridSize {
  return VALID_GRID_SIZES.find((candidate) => candidate >= Math.max(size, wanted)) ?? 5;
}

/**
 * Brings the newer starter words onto a device that already has older ones,
 * without moving anything. An adult asks for this; it never happens by
 * itself. For each starter page:
 *
 *  - a page that is missing is added as it ships;
 *  - a page that exists keeps every button, position and colour it has. If
 *    the shipped page is bigger, the grid grows by adding empty rows and
 *    columns on the right and below, so each existing button stays in the
 *    same row and column (the buttons get a little smaller, which is the
 *    same adult choice as changing the grid size by hand). New buttons go
 *    where the shipped page puts them if that slot is free, otherwise in the
 *    first free slot, and are skipped if there is no room.
 *
 * Returns only the pages that changed.
 */
export function mergeStarterBoards(existing: Board[]): Board[] {
  const byId = new Map(existing.map((board) => [board.id, board]));
  const changed: Board[] = [];

  for (const starter of STARTER_BOARDS) {
    const current = byId.get(starter.id);
    if (!current) {
      changed.push(structuredClone(starter));
      continue;
    }

    const rows = atLeast(current.grid.rows, starter.grid.rows);
    const columns = atLeast(current.grid.columns, starter.grid.columns);
    const order: (string | null)[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: columns }, (_, c) => current.grid.order[r]?.[c] ?? null),
    );
    const haveIds = new Set(current.buttons.map((button) => button.id));
    const added: Item[] = [];

    for (const button of starter.buttons) {
      if (haveIds.has(button.id)) continue;
      const wanted = starter.grid.order
        .flatMap((row, r) => row.map((id, c) => ({ id, r, c })))
        .find((cell) => cell.id === button.id);
      let slot = wanted && order[wanted.r]?.[wanted.c] === null ? { r: wanted.r, c: wanted.c } : undefined;
      for (let r = 0; r < rows && !slot; r += 1) {
        for (let c = 0; c < columns && !slot; c += 1) {
          if (order[r]![c] === null) slot = { r, c };
        }
      }
      if (!slot) continue;
      order[slot.r]![slot.c] = button.id;
      added.push(structuredClone(button));
    }

    const grew = rows !== current.grid.rows || columns !== current.grid.columns;
    if (added.length > 0 || grew) {
      changed.push({ ...current, grid: { rows, columns, order }, buttons: [...current.buttons, ...added] });
    }
  }
  return changed;
}
