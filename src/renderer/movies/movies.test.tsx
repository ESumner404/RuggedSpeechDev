import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MoviesScreen } from './MoviesScreen';
import { MoviesTab } from './MoviesTab';
import { formatLength, isMovieList, movieFromPick } from './movies';
import { moviesSetting, resetDBConnectionForTests } from '../store/db';

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
