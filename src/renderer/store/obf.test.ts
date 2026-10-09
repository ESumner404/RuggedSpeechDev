import { describe, expect, it } from 'vitest';
import { boardToObf, obfToPage, obfToText, type ObfImportStorage } from './obf';
import type { Board } from './types';

// A real 1x1 PNG, so the picture survives a trip through a data URI.
const PNG_BYTES = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='),
  (c) => c.charCodeAt(0),
);

// Which kind of Blob comes back depends on the version of Node: a native one has
// arrayBuffer(), and jsdom's has not and needs FileReader (which refuses a native one).
async function bytesOf(blob: Blob): Promise<Uint8Array> {
  if (typeof blob.arrayBuffer === 'function') return new Uint8Array(await blob.arrayBuffer());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.readAsArrayBuffer(blob);
  });
}

function fakeStorage() {
  const photos: Blob[] = [];
  const clips: Blob[] = [];
  const storage: ObfImportStorage = {
    savePhoto: async (blob) => {
      photos.push(blob);
      return `new-photo-${photos.length}`;
    },
    saveClip: async (blob) => {
      clips.push(blob);
      return `new-clip-${clips.length}`;
    },
  };
  return { storage, photos, clips };
}

const BOARD: Board = {
  id: 'mypage-1',
  name: 'Zoo trip',
  grid: {
    rows: 2,
    columns: 3,
    order: [
      ['lion', 'seal', null],
      [null, 'owl', null],
    ],
  },
  buttons: [
    {
      id: 'lion',
      label: 'lion',
      vocalization: 'I saw a lion',
      image: { kind: 'emoji', char: '🦁' },
      background_color: '#fed7aa',
      stage: 2,
      target: true,
    },
    { id: 'seal', label: 'seal', image: { kind: 'photo', blobId: 'p1' }, voiceClipBlobId: 'c1' },
    { id: 'owl', label: 'owl', hidden: true },
  ],
};

const sources = {
  getPhoto: async (id: string) => (id === 'p1' ? new Blob([PNG_BYTES], { type: 'image/png' }) : undefined),
  getClip: async (id: string) => (id === 'c1' ? new Blob(['voice'], { type: 'audio/webm' }) : undefined),
};

describe('exporting a page', () => {
  it('writes standard Open Board Format with the extras as ext_ fields', async () => {
    const obf = await boardToObf(BOARD, sources);
    expect(obf).toMatchObject({
      format: 'open-board-0.1',
      name: 'Zoo trip',
      grid: { rows: 2, columns: 3, order: BOARD.grid.order },
    });
    expect(obf.buttons[0]).toEqual({
      id: 'lion',
      label: 'lion',
      vocalization: 'I saw a lion',
      background_color: '#fed7aa',
      ext_my_speech_emoji: '🦁',
      ext_my_speech_stage: 2,
      ext_my_speech_target: true,
    });
    expect(obf.buttons[2]).toMatchObject({ id: 'owl', hidden: true });
    expect(obf.images).toHaveLength(1);
    expect(obf.images[0]!.data.startsWith('data:image/png;base64,')).toBe(true);
    expect(obf.sounds[0]!.data.startsWith('data:audio/webm')).toBe(true);
  });

  it('leaves out a picture that cannot be found rather than failing', async () => {
    const obf = await boardToObf(
      { ...BOARD, buttons: [{ id: 'x', label: 'x', image: { kind: 'photo', blobId: 'gone' } }] },
      sources,
    );
    expect(obf.images).toEqual([]);
    expect(obf.buttons[0]!.image_id).toBeUndefined();
  });

  it('never exports a folder link, since the other board would not be in the file', async () => {
    const obf = await boardToObf(
      { ...BOARD, buttons: [{ id: 'f', label: 'Food', load_board: { id: 'food' } }] },
      sources,
    );
    expect(obf.buttons[0]).toEqual({ id: 'f', label: 'Food' });
  });
});

