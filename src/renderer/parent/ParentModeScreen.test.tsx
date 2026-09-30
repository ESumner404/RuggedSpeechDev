import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { ParentModeScreen } from './ParentModeScreen';
import { ensureSeeded, getBoard, resetDBConnectionForTests } from '../store/db';
import { ROOT_BOARD_ID } from '../vocab/starter';

// fake-indexeddb resolves via IDBRequest 'success' events, not plain
// microtasks — poll for the DOM to reflect it, same as TalkScreen.test.tsx.
async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function rowFor(container: HTMLElement, label: string): HTMLElement {
  const row = Array.from(container.querySelectorAll<HTMLElement>('.parent-mode-screen__button-row')).find(
    (el) => el.querySelector<HTMLInputElement>('.parent-mode-screen__label-input')?.value === label,
  );
  if (!row) throw new Error(`No row for "${label}"`);
  return row;
}

describe('ParentModeScreen', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    (window as unknown as { myWords: { parentMode: unknown } }).myWords = {
      parentMode: {
        setFullscreen: async () => {},
        isFullscreen: async () => false,
      },
    };
    await ensureSeeded();
    container = document.createElement('div');
    render(<ParentModeScreen onExit={() => {}} />, container);
    await waitFor(() => container.querySelectorAll('.parent-mode-screen__button-row').length > 0);
  });

  it('lists the seeded boards, defaulting to the first', () => {
    const select = container.querySelector<HTMLSelectElement>('.parent-mode-screen__board-picker select');
    expect(select?.value).toBe(ROOT_BOARD_ID);
    expect(container.querySelectorAll('.parent-mode-screen__button-row').length).toBeGreaterThan(0);
  });

  it('hiding a button persists to the store', async () => {
    const row = rowFor(container, 'help');
    const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 60));

    const board = await getBoard(ROOT_BOARD_ID);
    expect(board?.buttons.find((b) => b.id === 'help')?.hidden).toBe(true);
  });

  it('editing a label persists to the store', async () => {
    const row = rowFor(container, 'help');
    const input = row.querySelector<HTMLInputElement>('.parent-mode-screen__label-input')!;
    act(() => {
      input.value = 'assist';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 60));

    const board = await getBoard(ROOT_BOARD_ID);
    expect(board?.buttons.find((b) => b.id === 'help')?.label).toBe('assist');
  });

  it('moving a button changes its position and persists', async () => {
    const before = await getBoard(ROOT_BOARD_ID);
    const firstCellBefore = before!.grid.order[0]![0];

    // The very first button can't move up (nothing before it) — move the
    // second one instead, which swaps with the first. The first
    // `.parent-mode-screen__move-button` in a row is "move up" (▲).
    const secondId = before!.grid.order[0]![1]!;
    const secondLabel = before!.buttons.find((b) => b.id === secondId)!.label;
    const secondRow = rowFor(container, secondLabel);
    act(() => {
      secondRow.querySelector<HTMLButtonElement>('.parent-mode-screen__move-button')?.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 60));

    const after = await getBoard(ROOT_BOARD_ID);
    expect(after!.grid.order[0]![0]).toBe(secondId);
    expect(after!.grid.order[0]![1]).toBe(firstCellBefore);
  });

  it('adding a button places it in the next empty slot and persists', async () => {
    // The root board is a full 4×4 with no empty slot; "food" (3×3, 5
    // buttons) has room.
    const select = container.querySelector<HTMLSelectElement>('.parent-mode-screen__board-picker select')!;
    act(() => {
      select.value = 'food';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => rowFor(container, 'apple') !== undefined);

    const addForm = container.querySelector<HTMLFormElement>('.parent-mode-screen__add-form')!;
    const formLabelInput = addForm.querySelector<HTMLInputElement>('.parent-mode-screen__label-input')!;

    act(() => {
      formLabelInput.value = 'brand new button';
      formLabelInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      addForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 60));

    const board = await getBoard('food');
    expect(board?.buttons.some((b) => b.label === 'brand new button')).toBe(true);
  });
});
