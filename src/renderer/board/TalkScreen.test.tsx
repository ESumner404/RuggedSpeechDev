import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TalkScreen } from './TalkScreen';
import { resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function findBoardButton(container: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(container.querySelectorAll<HTMLElement>('.board-button__label'))
    .find((el) => el.textContent === label)
    ?.closest('button') as HTMLButtonElement | undefined;
}

function buttonLabelled(container: HTMLElement, label: string): HTMLButtonElement {
  const button = findBoardButton(container, label);
  if (!button) throw new Error(`No board button labelled "${label}"`);
  return button;
}

describe('TalkScreen', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<TalkScreen onExit={() => {}} />, container);
    await waitFor(() => container.querySelectorAll('.board-button').length > 0);
  });

  afterEach(() => {
    render(null, container);
  });

  it('builds a sentence from separate button presses and shows a chip per word', () => {
    act(() => buttonLabelled(container, 'I').click());
    act(() => buttonLabelled(container, 'want').click());
    const chips = Array.from(container.querySelectorAll('.sentence-strip__chip')).map((el) => el.textContent);
    expect(chips).toEqual(['I', 'want']);
  });

  it('removes a chip when it is tapped', () => {
    act(() => buttonLabelled(container, 'I').click());
    act(() => buttonLabelled(container, 'want').click());
    act(() => container.querySelector<HTMLButtonElement>('.sentence-strip__chip')?.click());
    const chips = Array.from(container.querySelectorAll('.sentence-strip__chip')).map((el) => el.textContent);
    expect(chips).toEqual(['want']);
  });

  it('Clear all empties the whole sentence in one press, and starts disabled', () => {
    const clearButton = container.querySelector<HTMLButtonElement>('.sentence-strip__clear')!;
    expect(clearButton.disabled).toBe(true);

    act(() => buttonLabelled(container, 'I').click());
    act(() => buttonLabelled(container, 'want').click());
    expect(clearButton.disabled).toBe(false);

    act(() => clearButton.click());
    expect(container.querySelectorAll('.sentence-strip__chip')).toHaveLength(0);
    expect(clearButton.disabled).toBe(true);
  });

  it('navigates into a folder without adding the folder itself to the sentence', async () => {
    act(() => buttonLabelled(container, 'Food').click());
    await waitFor(() => findBoardButton(container, 'apple') !== undefined);
    expect(container.querySelectorAll('.sentence-strip__chip')).toHaveLength(0);
  });

  it('Back returns from a folder to the board above it', async () => {
    act(() => buttonLabelled(container, 'Food').click());
    await waitFor(() => findBoardButton(container, 'apple') !== undefined);

    act(() => {
      container.querySelector<HTMLButtonElement>('.talk-screen__nav-button:last-child')?.click();
    });

    await waitFor(() => findBoardButton(container, 'I') !== undefined);
    expect(findBoardButton(container, 'apple')).toBeUndefined();
  });
});

describe('TalkScreen crash recovery (PLAN.md Phase 8)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('restores the sentence and page left behind by an unclean shutdown', async () => {
    render(<TalkScreen onExit={() => {}} />, container);
    await waitFor(() => findBoardButton(container, 'I') !== undefined);

    act(() => buttonLabelled(container, 'I').click());
    act(() => buttonLabelled(container, 'want').click());
    act(() => buttonLabelled(container, 'Food').click());
    await waitFor(() => findBoardButton(container, 'apple') !== undefined);

    // No Home/Back press — this stands in for the process disappearing
    // mid-conversation rather than exiting deliberately.
    render(null, container);

    const secondContainer = document.createElement('div');
    render(<TalkScreen onExit={() => {}} />, secondContainer);
    await waitFor(() => secondContainer.querySelectorAll('.board-button').length > 0);

    expect(
      Array.from(secondContainer.querySelectorAll('.sentence-strip__chip')).map((el) => el.textContent),
    ).toEqual(['I', 'want']);
    // Still on the Food board, not back at the root.
    expect(findBoardButton(secondContainer, 'apple')).toBeDefined();

    render(null, secondContainer);
  });

  it('a deliberate Home press clears the recovery state — the next mount starts fresh', async () => {
    render(<TalkScreen onExit={() => {}} />, container);
    await waitFor(() => findBoardButton(container, 'I') !== undefined);

    act(() => buttonLabelled(container, 'I').click());
    act(() => container.querySelector<HTMLButtonElement>('.talk-screen__nav-button')!.click()); // Home
    render(null, container);

    const secondContainer = document.createElement('div');
    render(<TalkScreen onExit={() => {}} />, secondContainer);
    await waitFor(() => secondContainer.querySelectorAll('.board-button').length > 0);

    expect(secondContainer.querySelectorAll('.sentence-strip__chip')).toHaveLength(0);

    render(null, secondContainer);
  });
});
