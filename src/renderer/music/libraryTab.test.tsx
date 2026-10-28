import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MusicTab } from '../parent/MusicTab';
import { playlistsSetting, resetDBConnectionForTests, songsSetting } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

const everything = Array.from({ length: 300 }, (_, i) => ({ id: `${1000 + i}`, title: `Song ${i}`, artist: i % 2 ? 'Odd' : 'Even' }));

describe('choosing from the device’s Music library', () => {
  let container: HTMLElement;
  let list: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    songsSetting.reset();
    playlistsSetting.reset();
    list = vi.fn(async (options?: { playlistId?: string; search?: string }) => {
      if (options?.playlistId === '7') return everything.slice(0, 3);
      if (options?.search) return everything.filter((s) => s.title.toLowerCase().includes(options.search!.toLowerCase()) || s.artist.toLowerCase().includes(options.search!.toLowerCase()));
      return everything;
    });
    (window as unknown as { myWords: unknown }).myWords = {
      music: {
        access: vi.fn(async () => 'granted'),
        list,
        playlists: vi.fn(async () => [{ id: '7', name: 'Bedtime', count: 3 }]),
        play: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        stop: vi.fn(),
        state: vi.fn(),
      },
    };
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
    delete (window as unknown as { myWords?: unknown }).myWords;
  });

  const open = async (): Promise<void> => {
    render(<MusicTab />, container);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add songs from the Music library')!.click());
    await waitFor(() => container.querySelectorAll('.music-tab__library-list li').length > 0);
  };

  it('lists a few hundred songs, and adds every one shown in one go', async () => {
    await open();
    expect(container.querySelectorAll('.music-tab__library-list li').length).toBe(300);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add all 300 shown')!.click());
    await waitFor(() => songsSetting.signal.value.length === 300);
    expect(songsSetting.signal.value[0]).toMatchObject({ libraryId: '1000', blobId: '' });
  });

  it('adds only the songs ticked, and does not add one twice', async () => {
    await open();
    const boxes = container.querySelectorAll<HTMLInputElement>('.music-tab__library-list input');
    for (const index of [0, 2]) {
      await act(() => {
        boxes[index]!.checked = true;
        boxes[index]!.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add 2 ticked')!.click());
    await waitFor(() => songsSetting.signal.value.length === 2);
    expect(songsSetting.signal.value.map((s) => s.libraryId)).toEqual(['1000', '1002']);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add all 300 shown')!.click());
    await waitFor(() => songsSetting.signal.value.length === 300);
    expect(new Set(songsSetting.signal.value.map((s) => s.libraryId)).size).toBe(300);
  });

  it('searches by song or artist', async () => {
    await open();
    const input = container.querySelector<HTMLInputElement>('input[type="search"]')!;
    await act(() => {
      input.value = 'odd';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => container.querySelectorAll('.music-tab__library-list li').length === 150);
    expect(list).toHaveBeenLastCalledWith({ search: 'odd' });
  });

  it('makes one of this app’s playlists from one of the device’s, with its songs', async () => {
    await open();
    const select = container.querySelector<HTMLSelectElement>('.music-tab__library-tools select')!;
    await act(() => {
      select.value = '7';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => container.querySelectorAll('.music-tab__library-list li').length === 3);
    await act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Make a playlist from this one')!.click());
    await waitFor(() => playlistsSetting.signal.value.length === 1);
    const [made] = playlistsSetting.signal.value;
    expect(made!.name).toBe('Bedtime');
    expect(made!.songIds).toHaveLength(3);
    expect(songsSetting.signal.value).toHaveLength(3);
  });
});
