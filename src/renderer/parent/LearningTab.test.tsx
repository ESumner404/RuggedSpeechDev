import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LearningTab } from './LearningTab';
import {
  clearAfterSpeakSetting,
  getBoard,
  resetDBConnectionForTests,
  updateBoard,
  usageCountsSetting,
  usageEnabledSetting,
  wordStageSetting,
} from '../store/db';
import { recordPress } from '../store/usage';
import { ROOT_BOARD_ID } from '../vocab/starter';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('LearningTab', () => {
  let container: HTMLElement;
  const section = (heading: string) =>
    Array.from(container.querySelectorAll<HTMLElement>('.learning-tab__section')).find(
      (el) => el.querySelector('.learning-tab__heading')?.textContent === heading,
    )!;
  const button = (text: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(text))!;

  async function open(): Promise<void> {
    container = document.createElement('div');
    render(<LearningTab />, container);
    // The board list loads asynchronously.
    await waitFor(() => container.textContent?.includes('No words are being held back') === true || container.textContent?.includes('held back right now') === true);
  }

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
  });

  afterEach(() => {
    render(null, container);
  });

  it('starts showing every word, with nothing held back and no counting', async () => {
    await open();
    expect(wordStageSetting.signal.value).toBe(0);
    expect(section('Word stage').textContent).toContain('No words are being held back.');
    expect(usageEnabledSetting.signal.value).toBe(false);
    expect(section('Word counts').querySelector('table')).toBeNull();
  });

  it('holds words back from the chosen stage up, and says how many', async () => {
    await open(); // seeds the starter boards
    const root = (await getBoard(ROOT_BOARD_ID))!;
    await updateBoard({
      ...root,
      buttons: root.buttons.map((b) => (b.id === 'want' ? { ...b, stage: 2 } : b.id === 'like' ? { ...b, stage: 3 } : b)),
    });
    render(null, container);
    await open();

    const select = section('Word stage').querySelector('select')!;
    act(() => {
      select.value = '2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => wordStageSetting.signal.value === 2);
    await waitFor(() => section('Word stage').textContent?.includes('1 word is held back right now.') === true);
  });

  it('lists the focus words with the board each is on', async () => {
    await open();
    const root = (await getBoard(ROOT_BOARD_ID))!;
    await updateBoard({ ...root, buttons: root.buttons.map((b) => (b.id === 'go' ? { ...b, target: true } : b)) });
    render(null, container);
    await open();
    await waitFor(() => section('Focus words').textContent?.includes('go') === true);
    expect(section('Focus words').textContent).toContain('on Talk');
  });

  it('clears the sentence after speaking only when asked to', async () => {
    await open();
    const checkbox = section('After speaking').querySelector('input')!;
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => clearAfterSpeakSetting.signal.value === true);
  });

  it('counts only once switched on, then reports, exports and clears', async () => {
    await open();
    const toggle = section('Word counts').querySelector('input')!;
    act(() => {
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => usageEnabledSetting.signal.value === true);

    await recordPress('want');
    await recordPress('want');
    await recordPress('help');
    await waitFor(() => section('Word counts').querySelector('table') !== null);
    expect(section('Word counts').textContent).toContain('3 presses of 2 different words.');
    const rows = Array.from(section('Word counts').querySelectorAll('tbody tr')).map((r) => r.textContent);
    expect(rows).toEqual(['want2', 'help1']);

    const save = vi.fn().mockResolvedValue({ ok: true });
    (window as unknown as { myWords: unknown }).myWords = { files: { save } };
    act(() => button('Save the counts').click());
    await waitFor(() => save.mock.calls.length === 1);
    expect(save.mock.calls[0]![0]).toContain('date,word,count');
    expect(save.mock.calls[0]![0]).toContain(',want,2');
    expect(save.mock.calls[0]![1]).toMatchObject({ extensions: ['csv'] });

    act(() => button('Clear the counts').click());
    expect(Object.keys(usageCountsSetting.signal.value)).not.toHaveLength(0); // asked first
    act(() => button('Yes, clear them').click());
    await waitFor(() => Object.keys(usageCountsSetting.signal.value).length === 0);
  });
});
