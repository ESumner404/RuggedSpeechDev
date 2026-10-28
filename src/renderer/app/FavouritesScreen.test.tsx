import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { beforeEach, describe, expect, it } from 'vitest';
import { FavouritesScreen } from './FavouritesScreen';
import { resetDBConnectionForTests } from '../store/db';

describe('FavouritesScreen', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
  });

  it('says how to add a word, even when there are none yet', () => {
    const container = document.createElement('div');
    render(<FavouritesScreen tab="favourites" onTabChange={() => {}} />, container);
    expect(container.querySelector('.favourites-screen__tip')?.textContent).toContain('press and hold');
  });

  it('does not show that line on the Recent tab', () => {
    const container = document.createElement('div');
    render(<FavouritesScreen tab="recent" onTabChange={() => {}} />, container);
    expect(container.querySelector('.favourites-screen__tip')).toBeNull();
  });
});
