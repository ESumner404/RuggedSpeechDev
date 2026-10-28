import { signal } from '@preact/signals';

// What is being built and what was last said, for the one place that may show it: the family's own Apple TV, if an
// adult turned that on in Parent Mode, Access. Held only in memory. Nothing here is kept or sent anywhere by itself.

/** The words in the sentence on the Talk page right now. */
export const liveSentence = signal<string[]>([]);

/** The last thing said aloud, and when. */
export const lastSaid = signal<{ text: string; at: number } | null>(null);
