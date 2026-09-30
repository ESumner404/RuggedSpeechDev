import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ProfilesTab } from './ProfilesTab';
import { ensureSeeded, getActiveProfileId, getProfiles, resetDBConnectionForTests } from '../store/db';
import { ROOT_BOARD_ID, SCHOOL_BOARD_ID } from '../vocab/starter';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function rowFor(container: HTMLElement, name: string): HTMLElement {
  const row = Array.from(container.querySelectorAll<HTMLElement>('.profiles-tab__row')).find((el) =>
    el.querySelector('.profiles-tab__name')?.textContent === name,
  );
  if (!row) throw new Error(`No row for "${name}"`);
  return row;
}

describe('ProfilesTab', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    await ensureSeeded();
    container = document.createElement('div');
    render(<ProfilesTab />, container);
    await waitFor(() => container.querySelectorAll('.profiles-tab__row').length > 0);
  });

  afterEach(() => {
    render(null, container);
  });

  it('lists the four named profiles, alphabetically', () => {
    const names = Array.from(container.querySelectorAll('.profiles-tab__name')).map((el) => el.textContent);
    expect(names).toEqual(['Grandparents', 'Home', 'Hospital', 'School']);
  });

  it('marks Home as active by default', () => {
    const homeRow = rowFor(container, 'Home');
    expect(homeRow.querySelector('.profiles-tab__active')).not.toBeNull();
    const schoolRow = rowFor(container, 'School');
    expect(schoolRow.querySelector('.profiles-tab__active')).toBeNull();
    expect(schoolRow.textContent).toContain('Use this profile');
  });

  it('switching the active profile persists to the store', async () => {
    const schoolRow = rowFor(container, 'School');
    const button = Array.from(schoolRow.querySelectorAll('button')).find(
      (b) => b.textContent === 'Use this profile',
    )!;
    act(() => button.click());
    await waitFor(() => rowFor(container, 'School').querySelector('.profiles-tab__active') !== null);

    expect(await getActiveProfileId()).toBe('school');
  });

  it('changing a profile\'s root board persists to the store', async () => {
    const homeRow = rowFor(container, 'Home');
    const select = homeRow.querySelector<HTMLSelectElement>('select')!;
    expect(select.value).toBe(ROOT_BOARD_ID);

    act(() => {
      select.value = SCHOOL_BOARD_ID;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 60));

    const profiles = await getProfiles();
    expect(profiles.find((p) => p.id === 'home')?.rootBoardId).toBe(SCHOOL_BOARD_ID);
  });
});
