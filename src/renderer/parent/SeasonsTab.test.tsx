import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SeasonsTab } from './SeasonsTab';
import { resetDBConnectionForTests, seasonsSetting } from '../store/db';
import { DEFAULT_SEASONS_CONFIG } from '../vocab/seasons';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('Seasons tab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    seasonsSetting.signal.value = DEFAULT_SEASONS_CONFIG;
    container = document.createElement('div');
    render(<SeasonsTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const headings = () => Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);
  const box = (name: string) =>
    Array.from(container.querySelectorAll<HTMLLabelElement>('.seasons-tab__show')).find((l) => l.textContent!.includes(name))!.querySelector<HTMLInputElement>('input')!;
  const flip = (name: string) =>
    act(() => {
      const input = box(name);
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  const press = (label: string) => act(() => container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!.click());
  const type = (selector: string, value: string) =>
    act(() => {
      const input = container.querySelector<HTMLInputElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

  it('groups the celebrations by tradition, so a family can find theirs', () => {
    expect(headings()).toEqual(['The year', 'Christian', 'Muslim', 'Jewish', 'Hindu', 'Other celebrations', 'Add a celebration', 'Start again']);
    expect(box('Eid').checked).toBe(true);
    expect(container.textContent).toContain('Eid al-Fitr');
  });

  it('leaves a celebration out, and brings it back', async () => {
    flip('Christmas');
    await waitFor(() => seasonsSetting.signal.value.hidden.includes('christmas'));
    expect(box('Christmas').checked).toBe(false);
    flip('Christmas');
    await waitFor(() => seasonsSetting.signal.value.hidden.length === 0);
  });

  it('changes the words of a season, adds one, removes one, and puts the usual words back', async () => {
    press('Change the words for Eid');
    type('input[aria-label="Word 1 of Eid"]', 'crescent moon');
    await waitFor(() => seasonsSetting.signal.value.words['eid']?.[0]?.label === 'crescent moon');
    expect(seasonsSetting.signal.value.words['eid']).toHaveLength(9);

    press('Remove the word crescent moon from Eid');
    await waitFor(() => seasonsSetting.signal.value.words['eid']!.length === 8);

    type('input[aria-label="The new word"]', 'henna');
    act(() => {
      container.querySelector('form.seasons-tab__add')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => seasonsSetting.signal.value.words['eid']!.length === 9);
    expect(seasonsSetting.signal.value.words['eid']!.at(-1)!.label).toBe('henna');

    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Put back the usual words')!.click());
    await waitFor(() => seasonsSetting.signal.value.words['eid'] === undefined);
  });

  it('adds a celebration from the list, with its words to check, and can remove it', async () => {
    act(() => {
      const select = container.querySelector<HTMLSelectElement>('select[aria-label="Add a celebration from the list"]')!;
      select.value = 'ramadan';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add it')!.click());
    await waitFor(() => seasonsSetting.signal.value.custom.length === 1);
    expect(seasonsSetting.signal.value.custom[0]).toMatchObject({ id: 'ramadan', name: 'Ramadan', tradition: 'Muslim' });
    expect(seasonsSetting.signal.value.words['ramadan']!.map((w) => w.label)).toContain('iftar');
    // it appears with the Muslim celebrations, and is no longer in the list to add
    await waitFor(() => container.querySelector('button[aria-label="Remove Ramadan"]') !== null);
    expect(container.querySelector('option[value="ramadan"]')).toBeNull();
    press('Remove Ramadan');
    await waitFor(() => seasonsSetting.signal.value.custom.length === 0);
    expect(seasonsSetting.signal.value.words['ramadan']).toBeUndefined();
  });

  it('adds a celebration of the family\'s own, with no words to begin with', async () => {
    type('input[aria-label="Name of your own celebration"]', 'Kite day');
    act(() => {
      container.querySelector('form.seasons-tab__row')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await waitFor(() => seasonsSetting.signal.value.custom.length === 1);
    expect(seasonsSetting.signal.value.custom[0]!.name).toBe('Kite day');
    expect(seasonsSetting.signal.value.words[seasonsSetting.signal.value.custom[0]!.id]).toEqual([]);
    await waitFor(() => headings().includes('Your own'));
  });

  it('puts everything back to the usual', async () => {
    flip('Eid');
    await waitFor(() => seasonsSetting.signal.value.hidden.length === 1);
    act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Put everything back to the usual')!.click());
    await waitFor(() => seasonsSetting.signal.value.hidden.length === 0);
    expect(seasonsSetting.signal.value).toEqual(DEFAULT_SEASONS_CONFIG);
  });
});
