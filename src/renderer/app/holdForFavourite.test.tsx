import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeelingsHelpScreen } from './FeelingsHelpScreen';
import { FavouritesScreen } from './FavouritesScreen';
import { favouriteNotice } from '../board/favouriteNotice';
import { getFavourites, resetDBConnectionForTests } from '../store/db';

// jsdom has no pointer-event handler properties, so Preact listens under the camel-cased names; a real browser uses the lower-case ones.
const fire = (target: Element, type: 'down' | 'up') => {
  for (const name of type === 'down' ? ['pointerdown', 'PointerDown'] : ['pointerup', 'PointerUp']) {
    target.dispatchEvent(new Event(name, { bubbles: true }));
  }
};

const hold = async (button: Element, ms = 800) => {
  act(() => {
    fire(button, 'down');
  });
  await new Promise((resolve) => setTimeout(resolve, ms));
  act(() => {
    fire(button, 'up');
    button.dispatchEvent(new Event('click', { bubbles: true }));
  });
};

describe('holding a button to add it to Favourites', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    favouriteNotice.value = '';
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {};
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = { speak: () => {}, cancel: () => {}, getVoices: () => [] };
  });

  it('works on a Help button, and says so on the screen', async () => {
    const container = document.createElement('div');
    render(<FeelingsHelpScreen tab="help" onTabChange={() => {}} />, container);
    const button = container.querySelector('.feelings-help-screen__grid--help .board-button')!;
    const label = button.querySelector('.board-button__label')!.textContent!.trim();
    await hold(button);
    expect((await getFavourites()).some((item) => item.label === label)).toBe(true);
    expect(favouriteNotice.value).toBe(`${label} added to Favourites`);
  });

  it('works on a Feelings button', async () => {
    const container = document.createElement('div');
    render(<FeelingsHelpScreen tab="feelings" onTabChange={() => {}} />, container);
    const button = container.querySelector('.feelings-help-screen__grid .board-button')!;
    const label = button.querySelector('.board-button__label')!.textContent!.trim();
    await hold(button);
    expect((await getFavourites()).some((item) => item.label === label)).toBe(true);
  });

  it('does nothing on the Favourites page, where the word is already there', async () => {
    const { saveFavourite } = await import('../store/db');
    await saveFavourite({ id: 'x', label: 'banana', kind: 'word' } as never);
    const container = document.createElement('div');
    render(<FavouritesScreen tab="favourites" onTabChange={() => {}} />, container);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const button = container.querySelector('.favourites-screen__grid .board-button')!;
    expect(button).not.toBeNull();
    await hold(button);
    expect(favouriteNotice.value).toBe('');
  });
});
