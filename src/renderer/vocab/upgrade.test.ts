import { describe, expect, it } from 'vitest';
import { ROOT_BOARD_ID, STARTER_BOARDS } from './starter';
import { mergeStarterBoards, newStarterWordsAvailable } from './upgrade';
import type { Board } from '../store/types';

// What shipped before the larger vocabulary: the Talk page was four by four
// and completely full, with School at the bottom right.
function oldRoot(): Board {
  const root = structuredClone(STARTER_BOARDS.find((b) => b.id === ROOT_BOARD_ID)!);
  const school = { id: 'school', label: 'School', load_board: { id: 'school' } } as Board['buttons'][number];
  root.buttons = root.buttons.filter((b) => b.id !== 'actions').concat(school);
  root.grid.order[3]![3] = 'school';
  return root;
}

describe('mergeStarterBoards', () => {
  it('offers the new words only to a device that lacks some of the pages', () => {
    expect(newStarterWordsAvailable([oldRoot()])).toBe(true);
    expect(newStarterWordsAvailable(structuredClone(STARTER_BOARDS))).toBe(false);
  });

  it('adds missing pages whole and changes nothing on a complete device', () => {
    expect(mergeStarterBoards(structuredClone(STARTER_BOARDS))).toEqual([]);
    expect(mergeStarterBoards([oldRoot()]).map((b) => b.id)).toContain('animals');
  });

  it('never moves or removes a button on a full Talk page, and says so when a new one has no room', () => {
    const before = oldRoot();
    const changed = mergeStarterBoards([before]);
    expect(changed.find((b) => b.id === ROOT_BOARD_ID)).toBeUndefined(); // nothing to add, nothing grew
  });

  it('grows a smaller page without moving any button from its row and column', () => {
    const oldPlay: Board = {
      id: 'play',
      name: 'Play',
      grid: { rows: 2, columns: 2, order: [['ball', 'blocks'], ['storybook', 'game']] },
      buttons: [
        ...STARTER_BOARDS.find((b) => b.id === 'play')!.buttons.filter((b) => ['ball', 'blocks', 'storybook'].includes(b.id)),
        { id: 'game', label: 'game' },
      ],
    };
    const play = mergeStarterBoards([oldPlay]).find((b) => b.id === 'play')!;
    expect([play.grid.rows, play.grid.columns]).toEqual([3, 3]);
    expect(play.grid.order[0]!.slice(0, 2)).toEqual(['ball', 'blocks']);
    expect(play.grid.order[1]!.slice(0, 2)).toEqual(['storybook', 'game']);
    expect(play.buttons.some((b) => b.id === 'animals')).toBe(true);
  });

  it("keeps an adult's own changes: edited labels, a button they added, a slot they emptied", () => {
    const mine = structuredClone(STARTER_BOARDS.find((b) => b.id === 'play')!);
    const cell = (id: string) => mine.grid.order.flatMap((row, r) => row.map((x, c) => ({ x, r, c }))).find((c) => c.x === id)!;
    const carCell = cell('car');
    const tvCell = cell('tv');
    mine.buttons = mine.buttons
      .filter((b) => b.id !== 'car' && b.id !== 'tv')
      .map((b) => (b.id === 'ball' ? { ...b, label: 'football' } : b))
      .concat({ id: 'custom-1', label: 'Nanny' });
    mine.grid.order[carCell.r]![carCell.c] = 'custom-1'; // their own button where "car" was
    mine.grid.order[tvCell.r]![tvCell.c] = null; // and an empty place where "TV" was
    const result = mergeStarterBoards([mine]).find((b) => b.id === 'play') ?? mine;
    expect(result.buttons.find((b) => b.id === 'ball')!.label).toBe('football');
    expect(result.buttons.filter((b) => b.id === 'custom-1')).toHaveLength(1);
    expect(result.grid.order[carCell.r]![carCell.c]).toBe('custom-1');
    // What they took away comes back, but only into places that are free.
    const placed = result.grid.order.flat().filter((id): id is string => id !== null);
    expect(new Set(placed).size).toBe(placed.length);
    expect(placed).toContain('car');
    expect(placed).toContain('tv');
    expect(placed).toContain('custom-1');
    expect(result.grid.order[carCell.r]![carCell.c]).toBe('custom-1'); // theirs never moves
  });
});
