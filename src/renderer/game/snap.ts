import type { Item } from '../store/types';

export const DECK_LENGTH = 12;

export type SnapDeck = {
  cards: Item[];
  /** How many times a card is the same as the one before it. */
  snaps: number;
};

/**
 * A deck of pictures for Snap. About one card in three repeats the one
 * before, so there are snaps to find, but never three of the same in a row
 * and never a run so long it is boring. The first card cannot be a snap.
 */
export function makeSnapDeck(words: Item[], length: number = DECK_LENGTH, random: () => number = Math.random): SnapDeck | undefined {
  if (words.length < 4) return undefined;
  const cards: Item[] = [];
  let snaps = 0;
  for (let i = 0; i < length; i += 1) {
    const previous = cards[i - 1];
    const repeatsBefore = previous && cards[i - 2]?.id === previous.id;
    if (previous && !repeatsBefore && random() < 0.35) {
      cards.push(previous);
      snaps += 1;
      continue;
    }
    const others = words.filter((word) => word.id !== previous?.id);
    cards.push(others[Math.floor(random() * others.length)]!);
  }
  return { cards, snaps };
}
