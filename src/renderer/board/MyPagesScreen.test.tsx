import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MyPagesScreen } from './MyPagesScreen';
import { addButton } from '../parent/boardEditing';
import { createMyPage, getBoard, resetDBConnectionForTests, updateBoard } from '../store/db';

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

async function addWordToPage(boardId: string, id: string, label: string): Promise<void> {
  const board = await getBoard(boardId);
  await updateBoard(addButton(board!, { id, label }));
}

describe('MyPagesScreen', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('shows an empty state when no pages have been created', async () => {
    render(<MyPagesScreen onExit={() => {}} />, container);
    await waitFor(() => container.querySelector('.my-pages-screen__empty-title') !== null);
    expect(container.querySelector('.my-pages-screen__empty-note')?.textContent).toContain('Parent Mode');
  });

  it('a single page opens directly, with no picker step', async () => {
    const page = await createMyPage('Weekend words');
    await addWordToPage(page.boardId, 'park', 'park');

    render(<MyPagesScreen onExit={() => {}} />, container);
    await waitFor(() => findBoardButton(container, 'park') !== undefined);
    expect(container.querySelector('.my-pages-screen__picker')).toBeNull();
  });

  it('more than one page shows a picker, and each opens its own board', async () => {
    const first = await createMyPage('Weekend words');
    const second = await createMyPage('Holiday words');
    await addWordToPage(first.boardId, 'park', 'park');
    await addWordToPage(second.boardId, 'beach', 'beach');

    render(<MyPagesScreen onExit={() => {}} />, container);
    await waitFor(() => container.querySelector('.my-pages-screen__picker') !== null);

    const pickerButton = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Holiday words')!;
    act(() => pickerButton.click());
    await waitFor(() => findBoardButton(container, 'beach') !== undefined);
    expect(findBoardButton(container, 'park')).toBeUndefined();
  });

  it('builds and speaks a sentence from a page like Talk does', async () => {
    const page = await createMyPage('Weekend words');
    await addWordToPage(page.boardId, 'park', 'park');
    await addWordToPage(page.boardId, 'please', 'please');

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

    render(<MyPagesScreen onExit={() => {}} />, container);
    await waitFor(() => findBoardButton(container, 'park') !== undefined);

    act(() => findBoardButton(container, 'park')!.click());
    act(() => findBoardButton(container, 'please')!.click());
    expect(spoken).toEqual([]); // nothing speaks until Speak is pressed (invariant I5)

    act(() => container.querySelector<HTMLButtonElement>('.sentence-strip__speak')!.click());
    expect(spoken).toEqual(['park please']);
  });

  it('Back from a page returns to the picker when there is more than one page', async () => {
    await createMyPage('Weekend words');
    await createMyPage('Holiday words');

    render(<MyPagesScreen onExit={() => {}} />, container);
    await waitFor(() => container.querySelector('.my-pages-screen__picker') !== null);

    const pickerButton = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Weekend words')!;
    act(() => pickerButton.click());
    await waitFor(() => container.querySelector('.talk-screen__grid') !== null);

    act(() => {
      container.querySelector<HTMLButtonElement>('.talk-screen__nav-button:last-child')?.click();
    });
    await waitFor(() => container.querySelector('.my-pages-screen__picker') !== null);
  });
});
