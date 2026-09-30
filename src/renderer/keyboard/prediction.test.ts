import { describe, expect, it } from 'vitest';
import { applySuggestion, getSuggestions } from './prediction';

const VOCAB = ['want', 'water', 'watch', 'juice', 'yes'];

describe('getSuggestions', () => {
  it('prefix-matches the word currently being typed', () => {
    expect(getSuggestions('wa', VOCAB, {})).toEqual(['want', 'watch', 'water']);
  });

  it('excludes an exact match of the current word from its own suggestions', () => {
    expect(getSuggestions('want', VOCAB, {})).not.toContain('want');
  });

  it('falls back to the bigram table at the start of a fresh word', () => {
    const suggestions = getSuggestions('I ', VOCAB, {});
    expect(suggestions).toContain('want');
  });

  it('has nothing to suggest with no prefix and no known previous word', () => {
    expect(getSuggestions('zzz ', VOCAB, {})).toEqual([]);
  });

  it('ranks by frequency of being picked, not alphabetically, when frequency differs', () => {
    const suggestions = getSuggestions('wa', VOCAB, { watch: 5, water: 1 });
    expect(suggestions[0]).toBe('watch');
  });

  it('is a pure function: calling it never mutates its inputs', () => {
    const vocab = [...VOCAB];
    const freq = { water: 1 };
    getSuggestions('wa', vocab, freq);
    expect(vocab).toEqual(VOCAB);
    expect(freq).toEqual({ water: 1 });
  });
});

describe('applySuggestion', () => {
  it('completes the word being typed and adds a trailing space', () => {
    expect(applySuggestion('I wa', 'want')).toBe('I want ');
  });

  it('appends a fresh word after a space', () => {
    expect(applySuggestion('I want ', 'more')).toBe('I want more ');
  });

  it('starts the text when nothing has been typed yet', () => {
    expect(applySuggestion('', 'I')).toBe('I ');
  });
});
