import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AccessTab } from './AccessTab';
import {
  getAccessSettings,
  getPreferredSpeechPitch,
  getPreferredSpeechRate,
  getPressMode,
  resetDBConnectionForTests,
} from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('AccessTab', () => {
  let container: HTMLElement;

  // Controls are found by their section's heading, not by position — a new
  // section would otherwise silently shift every index-based lookup.
  function section(heading: string): HTMLElement {
    const found = Array.from(container.querySelectorAll<HTMLElement>('.access-tab__section')).find(
      (el) => el.querySelector('.access-tab__heading')?.textContent === heading,
    );
    if (!found) throw new Error(`No section "${heading}"`);
    return found;
  }
  const slider = (heading: string) => section(heading).querySelector<HTMLInputElement>('input[type="range"]')!;
  const select = (heading: string) => section(heading).querySelector<HTMLSelectElement>('select')!;

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

  it('defaults to everything off, speech rate and pitch to 1x, and a press to building the sentence', () => {
    expect(slider('Speech rate').value).toBe('1');
    expect(slider('Voice pitch').value).toBe('1');
    expect(select('When a button is pressed').value).toBe('sentence');
    expect(slider('Hold-to-select').value).toBe('0');
    expect(select('Switch scanning').value).toBe('off');
  });

  it('changing the speech rate slider persists to the store', async () => {
    act(() => {
      slider('Speech rate').value = '0.75';
      slider('Speech rate').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getPreferredSpeechRate()) === 0.75);
  });

  it('changing the voice pitch slider persists to the store', async () => {
    act(() => {
      slider('Voice pitch').value = '1.25';
      slider('Voice pitch').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getPreferredSpeechPitch()) === 1.25);
  });

  it('changing what a press does persists to the store', async () => {
    act(() => {
      select('When a button is pressed').value = 'both';
      select('When a button is pressed').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(async () => (await getPressMode()) === 'both');
  });

  it('changing the dwell slider persists to the store', async () => {
    act(() => {
      slider('Hold-to-select').value = '500';
      slider('Hold-to-select').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).dwellMs === 500);
  });

  it('switching scanning mode reveals the auto-advance interval only for one-switch timed', async () => {
    expect(container.textContent).not.toContain('Auto-advance');

    act(() => {
      select('Switch scanning').value = 'oneSwitchTimed';
      select('Switch scanning').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => container.textContent?.includes('Auto-advance') ?? false);

    expect(await getAccessSettings()).toMatchObject({ scanningMode: 'oneSwitchTimed' });
  });

  it('changing high contrast persists to the store', async () => {
    act(() => {
      select('Visual').value = 'dark';
      select('Visual').dispatchEvent(new Event('change', { bubbles: true }));
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
