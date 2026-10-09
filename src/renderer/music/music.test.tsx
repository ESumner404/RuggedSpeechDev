import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MusicScreen } from './MusicScreen';
import { MusicTab } from '../parent/MusicTab';
import { MAX_SONG_BYTES, formatSize, isAudioFile, isPlaylistList, isSongList, songsInPlaylist, titleFromFile } from './songs';
import { playlistsSetting, resetDBConnectionForTests, songsSetting } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('song files', () => {
  it('recognises sound files by type or by ending', () => {
    expect(isAudioFile({ name: 'a.mp3', type: '' })).toBe(true);
    expect(isAudioFile({ name: 'a.M4A', type: '' })).toBe(true);
    expect(isAudioFile({ name: 'noext', type: 'audio/mpeg' })).toBe(true);
    expect(isAudioFile({ name: 'photo.jpg', type: 'image/jpeg' })).toBe(false);
    expect(isAudioFile({ name: 'song.mp3.exe', type: 'application/x-msdownload' })).toBe(false);
  });

  it('makes a readable name from a file name', () => {
    expect(titleFromFile('01 - Twinkle_Twinkle.mp3')).toBe('Twinkle Twinkle');
    expect(titleFromFile('Old MacDonald.wav')).toBe('Old MacDonald');
    expect(titleFromFile('3.mp3')).toBe('3');
  });

  it('shows sizes in words', () => {
    expect(formatSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    expect(formatSize(300)).toBe('1 KB');
  });

  it('checks a saved list before using it', () => {
    expect(isSongList([{ id: 'a', title: 'A', emoji: '🎵', blobId: 'x', bytes: 5 }])).toBe(true);
    expect(isSongList([{ id: 'a' }])).toBe(false);
    expect(isSongList('nope')).toBe(false);
  });
});

describe('Music', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('says there are no songs yet, and where to add them', () => {
    render(<MusicScreen />, container);
    expect(container.textContent).toContain('No songs yet');
  });

  it('shows a tile for each song, in order, and plays nothing until one is pressed', async () => {
    await songsSetting.set([
      { id: 'a', title: 'Twinkle', emoji: '⭐', blobId: 'x', bytes: 1 },
      { id: 'b', title: 'Old MacDonald', emoji: '🐑', blobId: 'y', bytes: 1 },
    ]);
    render(<MusicScreen />, container);
    expect(Array.from(container.querySelectorAll('.music-screen__title')).map((t) => t.textContent)).toEqual(['Twinkle', 'Old MacDonald']);
    expect(container.querySelector('.music-screen__now')!.textContent).toBe('Press a song to play it.');
    expect((container.querySelectorAll('.music-screen__bar button')[0] as HTMLButtonElement).disabled).toBe(true);
  });

  it('says so plainly when a song cannot be found', async () => {
    await songsSetting.set([{ id: 'a', title: 'Gone', emoji: '🎵', blobId: 'missing', bytes: 1 }]);
    render(<MusicScreen />, container);
    act(() => container.querySelector<HTMLButtonElement>('.music-screen__song')!.click());
    await waitFor(() => container.querySelector('.music-screen__now')!.textContent === 'That song could not be found.');
  });

  describe('the Parent Mode tab', () => {
    beforeEach(() => {
      render(<MusicTab />, container);
    });

    const choose = (files: File[]) =>
      act(() => {
        const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
        Object.defineProperty(input, 'files', { value: files, configurable: true });
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

    it('adds a song from a file, naming it from the file', async () => {
      choose([new File(['x'], '02 - Row_Row_Row.mp3', { type: 'audio/mpeg' })]);
      await waitFor(() => songsSetting.signal.value.length === 1);
      expect(songsSetting.signal.value[0]!.title).toBe('Row Row Row');
      await waitFor(() => container.querySelector('.music-tab__song') !== null);
    });

    it('turns away a file that is not a sound, or too big, and says why', async () => {
      choose([new File(['x'], 'photo.jpg', { type: 'image/jpeg' })]);
      await waitFor(() => container.querySelector('.music-tab__message')!.textContent!.includes('not a sound file'));
      expect(songsSetting.signal.value).toEqual([]);

      const big = new File(['x'], 'huge.mp3', { type: 'audio/mpeg' });
      Object.defineProperty(big, 'size', { value: MAX_SONG_BYTES + 1 });
      choose([big]);
      await waitFor(() => container.querySelector('.music-tab__message')!.textContent!.includes('bigger than'));
      expect(songsSetting.signal.value).toEqual([]);
    });

    it('renames, reorders and removes songs', async () => {
      await songsSetting.set([
        { id: 'a', title: 'One', emoji: '🎵', blobId: 'x', bytes: 1 },
        { id: 'b', title: 'Two', emoji: '🎵', blobId: 'y', bytes: 1 },
      ]);
      await waitFor(() => container.querySelectorAll('.music-tab__song').length === 2);
      act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Move Two up"]')!.click());
      await waitFor(() => songsSetting.signal.value[0]!.id === 'b');
      const name = container.querySelector<HTMLInputElement>('input[aria-label="Name of Two"]')!;
      act(() => {
        name.value = 'Twinkle';
        name.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await waitFor(() => songsSetting.signal.value[0]!.title === 'Twinkle');
      act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Remove Twinkle"]')!.click());
      await waitFor(() => songsSetting.signal.value.length === 1);
      expect(songsSetting.signal.value[0]!.id).toBe('a');
    });

    it('is clear that there is no streaming', () => {
      expect(container.textContent).toContain('There is no Spotify or Apple Music');
    });
  });

  describe('playlists', () => {
    const songs = [
      { id: 'a', title: 'One', emoji: '🎵', blobId: 'x', bytes: 1 },
      { id: 'b', title: 'Two', emoji: '🎵', blobId: 'y', bytes: 1 },
      { id: 'c', title: 'Three', emoji: '🎵', blobId: 'z', bytes: 1 },
    ];

    it('checks a saved playlist before using it, and leaves out a song that has gone', () => {
      expect(isPlaylistList([{ id: 'p', name: 'Bed', emoji: '🌙', songIds: ['a'] }])).toBe(true);
      expect(isPlaylistList([{ id: 'p', name: 'Bed', emoji: '🌙', songIds: [3] }])).toBe(false);
      expect(isPlaylistList({})).toBe(false);
      expect(songsInPlaylist({ id: 'p', name: 'Bed', emoji: '🌙', songIds: ['c', 'gone', 'a'] }, songs).map((s) => s.title)).toEqual(['Three', 'One']);
    });

    it('the child sees no choices until an adult has made a playlist, then Everything comes first', async () => {
      await songsSetting.set(songs);
      render(<MusicScreen />, container);
      expect(container.querySelector('.music-screen__lists')).toBeNull();
      await playlistsSetting.set([{ id: 'p', name: 'Bedtime', emoji: '🌙', songIds: ['c', 'a'] }]);
      await waitFor(() => container.querySelector('.music-screen__lists') !== null);
      const names = Array.from(container.querySelectorAll('.music-screen__list')).map((b) => b.textContent?.trim());
      expect(names).toEqual(['🎵 Everything', '🌙 Bedtime', 'Play all']);
      // Everything shows every song in the usual order
      expect(Array.from(container.querySelectorAll('.music-screen__title')).map((t) => t.textContent)).toEqual(['One', 'Two', 'Three']);
      act(() => container.querySelectorAll<HTMLButtonElement>('.music-screen__list')[1]!.click());
      expect(Array.from(container.querySelectorAll('.music-screen__title')).map((t) => t.textContent)).toEqual(['Three', 'One']);
      expect(container.querySelector('.music-screen__now')!.textContent).toBe('Press a song to play it.');
    });

    it('an adult makes a playlist, adds songs in order, and removing a song takes it out of every list', async () => {
      await songsSetting.set(songs);
      render(<MusicTab />, container);
      await waitFor(() => container.querySelectorAll('.music-tab__song').length === 3);
      const input = container.querySelector<HTMLInputElement>('input[aria-label="Name of the new playlist"]')!;
      act(() => {
        input.value = 'Car journey';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      act(() => {
        container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
      await waitFor(() => playlistsSetting.signal.value.length === 1);
      for (const title of ['Two', 'One']) {
        await waitFor(() => container.querySelector('select[aria-label="Add a song to Car journey"]') !== null);
        const select = container.querySelector<HTMLSelectElement>('select[aria-label="Add a song to Car journey"]')!;
        const option = Array.from(select.options).find((o) => o.textContent === title)!;
        act(() => {
          select.value = option.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await waitFor(() => playlistsSetting.signal.value[0]!.songIds.length === (title === 'Two' ? 1 : 2));
      }
      expect(playlistsSetting.signal.value[0]!.songIds).toEqual(['b', 'a']);
      act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Move One up in Car journey"]')!.click());
      await waitFor(() => playlistsSetting.signal.value[0]!.songIds[0] === 'a');
      act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Remove Two"]')!.click());
      await waitFor(() => songsSetting.signal.value.length === 2);
      await waitFor(() => playlistsSetting.signal.value[0]!.songIds.length === 1);
      expect(playlistsSetting.signal.value[0]!.songIds).toEqual(['a']);
    });
  });
});
