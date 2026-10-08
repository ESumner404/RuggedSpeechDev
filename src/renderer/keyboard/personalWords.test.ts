import { describe, expect, it } from 'vitest';
import { collectPersonalWords, mergeVocabulary, wordsFromText } from './personalWords';
import type { Board } from '../store/types';

const BOARD: Board = {
  id: 'b',
  name: 'B',
  grid: { rows: 2, columns: 2, order: [['a', 'b'], [null, null]] },
  buttons: [
    { id: 'a', label: 'Grandad' },
    { id: 'b', label: 'secret thing', hidden: true },
  ],
};

describe('wordsFromText', () => {
  it('finds words, keeping apostrophes and hyphens inside them', () => {
    expect(wordsFromText("Can I have Mum's snack, please? It's a well-known one!")).toEqual([
      'Can',
      'have',
      "Mum's",
      'snack',
      'please',
      "It's",
      'well-known',
      'one',
    ]);
  });

  it('copes with accents and drops single letters and stray punctuation', () => {
    expect(wordsFromText('Zoë, a, -. Müller')).toEqual(['Zoë', 'Müller']);
  });
});

describe('collectPersonalWords', () => {
  it('gathers names, page words and phrases, once each, leaving out hidden buttons', () => {
    const words = collectPersonalWords({
      boards: [BOARD],
      people: [{ id: 'p', name: 'Niamh Quinn', phrases: [] }],
      places: [{ id: 'q', name: 'The Zoo', phrases: [] }],
      customPhrases: ['I like the zoo'],
      phraseBank: { name: 'My name is Niamh', address: '', usualOrder: 'A cheese toastie', registerAnswer: '' },
    });
    expect(words).toContain('Grandad');
    expect(words).toContain('Niamh');
    expect(words).toContain('Quinn');
    expect(words).toContain('toastie');
    expect(words).not.toContain('secret');
    // "zoo" appears twice in different capitals but is offered once, as first written.
    expect(words.filter((word) => word.toLowerCase() === 'zoo')).toEqual(['Zoo']);
    expect(words.filter((word) => word.toLowerCase() === 'niamh')).toHaveLength(1);
  });
});

describe('mergeVocabulary', () => {
  it('adds only the words the built-in list does not already have', () => {
    expect(mergeVocabulary(['Food', 'help'], ['food', 'Grandad', 'HELP'])).toEqual(['Food', 'help', 'Grandad']);
  });
});
