import type { Board, PersonRecord, PhraseBank, PlaceRecord } from '../store/types';

const WORD = /[\p{L}][\p{L}'’-]*/gu;

/** The words in some text: letters, with apostrophes and hyphens inside a word. */
export function wordsFromText(text: string): string[] {
  return (text.match(WORD) ?? []).map((word) => word.replace(/['’-]+$/u, '')).filter((word) => word.length >= 2);
}

export type PersonalWordSources = {
  boards: Board[];
  people: PersonRecord[];
  places: PlaceRecord[];
  customPhrases: string[];
  phraseBank: PhraseBank;
};

/**
 * Words that belong to this person, for the keyboard's suggestions to offer:
 * the names they have added, the words on pages an adult built, and the words
 * in their saved phrases. Only ever suggestions (invariant I5). Hidden
 * buttons are left out, and each word appears once whatever its capitals,
 * keeping the way it was first written ("Grandad", not "grandad").
 */
export function collectPersonalWords(sources: PersonalWordSources): string[] {
  const seen = new Map<string, string>();
  const add = (text: string): void => {
    for (const word of wordsFromText(text)) {
      if (!seen.has(word.toLowerCase())) seen.set(word.toLowerCase(), word);
    }
  };

  for (const board of sources.boards) {
    for (const button of board.buttons) {
      if (!button.hidden) add(button.label);
    }
  }
  for (const record of [...sources.people, ...sources.places]) add(record.name);
  for (const phrase of sources.customPhrases) add(phrase);
  for (const phrase of Object.values(sources.phraseBank)) add(phrase);
  return [...seen.values()];
}

/** The built-in words plus personal ones, each word once whatever its capitals. */
export function mergeVocabulary(builtIn: string[], personal: string[]): string[] {
  const seen = new Set(builtIn.map((word) => word.toLowerCase()));
  return [...builtIn, ...personal.filter((word) => !seen.has(word.toLowerCase()))];
}
