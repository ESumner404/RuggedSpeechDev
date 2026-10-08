import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { PeoplePlacesTab } from './PeoplePlacesTab';
import { ensureSeeded, getBoard, getMyPages, resetDBConnectionForTests } from '../store/db';

// Camera/mic capture aren't reachable under jsdom (no navigator.mediaDevices,
// no canvas 2D context), this covers the save flow without a photo, which
// is real, common usage (not every record needs a picture). The full
// photo/voice-clip capture path is verified in tests/e2e/parent-mode-photos.spec.ts
// against real Chromium with --use-fake-device-for-media-stream.
async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

async function renderAndSettle(container: HTMLElement, kind: 'people' | 'places'): Promise<void> {
  render(<PeoplePlacesTab kind={kind} />, container);
  // The mount effect resets the form fields (it also runs on tab-switch,
  // where that matters), let it settle before typing, or a fast test can
  // type into the form before that effect fires and finds its own input
  // wiped out a tick later. No human types that fast.
  await new Promise((resolve) => setTimeout(resolve, 20));
}

function fillInput(container: HTMLElement, placeholder: string, value: string): void {
  const input = Array.from(container.querySelectorAll<HTMLInputElement>('input')).find(
    (el) => el.placeholder === placeholder,
  );
  if (!input) throw new Error(`No input with placeholder "${placeholder}"`);
  act(() => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

describe('PeoplePlacesTab', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    await ensureSeeded();
    container = document.createElement('div');
  });

  it('saves a person without a photo and lists them', async () => {
    await renderAndSettle(container, 'people');
    fillInput(container, 'Person name', 'Grandad');
    fillInput(container, 'Relationship (e.g. Mum, teacher)', 'Grandad');
    fillInput(container, 'Phrases (comma separated)', 'How are you?, I love you');

    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length > 0);

    expect(container.querySelector('.people-places-tab__record-name')?.textContent).toBe('Grandad');
    expect(container.querySelector('.people-places-tab__record-relationship')?.textContent).toBe('Grandad');
  });

  it('adds a real, pressable button to the people board', async () => {
    await renderAndSettle(container, 'people');
    fillInput(container, 'Person name', 'Grandad');

    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length > 0);

    const board = await getBoard('people');
    const button = board?.buttons.find((b) => b.label === 'Grandad');
    expect(button).toBeDefined();
    expect(board?.grid.order.flat()).toContain(button?.id);
  });

  it('saves a place without a photo', async () => {
    await renderAndSettle(container, 'places');
    fillInput(container, 'Place name', 'Grandma’s house');

    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length > 0);

    const board = await getBoard('places');
    expect(board?.buttons.some((b) => b.label === "Grandma’s house")).toBe(true);
  });

  it('removes a person and their button together, but only after asking', async () => {
    await renderAndSettle(container, 'people');
    fillInput(container, 'Person name', 'Uncle Joe');
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length > 0);
    const before = (await getBoard('people'))!;
    const grandad = before.buttons.find((b) => b.label === 'Uncle Joe')!;

    const press = (text: string) =>
      act(() => {
        Array.from(container.querySelectorAll<HTMLButtonElement>('.people-places-tab__record button'))
          .find((b) => b.textContent === text)!
          .click();
      });

    press('Remove');
    expect(container.textContent).toContain('Remove Uncle Joe?');
    press('Keep');
    expect(container.querySelectorAll('.people-places-tab__record')).toHaveLength(1);
    expect((await getBoard('people'))!.buttons.some((b) => b.id === grandad.id)).toBe(true);

    press('Remove');
    press('Yes, remove');
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length === 0);

    const after = (await getBoard('people'))!;
    expect(after.buttons.some((b) => b.id === grandad.id)).toBe(false);
    // Its slot is left empty, so the other buttons stay put.
    expect(after.grid.order.flat()).not.toContain(grandad.id);
    expect(after.grid.order.flat().length).toBe(before.grid.order.flat().length);
  });

  it('turns the phrases saved with someone into a page of buttons, only when there are some', async () => {
    await renderAndSettle(container, 'people');
    fillInput(container, 'Person name', 'Grandad');
    fillInput(container, 'Phrases (comma separated)', 'How are you?, I love you');
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length > 0);

    fillInput(container, 'Person name', 'Auntie');
    act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => container.querySelectorAll('.people-places-tab__record').length === 2);

    const makePage = Array.from(container.querySelectorAll<HTMLButtonElement>('.people-places-tab__record button')).filter(
      (b) => b.textContent === 'Make a page of these phrases',
    );
    expect(makePage).toHaveLength(1); // Auntie has no phrases, so no button

    act(() => makePage[0]!.click());
    // This file's waitFor is synchronous, so poll the store directly.
    for (let attempt = 0; attempt < 100 && (await getMyPages()).length === 0; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    const page = (await getMyPages())[0]!;
    expect(page.name).toBe('Grandad');
    expect((await getBoard(page.boardId))!.buttons.map((b) => b.label)).toEqual(['How are you?', 'I love you']);
    await waitFor(() => container.textContent?.includes('Made a page called “Grandad”') === true);
  });
});
