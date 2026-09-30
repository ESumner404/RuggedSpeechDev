import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FirstRunWizard } from './FirstRunWizard';
import { ensureSeeded, getRootBoard, hasCompletedFirstRun, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function stubSpeech(): void {
  const voices: SpeechSynthesisVoice[] = [
    { voiceURI: 'Voice A', name: 'Voice A', localService: true } as SpeechSynthesisVoice,
    { voiceURI: 'Voice B', name: 'Voice B', localService: true } as SpeechSynthesisVoice,
  ];
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => voices,
    cancel: () => {},
    speak: () => {},
  };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string;
    constructor(text: string) {
      this.text = text;
    }
  };
}

async function setUpPin(container: HTMLElement, pin: string): Promise<void> {
  for (const digit of pin) {
    const key = Array.from(container.querySelectorAll<HTMLButtonElement>('.pin-gate__key')).find(
      (el) => el.textContent === digit,
    )!;
    act(() => key.click());
  }
  act(() => container.querySelector<HTMLButtonElement>('.pin-gate__key--submit')!.click());
}

describe('FirstRunWizard', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    stubSpeech();
    await ensureSeeded();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('shows only offline voices, and moves to the grid screen on Next', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
    expect(container.querySelectorAll('.first-run-wizard__voice-option')).toHaveLength(2);

    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.textContent?.includes('Choose a grid size') ?? false);
  });

  it('only offers grid sizes that actually fit the current vocabulary', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);

    // The root board ships with 16 buttons — 2×2 and 3×3 can't hold them.
    const options = Array.from(container.querySelectorAll('.first-run-wizard__grid-size-option')).map((el) =>
      el.textContent?.trim(),
    );
    expect(options).not.toContain('2 × 2');
    expect(options).not.toContain('3 × 3');
    expect(options).toContain('4 × 4');
  });

  it('resizing to a larger grid on Next actually updates the root board', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);

    const fiveByFive = Array.from(
      container.querySelectorAll<HTMLInputElement>('.first-run-wizard__grid-size-option input'),
    ).find((input) => input.closest('label')?.textContent?.includes('5'))!;
    act(() => {
      fiveByFive.checked = true;
      fiveByFive.dispatchEvent(new Event('change', { bubbles: true }));
    });
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.textContent?.includes('Set a Parent PIN') ?? false);

    const board = await getRootBoard();
    expect(board?.grid.rows).toBe(5);
    expect(board?.grid.columns).toBe(5);
  });

  it('completing the PIN step marks first run done and calls onComplete', async () => {
    let completed = false;
    render(<FirstRunWizard onComplete={() => (completed = true)} />, container);
    await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);

    // PIN setup here is mandatory — Cancel would have nowhere to go, so a
    // button that visibly did nothing when pressed would just look broken.
    // It's hidden entirely rather than wired to a no-op.
    expect(container.querySelector('.pin-gate__cancel')).toBeNull();

    await setUpPin(container, '1234');
    await setUpPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => container.querySelector<HTMLButtonElement>('.pin-gate__button')!.click());

    await waitFor(() => completed);
    expect(await hasCompletedFirstRun()).toBe(true);
  });
});
