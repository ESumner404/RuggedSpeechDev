// Music: songs a parent adds from files on this computer (MP3 and the like).
// They are kept on this computer, play without the internet, and go nowhere
// except into a backup an adult saves. There is no Spotify and no streaming:
// that is an account and the internet, which this app deliberately does not
// have (PRINCIPLES.md section 2, I1 and I2). Songs bought or copied as plain
// files work, and so does a recording of someone singing. On an iPhone or iPad
// a song can instead be one already stored on the device in its Music library
// (`libraryId`): only the reference is kept here, the device plays it, and a
// song that is only in the cloud is never offered.

export type Song = {
  id: string;
  title: string;
  emoji: string;
  /** Where the audio is kept (in the same store as recorded voice clips). Empty for a song from the device's Music library. */
  blobId: string;
  bytes: number;
  /** A song already on the device, in its Music library: the device's own identifier for it. */
  libraryId?: string;
  /** Who sings it, for a song from the device's Music library. */
  artist?: string;
};

/** A named list of songs, in the order they play. */
export type Playlist = {
  id: string;
  name: string;
  emoji: string;
  songIds: string[];
};

export const MAX_PLAYLISTS = 12;

export const isPlaylistList = (value: unknown): value is Playlist[] =>
  Array.isArray(value) &&
  value.length <= MAX_PLAYLISTS &&
  value.every((p) => {
    if (typeof p !== 'object' || p === null) return false;
    const list = p as Record<string, unknown>;
    return (
      typeof list['id'] === 'string' &&
      typeof list['name'] === 'string' &&
      typeof list['emoji'] === 'string' &&
      Array.isArray(list['songIds']) &&
      list['songIds'].every((id) => typeof id === 'string')
    );
  });

/** The songs of a playlist, in its order. A song that has since been removed is left out. */
export function songsInPlaylist(playlist: Playlist, songs: Song[]): Song[] {
  return playlist.songIds.map((id) => songs.find((song) => song.id === id)).filter((song): song is Song => Boolean(song));
}

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
      typeof song['bytes'] === 'number' &&
      (song['libraryId'] === undefined || typeof song['libraryId'] === 'string') &&
      (song['artist'] === undefined || typeof song['artist'] === 'string')
    );
  });

/** A song from the device's Music library, as one of ours. Nothing is copied: only the device's identifier for it. */
export function songFromLibrary(entry: { id: string; title: string; artist?: string }): Song {
  return {
    id: `song-lib-${entry.id}`,
    title: entry.title.trim().slice(0, 80) || 'Song',
    emoji: '🎵',
    blobId: '',
    bytes: 0,
    libraryId: entry.id,
    ...(entry.artist?.trim() ? { artist: entry.artist.trim().slice(0, 80) } : {}),
  };
}
