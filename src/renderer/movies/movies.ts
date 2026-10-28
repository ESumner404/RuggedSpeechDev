// Movies kept on the device: picked from Photos or Files by an adult, copied into the app, and played by the device when
// the child presses one. Never streamed, never sent anywhere, and never played unless pressed. They are not in a backup
// (a film is far too big), so a backup restored on another device keeps the list's names but not the films.

export type Movie = {
  /** The device's name for the stored file. */
  id: string;
  title: string;
  emoji: string;
  bytes: number;
  seconds: number;
};

export const MAX_MOVIES = 40;

export const isMovieList = (value: unknown): value is Movie[] =>
  Array.isArray(value) &&
  value.length <= MAX_MOVIES &&
  value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const m = entry as Record<string, unknown>;
    return (
      typeof m['id'] === 'string' &&
      typeof m['title'] === 'string' &&
      typeof m['emoji'] === 'string' &&
      typeof m['bytes'] === 'number' &&
      typeof m['seconds'] === 'number'
    );
  });

/** "1h 5m", "12m", "45s". */
export function formatLength(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function movieFromPick(entry: { id: string; title: string; bytes: number; seconds: number }): Movie {
  return { id: entry.id, title: entry.title.trim().slice(0, 80) || 'Movie', emoji: '🎬', bytes: entry.bytes, seconds: entry.seconds };
}
