import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PhraseBankTab } from './PhraseBankTab';
import { customPhrasesSetting, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('PhraseBankTab custom phrases', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = [];
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: { text: string }) => spoken.push(utterance.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      text: string;
      rate = 1;
      pitch = 1;
      voice = null;
      constructor(text: string) {
        this.text = text;
      }
    };
    container = document.createElement('div');
    render(<PhraseBankTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const addPhrase = (text: string) => {
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Add a phrase"]')!;
    act(() => {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  };

  it('adds as many phrases as needed, speaks each on a press, and keeps them', async () => {
    addPhrase('Can I have a snack please?');
    addPhrase("I'd like to sit at the front");
    await waitFor(() => customPhrasesSetting.signal.value.length === 2);

    const rows = container.querySelectorAll('.phrase-bank-tab__row--custom');
    expect(Array.from(rows).map((r) => r.querySelector('.phrase-bank-tab__phrase')?.textContent)).toEqual([
      'Can I have a snack please?',
      "I'd like to sit at the front",
    ]);

    act(() => rows[1]!.querySelector<HTMLButtonElement>('.phrase-bank-tab__speak')!.click());
    expect(spoken).toEqual(["I'd like to sit at the front"]);

    resetDBConnectionForTests();
    expect(await customPhrasesSetting.get()).toEqual(['Can I have a snack please?', "I'd like to sit at the front"]);
  });

  it('ignores an empty phrase, and removes one on request', async () => {
    addPhrase('   ');
    expect(customPhrasesSetting.signal.value).toEqual([]);

    addPhrase('Hello');
    await waitFor(() => customPhrasesSetting.signal.value.length === 1);
    act(() => container.querySelector<HTMLButtonElement>('.phrase-bank-tab__remove')!.click());
    await waitFor(() => customPhrasesSetting.signal.value.length === 0);
  });
});
