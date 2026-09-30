import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MedicalInfoTab } from './MedicalInfoTab';
import { getMedicalInfo, resetDBConnectionForTests } from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('MedicalInfoTab', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<MedicalInfoTab />, container);
    await waitFor(() => container.querySelector('.medical-info-tab') !== null);
  });

  afterEach(() => {
    render(null, container);
  });

  it('shows the empty-preview message when nothing has been entered', () => {
    expect(container.querySelector('.medical-info-tab__empty')).not.toBeNull();
    expect(container.querySelector('.medical-info-tab__qr')).toBeNull();
  });

  it('typing the child\'s name persists it and updates the live preview', async () => {
    const nameInput = container.querySelector<HTMLInputElement>('.medical-info-tab__field input[type="text"]')!;
    act(() => {
      nameInput.value = 'Sam';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await waitFor(async () => (await getMedicalInfo()).childName === 'Sam');
    await waitFor(() => container.querySelector('.medical-info-tab__qr') !== null);
    expect(container.querySelector('.medical-info-tab__text')?.textContent).toContain('Sam');
  });

  it('adding and removing a contact persists the change', async () => {
    act(() => container.querySelector<HTMLButtonElement>('.medical-info-tab__contacts button')!.click());
    await waitFor(() => container.querySelectorAll('.medical-info-tab__contact-row').length === 1);

    const row = container.querySelector<HTMLElement>('.medical-info-tab__contact-row')!;
    const nameInput = row.querySelector<HTMLInputElement>('input[placeholder="Name"]')!;
    const phoneInput = row.querySelector<HTMLInputElement>('input[placeholder="Phone"]')!;
    act(() => {
      nameInput.value = 'Mum';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      phoneInput.value = '07700 900001';
      phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await waitFor(async () => {
      const info = await getMedicalInfo();
      return info.contacts.length === 1 && info.contacts[0]?.name === 'Mum';
    });

    act(() => row.querySelector<HTMLButtonElement>('.medical-info-tab__remove')!.click());
    await waitFor(async () => (await getMedicalInfo()).contacts.length === 0);
  });
});
