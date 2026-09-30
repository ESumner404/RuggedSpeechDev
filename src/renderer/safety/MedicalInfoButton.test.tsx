import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MedicalInfoButton } from './MedicalInfoButton';
import { resetDBConnectionForTests, setMedicalInfo } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('MedicalInfoButton', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('is reachable with no PIN, and says so when nothing has been set up', async () => {
    render(<MedicalInfoButton />, container);
    act(() => container.querySelector<HTMLButtonElement>('.medical-info-button')!.click());
    await waitFor(() => container.querySelector('.medical-info-overlay') !== null);

    expect(container.querySelector('.medical-info-overlay__empty')?.textContent).toContain(
      'No medical information',
    );
    expect(container.querySelector('.medical-info-overlay__qr')).toBeNull();
  });

  it('shows the QR code and readable text once medical info exists, and Close dismisses it', async () => {
    await setMedicalInfo({
      childName: 'Sam',
      allergies: 'Peanuts',
      conditions: '',
      contacts: [{ name: 'Mum', phone: '07700 900001' }],
    });

    render(<MedicalInfoButton />, container);
    act(() => container.querySelector<HTMLButtonElement>('.medical-info-button')!.click());
    await waitFor(() => container.querySelector('.medical-info-overlay') !== null);

    expect(container.querySelector('.medical-info-overlay__qr svg')).not.toBeNull();
    expect(container.querySelector('.medical-info-overlay__text')?.textContent).toContain('Sam');
    expect(container.querySelector('.medical-info-overlay__text')?.textContent).toContain('Peanuts');
    expect(container.querySelector('.medical-info-overlay__text')?.textContent).toContain('07700 900001');

    act(() => container.querySelector<HTMLButtonElement>('.medical-info-overlay__close')!.click());
    expect(container.querySelector('.medical-info-overlay')).toBeNull();
  });
});
