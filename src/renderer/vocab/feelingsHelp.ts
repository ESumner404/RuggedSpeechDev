import { FITZGERALD_COLORS } from '../ui/fitzgerald';
import type { Item } from '../store/types';

function feelingWord(id: string, label: string, emoji: string): Item {
  return {
    id,
    label,
    image: { kind: 'emoji', char: emoji },
    background_color: FITZGERALD_COLORS.describing,
  };
}

// Emotion, sensory and physical needs together — a sensory need is a need
// to be met, not a problem to report, so these read as "too loud" / "need
// space", never "sensory issue" (CLAUDE.md §7).
export const FEELINGS_ITEMS: Item[] = [
  feelingWord('happy', 'happy', '😊'),
  feelingWord('sad', 'sad', '😢'),
  feelingWord('angry', 'angry', '😠'),
  feelingWord('worried', 'worried', '😟'),
  feelingWord('scared', 'scared', '😨'),
  feelingWord('tired-feeling', 'tired', '😴'),
  feelingWord('excited', 'excited', '🤩'),
  feelingWord('calm', 'calm', '😌'),
  feelingWord('too-loud', 'too loud', '🔊'),
  feelingWord('too-bright', 'too bright', '💡'),
  feelingWord('need-quiet', 'need quiet', '🤫'),
  feelingWord('need-space', 'need space', '↔️'),
  feelingWord('need-to-move', 'need to move', '🏃'),
  feelingWord('itchy', 'itchy', '🪡'),
  feelingWord('hungry', 'hungry', '🍽️'),
  feelingWord('thirsty', 'thirsty', '🥤'),
  feelingWord('hurts', 'hurts', '🤕'),
  feelingWord('hot', 'hot', '🥵'),
  feelingWord('cold', 'cold', '🥶'),
  feelingWord('need-toilet', 'need toilet', '🚻'),
];

export type Intensity = 'a little' | 'medium' | 'a lot';
export const INTENSITIES: Intensity[] = ['a little', 'medium', 'a lot'];

function helpPhrase(id: string, label: string, emoji: string): Item {
  return {
    id,
    label,
    image: { kind: 'emoji', char: emoji },
    background_color: FITZGERALD_COLORS.social,
  };
}

// Speaks the phrase and stops — the app is not a safeguarding record
// (CLAUDE.md §6). Nothing here notifies anyone or logs differently from
// any other utterance.
export const HELP_ITEMS: Item[] = [
  helpPhrase('lost', "I'm lost", '❓'),
  helpPhrase('unsafe', 'I feel unsafe', '⚠️'),
  helpPhrase('hurt-help', "I'm hurt", '🤕'),
  helpPhrase('unwell', "I feel unwell", '🤒'),
  helpPhrase('call-parent', 'Call my parent', '📞'),
  helpPhrase('toilet-help', 'I need the toilet', '🚻'),
  helpPhrase('someone-hurt-me', 'Someone hurt me', '🚨'),
  helpPhrase('dont-touch-me', "Don't touch me", '✋'),
  helpPhrase('dont-know-where', "I don't know where I am", '📍'),
];
