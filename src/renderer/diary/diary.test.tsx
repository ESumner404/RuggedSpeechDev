import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DiaryTab } from './DiaryTab';
import { MAX_DIARY, addEntry, isDiaryList, makeEntry, unreadFor } from './diary';
import { diarySeenSetting, diarySetting, resetDBConnectionForTests } from '../store/db';

describe('diary entries', () => {
  it('makes an entry from what was written, and none from nothing', () => {
    expect(makeEntry('home', '  Mum ', '  Slept well.  ', 5)).toMatchObject({ from: 'home', author: 'Mum', text: 'Slept well.', at: 5 });
    expect(makeEntry('school', 'Ms Khan', '   ', 5)).toBeNull();
  });

  it('keeps the newest first and never more than the limit', () => {
    let entries = [] as ReturnType<typeof addEntry>;
    for (let i = 0; i < MAX_DIARY + 5; i += 1) entries = addEntry(entries, makeEntry('home', 'M', `note ${i}`, i + 1)!);
    expect(entries).toHaveLength(MAX_DIARY);
    expect(entries[0]!.text).toBe(`note ${MAX_DIARY + 4}`);
  });

  it('counts what the other side has written since this side looked', () => {
    const entries = [makeEntry('home', 'M', 'a', 10)!, makeEntry('school', 'T', 'b', 20)!, makeEntry('school', 'T', 'c', 30)!];
    expect(unreadFor(entries, 'home', 15)).toBe(2);
    expect(unreadFor(entries, 'school', 15)).toBe(0);
  });

  it('checks a saved diary before using it', () => {
    expect(isDiaryList([{ id: 'a', at: 1, from: 'home', author: 'M', text: 't' }])).toBe(true);
    expect(isDiaryList([{ id: 'a', at: 1, from: 'friend', author: 'M', text: 't' }])).toBe(false);
  });
});

describe('the diary page', () => {
  let container: HTMLElement;
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    diarySetting.reset();
    diarySeenSetting.reset();
    container = document.createElement('div');
  });
  afterEach(() => render(null, container));

  it('writes as the side that is looking, and shows notes from both, marking the other side’s as new', async () => {
    diarySetting.signal.value = [makeEntry('school', 'Ms Khan', 'Used “more” at snack.', Date.now() - 1000)!];
    render(<DiaryTab side="home" />, container);
    expect(container.textContent).toContain('From school');
    expect(container.textContent).toContain('Used “more” at snack.');
    expect(container.textContent).toContain('new');
    const area = container.querySelector<HTMLTextAreaElement>('textarea')!;
    await act(() => {
      area.value = 'Said “help” at the shops.';
      area.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(() => {
      container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(diarySetting.signal.value[0]).toMatchObject({ from: 'home', text: 'Said “help” at the shops.' });
  });
});
