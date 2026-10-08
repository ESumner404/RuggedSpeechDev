// Music: songs a parent adds from files on this computer (MP3 and the like).
// They are kept on this computer, play without the internet, and go nowhere
// except into a backup an adult saves. There is no Spotify or Apple Music:
// those are accounts and streaming, which this app deliberately does not
// have (PRINCIPLES.md section 2, I1 and I2). Songs bought or copied as plain
// files work, and so does a recording of someone singing.

export type Song = {
  id: string;
  title: string;
  emoji: string;
  /** Where the audio is kept (in the same store as recorded voice clips). */
  blobId: string;
  bytes: number;
};

export const MAX_SONG_BYTES = 30 * 1024 * 1024;
export const MAX_SONGS = 60;
/** A reminder, not a limit: a backup holds every song, so a large library makes a large backup. */
export const BIG_LIBRARY_BYTES = 150 * 1024 * 1024;

const AUDIO_EXTENSIONS = /\.(mp3|m4a|aac|wav|ogg|oga|opus|flac|webm)$/i;

export function isAudioFile(file: { name: string; type: string }): boolean {
  return file.type.startsWith('audio/') || AUDIO_EXTENSIONS.test(file.name);
}

/** "01 - Twinkle_Twinkle.mp3" becomes "Twinkle Twinkle". */
export function titleFromFile(name: string): string {
  return name
    .replace(AUDIO_EXTENSIONS, '')
    .replace(/^\s*\d{1,3}\s*[-._)]\s*/, '')
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const isSongList = (value: unknown): value is Song[] =>
  Array.isArray(value) &&
  value.length <= MAX_SONGS &&
  value.every((s) => {
    if (typeof s !== 'object' || s === null) return false;
    const song = s as Record<string, unknown>;
    return (
      typeof song['id'] === 'string' &&
      typeof song['title'] === 'string' &&
      typeof song['emoji'] === 'string' &&
      typeof song['blobId'] === 'string' &&
      typeof song['bytes'] === 'number'
    );
  });
