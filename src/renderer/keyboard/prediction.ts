// Hand-built bigram table for the core words (PLAN.md Phase 3), used to
// suggest a likely next word right after one is finished — prefix
// matching alone has nothing to go on at the start of a fresh word.
export const CORE_WORD_BIGRAMS: Record<string, string[]> = {
  i: ['want', 'like', 'feel', 'am', 'need'],
  want: ['a drink', 'more', 'to', 'help'],
  like: ['it', 'more', 'to'],
  more: ['please', 'food', 'juice'],
  no: ['thank you'],
  yes: ['please'],
  help: ['me', 'please'],
  go: ['home', 'to', 'outside'],
  my: ['turn', 'name is'],
  feel: ['happy', 'sad', 'tired', 'worried'],
};

function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Suggestions only — nothing here mutates any text. Prefix-matches the
 * word currently being typed against the loaded vocabulary; at the start
 * of a fresh word (just typed a space, or nothing yet) falls back to the
 * bigram table keyed on the word before it. Ranked by how often a person
 * has actually picked that word from a suggestion before, not typed it.
 */
export function getSuggestions(
  currentText: string,
  vocabulary: string[],
  frequency: Record<string, number>,
  maxSuggestions = 5,
): string[] {
  const endsWithSpace = currentText.length > 0 && /\s$/.test(currentText);
  const words = splitWords(currentText);
  const currentWord = endsWithSpace ? '' : (words[words.length - 1] ?? '');
  const previousWord = endsWithSpace ? words[words.length - 1] : words[words.length - 2];

  let candidates: string[];
  if (currentWord) {
    const prefix = currentWord.toLowerCase();
    candidates = vocabulary.filter(
      (word) => word.toLowerCase().startsWith(prefix) && word.toLowerCase() !== prefix,
    );
  } else if (previousWord && CORE_WORD_BIGRAMS[previousWord.toLowerCase()]) {
    candidates = CORE_WORD_BIGRAMS[previousWord.toLowerCase()]!;
  } else {
    candidates = [];
  }

  return [...candidates]
    .sort(
      (a, b) =>
        (frequency[b.toLowerCase()] ?? 0) - (frequency[a.toLowerCase()] ?? 0) || a.localeCompare(b),
    )
    .slice(0, maxSuggestions);
}

/**
 * Inserts a tapped suggestion into the text: completes the word currently
 * being typed (if any) or appends a fresh one, then a trailing space so
 * the next word can start straight away.
 */
export function applySuggestion(currentText: string, suggestion: string): string {
  const endsWithSpace = currentText.length > 0 && /\s$/.test(currentText);
  if (endsWithSpace || currentText.length === 0) {
    return `${currentText}${suggestion} `;
  }
  const words = currentText.split(/(\s+)/);
  words[words.length - 1] = suggestion;
  return `${words.join('')} `;
}
