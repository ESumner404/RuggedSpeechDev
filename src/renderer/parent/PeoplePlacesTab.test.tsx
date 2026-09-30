import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { PeoplePlacesTab } from './PeoplePlacesTab';
import { ensureSeeded, getBoard, resetDBConnectionForTests } from '../store/db';

// Camera/mic capture aren't reachable under jsdom (no navigator.mediaDevices,
// no canvas 2D context) — this covers the save flow without a photo, which
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
  // where that matters) — let it settle before typing, or a fast test can
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
});
