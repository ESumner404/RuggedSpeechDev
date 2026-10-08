import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GeneralTab } from './GeneralTab';
import { getFavourites, parentModeTimeoutSetting, resetDBConnectionForTests, saveFavourite } from '../store/db';
import { IDBFactory } from 'fake-indexeddb';
import 'fake-indexeddb/auto';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('GeneralTab', () => {
  let container: HTMLElement;
  let getMock: ReturnType<typeof vi.fn>;
  let setMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    getMock = vi.fn(async () => false);
    setMock = vi.fn(async () => {});
    (window as unknown as { myWords: { startup: unknown } }).myWords = {
      startup: { getOpenAtLogin: getMock, setOpenAtLogin: setMock },
    };
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('reflects the current OS setting, off by default', async () => {
    render(<GeneralTab />, container);
    await waitFor(() => container.querySelector('.general-tab__checkbox') !== null);
    const checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(checkbox.checked).toBe(false);
  });

  it('toggling it calls setOpenAtLogin and updates the checkbox', async () => {
    render(<GeneralTab />, container);
    await waitFor(() => container.querySelector('.general-tab__checkbox') !== null);
    const checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => setMock.mock.calls.length > 0);

    expect(setMock).toHaveBeenCalledWith(true);
    await waitFor(() => checkbox.checked === true);
  });

  it('closes Parent Mode after a chosen time without use, never by default', async () => {
    render(<GeneralTab />, container);
    await waitFor(() => container.querySelector('.general-tab__checkbox') !== null);
    const select = container.querySelector<HTMLSelectElement>('.general-tab__row select')!;
    expect(select.value).toBe('0');

    act(() => {
      select.value = '15';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => parentModeTimeoutSetting.signal.value === 15);
  });

  it('offers to change the PIN, and Cancel closes it without changing anything', async () => {
    render(<GeneralTab />, container);
    await waitFor(() => container.querySelector('.general-tab__checkbox') !== null);
    expect(container.querySelector('.pin-gate-overlay')).toBeNull();

    const change = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Change the PIN')!;
    act(() => change.click());
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    expect(container.querySelector('.pin-gate__prompt')?.textContent).toContain('Choose a new');

    act(() => container.querySelector<HTMLButtonElement>('.pin-gate__cancel')!.click());
    expect(container.querySelector('.pin-gate-overlay')).toBeNull();
  });

  it('lists the Favourites and takes one away on request', async () => {
    await saveFavourite({ id: 'zebra', label: 'zebra', image: { kind: 'emoji', char: '🦓' } });
    render(<GeneralTab />, container);
    await waitFor(() => container.querySelector('.general-tab__favourite') !== null);

    const labels = () =>
      Array.from(container.querySelectorAll('.general-tab__favourite span')).map((el) => el.textContent?.trim());
    expect(labels()).toContain('🦓 zebra');

    const remove = container.querySelector<HTMLButtonElement>('button[aria-label="Remove zebra from Favourites"]')!;
    act(() => remove.click());
    await waitFor(() => !labels().includes('🦓 zebra'));
    expect((await getFavourites()).some((item) => item.id === 'zebra')).toBe(false);
    // The other favourites are untouched.
    expect(labels().some((text) => text?.endsWith('want'))).toBe(true);
  });
});