describe('importing a page', () => {
  it("reads back what this app wrote: words, places, pictures, voices, stages and focus marks", async () => {
    const text = obfToText(await boardToObf(BOARD, sources));
    const { storage, photos, clips } = fakeStorage();
    const result = await obfToPage(text, storage);
    if (!result.ok) throw new Error(result.error);

    expect(result.name).toBe('Zoo trip');
    expect(result.grid).toEqual({ rows: 2, columns: 3, order: BOARD.grid.order });
    expect(result.notes).toEqual([]);

    const byId = Object.fromEntries(result.buttons.map((b) => [b.id, b]));
    expect(byId['lion']).toEqual({
      id: 'lion',
      label: 'lion',
      vocalization: 'I saw a lion',
      image: { kind: 'emoji', char: '🦁' },
      background_color: '#fed7aa',
      stage: 2,
      target: true,
    });
    expect(byId['seal']).toMatchObject({ image: { kind: 'photo', blobId: 'new-photo-1' }, voiceClipBlobId: 'new-clip-1' });
    expect(byId['owl']?.hidden).toBe(true);

    expect(photos).toHaveLength(1);
    expect(photos[0]!.type).toBe('image/png');
    expect(await bytesOf(photos[0]!)).toEqual(PNG_BYTES);
    expect(clips).toHaveLength(1);
  });

  it('takes a page from other software, keeping what fits and saying what it dropped', async () => {
    const { storage } = fakeStorage();
    const foreign = {
      format: 'open-board-0.1',
      id: 'their-board',
      name: 'Snack time',
      locale: 'en_GB',
      grid: { rows: 2, columns: 2, order: [['a', 'b'], ['c', null]] },
      buttons: [
        { id: 'a', label: 'crisps', background_color: 'rgb(255, 204, 0)', image_id: 'remote' },
        { id: 'b', label: 'more', background_color: '#bbf7d0', load_board: { id: 'other', name: 'More' } },
        { id: 'c', label: 'drink', vocalization: 'a drink please' },
      ],
      images: [{ id: 'remote', url: 'https://example.com/crisps.png', content_type: 'image/png' }],
    };
    const result = await obfToPage(JSON.stringify(foreign), storage);
    if (!result.ok) throw new Error(result.error);

    const byId = Object.fromEntries(result.buttons.map((b) => [b.id, b]));
    expect(byId['a']).toEqual({ id: 'a', label: 'crisps' }); // an unfamiliar colour and a web-only picture are not kept
    expect(byId['b']).toEqual({ id: 'b', label: 'more', background_color: '#bbf7d0' });
    expect(byId['c']).toEqual({ id: 'c', label: 'drink', vocalization: 'a drink please' });
    expect(result.notes).toHaveLength(2);
    expect(result.notes.join(' ')).toContain('opened other boards');
    expect(result.notes.join(' ')).toContain('Colours from the other app');
  });

  it('never fetches anything from the web (invariant I1)', async () => {
    const { storage, photos } = fakeStorage();
    const result = await obfToPage(
      JSON.stringify({
        format: 'open-board-0.1',
        name: 'x',
        grid: { rows: 2, columns: 2, order: [['a', null], [null, null]] },
        buttons: [{ id: 'a', label: 'a', image_id: 'i' }],
        images: [{ id: 'i', url: 'https://example.com/a.png', content_type: 'image/png' }],
      }),
      storage,
    );
    expect(result.ok).toBe(true);
    expect(photos).toHaveLength(0);
  });

  it('raises a one-row page to the smallest grid this app has, and places buttons the file left out', async () => {
    const { storage } = fakeStorage();
    const result = await obfToPage(
      JSON.stringify({
        format: 'open-board-0.1',
        name: 'Row',
        grid: { rows: 1, columns: 3, order: [['a', null, null]] },
        buttons: [
          { id: 'a', label: 'a' },
          { id: 'b', label: 'b' },
        ],
      }),
      storage,
    );
    if (!result.ok) throw new Error(result.error);
    expect(result.grid).toEqual({ rows: 2, columns: 3, order: [['a', 'b', null], [null, null, null]] });
  });

  it('refuses a page larger than this app supports, with the size in the message', async () => {
    const { storage } = fakeStorage();
    const result = await obfToPage(
      JSON.stringify({ format: 'open-board-0.1', name: 'Big', grid: { rows: 6, columns: 8, order: [] }, buttons: [] }),
      storage,
    );
    expect(result).toEqual({ ok: false, error: "This page is 8 by 6. This app's pages go up to 5 by 5." });
  });

  it('leaves out buttons that do not fit rather than overwriting others, and says so', async () => {
    const { storage } = fakeStorage();
    const buttons = Array.from({ length: 6 }, (_, i) => ({ id: `b${i}`, label: `b${i}` }));
    const result = await obfToPage(
      JSON.stringify({ format: 'open-board-0.1', name: 'Full', grid: { rows: 2, columns: 2, order: [] }, buttons }),
      storage,
    );
    if (!result.ok) throw new Error(result.error);
    expect(result.buttons).toHaveLength(4);
    expect(result.notes.join(' ')).toContain('2 buttons did not fit');
  });

  it('copes with duplicate button ids', async () => {
    const { storage } = fakeStorage();
    const result = await obfToPage(
      JSON.stringify({
        format: 'open-board-0.1',
        name: 'Dupes',
        grid: { rows: 2, columns: 2, order: [['a', 'a'], [null, null]] },
        buttons: [
          { id: 'a', label: 'one' },
          { id: 'a', label: 'two' },
        ],
      }),
      storage,
    );
    if (!result.ok) throw new Error(result.error);
    expect(new Set(result.buttons.map((b) => b.id)).size).toBe(2);
    expect(result.buttons.map((b) => b.label).sort()).toEqual(['one', 'two']);
  });

  it.each([
    ['not JSON', 'hello'],
    ['JSON that is not a board', '{"hello":"world"}'],
    ['a different format', '{"format":"something-else","grid":{"rows":2,"columns":2},"buttons":[]}'],
    ['a board with no buttons list', '{"format":"open-board-0.1","grid":{"rows":2,"columns":2}}'],
  ])('refuses %s with a plain message', async (_name, text) => {
    const result = await obfToPage(text, fakeStorage().storage);
    expect(result).toEqual({ ok: false, error: "This file isn't a page this app can read." });
  });

  it('refuses a file far too big to be a page', async () => {
    const result = await obfToPage('x'.repeat(60_000_001), fakeStorage().storage);
    expect(result).toEqual({ ok: false, error: 'That file is too big to be a page.' });
  });
});
