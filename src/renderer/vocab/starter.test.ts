import { describe, expect, it } from 'vitest';
import { classOfColor } from '../ui/fitzgerald';
import { ROOT_BOARD_ID, STARTER_BOARDS, collectVocabularyWords } from './starter';

describe('starter vocabulary', () => {
  it('lays every button out exactly once, inside the grid', () => {
    for (const board of STARTER_BOARDS) {
      const { rows, columns, order } = board.grid;
      expect(order, board.name).toHaveLength(rows);
      expect(order.every((row) => row.length === columns), board.name).toBe(true);
      const placed = order.flat().filter((id): id is string => id !== null);
      expect(new Set(placed).size, `${board.name} places a button twice`).toBe(placed.length);
      expect([...placed].sort(), board.name).toEqual(board.buttons.map((b) => b.id).sort());
    }
  });

  it('never repeats a button id anywhere, so favourites and counts cannot be confused', () => {
    const ids = STARTER_BOARDS.flatMap((board) => board.buttons.map((b) => b.id));
    const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(repeated).toEqual([]);
  });

  it('every folder opens a board that exists, and every board is reachable from Talk', () => {
    const byId = new Map(STARTER_BOARDS.map((b) => [b.id, b]));
    const reached = new Set<string>([ROOT_BOARD_ID]);
    const queue = [ROOT_BOARD_ID];
    while (queue.length) {
      for (const button of byId.get(queue.pop()!)!.buttons) {
        const target = button.load_board?.id;
        if (!target) continue;
        expect(byId.has(target), `${button.label} opens a missing board`).toBe(true);
        if (!reached.has(target)) {
          reached.add(target);
          queue.push(target);
        }
      }
    }
    expect([...reached].sort()).toEqual([...byId.keys()].sort());
  });

  it('keeps the Talk page a four-by-four of big buttons, with the original words where they have always been', () => {
    const grid = STARTER_BOARDS.find((b) => b.id === ROOT_BOARD_ID)!.grid;
    expect([grid.rows, grid.columns]).toEqual([4, 4]);
    expect(grid.order[0]).toEqual(['i', 'want', 'like', 'more']);
    expect(grid.order[1]).toEqual(['no', 'yes', 'help', 'go']);
    expect(grid.order[2]).toEqual(['my', 'feel', 'food', 'feelings']);
    expect(grid.order[3]!.slice(0, 3)).toEqual(['play', 'people', 'places']);
  });

  it('gives every button a picture and a colour from the key, and no word a stage', () => {
    for (const board of STARTER_BOARDS) {
      for (const button of board.buttons) {
        expect(button.image?.kind, button.label).toBe('emoji');
        expect(classOfColor(button.background_color), button.label).toBeDefined();
        expect(button.stage, button.label).toBeUndefined();
      }
    }
  });

  it('leaves room on People and Places for the people and places an adult adds', () => {
    for (const id of ['people', 'places']) {
      const board = STARTER_BOARDS.find((b) => b.id === id)!;
      expect(board.grid.rows * board.grid.columns - board.buttons.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('is a small set of first words, not a dictionary', () => {
    const words = collectVocabularyWords();
    for (const w of ['want', 'more', 'stop', 'look', 'all done', 'please', 'thank you', 'dog', 'eyes', 'water']) {
      expect(words).toContain(w);
    }
    expect(words.length).toBeGreaterThan(60);
    expect(words.length).toBeLessThan(110);
  });

  it('keeps every folder to nine buttons or fewer, apart from Doing, which holds the few most common little words', () => {
    for (const board of STARTER_BOARDS) {
      if (board.id === ROOT_BOARD_ID) continue;
      const room = ['people', 'places'].includes(board.id);
      expect(board.buttons.length, board.name).toBeLessThanOrEqual(board.id === 'actions' ? 13 : 9);
      if (!room && board.id !== 'actions') expect(board.grid.rows * board.grid.columns, board.name).toBeLessThanOrEqual(9);
    }
  });

  it('uses only simple, short words that a young child would know', () => {
    const labels = STARTER_BOARDS.flatMap((board) => board.buttons.map((b) => b.label));
    for (const label of labels) {
      expect(label.split(' ').length, label).toBeLessThanOrEqual(3);
      expect(label.length, label).toBeLessThanOrEqual(12);
    }
    // Words that belong on a later page, not a first one.
    for (const advanced of ['worried', 'excited', 'proud', 'excuse me', 'understand', 'hospital', 'elephant', 'butterfly', 'stormy', 'pasta', 'squash', 'scissors']) {
      expect(labels.map((l) => l.toLowerCase())).not.toContain(advanced);
    }
  });
});
