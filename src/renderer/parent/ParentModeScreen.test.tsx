import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { ParentModeScreen } from './ParentModeScreen';
import { ensureSeeded, getBoard, resetDBConnectionForTests } from '../store/db';
import { ROOT_BOARD_ID } from '../vocab/starter';

// fake-indexeddb resolves via IDBRequest 'success' events, not plain
// microtasks, poll for the DOM to reflect it, same as TalkScreen.test.tsx.
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

    // The very first button can't move up (nothing before it), move the
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

  it('dragging one button onto another swaps just those two, and persists (docs/build-plan.md Phase 4)', async () => {
    const before = await getBoard(ROOT_BOARD_ID);
    const [firstId, secondId] = [before!.grid.order[0]![0]!, before!.grid.order[0]![1]!];
    const label = (id: string) => before!.buttons.find((b) => b.id === id)!.label;

    const handle = rowFor(container, label(firstId)).querySelector('.parent-mode-screen__drag-handle')!;
    const target = rowFor(container, label(secondId));

    act(() => {
      handle.dispatchEvent(new Event('dragstart', { bubbles: true }));
    });
    act(() => {
      target.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    });
    expect(target.className).toContain('drop-target');
    act(() => {
      target.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 60));

    const after = await getBoard(ROOT_BOARD_ID);
    expect(after!.grid.order[0]![0]).toBe(secondId);
    expect(after!.grid.order[0]![1]).toBe(firstId);
    // Everything else stays exactly where it was (invariant I3).
    expect(after!.grid.order.slice(1)).toEqual(before!.grid.order.slice(1));
    expect(after!.grid.order[0]!.slice(2)).toEqual(before!.grid.order[0]!.slice(2));
  });

  it('adding a folder creates a new board and a button on this one that opens it', async () => {
    const select = container.querySelector<HTMLSelectElement>('.parent-mode-screen__board-picker select')!;
    act(() => {
      select.value = 'school';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => rowFor(container, 'pencil') !== undefined);

    const form = container.querySelector<HTMLFormElement>('.parent-mode-screen__add-folder')!;
    const nameInput = form.querySelector<HTMLInputElement>('.parent-mode-screen__label-input')!;
    act(() => {
      nameInput.value = 'Sweets';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // waitFor above is synchronous, so poll the store directly.
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const current = await getBoard('school');
      if (current?.buttons.some((b) => b.label === 'Sweets' && b.load_board)) break;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    const school = await getBoard('school');
    const folderButton = school!.buttons.find((b) => b.label === 'Sweets')!;
    const folder = await getBoard(folderButton.load_board!.id);
    expect(folder).toMatchObject({ name: 'Sweets', buttons: [] });
    // The new board shows up in the picker straight away.
    expect(Array.from(select.options).map((o) => o.textContent)).toContain('Sweets');
  });

  it('puts a starter board back as it came, but only after asking', async () => {
    const original = (await getBoard(ROOT_BOARD_ID))!;
    const firstButton = original.buttons[0]!;

    // Change a label and a position.
    const row = rowFor(container, firstButton.label);
    const input = row.querySelector<HTMLInputElement>('.parent-mode-screen__label-input')!;
    act(() => {
      input.value = 'changed';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect((await getBoard(ROOT_BOARD_ID))!.buttons[0]!.label).toBe('changed');

    const restore = () =>
      Array.from(container.querySelectorAll<HTMLButtonElement>('.parent-mode-screen__restore button'));
    act(() => restore()[0]!.click()); // "Put this board back to the starter version"
    expect((await getBoard(ROOT_BOARD_ID))!.buttons[0]!.label).toBe('changed'); // asked first

    act(() => restore()[1]!.click()); // "Keep my changes"
    expect((await getBoard(ROOT_BOARD_ID))!.buttons[0]!.label).toBe('changed');

    act(() => restore()[0]!.click());
    act(() => restore()[0]!.click()); // "Yes, put it back"
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(await getBoard(ROOT_BOARD_ID)).toEqual(original);
  });

  it('adding a button places it in the next empty slot and persists', async () => {
    // The root board and Food are full 4×4s with no empty slot; "school"
    // (14 of 16) has room.
    const select = container.querySelector<HTMLSelectElement>('.parent-mode-screen__board-picker select')!;
    act(() => {
      select.value = 'school';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => rowFor(container, 'pencil') !== undefined);

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

    const board = await getBoard('school');
    expect(board?.buttons.some((b) => b.label === 'brand new button')).toBe(true);
  });
});
