import type { Board, GridSize, Item } from '../store/types';

/** Everything about a button an adult can change. `null` clears a field. */
export type ButtonChanges = {
  [K in 'label' | 'vocalization' | 'image' | 'background_color' | 'voiceClipBlobId' | 'stage' | 'target']?:
    | Item[K]
    | null;
};

export function slugify(label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'button'}-${Math.random().toString(36).slice(2, 7)}`;
}

// Pure transforms over a Board. The caller (ParentModeScreen) persists the
// result with store/db's updateBoard, nothing here touches IndexedDB, so
// every rule (capacity checks, position preservation) is testable without it.

export function toggleButtonHidden(board: Board, buttonId: string): Board {
  return {
    ...board,
    buttons: board.buttons.map((button) =>
      button.id === buttonId ? { ...button, hidden: !button.hidden } : button,
    ),
  };
}

export function updateButtonLabel(board: Board, buttonId: string, label: string): Board {
  return {
    ...board,
    buttons: board.buttons.map((button) => (button.id === buttonId ? { ...button, label } : button)),
  };
}

export function updateButtonEmoji(board: Board, buttonId: string, char: string): Board {
  return {
    ...board,
    buttons: board.buttons.map((button) =>
      button.id === buttonId ? { ...button, image: { kind: 'emoji', char } } : button,
    ),
  };
}

function flattenOrder(board: Board): (string | null)[] {
  return board.grid.order.flat();
}

function reshapeOrder(
  flat: (string | null)[],
  rows: GridSize,
  columns: GridSize,
): (string | null)[][] {
  const padded = [...flat];
  while (padded.length < rows * columns) padded.push(null);

  const order: (string | null)[][] = [];
  for (let r = 0; r < rows; r += 1) {
    order.push(padded.slice(r * columns, (r + 1) * columns));
  }
  return order;
}

/**
 * Swaps a button with its neighbour in the flat (row-major) order,
 * the keyboard-accessible fallback docs/build-plan.md Phase 4 asks for alongside
 * drag-and-drop. Position is independent of visibility: a hidden button
 * still moves.
 */
export function moveButton(board: Board, buttonId: string, direction: 'up' | 'down'): Board {
  const flat = flattenOrder(board);
  const index = flat.indexOf(buttonId);
  if (index === -1) return board;

  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= flat.length) return board;

  const next = [...flat];
  const a = next[index]!;
  const b = next[swapWith]!;
  next[index] = b;
  next[swapWith] = a;

  return { ...board, grid: { ...board.grid, order: reshapeOrder(next, board.grid.rows, board.grid.columns) } };
}

/**
 * Drag-and-drop reordering (docs/build-plan.md Phase 4): two buttons trade places and
 * every other button stays exactly where it was, so one drag never shifts
 * anything a child has learned the position of (invariant I3). The ▲/▼
 * buttons remain as the keyboard-accessible fallback.
 */
export function swapButtons(board: Board, firstId: string, secondId: string): Board {
  const flat = flattenOrder(board);
  const first = flat.indexOf(firstId);
  const second = flat.indexOf(secondId);
  if (first === -1 || second === -1 || first === second) return board;

  const next = [...flat];
  next[first] = secondId;
  next[second] = firstId;
  return { ...board, grid: { ...board.grid, order: reshapeOrder(next, board.grid.rows, board.grid.columns) } };
}

export function hasEmptySlot(board: Board): boolean {
  return flattenOrder(board).includes(null);
}

export function addButton(board: Board, item: Item): Board {
  const flat = flattenOrder(board);
  const emptyIndex = flat.indexOf(null);
  if (emptyIndex === -1) {
    throw new Error('No empty slot on this board. Resize the grid or remove a button first.');
  }
  const next = [...flat];
  next[emptyIndex] = item.id;
  return {
    ...board,
    buttons: [...board.buttons, item],
    grid: { ...board.grid, order: reshapeOrder(next, board.grid.rows, board.grid.columns) },
  };
}

/**
 * Changes a board's own grid dimensions (invariant I3: this is the only
 * way layout changes, never automatically). Every currently-placed
 * button, hidden or not, must still fit; refuses rather than silently
 * losing one.
 */
export function resizeGrid(board: Board, rows: GridSize, columns: GridSize): Board {
  const placed = flattenOrder(board).filter((id): id is string => id !== null);
  if (placed.length > rows * columns) {
    throw new Error('Too many buttons for that grid size. Hide or remove some first.');
  }
  return { ...board, grid: { rows, columns, order: reshapeOrder(placed, rows, columns) } };
}

/**
 * Changes one button in place. Position never changes, however much else
 * does (invariant I3). Passing `null` for a field removes it, so "says"
 * text, a voice clip, a stage or a focus-word mark can be taken away again.
 */
export function updateButton(board: Board, buttonId: string, changes: ButtonChanges): Board {
  return {
    ...board,
    buttons: board.buttons.map((button) => {
      if (button.id !== buttonId) return button;
      const next: Record<string, unknown> = { ...button };
      for (const [field, value] of Object.entries(changes)) {
        if (value === null) delete next[field];
        else if (value !== undefined) next[field] = value;
      }
      return next as Item;
    }),
  };
}

/** Takes a button off the board and leaves its slot empty, so no other button moves. */
export function removeButton(board: Board, buttonId: string): Board {
  return {
    ...board,
    buttons: board.buttons.filter((button) => button.id !== buttonId),
    grid: {
      ...board.grid,
      order: board.grid.order.map((row) => row.map((cell) => (cell === buttonId ? null : cell))),
    },
  };
}
