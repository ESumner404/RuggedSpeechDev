import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NotesTab } from './NotesTab';
import { ReportsTab } from './ReportsTab';
import { TargetsTab } from './TargetsTab';
import { handoverSheet, reviewSheet } from './reports';
import {
  EMPTY_ABOUT_ME,
  EMPTY_ROUTINE,
  EMPTY_USER_PROFILE,
  DEFAULT_ACCESS_SETTINGS,
  noteAuthorSetting,
  resetDBConnectionForTests,
  staffNotesSetting,
  targetsSetting,
} from '../store/db';
import {
  EMPTY_SCHOOL_INFO,
  isNoteList,
  isSchoolInfo,
  isTargetList,
  reviewDue,
  routineIsEmpty,
  sortedTargets,
  suggestedReturnTo,
  typicalSchoolWeek,
  type Target,
} from '../store/staff';
import { DEFAULT_TRAFFIC } from '../signals/traffic';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

const target = (over: Partial<Target> = {}): Target => ({ id: 't', text: 'Asks for help', area: 'express', status: 'working', set: '2026-09-01', review: '', notes: '', ...over });

describe('staff data', () => {
  it('puts targets being worked on first, then paused, then achieved', () => {
    const list = [target({ id: 'a', status: 'achieved' }), target({ id: 'b', status: 'paused' }), target({ id: 'c' })];
    expect(sortedTargets(list).map((t) => t.id)).toEqual(['c', 'b', 'a']);
  });

  it('says when a target is due to be looked at again', () => {
    expect(reviewDue(target({ review: '2026-10-01' }), '2026-10-07')).toBe(true);
    expect(reviewDue(target({ review: '2026-10-07' }), '2026-10-07')).toBe(true);
    expect(reviewDue(target({ review: '2026-11-01' }), '2026-10-07')).toBe(false);
    expect(reviewDue(target({ review: '' }), '2026-10-07')).toBe(false);
    expect(reviewDue(target({ review: '2026-10-01', status: 'achieved' }), '2026-10-07')).toBe(false);
  });

  it('checks what was saved before using it', () => {
    expect(isTargetList([target()])).toBe(true);
    expect(isTargetList([{ ...target(), status: 'done' }])).toBe(false);
    expect(isNoteList([{ id: 'n', at: 1, by: '', text: 'x' }])).toBe(true);
    expect(isNoteList([{ id: 'n', at: 'now', by: '', text: 'x' }])).toBe(false);
    expect(isSchoolInfo(EMPTY_SCHOOL_INFO)).toBe(true);
    expect(isSchoolInfo({ school: 'x' })).toBe(false);
  });

  it('offers a typical school week, Monday to Friday, in time order, with unique ids', () => {
    const week = typicalSchoolWeek();
    expect(week.sat).toEqual([]);
    for (const day of [week.mon, week.fri]) {
      const times = day.map((a) => a.time!);
      expect([...times].sort()).toEqual(times);
    }
    const ids = Object.values(week).flat().map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(routineIsEmpty(week)).toBe(false);
    expect(routineIsEmpty(EMPTY_ROUTINE)).toBe(true);
  });

  it('suggests who to return a lost device to from the school details', () => {
    expect(suggestedReturnTo({ ...EMPTY_SCHOOL_INFO, school: 'Oakfield', className: 'Year 2' })).toBe('Oakfield, Year 2');
    expect(suggestedReturnTo(EMPTY_SCHOOL_INFO)).toBe('');
  });
});

