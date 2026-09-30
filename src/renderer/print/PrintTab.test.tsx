import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrintTab } from './PrintTab';
import { ensureSeeded, resetDBConnectionForTests } from '../store/db';
import { ROOT_BOARD_ID } from '../vocab/starter';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('PrintTab', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    await ensureSeeded();
    container = document.createElement('div');
    render(<PrintTab />, container);
    await waitFor(() => container.querySelectorAll('.print-card').length > 0);
  });

  afterEach(() => {
    render(null, container);
  });

  it('defaults to the root board, rendering one card per visible button at the chosen size', async () => {
    const cards = container.querySelectorAll<HTMLElement>('.print-card');
    expect(cards.length).toBeGreaterThan(0);
    for (const card of Array.from(cards)) {
      expect(card.style.width).toBe('50mm');
      expect(card.style.height).toBe('50mm');
    }
  });

  it('changing the card size resizes the printed cards', async () => {
    const [, , sizeSelect] = container.querySelectorAll<HTMLSelectElement>('select');
    act(() => {
      sizeSelect!.value = '20';
      sizeSelect!.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => container.querySelector<HTMLElement>('.print-card')?.style.width === '20mm');
  });

  it('switching to the sentence strip template shows blank boxes instead of board cards', async () => {
    const [modeSelect] = container.querySelectorAll<HTMLSelectElement>('select');
    act(() => {
      modeSelect!.value = 'strip';
      modeSelect!.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => container.querySelectorAll('.print-strip__box').length === 6);
    expect(container.querySelectorAll('.print-card__label').length).toBe(0);
  });

  it('the Print button calls window.print()', () => {
    const printSpy = vi.fn();
    window.print = printSpy;
    const button = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Print')!;
    act(() => button.click());
    expect(printSpy).toHaveBeenCalledOnce();
  });

  it('the board picker starts at the root Talk board', () => {
    const [boardSelect] = Array.from(container.querySelectorAll<HTMLSelectElement>('select')).slice(1, 2);
    expect(boardSelect?.value).toBe(ROOT_BOARD_ID);
  });
});
