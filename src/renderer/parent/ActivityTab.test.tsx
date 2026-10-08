import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ActivityTab } from './ActivityTab';
import { announceItem, announceText } from '../speech/announce';
import {
  activityEnabledSetting,
  activityRetentionSetting,
  clearActivity,
  getActivity,
  recordActivity,
  resetDBConnectionForTests,
} from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function stubSpeech(): void {
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = { getVoices: () => [], cancel: () => {}, speak: () => {} };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    constructor(public text: string) {}
  };
}

describe('the activity log', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    stubSpeech();
  });

  it('keeps nothing until an adult turns it on', async () => {
    await recordActivity('speech', 'hello');
    expect(await getActivity()).toEqual([]);
    announceText('hello');
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(await getActivity()).toEqual([]);
  });

  it('notes what is said, once it is on, in the same way for every phrase', async () => {
    await activityEnabledSetting.set(true);
    announceText('I want juice');
    await announceItem({ id: 'help', label: 'Someone hurt me' });
    await waitFor(async () => (await getActivity()).length === 2);
    const entries = await getActivity();
    expect(entries.map((e) => e.label).sort()).toEqual(['I want juice', 'Someone hurt me']);
    // Nothing singles a phrase out: every entry has exactly the same shape.
    expect(entries.map((e) => Object.keys(e).sort())).toEqual([['at', 'id', 'kind', 'label'], ['at', 'id', 'kind', 'label']]);
    expect(new Set(entries.map((e) => e.kind))).toEqual(new Set(['speech']));
  });

  it('does not note practice, such as the games', async () => {
    await activityEnabledSetting.set(true);
    announceText('Snap!', { keepInHistory: false });
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(await getActivity()).toEqual([]);
  });

  it('forgets what is older than the days chosen, and cuts long phrases', async () => {
    await activityEnabledSetting.set(true);
    await activityRetentionSetting.set(7);
    const now = Date.now();
    await recordActivity('speech', 'old one', now - 8 * 24 * 60 * 60 * 1000);
    await recordActivity('speech', 'x'.repeat(500), now);
    const entries = await getActivity();
    expect(entries.map((e) => e.label.length)).toEqual([200]);
  });

  it('turning it off stops it, and clearing empties it', async () => {
    await activityEnabledSetting.set(true);
    await recordActivity('screen', 'Talk');
    expect(await getActivity()).toHaveLength(1);
    await activityEnabledSetting.set(false);
    await recordActivity('screen', 'Home');
    expect(await getActivity()).toHaveLength(1);
    await clearActivity();
    expect(await getActivity()).toEqual([]);
  });
});

describe('ActivityTab', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    stubSpeech();
    (window as unknown as { myWords: unknown }).myWords = {
      files: { save: async () => ({ ok: true }) },
    };
    container = document.createElement('div');
    render(<ActivityTab />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  it('starts off, and says nothing is being kept', () => {
    expect(container.textContent).toContain('Nothing is being kept.');
    expect((container.querySelector('input[type="checkbox"]') as HTMLInputElement).checked).toBe(false);
  });

  it('turns on, and then shows counts by the hour, day, week and month', async () => {
    const box = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    act(() => {
      box.checked = true;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => activityEnabledSetting.signal.value);
    await recordActivity('speech', 'yes');
    await recordActivity('speech', 'yes');
    await recordActivity('screen', 'Talk');
    await waitFor(() => container.querySelectorAll('.activity-tab__table tbody tr').length === 3);

    const total = (label: string) => Array.from(container.querySelectorAll('.activity-tab__totals div')).find((d) => d.textContent!.startsWith(label))!.querySelector('dd')!.textContent;
    expect(total('Last hour')).toBe('3');
    expect(total('Today')).toBe('3');
    expect(total('Last 7 days')).toBe('3');
    expect(total('Last 30 days')).toBe('3');

    for (const [label, bars] of [['Hours', 24], ['Days', 14], ['Weeks', 8], ['Months', 6]] as const) {
      act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === label)!.click());
      await waitFor(() => container.querySelectorAll('.activity-tab__bar').length === bars);
      expect(Array.from(container.querySelectorAll('.activity-tab__count')).reduce((sum, c) => sum + Number(c.textContent), 0)).toBe(3);
    }
  });

  it('can show only what was said, and lists what was said most', async () => {
    await activityEnabledSetting.set(true);
    await recordActivity('speech', 'yes');
    await recordActivity('speech', 'yes');
    await recordActivity('screen', 'Talk');
    await waitFor(() => container.querySelectorAll('.activity-tab__table tbody tr').length === 3);
    expect(container.querySelector('.activity-tab__top')!.textContent).toContain('yes 2');
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.activity-tab__chip')).find((b) => b.textContent === 'What was said')!.click());
    await waitFor(() => container.querySelectorAll('.activity-tab__table tbody tr').length === 2);
  });

  it('empties the log, but only after asking', async () => {
    await activityEnabledSetting.set(true);
    await recordActivity('speech', 'hello');
    await waitFor(() => container.querySelectorAll('.activity-tab__table tbody tr').length === 1);
    const press = (label: string) => act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === label)!.click());
    press('Clear the log');
    press('Keep it');
    expect(await getActivity()).toHaveLength(1);
    press('Clear the log');
    press('Yes, empty it');
    await waitFor(async () => (await getActivity()).length === 0);
    await waitFor(() => container.textContent!.includes('The activity log is empty.'));
  });

  it('saves a spreadsheet only when asked', async () => {
    const saved: string[] = [];
    (window as unknown as { myWords: { files: { save: (text: string) => Promise<{ ok: true }> } } }).myWords.files.save = async (text) => {
      saved.push(text);
      return { ok: true };
    };
    await activityEnabledSetting.set(true);
    await recordActivity('speech', 'hello');
    await waitFor(() => container.querySelectorAll('.activity-tab__table tbody tr').length === 1);
    expect(saved).toEqual([]);
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === 'Save as a spreadsheet')!.click());
    await waitFor(() => saved.length === 1);
    expect(saved[0]).toContain('"Said","hello"');
  });
});
