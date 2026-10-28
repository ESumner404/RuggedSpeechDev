import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MoviesScreen } from './MoviesScreen';
import { MoviesTab } from './MoviesTab';
import { formatLength, isMovieList, movieFromPick } from './movies';
import { MAX_VIDEO_BYTES, storeVideos, titleFromFileName } from './webLibrary';
import { getMovieFile, moviesSetting, resetDBConnectionForTests, saveMovieFile } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('movie details', () => {
  it('writes a length in words', () => {
    expect(formatLength(45)).toBe('45s');
    expect(formatLength(12 * 60)).toBe('12m');
    expect(formatLength(3900)).toBe('1h 5m');
    expect(formatLength(0)).toBe('');
  });

  it('makes a movie of what the device chose, with a name always', () => {
    expect(movieFromPick({ id: 'a.mov', title: '  Holiday  ', bytes: 5, seconds: 9 })).toEqual({ id: 'a.mov', title: 'Holiday', emoji: '🎬', bytes: 5, seconds: 9 });
    expect(movieFromPick({ id: 'a.mov', title: ' ', bytes: 5, seconds: 9 }).title).toBe('Movie');
  });

  it('checks a saved list before using it', () => {
    expect(isMovieList([{ id: 'a', title: 'A', emoji: '🎬', bytes: 1, seconds: 2 }])).toBe(true);
    expect(isMovieList([{ id: 'a' }])).toBe(false);
  });
});

describe('movies on the device', () => {
  let container: HTMLElement;
  const library = {
    pick: vi.fn(),
    play: vi.fn(),
    remove: vi.fn(async () => undefined),
  };

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    moviesSetting.reset();
    library.pick.mockReset();
    library.play.mockReset();
    library.remove.mockClear();
    (window as unknown as { myWords: unknown }).myWords = { movies: library };
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
    delete (window as unknown as { myWords?: unknown }).myWords;
  });

  it('adds movies from Photos in Parent Mode, and removes one from the device when taken away', async () => {
    library.pick.mockResolvedValue([{ id: 'a.mov', title: 'Holiday', bytes: 20_000_000, seconds: 90 }]);
    render(<MoviesTab />, container);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add from Photos')!.click());
    await waitFor(() => moviesSetting.signal.value.length === 1);
    expect(library.pick).toHaveBeenCalledWith('photos');
    await waitFor(() => container.textContent?.includes('Added the movie') === true);
    await act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Remove Holiday"]')!.click());
    await waitFor(() => moviesSetting.signal.value.length === 0);
    await waitFor(() => library.remove.mock.calls.length > 0);
    expect(library.remove).toHaveBeenCalledWith('a.mov');
  });

  it('plays a movie when its tile is pressed, and says so kindly when the file has gone', async () => {
    await moviesSetting.set([{ id: 'a.mov', title: 'Holiday', emoji: '🎬', bytes: 1, seconds: 90 }]);
    library.play.mockResolvedValue(false);
    render(<MoviesScreen />, container);
    await act(() => container.querySelector<HTMLButtonElement>('.movies-screen__tile')!.click());
    expect(library.play).toHaveBeenCalledWith('a.mov');
    await waitFor(() => container.textContent?.includes('not on this device any more') === true);
  });

  it('says there are none yet, and plays nothing by itself', () => {
    render(<MoviesScreen />, container);
    expect(container.textContent).toContain('No movies yet');
    expect(library.play).not.toHaveBeenCalled();
  });
});

describe('videos on a computer (no device player)', () => {
  let container: HTMLElement;
  const created: string[] = [];
  const revoked: string[] = [];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    moviesSetting.reset();
    (window as unknown as { myWords: unknown }).myWords = {};
    created.length = 0;
    revoked.length = 0;
    URL.createObjectURL = () => {
      const url = `blob:test-${created.length}`;
      created.push(url);
      return url;
    };
    URL.revokeObjectURL = (url: string) => {
      revoked.push(url);
    };
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
    delete (window as unknown as { myWords?: unknown }).myWords;
  });

  it('names a video from its file', () => {
    expect(titleFromFileName('Holiday_at_the beach.mp4')).toBe('Holiday at the beach');
  });

  it('keeps each video in the app, and leaves out one that is too big', async () => {
    const small = new File(['abc'], 'Trip.mp4', { type: 'video/mp4' });
    const big = Object.defineProperty(new File(['x'], 'Huge.mp4', { type: 'video/mp4' }), 'size', { value: MAX_VIDEO_BYTES + 1 });
    const result = await storeVideos([small, big]);
    expect(result.tooBig).toBe(1);
    expect(result.movies).toHaveLength(1);
    expect(result.movies[0]).toMatchObject({ title: 'Trip', bytes: 3 });
    expect(await getMovieFile(result.movies[0]!.id)).toBeDefined();
  });

  it('plays in the page, only once the tile is pressed, with its own controls, and lets go when closed', async () => {
    await saveMovieFile('m1', new Blob(['video'], { type: 'video/mp4' }));
    await moviesSetting.set([{ id: 'm1', title: 'Trip', emoji: '🎬', bytes: 5, seconds: 30 }]);
    render(<MoviesScreen />, container);
    expect(container.querySelector('video')).toBeNull();
    await act(() => container.querySelector<HTMLButtonElement>('.movies-screen__tile')!.click());
    await waitFor(() => container.querySelector('video') !== null);
    const video = container.querySelector('video')!;
    expect(video.hasAttribute('controls')).toBe(true);
    expect(video.hasAttribute('autoplay')).toBe(false);
    expect(video.getAttribute('src')).toBe(created[0]);
    await act(() => container.querySelector<HTMLButtonElement>('.movies-player__close')!.click());
    expect(container.querySelector('video')).toBeNull();
    expect(revoked).toContain(created[0]);
  });

  it('says kindly when the file has gone', async () => {
    await moviesSetting.set([{ id: 'gone', title: 'Gone', emoji: '🎬', bytes: 5, seconds: 30 }]);
    render(<MoviesScreen />, container);
    await act(() => container.querySelector<HTMLButtonElement>('.movies-screen__tile')!.click());
    await waitFor(() => container.textContent?.includes('not on this device any more') === true);
  });

  it('removes the stored video when it is taken away in Parent Mode', async () => {
    await saveMovieFile('m2', new Blob(['v']));
    await moviesSetting.set([{ id: 'm2', title: 'Trip', emoji: '🎬', bytes: 1, seconds: 3 }]);
    render(<MoviesTab />, container);
    await act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Remove Trip"]')!.click());
    await waitFor(() => moviesSetting.signal.value.length === 0);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(await getMovieFile('m2')).toBeUndefined();
  });
});
