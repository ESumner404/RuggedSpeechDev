import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QuickAccessTab } from './QuickAccessTab';
import { getQuickAccess, resetDBConnectionForTests } from '../store/db';
import { DEFAULT_QUICK_ACCESS } from '../store/quickAccess';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('QuickAccessTab (docs/build-plan.md Phase 2)', () => {
  let container: HTMLElement;

  const selects = () => Array.from(container.querySelectorAll<HTMLSelectElement>('.quick-access-tab__slot select'));

  function choose(slot: number, id: string): void {
    const select = selects()[slot]!;
    act(() => {
      select.value = id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<QuickAccessTab />, container);
    await waitFor(() => container.querySelector('.quick-access-tab') !== null);
  });

  afterEach(() => {
    render(null, container);
  });

  it('shows the six current buttons in order', () => {
    expect(selects().map((s) => s.value)).toEqual(DEFAULT_QUICK_ACCESS);
  });

  it('choosing a new button for a slot persists it', async () => {
    choose(5, 'talk');
    await waitFor(async () => (await getQuickAccess())[5] === 'talk');
    expect((await getQuickAccess())[1]).toBe('help');
  });

  it('choosing one already on the bar swaps, so nothing appears twice', async () => {
    choose(0, 'keyboard');
    await waitFor(async () => (await getQuickAccess())[0] === 'keyboard');
    expect(await getQuickAccess()).toEqual(['keyboard', 'help', 'yes', 'no', 'favourites', 'home']);
  });

  it('refuses to take Help off the bar, says why, and keeps the stored layout', async () => {
    choose(1, 'talk');
    await waitFor(() => container.querySelector('.parent-mode-screen__error') !== null);
    expect(container.querySelector('.parent-mode-screen__error')?.textContent).toContain('Help');
    expect(await getQuickAccess()).toEqual(DEFAULT_QUICK_ACCESS);
    expect(selects()[1]!.value).toBe('help');
  });

  it('"Put back the usual six" restores the default', async () => {
    choose(5, 'talk');
    await waitFor(async () => (await getQuickAccess())[5] === 'talk');

    const reset = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('usual six'),
    )!;
    act(() => reset.click());
    await waitFor(async () => (await getQuickAccess())[5] === 'keyboard');
    expect(selects().map((s) => s.value)).toEqual(DEFAULT_QUICK_ACCESS);
  });
});
