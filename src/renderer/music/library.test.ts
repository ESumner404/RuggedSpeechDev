import { describe, expect, it } from 'vitest';
import { isSongList, songFromLibrary } from './songs';

describe('songs from the device’s Music library', () => {
  it('keeps only the device’s reference, never the audio', () => {
    const song = songFromLibrary({ id: '987654321', title: '  Twinkle Twinkle  ', artist: ' Nursery ' });
    expect(song).toMatchObject({ libraryId: '987654321', blobId: '', bytes: 0, title: 'Twinkle Twinkle', artist: 'Nursery', emoji: '🎵' });
    expect(song.id).toBe('song-lib-987654321');
  });

  it('copes with a missing title or artist', () => {
    const song = songFromLibrary({ id: '1', title: '   ' });
    expect(song.title).toBe('Song');
    expect('artist' in song).toBe(false);
  });

  it('is a valid song list alongside songs that are files, and nothing else is', () => {
    const file = { id: 'a', title: 'A', emoji: '🎵', blobId: 'x', bytes: 5 };
    expect(isSongList([file, songFromLibrary({ id: '1', title: 'B', artist: 'C' })])).toBe(true);
    expect(isSongList([{ ...file, libraryId: 5 }])).toBe(false);
    expect(isSongList([{ ...file, artist: 7 }])).toBe(false);
  });
});
