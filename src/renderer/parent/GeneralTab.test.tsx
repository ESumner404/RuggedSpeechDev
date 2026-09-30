import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GeneralTab } from './GeneralTab';

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
});
