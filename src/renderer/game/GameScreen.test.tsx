import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GameScreen } from './GameScreen';
import { getRecentEntries, resetDBConnectionForTests, setRecentEnabled } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('GameScreen', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = [];
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: { text: string }) => spoken.push(utterance.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      constructor(public text: string) {}
    };
    container = document.createElement('div');
    render(<GameScreen />, container);
    await waitFor(() => container.querySelector('.game-option') !== null);
  });

  afterEach(() => {
    render(null, container);
  });

  const options = () => Array.from(container.querySelectorAll<HTMLButtonElement>('.game-option'));
  const labels = () => options().map((o) => o.textContent);
  const message = () => container.querySelector('.game-screen__message')!.textContent;
  const button = (text: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('.game-screen__button')).find((b) => b.textContent === text)!;

  /** Finds which option is right by pressing "Hear the word" and reading what was said. */
  function rightOption(): HTMLButtonElement {
    act(() => button('Hear the word').click());
    const word = spoken[spoken.length - 1];
    return options().find((o) => o.textContent === word)!;
  }

  it('shows four words and says nothing until something is pressed', () => {
    expect(options()).toHaveLength(4);
    expect(message()).toBe('Which word is this?');
    expect(spoken).toEqual([]);
  });

  it('says each word that is pressed, marks a wrong one as tried, and leaves the four words where they are', () => {
    const before = labels();
    const right = rightOption();
    const wrong = options().find((o) => o !== right)!;
    act(() => wrong.click());
    expect(spoken[spoken.length - 1]).toBe(wrong.textContent);
    expect(message()).toBe('Not that one. Try another.');
    expect(wrong.classList.contains('game-option--tried')).toBe(true);
    expect(labels()).toEqual(before);
  });

  it('marks the right word, counts it once, and does not move on by itself', () => {
    const before = labels();
    act(() => rightOption().click());
    expect(message()).toMatch(/^Yes! That is /);
    expect(container.querySelector('.game-option--right')).not.toBeNull();
    act(() => rightOption().click()); // pressing it again does not count twice
    expect(container.querySelector('.game-screen__count')!.textContent).toBe('Found 1');
    expect(labels()).toEqual(before);
  });

  it('Next picture starts a fresh round, with nothing marked and nothing spoken', () => {
    act(() => rightOption().click());
    const spokenBefore = spoken.length;
    act(() => button('Next picture').click());
    expect(spoken.length).toBe(spokenBefore);
    expect(message()).toBe('Which word is this?');
    expect(container.querySelector('.game-option--right')).toBeNull();
    expect(container.querySelector('.game-option--tried')).toBeNull();
  });

  it('can show a picture on each word, and put them away again', () => {
    expect(container.querySelector('.game-option__emoji')).toBeNull();
    act(() => button('Pictures on the words').click());
    expect(container.querySelectorAll('.game-option__emoji')).toHaveLength(4);
    act(() => button('Words only').click());
    expect(container.querySelector('.game-option__emoji')).toBeNull();
  });

  it('is practice, so what it says never goes into Recent', async () => {
    await setRecentEnabled(true);
    act(() => rightOption().click());
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(await getRecentEntries()).toEqual([]);
  });
});
