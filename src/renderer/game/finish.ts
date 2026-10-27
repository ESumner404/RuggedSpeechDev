import type { Board, Item } from '../store/types';

// Finish the sentence: the start of a sentence, and four words to finish it with. There is no right answer and no score:
// whichever word is pressed finishes the sentence, and a person can press Hear it to hear it. It builds longer sentences
// out of words a child already knows, in the way a speech and language therapist would model them.

export type Frame = { id: string; start: string; boardIds: string[]; /** What goes between the start and the word. */ glue: string };

export const FRAMES: Frame[] = [
  { id: 'want', start: 'I want', boardIds: ['food', 'food-drinks', 'play'], glue: '' },
  { id: 'like', start: 'I like', boardIds: ['food', 'play', 'animals'], glue: '' },
  { id: 'feel', start: 'I feel', boardIds: ['feelings'], glue: '' },
  { id: 'go', start: 'Let us go to the', boardIds: ['places'], glue: '' },
  { id: 'see', start: 'I can see my', boardIds: ['people', 'body'], glue: '' },
];

export const OPTIONS = 4;

export type FinishRound = { frame: Frame; options: Item[] };

/** The words a frame can use: pictured, not folders, and each said differently. */
export function frameWords(frame: Frame, boards: Board[]): Item[] {
  const seen = new Set<string>();
  const words: Item[] = [];
  for (const board of boards) {
    if (!frame.boardIds.includes(board.id)) continue;
    for (const item of board.buttons) {
      const key = item.label.trim().toLowerCase();
      if (!key || item.load_board || item.hidden || !item.image || seen.has(key)) continue;
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

/** The next sentence to finish, never the same start twice in a row (unless there is only one), or undefined if no frame has enough words. */
export function makeFinishRound(boards: Board[], previousFrameId?: string, random: () => number = Math.random): FinishRound | undefined {
  const usable = FRAMES.filter((frame) => frameWords(frame, boards).length >= OPTIONS);
  if (usable.length === 0) return undefined;
  const choices = usable.length > 1 ? usable.filter((frame) => frame.id !== previousFrameId) : usable;
  const frame = choices[Math.floor(random() * choices.length)]!;
  return { frame, options: shuffled(frameWords(frame, boards), random).slice(0, OPTIONS) };
}

export function sentenceFor(frame: Frame, word: Item): string {
  return `${frame.start} ${word.label.toLowerCase()}.`;
}
