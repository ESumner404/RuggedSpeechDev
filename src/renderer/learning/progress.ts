import type { ActivityEntry } from '../store/activity';

// How what a child says is changing over the weeks, worked out from the opt-in activity log, for an adult and a speech
// and language therapist. It is a rough guide, not a score: how much someone says is not the same as how well they
// communicate, and nothing here is ever shown to the child. A word is counted wherever it came from (a button or a typed
// word), and punctuation and capitals are ignored.

export type WeekProgress = {
  /** The Monday the week starts, in milliseconds. */
  start: number;
  /** How many things were said. */
  utterances: number;
  /** The average number of words in what was said. */
  averageWords: number;
  /** The longest thing said, in words. */
  longest: number;
  /** What share of what was said had three words or more (0 to 1). */
  threePlus: number;
  /** Different words used. */
  distinctWords: number;
  /** Words used this week that were not used in any earlier week in the log. */
  newWords: string[];
};

const DAY = 24 * 60 * 60 * 1000;

function startOfWeek(at: number): number {
  const d = new Date(at);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

export function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9’'\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.replace(/^[-'’]+|[-'’]+$/g, ''))
    .filter(Boolean);
}

/** One entry per week, oldest first, for the last `weeks` weeks (including this one). Weeks with nothing said are kept, so a gap shows. */
export function languageProgress(entries: ActivityEntry[], now: number, weeks = 8): WeekProgress[] {
  const speech = entries.filter((entry) => entry.kind === 'speech').sort((a, b) => a.at - b.at);
  const thisWeek = startOfWeek(now);
  const starts = Array.from({ length: weeks }, (_, i) => thisWeek - (weeks - 1 - i) * 7 * DAY);

  const seenBefore = new Set<string>();
  const result: WeekProgress[] = [];
  for (const entry of speech) if (entry.at < starts[0]!) for (const word of wordsOf(entry.label)) seenBefore.add(word);

  for (const start of starts) {
    const end = start + 7 * DAY;
    const said = speech.filter((entry) => entry.at >= start && entry.at < end).map((entry) => wordsOf(entry.label)).filter((words) => words.length > 0);
    const distinct = new Set(said.flat());
    const newWords = [...distinct].filter((word) => !seenBefore.has(word)).sort();
    for (const word of distinct) seenBefore.add(word);
    const lengths = said.map((words) => words.length);
    result.push({
      start,
      utterances: said.length,
      averageWords: lengths.length ? Math.round((lengths.reduce((sum, n) => sum + n, 0) / lengths.length) * 10) / 10 : 0,
      longest: lengths.length ? Math.max(...lengths) : 0,
      threePlus: lengths.length ? lengths.filter((n) => n >= 3).length / lengths.length : 0,
      distinctWords: distinct.size,
      newWords,
    });
  }
  return result;
}
