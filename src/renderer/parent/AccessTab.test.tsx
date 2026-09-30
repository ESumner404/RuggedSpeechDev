import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AccessTab } from './AccessTab';
import { getAccessSettings, getPreferredSpeechRate, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('AccessTab', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<AccessTab />, container);
    await waitFor(() => container.querySelector('.access-tab') !== null);
  });

  afterEach(() => {
    render(null, container);
  });

  it('defaults to everything off, and speech rate to 1x', () => {
    const speechRateSlider = container.querySelectorAll<HTMLInputElement>('input[type="range"]')[0]!;
    expect(speechRateSlider.value).toBe('1');
    const dwellSlider = container.querySelectorAll<HTMLInputElement>('input[type="range"]')[1]!;
    expect(dwellSlider.value).toBe('0');
    const scanSelect = container.querySelectorAll<HTMLSelectElement>('select')[0]!;
    expect(scanSelect.value).toBe('off');
  });

  it('changing the speech rate slider persists to the store', async () => {
    const speechRateSlider = container.querySelectorAll<HTMLInputElement>('input[type="range"]')[0]!;
    act(() => {
      speechRateSlider.value = '0.75';
      speechRateSlider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getPreferredSpeechRate()) === 0.75);
  });

  it('changing the dwell slider persists to the store', async () => {
    const dwellSlider = container.querySelectorAll<HTMLInputElement>('input[type="range"]')[1]!;
    act(() => {
      dwellSlider.value = '500';
      dwellSlider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).dwellMs === 500);
  });

  it('switching scanning mode reveals the auto-advance interval only for one-switch timed', async () => {
    const scanSelect = container.querySelectorAll<HTMLSelectElement>('select')[0]!;
    expect(container.textContent).not.toContain('Auto-advance');

    act(() => {
      scanSelect.value = 'oneSwitchTimed';
      scanSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => container.textContent?.includes('Auto-advance') ?? false);

    expect(await getAccessSettings()).toMatchObject({ scanningMode: 'oneSwitchTimed' });
  });

  it('changing high contrast persists to the store', async () => {
    const contrastSelect = container.querySelectorAll<HTMLSelectElement>('select')[1]!;
    act(() => {
      contrastSelect.value = 'dark';
      contrastSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).highContrast === 'dark');
  });

  it('toggling low-arousal palette persists to the store', async () => {
    const checkbox = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).find(
      (input) => input.closest('label')?.textContent?.includes('Low-arousal'),
    )!;
    expect(checkbox).toBeDefined();
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).lowArousalPalette === true);
  });
});
