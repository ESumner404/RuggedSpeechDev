import 'fake-indexeddb/auto';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { KeyboardScreen } from './KeyboardScreen';
import { keyboardLayoutSetting, resetDBConnectionForTests, savePerson } from '../store/db';

function key(container: HTMLElement, char: string): HTMLButtonElement {
  const button = Array.from(
    container.querySelectorAll<HTMLButtonElement>('.on-screen-keyboard__key'),
  ).find((el) => el.textContent === char);
  if (!button) throw new Error(`No key "${char}"`);
  return button;
}

function textbox(container: HTMLElement): string {
  return container.querySelector('.keyboard-screen__textbox')?.textContent ?? '';
}

function stubSpeechSynthesis(): string[] {
  const spoken: string[] = [];
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string;
    rate = 1;
    pitch = 1;
    voice = null;
    constructor(text: string) {
      this.text = text;
    }
  };
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => [],
    cancel: () => {},
    speak: (utterance: { text: string }) => spoken.push(utterance.text),
  };
  return spoken;
}

describe('KeyboardScreen', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    render(<KeyboardScreen />, container);
  });

  it('typing builds the text box exactly, regardless of what predictions are showing', () => {
    act(() => key(container, 'w').click());
    act(() => key(container, 'a').click());
    expect(textbox(container)).toBe('wa');
    // Suggestions for "wa" exist (e.g. "want" is in the starter vocabulary)
    // but must not have touched the text.
    expect(container.querySelectorAll('.prediction-bar__suggestion').length).toBeGreaterThan(0);
    expect(textbox(container)).toBe('wa');
  });

  it('typing digits builds numeric text (e.g. "I want 3 cookies")', () => {
    act(() => key(container, 'i').click());
    act(() => container.querySelector<HTMLButtonElement>('.on-screen-keyboard__key--space')!.click());
    act(() => key(container, 'w').click());
    act(() => key(container, '3').click());
    expect(textbox(container)).toBe('i w3');
  });

  it('a suggestion only ever changes the text when it is pressed', () => {
    act(() => key(container, 'w').click());
    act(() => key(container, 'a').click());
    act(() => key(container, 'n').click());
    expect(textbox(container)).toBe('wan'); // still untouched right up to the press

    const suggestion = container.querySelector<HTMLButtonElement>('.prediction-bar__suggestion');
    expect(suggestion?.textContent).toBe('want');

    act(() => suggestion!.click());
    expect(textbox(container)).toBe('want '); // word completed, trailing space, ready for the next one
  });

  it('Show displays the text full-screen and speaks nothing', () => {
    const spoken = stubSpeechSynthesis();
    act(() => key(container, 'h').click());
    act(() => key(container, 'i').click());
    act(() => container.querySelector<HTMLButtonElement>('.keyboard-screen__show')?.click());

    expect(container.querySelector('.show-overlay__text')?.textContent).toBe('hi');
    expect(spoken).toEqual([]);
  });

  it('no-pressure mode leaves only the keyboard, text box and Speak', () => {
    act(() =>
      container.querySelector<HTMLButtonElement>('.keyboard-screen__no-pressure-toggle')?.click(),
    );

    expect(container.querySelector('.page-tabs')).toBeNull();
    expect(container.querySelector('.prediction-bar')).toBeNull();
    expect(container.querySelector('.keyboard-screen__show')).toBeNull();
    expect(container.querySelector('.on-screen-keyboard')).not.toBeNull();
    expect(container.querySelector('.keyboard-screen__textbox')).not.toBeNull();
    expect(container.querySelector('.sentence-strip__speak')).not.toBeNull();
  });
});

describe('KeyboardScreen personal words and layout', () => {
  let container: HTMLElement;

  async function open(): Promise<void> {
    container = document.createElement('div');
    render(<KeyboardScreen />, container);
    await new Promise((resolve) => setTimeout(resolve, 60));
  }

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
  });

  const suggestions = () => Array.from(container.querySelectorAll('.prediction-bar__suggestion')).map((el) => el.textContent);

  it("suggests the names of the people this person has added, as well as the built-in words", async () => {
    await savePerson({ id: 'gran', name: 'Grandad Joe', phrases: [] });
    await open();
    act(() => key(container, 'g').click());
    act(() => key(container, 'r').click());
    act(() => key(container, 'a').click());
    expect(suggestions()).toContain('Grandad');
    // Only ever suggested: the text is exactly what was typed.
    expect(textbox(container)).toBe('gra');
  });

  it('lays the letters out in alphabetical order when an adult has chosen that', async () => {
    keyboardLayoutSetting.signal.value = 'alphabetical';
    await open();
    const rows = Array.from(container.querySelectorAll('.on-screen-keyboard__row')).map((row) =>
      Array.from(row.querySelectorAll('.on-screen-keyboard__key'))
        .map((k) => k.textContent)
        .join(''),
    );
    expect(rows.slice(0, 4)).toEqual(['1234567890', 'abcdefghi', 'jklmnopqr', 'stuvwxyz']);
  });

  it('keeps the usual order by default', async () => {
    await open();
    expect(container.querySelector('.on-screen-keyboard__row:nth-child(2)')?.textContent).toBe('qwertyuiop');
  });
});
