// The home–school diary: a short note each way, so home and school know what the other has seen. It is written by adults
// on this device, for adults, and never shown on the child's screen. Kept on this device, and in a backup an adult
// saves; nothing is sent anywhere.

export type DiaryEntry = {
  id: string;
  /** Milliseconds since 1970. */
  at: number;
  from: 'home' | 'school';
  /** Who wrote it, in their own words: "Mum", "Ms Khan". */
  author: string;
  text: string;
};

export const MAX_DIARY = 200;
export const MAX_DIARY_TEXT = 600;

export const isDiaryList = (value: unknown): value is DiaryEntry[] =>
  Array.isArray(value) &&
  value.length <= MAX_DIARY &&
  value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const e = entry as Record<string, unknown>;
    return (
      typeof e['id'] === 'string' &&
      typeof e['at'] === 'number' &&
      (e['from'] === 'home' || e['from'] === 'school') &&
      typeof e['author'] === 'string' &&
      typeof e['text'] === 'string'
    );
  });

/** A new entry, trimmed, or null if there is nothing to say. */
export function makeEntry(from: DiaryEntry['from'], author: string, text: string, at: number): DiaryEntry | null {
  const clean = text.trim().slice(0, MAX_DIARY_TEXT);
  if (!clean) return null;
  return { id: `diary-${at}-${Math.random().toString(36).slice(2, 6)}`, at, from, author: author.trim().slice(0, 60), text: clean };
}

/** Newest first, and only the newest `MAX_DIARY` are kept when one is added. */
export function addEntry(entries: DiaryEntry[], entry: DiaryEntry): DiaryEntry[] {
  return [entry, ...entries].sort((a, b) => b.at - a.at).slice(0, MAX_DIARY);
}

/** Entries from the other side that have come in since this side last looked. */
export function unreadFor(entries: DiaryEntry[], side: DiaryEntry['from'], lastSeen: number): number {
  return entries.filter((entry) => entry.from !== side && entry.at > lastSeen).length;
}