describe('the sheets', () => {
  const base = {
    profile: { ...EMPTY_USER_PROFILE, name: 'Lucy', age: '6' },
    school: { ...EMPTY_SCHOOL_INFO, school: 'Oakfield', keyAdult: 'Mr Khan' },
    about: { ...EMPTY_ABOUT_ME, whatHelps: 'A warning before changes' },
    targets: [target({ text: 'Uses I want' }), target({ id: 'd', text: 'Says hello', status: 'achieved' })],
    focusWords: ['juice', 'more'],
    press: 'sentence' as const,
    speakStyle: 'wordByWord' as const,
    access: { ...DEFAULT_ACCESS_SETTINGS, scanningMode: 'twoSwitchStepped' as const },
    traffic: DEFAULT_TRAFFIC,
  };

  it('the handover sheet says who, how it works, what helps and what is being worked on', () => {
    const sheet = handoverSheet(base);
    expect(sheet.heading).toBe('Handover: Lucy');
    const text = sheet.sections.map((s) => `${s.title} ${s.lines.join(' ')}`).join('\n');
    expect(text).toContain('Age: 6');
    expect(text).toContain("Device: Lucy's device");
    expect(text).toContain('Key adult or teaching assistant: Mr Khan');
    expect(text).toContain('A warning before changes');
    expect(text).toContain('Uses two switches');
    expect(text).toContain('one word at a time');
    expect(text).toContain('juice, more');
    expect(text).toContain('Uses I want');
    expect(text).not.toContain('Says hello'); // already achieved
    expect(text).toContain("Please don't talk to me right now.");
    expect(text).toContain('safeguarding procedure');
  });

  it('leaves out what is not filled in, rather than printing empty headings', () => {
    const sheet = handoverSheet({ ...base, about: EMPTY_ABOUT_ME, targets: [], focusWords: [], school: EMPTY_SCHOOL_INFO });
    expect(sheet.sections.map((s) => s.title)).not.toContain('Words being practised');
    expect(sheet.sections.map((s) => s.title)).not.toContain('Current targets');
    expect(sheet.sections.map((s) => s.title)).not.toContain('What helps me');
  });

  it('the review report covers the targets, the use, the words and the notes in the time chosen', () => {
    const now = new Date(2026, 9, 7, 12).getTime();
    const day = 24 * 60 * 60 * 1000;
    const sheet = reviewSheet({
      profile: base.profile,
      about: EMPTY_ABOUT_ME,
      targets: base.targets,
      notes: [
        { id: '1', at: now - 2 * day, by: 'Mrs Ali', text: 'Chose juice with two words.' },
        { id: '2', at: now - 100 * day, by: '', text: 'Too old to include.' },
      ],
      days: 30,
      now,
      activity: [
        { at: now - day, kind: 'speech', label: 'juice' },
        { at: now - day, kind: 'speech', label: 'juice' },
        { at: now - day, kind: 'screen', label: 'Talk' },
        { at: now - 60 * day, kind: 'speech', label: 'old' },
      ],
      activityOn: true,
      usage: {},
      usageOn: false,
    });
    const text = sheet.sections.map((s) => `${s.title} ${s.lines.join(' ')}`).join('\n');
    expect(sheet.heading).toBe('Review: Lucy');
    expect(text).toContain('Things said: 2');
    expect(text).toContain('Parts of the app opened: 1');
    expect(text).toContain('juice (2)');
    expect(text).not.toContain('old');
    expect(text).toContain('Chose juice with two words.');
    expect(text).not.toContain('Too old to include.');
    expect(text).toContain('Working on it (Saying things): Uses I want');
    expect(text).toContain('Achieved (Saying things): Says hello');
  });

  it('says so when the log is off, instead of reporting zero', () => {
    const sheet = reviewSheet({ profile: EMPTY_USER_PROFILE, about: EMPTY_ABOUT_ME, targets: [], notes: [], days: 30, now: Date.now(), activity: [], activityOn: false, usage: {}, usageOn: false });
    expect(sheet.sections.map((s) => s.lines.join(' ')).join(' ')).toContain('The activity log is off');
  });
});

describe('the staff tabs', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  const type = (selector: string, value: string, index = 0) =>
    act(() => {
      const input = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(selector)[index]!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  // A form that is not on a real page is not submitted by pressing its button, so send the submit.
  const submit = (selector: string) =>
    act(() => void container.querySelector(selector)!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  const press = (label: string) => act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === label)!.click());

  it('Targets: adds one, marks it achieved, and removes it', async () => {
    render(<TargetsTab />, container);
    type('.targets-tab__form input[type="text"]', 'Uses I want and a word');
    await waitFor(() => !(Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add target') as HTMLButtonElement).disabled);
    submit('.targets-tab__form');
    await waitFor(() => targetsSetting.signal.value.length === 1);
    expect(targetsSetting.signal.value[0]).toMatchObject({ text: 'Uses I want and a word', status: 'working', area: 'express' });
    await waitFor(() => container.querySelector('.targets-tab__target') !== null);

    const status = container.querySelector<HTMLSelectElement>('select[aria-label^="Status of"]')!;
    act(() => {
      status.value = 'achieved';
      status.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => targetsSetting.signal.value[0]!.status === 'achieved');

    act(() => container.querySelector<HTMLButtonElement>('button[aria-label^="Remove target"]')!.click());
    await waitFor(() => targetsSetting.signal.value.length === 0);
  });

  it('Targets: says when one is due to be looked at again', async () => {
    await targetsSetting.set([target({ review: '2020-01-01' })]);
    render(<TargetsTab />, container);
    expect(container.textContent).toContain('Time to look at this again');
  });

  it('Notes: adds a note with who wrote it, remembers the name, and removes only after asking', async () => {
    render(<NotesTab />, container);
    type('.notes-tab__form input', 'Mrs Ali');
    await waitFor(() => noteAuthorSetting.signal.value === 'Mrs Ali');
    type('.notes-tab__form textarea', 'Chose juice twice.');
    await waitFor(() => !(Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Add note') as HTMLButtonElement).disabled);
    submit('.notes-tab__form');
    await waitFor(() => staffNotesSetting.signal.value.length === 1);
    expect(staffNotesSetting.signal.value[0]).toMatchObject({ by: 'Mrs Ali', text: 'Chose juice twice.' });
    await waitFor(() => container.querySelector('.notes-tab__note') !== null);

    act(() => container.querySelector<HTMLButtonElement>('button[aria-label^="Remove the note"]')!.click());
    press('Keep it');
    expect(staffNotesSetting.signal.value).toHaveLength(1);
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label^="Remove the note"]')!.click());
    press('Yes, remove it');
    await waitFor(() => staffNotesSetting.signal.value.length === 0);
  });

  it('Reports: shows the handover sheet and can switch to the review', async () => {
    (window as unknown as { print: () => void }).print = () => {};
    render(<ReportsTab />, container);
    await waitFor(() => container.querySelector('.staff-sheet') !== null);
    expect(container.querySelector('.staff-sheet__heading')!.textContent).toBe('Handover');
    press('Review report');
    await waitFor(() => container.querySelector('.staff-sheet__heading')!.textContent === 'Review');
    expect(container.textContent).toContain('The activity log is off');
  });
});
