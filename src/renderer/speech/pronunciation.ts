import type { Pronunciation } from '../store/types';

function escapeForRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rewrites spoken text so a voice says words the way an adult has asked:
 * "Niamh" said as "Neev". Whole words only (so "Sam" does not change
 * "Samuel"), ignoring capital letters, and the longest entry wins when two
 * overlap. Nothing is rewritten twice: a replacement is never itself
 * searched again. The words on screen and in Recent history are untouched;
 * this only changes what is handed to the voice.
 */
export function applyPronunciations(text: string, entries: Pronunciation[]): string {
  const usable = entries.filter((entry) => entry.written.trim() !== '' && entry.spoken.trim() !== '');
  if (usable.length === 0) return text;

  const spokenFor = new Map(usable.map((entry) => [entry.written.trim().toLowerCase(), entry.spoken.trim()]));
  const alternatives = [...spokenFor.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeForRegExp)
    .join('|');
  const wholeWord = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, 'giu');
  return text.replace(wholeWord, (match) => spokenFor.get(match.toLowerCase()) ?? match);
}
