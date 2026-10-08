import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SchoolTab } from './SchoolTab';
import {
  getQuickAccess,
  hasSchoolPin,
  resetDBConnectionForTests,
  schoolModeSetting,
  setSchoolPin,
  verifySchoolPin,
} from '../store/db';
import { resetPinLockoutForTests } from '../store/pinSecurity';
import { DEFAULT_QUICK_ACCESS } from '../store/quickAccess';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function enterPin(container: HTMLElement, pin: string): void {
  for (const digit of pin) {
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.pin-gate__key')).find((k) => k.textContent === digit)!.click());
  }
  act(() => container.querySelector<HTMLButtonElement>('.pin-gate__key--submit')!.click());
}

describe('SchoolTab (in Parent Mode)', () => {
  let container: HTMLElement;
  const button = (text: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(text))!;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    resetPinLockoutForTests();
    container = document.createElement('div');
    render(<SchoolTab />, container);
    await new Promise((resolve) => setTimeout(resolve, 20));
  });

  afterEach(() => {
    render(null, container);
  });

  it('is off by default, and says what turning it on does, including that it is a separate PIN', () => {
    expect(container.textContent).toContain('School Mode is off');
    expect(container.textContent).toContain('It is not the Parent PIN');
    expect(schoolModeSetting.signal.value).toBe(false);
  });

  it('asks for a School PIN first, twice, and only then turns it on, leaving the top bar alone', async () => {
    act(() => button('Turn School Mode on').click());
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    expect(container.querySelector('.pin-gate__prompt')!.textContent).toContain('School PIN');
    expect(schoolModeSetting.signal.value).toBe(false); // not yet

    enterPin(container, '2468');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '2468');
    await waitFor(() => schoolModeSetting.signal.value === true);
    expect(await hasSchoolPin()).toBe(true);
    expect(await verifySchoolPin('2468')).toBe(true);
    expect(await verifySchoolPin('1357')).toBe(false);
    // No recovery code is shown for the School PIN, and nothing on the child's screen moved.
    expect(container.querySelector('.pin-gate__recovery-code')).toBeNull();
    expect(await getQuickAccess()).toEqual(DEFAULT_QUICK_ACCESS);
    expect(container.textContent).toContain('School Mode is on');
  });

  it('cancelling the PIN leaves it off', async () => {
    act(() => button('Turn School Mode on').click());
    await waitFor(() => container.querySelector('.pin-gate__cancel') !== null);
    act(() => container.querySelector<HTMLButtonElement>('.pin-gate__cancel')!.click());
    expect(schoolModeSetting.signal.value).toBe(false);
    expect(await hasSchoolPin()).toBe(false);
  });

  it('turning it off hides the button but keeps the PIN, so turning it back on does not ask again', async () => {
    await setSchoolPin('2468');
    await schoolModeSetting.set(true);
    render(null, container);
    container = document.createElement('div');
    render(<SchoolTab />, container);
    await new Promise((resolve) => setTimeout(resolve, 20));

    act(() => button('Turn School Mode off').click());
    await waitFor(() => schoolModeSetting.signal.value === false);
    expect(await hasSchoolPin()).toBe(true);
    await waitFor(() => container.textContent!.includes('School Mode is off'));

    act(() => button('Turn School Mode on').click());
    await waitFor(() => schoolModeSetting.signal.value === true);
    expect(container.querySelector('.pin-gate')).toBeNull();
  });

  it('a new School PIN can be chosen from here, with no old PIN needed, because this is Parent Mode', async () => {
    await setSchoolPin('2468');
    await schoolModeSetting.set(true);
    render(null, container);
    container = document.createElement('div');
    render(<SchoolTab />, container);
    await new Promise((resolve) => setTimeout(resolve, 20));

    act(() => button('Choose a new School PIN').click());
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent?.includes('new School PIN') ?? false);
    enterPin(container, '9753');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '9753');
    await waitFor(async () => await verifySchoolPin('9753'));
    expect(await verifySchoolPin('2468')).toBe(false);
  });

  it('the School PIN can be forgotten, only while School Mode is off, after asking', async () => {
    await setSchoolPin('2468');
    render(null, container);
    container = document.createElement('div');
    render(<SchoolTab />, container);
    await new Promise((resolve) => setTimeout(resolve, 20));
    act(() => button('Forget the School PIN').click());
    act(() => button('Keep it').click());
    expect(await hasSchoolPin()).toBe(true);
    act(() => button('Forget the School PIN').click());
    act(() => button('Yes, forget it').click());
    await waitFor(async () => !(await hasSchoolPin()));
  });
});
