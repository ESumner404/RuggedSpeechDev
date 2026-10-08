import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JokesScreen } from './JokesScreen';
import { JokesTab } from '../parent/JokesTab';
import { customJokesSetting, resetDBConnectionForTests } from '../store/db';
import { BASIC_JOKES } from '../vocab/jokes';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('jokes', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = [];
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (u: { text: string }) => spoken.push(u.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      constructor(public text: string) {}
    };
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  const button = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === label)!;

  it('shows a question first, keeps the answer back, and says nothing until asked', () => {
    render(<JokesScreen />, container);
    expect(container.querySelector('.jokes-screen__question')!.textContent).toMatch(/\?$/);
    expect(container.querySelector('.jokes-screen__answer--hidden')).not.toBeNull();
    expect(button('Say the answer').disabled).toBe(true);
    expect(spoken).toEqual([]);
  });

  it('says the question, shows the answer, says the answer', () => {
    render(<JokesScreen />, container);
    const question = container.querySelector('.jokes-screen__question')!.textContent!;
    act(() => button('Say the question').click());
    act(() => button('Show the answer').click());
    const answer = container.querySelector('.jokes-screen__answer')!.textContent!;
    act(() => button('Say the answer').click());
    expect(spoken).toEqual([question, answer]);
    expect(BASIC_JOKES.some((j) => j.q === question && j.a === answer)).toBe(true);
  });

  it('goes on to a different joke, with the answer hidden again', () => {
    render(<JokesScreen />, container);
    const first = container.querySelector('.jokes-screen__question')!.textContent;
    act(() => button('Show the answer').click());
    act(() => button('Next joke').click());
    expect(container.querySelector('.jokes-screen__question')!.textContent).not.toBe(first);
    expect(container.querySelector('.jokes-screen__answer--hidden')).not.toBeNull();
  });

  it('makes a silly one and says it is one', () => {
    render(<JokesScreen />, container);
    act(() => button('Make a silly one').click());
    expect(container.querySelector('.jokes-screen__label')!.textContent).toBe('A silly one');
  });

  it('adds an adult\'s own joke, which then turns up in the game, and removes it', async () => {
    render(<JokesTab />, container);
    const [q, a] = Array.from(container.querySelectorAll<HTMLInputElement>('.jokes-tab__form input'));
    act(() => {
      q!.value = 'What do you call a sleepy dog?';
      q!.dispatchEvent(new Event('input', { bubbles: true }));
      a!.value = 'A snore-dle!';
      a!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => !(button('Add joke') as HTMLButtonElement).disabled);
    act(() => void container.querySelector('.jokes-tab__form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await waitFor(() => customJokesSetting.signal.value.length === 1);
    await waitFor(() => container.querySelector('.jokes-tab__joke') !== null);
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label^="Remove the joke"]')!.click());
    await waitFor(() => customJokesSetting.signal.value.length === 0);
  });
});
