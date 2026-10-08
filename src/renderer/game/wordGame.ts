import { isItemShown } from '../board/visibility';
import type { Board, Item } from '../store/types';

/** Four words to choose from: one right, three not. */
export const OPTIONS_PER_ROUND = 4;

export type Round = {
  target: Item;
  /** In the order they are shown. */
  options: Item[];
};

/**
 * The words the game can use: every button that has a picture, is not a
 * folder, is showing for the current word stage, and has a label no other
 * button here shares (two pictures for one word would make a fair answer
 * look wrong). Hidden buttons are never used, so an adult's choices about
 * what the child sees apply here too.
 */
export function gameWords(boards: Board[], activeStage: number): Item[] {
  const seen = new Set<string>();
  const words: Item[] = [];
  for (const board of boards) {
    for (const item of board.buttons) {
      const key = item.label.trim().toLowerCase();
      if (!key || item.load_board || !item.image || item.image.kind === 'symbol') continue;
      if (!isItemShown(item, activeStage) || seen.has(key)) continue;
      seen.add(key);
      words.push(item);
    }
  }
  return words;
}

function shuffled<T>(values: T[], random: () => number): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/**
 * Picks the next picture and the words to choose between. The picture is
 * never the one just shown (unless there is no other), and the wrong words
 * are different from the right one. Returns undefined when there are too
 * few words to make a fair choice.
 */
export function makeRound(words: Item[], previousId?: string, random: () => number = Math.random): Round | undefined {
  if (words.length < OPTIONS_PER_ROUND) return undefined;
  const candidates = words.filter((word) => word.id !== previousId);
  const target = candidates[Math.floor(random() * candidates.length)]!;
  const others = shuffled(
    words.filter((word) => word.id !== target.id),
    random,
  ).slice(0, OPTIONS_PER_ROUND - 1);
  return { target, options: shuffled([target, ...others], random) };
}
