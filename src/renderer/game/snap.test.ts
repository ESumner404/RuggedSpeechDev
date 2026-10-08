import { describe, expect, it } from 'vitest';
import type { Item } from '../store/types';
import { DECK_LENGTH, makeSnapDeck } from './snap';

const words: Item[] = Array.from({ length: 8 }, (_, i) => ({ id: `w${i}`, label: `word${i}`, image: { kind: 'emoji', char: '🙂' } }));

describe('makeSnapDeck', () => {
  it('makes a deck of the right length, and counts its snaps truthfully', () => {
    for (let n = 0; n < 100; n += 1) {
      const deck = makeSnapDeck(words)!;
      expect(deck.cards).toHaveLength(DECK_LENGTH);
      const counted = deck.cards.filter((card, i) => i > 0 && card.id === deck.cards[i - 1]!.id).length;
      expect(deck.snaps).toBe(counted);
    }
  });

  it('never makes three of the same in a row, and never a snap on the first card', () => {
    for (let n = 0; n < 200; n += 1) {
      const { cards } = makeSnapDeck(words)!;
      for (let i = 2; i < cards.length; i += 1) {
        expect(cards[i]!.id === cards[i - 1]!.id && cards[i - 1]!.id === cards[i - 2]!.id).toBe(false);
      }
    }
  });

  it('has snaps to find over a few decks, and turns up different cards', () => {
    const decks = Array.from({ length: 30 }, () => makeSnapDeck(words)!);
    expect(decks.some((deck) => deck.snaps > 0)).toBe(true);
    expect(new Set(decks.flatMap((deck) => deck.cards.map((c) => c.id))).size).toBeGreaterThan(4);
  });

  it('makes nothing from too few words', () => {
    expect(makeSnapDeck(words.slice(0, 3))).toBeUndefined();
  });
});
