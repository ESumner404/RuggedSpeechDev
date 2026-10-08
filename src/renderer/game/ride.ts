import type { Item } from '../store/types';

// The rollercoaster builds short sentences, one for each hill. A child picks
// how long: two words ("want ball"), three ("I want ball") or four ("I want
// big ball"). Starting small and adding a word is how many speech and
// language therapists build sentences up.

export type Level = 'two' | 'three' | 'four';

export const LEVELS: { id: Level; label: string; example: string }[] = [
  { id: 'two', label: 'Two words', example: 'want ball' },
  { id: 'three', label: 'Three words', example: 'I want ball' },
  { id: 'four', label: 'Four words', example: 'I want big ball' },
];

export const LENGTHS: { hills: number; label: string }[] = [
  { hills: 3, label: 'Short ride' },
  { hills: 5, label: 'Long ride' },
];

export const VERBS = ['want', 'like', 'see'] as const;
/** Describing words that fit almost anything, and are easy to see. */
export const DESCRIBERS = ['big', 'little', 'red', 'blue', 'green'] as const;

export type StepKind = 'start' | 'verb' | 'describer' | 'thing';

export const STEPS: Record<Level, StepKind[]> = {
  two: ['verb', 'thing'],
  three: ['start', 'verb', 'thing'],
  four: ['start', 'verb', 'describer', 'thing'],
};

export type Hill = {
  /** The thing to find in the pictures, and the words to choose from. */
  target: Item;
  options: Item[];
  /** Describing words on offer, in the order shown. */
  describers: string[];
};

function shuffled<T>(values: T[], random: () => number): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/**
 * Things to talk about: single words only, so a sentence always has the
 * number of words it says it has, and not the little core words the sentence
 * already contains.
 */
export function rideThings(words: Item[]): Item[] {
  const skip = new Set<string>(['i', 'you', 'my', 'me', ...VERBS, ...DESCRIBERS]);
  return words.filter((word) => {
    const label = word.label.trim();
    return /^[^\s]+$/.test(label) && !skip.has(label.toLowerCase());
  });
}

/** The pictures and choices for each hill of one ride. Undefined if there are too few things. */
export function makeRide(words: Item[], hills: number = 5, random: () => number = Math.random): Hill[] | undefined {
  const things = rideThings(words);
  if (things.length < hills + 3) return undefined;
  const targets = shuffled(things, random).slice(0, hills);
  return targets.map((target) => ({
    target,
    options: shuffled([target, ...shuffled(things.filter((thing) => thing.id !== target.id), random).slice(0, 3)], random),
    describers: shuffled([...DESCRIBERS], random).slice(0, 3),
  }));
}

/** How far along the whole track the car is, from 0 (start) to 1 (the end). */
export function progress(hillIndex: number, stepsDone: number, stepsPerHill: number, hills: number): number {
  return Math.min(1, (hillIndex * stepsPerHill + stepsDone) / (hills * stepsPerHill));
}

/** After this many wrong tries in a row at one step, the right word is outlined. */
export const HINT_AFTER = 2;

export function sentenceFor(level: Level, parts: { verb: string | null; describer: string | null; thing: string | null; started: boolean }): string {
  const order: (string | null)[] =
    level === 'two'
      ? [parts.verb, parts.thing]
      : level === 'three'
        ? [parts.started ? 'I' : null, parts.verb, parts.thing]
        : [parts.started ? 'I' : null, parts.verb, parts.describer, parts.thing];
  return order.filter(Boolean).join(' ');
}
