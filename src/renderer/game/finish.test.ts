import { describe, expect, it } from 'vitest';
import { FRAMES, OPTIONS, frameWords, makeFinishRound, sentenceFor } from './finish';
import type { Board, Item } from '../store/types';

const item = (id: string, label: string, extra: Partial<Item> = {}): Item => ({ id, label, image: { kind: 'emoji', char: '🙂' }, ...extra });
const board = (id: string, labels: string[]): Board => ({
  id,
  name: id,
  grid: { rows: 3, columns: 3, order: [[null, null, null], [null, null, null], [null, null, null]] },
  buttons: labels.map((label, i) => item(`${id}-${i}`, label)),
});

describe('words to finish a sentence', () => {
  const boards = [board('food', ['apple', 'banana', 'cake', 'dates', 'apple']), board('feelings', ['happy', 'sad', 'tired', 'calm', 'angry']), board('other', ['x', 'y', 'z', 'w'])];

  it('takes pictured words from the right boards, each said differently, never folders or hidden ones', () => {
    expect(frameWords(FRAMES[0]!, boards).map((w) => w.label)).toEqual(['apple', 'banana', 'cake', 'dates']);
    const withFolder = [board('food', ['apple', 'banana', 'cake', 'dates'])];
    withFolder[0]!.buttons.push({ id: 'f', label: 'More', image: { kind: 'emoji', char: '➕' }, load_board: { id: 'x' } }, item('h', 'hidden word', { hidden: true }));
    expect(frameWords(FRAMES[0]!, withFolder).map((w) => w.label)).toEqual(['apple', 'banana', 'cake', 'dates']);
  });

  it('makes a round of four words for a sentence start with enough words, and never the same start twice in a row', () => {
    const round = makeFinishRound(boards, undefined, () => 0)!;
    expect(round.options).toHaveLength(OPTIONS);
    const next = makeFinishRound(boards, round.frame.id, () => 0)!;
    expect(next.frame.id).not.toBe(round.frame.id);
  });

  it('gives nothing when no sentence has enough words', () => {
    expect(makeFinishRound([board('food', ['apple'])])).toBeUndefined();
  });

  it('finishes the sentence with whichever word is pressed', () => {
    expect(sentenceFor(FRAMES.find((f) => f.id === 'feel')!, item('a', 'Happy'))).toBe('I feel happy.');
  });
});
