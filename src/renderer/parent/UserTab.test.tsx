import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UserTab } from './UserTab';
import { resetDBConnectionForTests, userProfileSetting } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('UserTab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<UserTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  function type(label: string, value: string): void {
    act(() => {
      const field = Array.from(container.querySelectorAll<HTMLLabelElement>('label')).find((l) => l.textContent?.startsWith(label))!;
      const input = field.querySelector<HTMLInputElement>('input')!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  it('names the device after the person, as it will look, and keeps it', async () => {
    type('Name', 'Lucy');
    await waitFor(() => userProfileSetting.signal.value.name === 'Lucy');
    await waitFor(() => container.querySelector('.user-tab__preview')!.textContent!.includes("Lucy's device"));
    expect(await userProfileSetting.get()).toMatchObject({ name: 'Lucy' });
  });

  it('lets the device have a name of its own', async () => {
    type('Name', 'Lucy');
    type('Device name', "Lucy's talker");
    await waitFor(() => container.querySelector('.user-tab__preview')!.textContent!.includes("Lucy's talker"));
  });

  it('keeps only digits in the age', async () => {
    type('Age', '6a');
    await waitFor(() => userProfileSetting.signal.value.age === '6');
  });

  it('chooses and un-chooses a picture, and can hide the name from the child\'s screen', async () => {
    const picture = () => container.querySelector<HTMLButtonElement>('button[aria-label="Use 🦁"]')!;
    act(() => picture().click());
    await waitFor(() => userProfileSetting.signal.value.emoji === '🦁');
    act(() => picture().click());
    await waitFor(() => userProfileSetting.signal.value.emoji === '');

    const show = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(show.checked).toBe(true);
    act(() => {
      show.checked = false;
      show.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => userProfileSetting.signal.value.showOnScreen === false);
  });
});
