import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MyPagesTab } from './MyPagesTab';
import { createMyPage, getBoard, getMyPages, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('MyPagesTab sharing', () => {
  let container: HTMLElement;
  let save: ReturnType<typeof vi.fn>;
  let open: ReturnType<typeof vi.fn>;
  const button = (text: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(text))!;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    save = vi.fn().mockResolvedValue({ ok: true });
    open = vi.fn().mockResolvedValue({ ok: false });
    (window as unknown as { myWords: unknown }).myWords = { files: { save, open } };
    await createMyPage('Dinosaurs');
    container = document.createElement('div');
    render(<MyPagesTab />, container);
    await waitFor(() => container.querySelector('.my-pages-tab__page-button') !== null);
    await waitFor(() => button('Share this page') !== undefined);
  });

  afterEach(() => {
    render(null, container);
  });

  it('saves the selected page as an .obf file, with a tidy name', async () => {
    act(() => button('Share this page').click());
    await waitFor(() => save.mock.calls.length === 1);

    const [text, options] = save.mock.calls[0]!;
    expect(JSON.parse(text as string)).toMatchObject({ format: 'open-board-0.1', name: 'Dinosaurs' });
    expect(options).toMatchObject({ suggestedName: 'dinosaurs.obf', extensions: ['obf'] });
    await waitFor(() => container.textContent?.includes('Saved “Dinosaurs”') === true);
  });

  it('adds a shared page as a new page, never over an existing one', async () => {
    act(() => button('Share this page').click());
    await waitFor(() => save.mock.calls.length === 1);
    open.mockResolvedValue({ ok: true, data: save.mock.calls[0]![0] });

    act(() => button('Add a shared page').click());
    await waitFor(async () => (await getMyPages()).length === 2);
    expect((await getMyPages()).map((p) => p.name)).toEqual(['Dinosaurs', 'Dinosaurs']);
    await waitFor(() => container.textContent?.includes('as a new page') === true);
  });

  it('says plainly when the file is not a page, and adds nothing', async () => {
    open.mockResolvedValue({ ok: true, data: 'definitely not a page' });
    act(() => button('Add a shared page').click());
    await waitFor(() => container.querySelector('.parent-mode-screen__error') !== null);
    expect(container.querySelector('.parent-mode-screen__error')?.textContent).toContain("isn't a page");
    expect(await getMyPages()).toHaveLength(1);
  });

  it('does nothing when the file dialog is cancelled', async () => {
    act(() => button('Add a shared page').click());
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(await getMyPages()).toHaveLength(1);
    expect(container.querySelector('.parent-mode-screen__error')).toBeNull();
  });

  it('starts a page from a ready-made template, already filled in and ready to change', async () => {
    const select = container.querySelector<HTMLSelectElement>('.my-pages-tab__template select')!;
    act(() => {
      select.value = 'drinks';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(container.querySelector('.my-pages-tab__template')!.textContent).toContain('A few drinks');

    act(() => button('Make this page').click());
    await waitFor(async () => (await getMyPages()).length === 2);

    const made = (await getMyPages()).find((page) => page.name === 'Drink choices')!;
    const board = (await getBoard(made.boardId))!;
    expect(board.buttons.map((b) => b.label)).toEqual(['water', 'milk', 'juice', 'squash']);
    expect(board.buttons[0]).toMatchObject({ vocalization: 'I want water', image: { kind: 'emoji', char: '💧' } });
    await waitFor(() => container.textContent?.includes('Made the page “Drink choices”') === true);

    // It is the selected page, and its buttons are there to edit straight away.
    await waitFor(() => container.querySelectorAll('.parent-mode-screen__button-row').length === 4);
  });
});
