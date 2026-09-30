import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BackupTab } from './BackupTab';
import { encodeBackup } from './backupCodec';
import { ensureSeeded, getPeople, resetDBConnectionForTests, savePerson } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('BackupTab', () => {
  let container: HTMLElement;
  let saveMock: ReturnType<typeof vi.fn>;
  let restoreMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    await ensureSeeded();

    saveMock = vi.fn(async () => ({ ok: true as const }));
    restoreMock = vi.fn(async () => ({ ok: false as const }));
    (window as unknown as { myWords: { backup: unknown } }).myWords = {
      backup: { save: saveMock, restore: restoreMock },
    };

    container = document.createElement('div');
    render(<BackupTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  it('saves an unencrypted backup by default', async () => {
    const button = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Save backup…')!;
    act(() => button.click());
    await waitFor(() => saveMock.mock.calls.length > 0);

    const [data] = saveMock.mock.calls[0]!;
    const envelope = JSON.parse(data as string);
    expect(envelope.encrypted).toBe(false);
    await waitFor(() => container.textContent?.includes('Backup saved.') ?? false);
  });

  it('refuses to save when passphrase protection is on but the passphrase is empty', async () => {
    const checkbox = container.querySelector<HTMLInputElement>('.backup-tab__checkbox input')!;
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const button = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Save backup…')!;
    act(() => button.click());
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(saveMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Enter a passphrase');
  });

  it('encrypts the saved backup when a passphrase is set and confirmed', async () => {
    const checkbox = container.querySelector<HTMLInputElement>('.backup-tab__checkbox input')!;
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const [passInput, confirmInput] = Array.from(
      container.querySelectorAll<HTMLInputElement>('.backup-tab__passphrase-fields input'),
    );
    act(() => {
      passInput!.value = 'family secret';
      passInput!.dispatchEvent(new Event('input', { bubbles: true }));
      confirmInput!.value = 'family secret';
      confirmInput!.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const button = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Save backup…')!;
    act(() => button.click());
    await waitFor(() => saveMock.mock.calls.length > 0);

    const [data] = saveMock.mock.calls[0]!;
    const envelope = JSON.parse(data as string);
    expect(envelope.encrypted).toBe(true);
  });

  it('restoring asks for confirmation before replacing existing data', async () => {
    await savePerson({ id: 'existing', name: 'Existing Person', phrases: [] });
    const backupText = await encodeBackup({
      formatVersion: 1,
      boards: [],
      favourites: [],
      recent: [],
      people: [{ id: 'restored', name: 'Restored Person', phrases: [] }],
      places: [],
      dayPlans: [],
      profiles: [],
      photos: {},
      voiceClips: {},
      meta: {
        recentEnabled: false,
        wordFrequency: {},
        phraseBank: { name: '', address: '', usualOrder: '', registerAnswer: '' },
        parentPin: null,
        daySettings: { view: 'today', countdownEnabled: false },
        activeProfileId: 'home',
        accessSettings: {
          dwellMs: 0,
          repeatSuppressMs: 0,
          scanningMode: 'off',
          scanIntervalMs: 1500,
          highContrast: 'off',
          textScale: 1,
          reduceMotion: false,
          lowArousalPalette: false,
        },
        medicalInfo: { childName: '', allergies: '', conditions: '', contacts: [] },
        myPages: [],
      },
    });
    restoreMock.mockResolvedValue({ ok: true, data: backupText });

    const chooseButton = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Choose backup file…',
    )!;
    act(() => chooseButton.click());
    await waitFor(() => container.textContent?.includes('Replace everything on this device') ?? false);

    // Not yet imported — the confirmation step must be a real gate.
    expect(await getPeople()).toHaveLength(1);
    expect((await getPeople())[0]?.id).toBe('existing');

    const confirmButton = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Yes, replace everything',
    )!;
    act(() => confirmButton.click());
    await waitFor(() => container.textContent?.includes('Backup restored.') ?? false);

    const people = await getPeople();
    expect(people).toHaveLength(1);
    expect(people[0]?.id).toBe('restored');
  });
});
