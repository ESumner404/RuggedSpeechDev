import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CalmTab } from './CalmTab';
import { resetDBConnectionForTests } from '../store/db';

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
    voice = null;
    constructor(text: string) {
      this.text = text;
    }
  };
  return spoken;
}

function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('CalmTab (feature review, Aug 2026)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    vi.useFakeTimers();
    container = document.createElement('div');
    render(<CalmTab />, container);
  });

  afterEach(() => {
    render(null, container);
    vi.useRealTimers();
  });

  it('starts on "Ready when you are" and cycles through the breathing phases when started', () => {
    const spoken = stubSpeech();
    expect(container.querySelector('.calm-tab__phase')?.textContent).toBe('Ready when you are');

    const startButton = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Start')!;
    act(() => startButton.click());
    expect(container.querySelector('.calm-tab__phase')?.textContent).toBe('Breathe in');
    expect(spoken).toEqual(['Breathe in']);

    advance(4000);
    expect(container.querySelector('.calm-tab__phase')?.textContent).toBe('Hold');

    advance(4000);
    expect(container.querySelector('.calm-tab__phase')?.textContent).toBe('Breathe out');

    advance(6000);
    expect(container.querySelector('.calm-tab__phase')?.textContent).toBe('Breathe in');
    expect(spoken).toEqual(['Breathe in', 'Hold', 'Breathe out', 'Breathe in']);
  });

  it('Stop ends the breathing cycle immediately and no further phases are announced', () => {
    const spoken = stubSpeech();
    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Start')!.click());
    advance(4000); // now on "Hold"

    act(() => container.querySelector<HTMLButtonElement>('.calm-tab__button')!.click()); // Stop
    expect(container.querySelector('.calm-tab__phase')?.textContent).toBe('Ready when you are');

    const spokenCountAtStop = spoken.length;
    advance(20_000);
    expect(spoken).toHaveLength(spokenCountAtStop); // nothing further fired
  });

  it('quiet time counts down and announces completion once, gently', () => {
    const spoken = stubSpeech();
    const oneMinButton = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '1 min')!;
    act(() => oneMinButton.click());
    expect(container.querySelector('.calm-tab__countdown')?.textContent).toBe('1:00');

    advance(1000);
    expect(container.querySelector('.calm-tab__countdown')?.textContent).toBe('0:59');

    advance(59_000);
    expect(container.querySelector('.calm-tab__countdown')).toBeNull();
    expect(spoken).toEqual(["The timer's finished. Take your time."]);
  });

  it('quiet time Stop cancels the countdown without announcing completion', () => {
    const spoken = stubSpeech();
    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '2 min')!.click());
    advance(5000);

    // Both sections have their own "Stop" once active — Breathing hasn't
    // been started here, so this is unambiguously Quiet Time's.
    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Stop')!.click());
    expect(container.querySelector('.calm-tab__countdown')).toBeNull();

    advance(200_000);
    expect(spoken).toEqual([]);
  });
});
