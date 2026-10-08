import { describe, expect, it } from 'vitest';
import { STARTER_BOARDS } from '../vocab/starter';
import type { Board, Item } from '../store/types';
import { gameWords, makeRound, OPTIONS_PER_ROUND } from './wordGame';

const item = (id: string, label: string, extra: Partial<Item> = {}): Item => ({
  id,
  label,
  image: { kind: 'emoji', char: '🙂' },
  ...extra,
});

const boardOf = (buttons: Item[]): Board =>
  ({ id: 'b', name: 'b', grid: { rows: 3, columns: 3, order: [] }, buttons }) as unknown as Board;

describe('gameWords', () => {
  it('uses pictured words from every board, never folders', () => {
    const words = gameWords(STARTER_BOARDS, 0);
    expect(words.length).toBeGreaterThan(20);
    expect(words.every((word) => word.image && !word.load_board)).toBe(true);
  });

  it('leaves out hidden words, words beyond the current stage, and pictureless ones', () => {
    const board = boardOf([
      item('a', 'apple'),
      item('b', 'ball', { hidden: true }),
      item('c', 'cup', { stage: 3 }),
      { id: 'd', label: 'dog' },
      item('e', 'egg', { stage: 1 }),
    ]);
    expect(gameWords([board], 1).map((w) => w.label)).toEqual(['apple', 'egg']);
    expect(gameWords([board], 0).map((w) => w.label)).toEqual(['apple', 'cup', 'egg']);
  });

  it('counts a repeated word once, however it is capitalised', () => {
    const words = gameWords([boardOf([item('a', 'Drink'), item('b', 'drink'), item('c', ' drink ')])], 0);
    expect(words).toHaveLength(1);
  });
});

describe('makeRound', () => {
  const words = Array.from({ length: 8 }, (_, i) => item(`w${i}`, `word${i}`));

  it('offers the right word once among four different words', () => {
    for (let i = 0; i < 50; i += 1) {
      const round = makeRound(words)!;
      expect(round.options).toHaveLength(OPTIONS_PER_ROUND);
      expect(new Set(round.options.map((o) => o.id)).size).toBe(OPTIONS_PER_ROUND);
      expect(round.options.filter((o) => o.id === round.target.id)).toHaveLength(1);
    }
  });

  it('never repeats the picture just shown', () => {
    for (let i = 0; i < 50; i += 1) {
      expect(makeRound(words, 'w3')!.target.id).not.toBe('w3');
    }
  });

  it('puts the right word in different places, not always the same one', () => {
    const places = new Set<number>();
    for (let i = 0; i < 100; i += 1) {
      const round = makeRound(words)!;
      places.add(round.options.findIndex((o) => o.id === round.target.id));
    }
    expect(places.size).toBeGreaterThan(1);
  });

  it('makes nothing from too few words', () => {
    expect(makeRound(words.slice(0, 3))).toBeUndefined();
  });
});
