import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createPageWithButtons,
  exportMyPageText,
  gridSizeFor,
  importMyPageFromText,
  MAX_PAGE_BUTTONS,
  suggestedPageFileName,
} from './pages';
import { createMyPage, getBoard, getMyPages, resetDBConnectionForTests, updateBoard } from './db';

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
});

describe('sharing a page between devices', () => {
  it('a page exported from one device arrives on another as a new, matching page (words, places, stages, focus marks)', async () => {
    const page = await createMyPage('Zoo trip');
    const board = (await getBoard(page.boardId))!;
    await updateBoard({
      ...board,
      grid: { rows: 2, columns: 2, order: [['lion', 'seal'], [null, null]] },
      buttons: [
        { id: 'lion', label: 'lion', image: { kind: 'emoji', char: '🦁' }, background_color: '#fed7aa', stage: 2 },
        { id: 'seal', label: 'seal', vocalization: 'a seal', image: { kind: 'emoji', char: '🦭' }, target: true },
      ],
    });
    const text = await exportMyPageText(page);
    expect(text).not.toBeNull();

    // A different device: nothing there yet.
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    const result = await importMyPageFromText(text!);
    if (!result.ok) throw new Error(result.error);

    expect(await getMyPages()).toEqual([result.page]);
    expect(result.page.name).toBe('Zoo trip');
    const imported = (await getBoard(result.page.boardId))!;
    expect(imported.grid).toEqual({ rows: 2, columns: 2, order: [['lion', 'seal'], [null, null]] });
    expect(imported.buttons[0]).toMatchObject({ label: 'lion', stage: 2, image: { kind: 'emoji', char: '🦁' } });

    expect(imported.buttons[1]).toMatchObject({
      label: 'seal',
      vocalization: 'a seal',
      target: true,
      image: { kind: 'emoji', char: '🦭' },
    });
    // Pictures and recordings travelling in the file are covered by the
    // converter's tests and by the end-to-end test: this environment's fake
    // database cannot hold a real blob.
  });

  it('importing the same file twice makes two pages, and never replaces one', async () => {
    const page = await createMyPage('Topic');
    const text = (await exportMyPageText(page))!;
    await importMyPageFromText(text);
    await importMyPageFromText(text);
    expect((await getMyPages()).map((p) => p.name)).toEqual(['Topic', 'Topic', 'Topic']);
  });

  it('a file that is not a page changes nothing', async () => {
    const result = await importMyPageFromText('not a page');
    expect(result.ok).toBe(false);
    expect(await getMyPages()).toEqual([]);
  });

  it('suggests a tidy file name', () => {
    expect(suggestedPageFileName({ id: '1', boardId: 'b', name: "Sam's Zoo Trip!" })).toBe('sam-s-zoo-trip.obf');
    expect(suggestedPageFileName({ id: '1', boardId: 'b', name: '???' })).toBe('page.obf');
  });
});

describe('making a page with buttons already on it', () => {
  it('picks the smallest grid that fits', () => {
    expect([1, 4, 5, 9, 10, 16, 17, 25].map(gridSizeFor)).toEqual([2, 2, 3, 3, 4, 4, 5, 5]);
  });

  it('puts the buttons in reading order from the top left, with what each says and its picture', async () => {
    const page = await createPageWithButtons('Snacks', [
      { label: 'apple', emoji: '🍎', says: 'I want an apple' },
      { label: 'milk', emoji: '🥛', colour: 'doing' },
      { label: 'tea', says: 'tea' },
    ]);
    expect((await getMyPages()).map((p) => p.name)).toEqual(['Snacks']);

    const board = (await getBoard(page.boardId))!;
    expect(board.grid).toEqual({ rows: 2, columns: 2, order: [['button-1', 'button-2'], ['button-3', null]] });
    expect(board.buttons[0]).toMatchObject({
      label: 'apple',
      vocalization: 'I want an apple',
      image: { kind: 'emoji', char: '🍎' },
      background_color: '#fed7aa',
    });
    expect(board.buttons[1]).toMatchObject({ background_color: '#bbf7d0' });
    // Saying the same thing as the label needs no extra field.
    expect(board.buttons[2]!.vocalization).toBeUndefined();
  });

  it('keeps to the biggest page this app has, rather than losing the rest silently into a broken grid', async () => {
    const many = Array.from({ length: MAX_PAGE_BUTTONS + 5 }, (_, i) => ({ label: `word ${i}` }));
    const page = await createPageWithButtons('Lots', many);
    const board = (await getBoard(page.boardId))!;
    expect(board.buttons).toHaveLength(MAX_PAGE_BUTTONS);
    expect(board.grid.rows).toBe(5);
  });
});
