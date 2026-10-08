import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FirstThenScreen } from './FirstThenScreen';
import { FirstThenEditor } from '../day/FirstThenEditor';
import { EMPTY_FIRST_THEN, firstThenSetting, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function stubSpeech(): string[] {
  const spoken: string[] = [];
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => [],
    cancel: () => {},
    speak: (utterance: { text: string }) => spoken.push(utterance.text),
  };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string;
    rate = 1;
    pitch = 1;
    volume = 1;
    voice = null;
    constructor(text: string) {
      this.text = text;
    }
  };
  return spoken;
}

const SET_UP = {
  first: { label: 'Brush teeth', emoji: '🪥' },
  then: { label: 'Tablet time', emoji: '📱' },
  firstDone: false,
};

describe('FirstThenScreen', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = stubSpeech();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  const button = (text: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(text))!;

  it('says plainly that nothing is set up yet, and where to do it', () => {
    render(<FirstThenScreen />, container);
    expect(container.textContent).toContain('Nothing here yet');
    expect(container.textContent).toContain('Parent Mode');
  });

  it('shows First and Then, with the first one current, and speaks each when pressed', () => {
    firstThenSetting.signal.value = SET_UP;
    render(<FirstThenScreen />, container);

    expect(container.querySelector('.first-then-card--first')!.className).toContain('first-then-card--now');
    expect(container.querySelector('.first-then-card--then')!.className).toContain('first-then-card--later');
    expect(container.textContent).toContain('Brush teeth');
    expect(container.textContent).toContain('🪥');

    act(() => container.querySelector<HTMLButtonElement>('.first-then-card--first')!.click());
    act(() => container.querySelector<HTMLButtonElement>('.first-then-card--then')!.click());
    expect(spoken).toEqual(['First, Brush teeth', 'Then, Tablet time']);
  });

  it('moves on when the first step is finished, says so, and can start again', () => {
    firstThenSetting.signal.value = SET_UP;
    render(<FirstThenScreen />, container);

    act(() => button('First is finished').click());
    expect(spoken).toEqual(['All done. Now Tablet time']);
    expect(firstThenSetting.signal.value.firstDone).toBe(true);
    expect(container.querySelector('.first-then-card--first')!.className).toContain('first-then-card--done');
    expect(container.querySelector('.first-then-card--first')!.textContent).toContain('Done');
    expect(container.querySelector('.first-then-card--then')!.className).toContain('first-then-card--now');
    expect(container.textContent).not.toContain('First is finished');

    act(() => button('Start again').click());
    expect(firstThenSetting.signal.value.firstDone).toBe(false);
    expect(container.querySelector('.first-then-card--first')!.className).toContain('first-then-card--now');
  });

  it('gives each card a spoken, readable name for a screen reader', () => {
    firstThenSetting.signal.value = { ...SET_UP, firstDone: true };
    render(<FirstThenScreen />, container);
    expect(container.querySelector('.first-then-card--first')!.getAttribute('aria-label')).toBe(
      'First: Brush teeth, finished',
    );
    expect(container.querySelector('.first-then-card--then')!.getAttribute('aria-label')).toBe('Then: Tablet time');
  });
});

describe('FirstThenEditor', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<FirstThenEditor />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const type = (input: HTMLInputElement, value: string) =>
    act(() => {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  const cards = () => Array.from(container.querySelectorAll<HTMLElement>('.first-then-editor__card'));

  it('saves what is typed for each card, and keeps it', async () => {
    type(cards()[0]!.querySelector<HTMLInputElement>('.first-then-editor__input')!, 'Brush teeth');
    type(cards()[1]!.querySelector<HTMLInputElement>('.first-then-editor__input')!, 'Tablet time');
    type(container.querySelector<HTMLInputElement>('input[aria-label="First emoji"]')!, '🪥');
    await waitFor(async () => (await firstThenSetting.get()).first.emoji === '🪥');

    resetDBConnectionForTests();
    const saved = await firstThenSetting.get();
    expect(saved.first).toEqual({ label: 'Brush teeth', emoji: '🪥' });
    expect(saved.then.label).toBe('Tablet time');
  });

  it('changing the first step puts the board back to the start', async () => {
    firstThenSetting.signal.value = { ...EMPTY_FIRST_THEN, firstDone: true };
    render(null, container);
    render(<FirstThenEditor />, container);
    type(cards()[0]!.querySelector<HTMLInputElement>('.first-then-editor__input')!, 'Shoes on');
    await waitFor(() => firstThenSetting.signal.value.firstDone === false);
  });

  it('can only be started again once it has been finished', () => {
    const startAgain = Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find(
      (b) => b.textContent === 'Start again',
    )!;
    expect(startAgain.disabled).toBe(true);
  });
});
