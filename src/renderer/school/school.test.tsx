import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClassroomTab } from './ClassroomTab';
import { PupilTab } from './PupilTab';
import { SafeguardingTab } from './SafeguardingTab';
import { SchoolModeScreen } from './SchoolModeScreen';
import { TodayTab } from './TodayTab';
import { NotesTab } from '../parent/NotesTab';
import { getDateString } from '../day/dayLogic';
import {
  EMPTY_USER_PROFILE,
  getActiveProfile,
  getQuickAccess,
  noteAuthorSetting,
  resetDBConnectionForTests,
  schoolInfoSetting,
  schoolTimeoutSetting,
  setSchoolPin,
  staffNotesSetting,
  targetsSetting,
  userProfileSetting,
  verifySchoolPin,
  weeklyRoutineSetting,
} from '../store/db';
import { resetPinLockoutForTests } from '../store/pinSecurity';
import { SCHOOL_QUICK_ACCESS } from '../store/quickAccess';
import { EMPTY_SCHOOL_INFO, routineIsEmpty, typicalSchoolWeek } from '../store/staff';
import { weekdayOf } from '../day/routine';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

let container: HTMLElement;
const button = (text: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim() === text)!;
const buttonIncluding = (text: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(text))!;
const typeInto = (el: HTMLInputElement | HTMLTextAreaElement, value: string) =>
  act(() => {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
  resetPinLockoutForTests();
  container = document.createElement('div');
});

afterEach(() => {
  render(null, container);
  vi.useRealTimers();
});

describe('SchoolModeScreen', () => {
  it('is its own place: School Mode in the title, a menu of its own, and Today first', async () => {
    render(<SchoolModeScreen onExit={() => {}} />, container);
    expect(container.querySelector('.parent-mode-screen__title')!.textContent).toBe('School Mode');
    expect(container.querySelector('.parent-mode-screen__exit')!.textContent).toBe('Exit School Mode');
    expect(Array.from(container.querySelectorAll('.parent-nav__tab')).map((t) => t.textContent)).toEqual([
      'Today',
      'Pupil and school',
      'About me',
      'Safeguarding',
      'Timetable',
      'Lesson pages',
      'Vocabulary',
      'Targets',
      'Notes',
      'Activity',
      'Reports',
      'Classroom set-up',
      'School guide',
    ]);
    expect(container.querySelector('.today-tab')).not.toBeNull();
    expect(container.querySelector('.school-nav')).not.toBeNull();
  });

  it('opens each part, and leaves with Exit', async () => {
    const onExit = vi.fn();
    render(<SchoolModeScreen onExit={onExit} />, container);
    const open = async (name: string, selector: string) => {
      act(() => button(name).click());
      await waitFor(() => container.querySelector(selector) !== null);
    };
    await open('Pupil and school', '.pupil-tab');
    await open('Safeguarding', '.safeguarding-tab');
    await open('Targets', '.targets-tab');
    await open('Notes', '.notes-tab');
    await open('Activity', '.activity-tab');
    await open('Reports', '.reports-tab');
    await open('Classroom set-up', '.classroom-tab');
    await open('School guide', '.guide');
    expect(container.querySelector('.activity-tab__chip--on')!.textContent).toBe('Start here: teachers and staff');
    act(() => container.querySelector<HTMLButtonElement>('.parent-mode-screen__exit')!.click());
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('closes itself after the time chosen without use, and not before', async () => {
    schoolTimeoutSetting.signal.value = 5;
    vi.useFakeTimers();
    const onExit = vi.fn();
    await act(async () => {
      render(<SchoolModeScreen onExit={onExit} />, container);
    });
    await act(async () => void vi.advanceTimersByTime(4 * 60_000));
    expect(onExit).not.toHaveBeenCalled();
    act(() => void document.dispatchEvent(new Event('pointerdown', { bubbles: true })));
    await act(async () => void vi.advanceTimersByTime(4 * 60_000));
    expect(onExit).not.toHaveBeenCalled(); // use started the time again
    await act(async () => void vi.advanceTimersByTime(2 * 60_000));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('never closes by itself when the time is set to never', async () => {
    schoolTimeoutSetting.signal.value = 0;
    vi.useFakeTimers();
    const onExit = vi.fn();
    await act(async () => {
      render(<SchoolModeScreen onExit={onExit} />, container);
    });
    await act(async () => void vi.advanceTimersByTime(3 * 60 * 60_000));
    expect(onExit).not.toHaveBeenCalled();
  });
});

describe('TodayTab', () => {
  const go = vi.fn();

  it('shows the date and whose device it is, and says plainly when nothing is planned or logged', async () => {
    await userProfileSetting.set({ ...EMPTY_USER_PROFILE, name: 'Lucy' });
    render(<TodayTab go={go} />, container);
    expect(container.querySelector('.today-tab__who')!.textContent).toBe("Lucy's device");
    await waitFor(() => container.textContent!.includes('Nothing planned for today.'));
    expect(container.textContent).toContain('No notes yet.');
    expect(container.textContent).toContain('The activity log is off');
  });

  it("lists today's timetable, the targets being worked on and due, and the latest notes", async () => {
    const today = getDateString(new Date());
    const week = typicalSchoolWeek();
    await weeklyRoutineSetting.set({ ...week, [weekdayOf(today)]: [{ id: 'x', name: 'Registration', time: '08:50' }] });
    await targetsSetting.set([
      { id: 'a', text: 'Asks for more', area: 'express', status: 'working', set: '2026-01-01', review: '2020-01-01', notes: '' },
      { id: 'b', text: 'Says hello', area: 'social', status: 'working', set: '2026-01-01', review: '', notes: '' },
      { id: 'c', text: 'Done one', area: 'express', status: 'achieved', set: '2026-01-01', review: '', notes: '' },
    ]);
    await staffNotesSetting.set([
      { id: '1', at: Date.now() - 1000, by: 'Mrs Ali', text: 'Chose juice.' },
      { id: '2', at: Date.now() - 5000, by: '', text: 'Used help twice.' },
    ]);
    render(<TodayTab go={go} />, container);
    await waitFor(() => container.textContent!.includes('Registration'));
    expect(container.querySelector('.today-tab__big')!.textContent).toBe('2');
    expect(container.querySelector('.targets-tab__due')!.textContent).toContain('1 target is due');
    expect(container.textContent).toContain('Chose juice.');
    expect(container.textContent).toContain('Used help twice.');
  });

  it('adds a quick note, with the name last used, as a note somebody noticed', async () => {
    await noteAuthorSetting.set('Mr Khan');
    render(<TodayTab go={go} />, container);
    typeInto(container.querySelector<HTMLTextAreaElement>('.today-tab__quick textarea')!, 'Pointed to the juice.');
    await waitFor(() => !buttonIncluding('Add note').disabled);
    act(() => void container.querySelector('.today-tab__quick')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await waitFor(() => staffNotesSetting.signal.value.length === 1);
    expect(staffNotesSetting.signal.value[0]).toMatchObject({ by: 'Mr Khan', text: 'Pointed to the juice.', kind: 'observation' });
    await waitFor(() => container.textContent!.includes('Added.'));
  });

  it('jumps to the part you ask for', async () => {
    const jump = vi.fn();
    render(<TodayTab go={jump} />, container);
    act(() => button('Open targets').click());
    act(() => button('Print a handover sheet').click());
    act(() => button('Safeguarding').click());
    expect(jump.mock.calls.map((c) => c[0])).toEqual(['targets', 'reports', 'safeguarding']);
  });
});

describe('PupilTab and SafeguardingTab', () => {
  it('shows the child, keeps the school details, and leaves the safeguarding lead to its own page', async () => {
    await userProfileSetting.set({ ...EMPTY_USER_PROFILE, name: 'Lucy', age: '6' });
    render(<PupilTab />, container);
    expect(container.textContent).toContain("Lucy's device");
    expect(container.querySelector('.pupil-tab__facts')!.textContent).toContain('6');
    const labels = Array.from(container.querySelectorAll('.school-tab__fields label')).map((l) => l.textContent);
    expect(labels.some((l) => l!.startsWith('School or setting'))).toBe(true);
    expect(labels.some((l) => l!.startsWith('Designated safeguarding lead'))).toBe(false);
    typeInto(container.querySelector<HTMLInputElement>('.school-tab__fields input')!, 'Oakfield Primary');
    await waitFor(() => schoolInfoSetting.signal.value.school === 'Oakfield Primary');
  });

  it('puts the safeguarding steps first, with the lead beside them once typed in, and says what the device does not do', async () => {
    render(<SafeguardingTab />, container);
    expect(container.textContent).toContain("Follow your setting's safeguarding procedure");
    expect(container.textContent).toContain('Add the designated safeguarding lead below');
    expect(container.textContent).toContain('speaks the phrase and stops');
    const [lead, phone] = Array.from(container.querySelectorAll<HTMLInputElement>('.school-tab__fields input'));
    typeInto(lead!, 'Mrs Okafor');
    typeInto(phone!, '01234 000111');
    await waitFor(() => container.querySelector('.safeguarding-tab__lead')!.textContent!.includes('Mrs Okafor'));
    expect(container.querySelector('.safeguarding-tab__lead')!.textContent).toContain('01234 000111');
    expect(schoolInfoSetting.signal.value).toMatchObject({ dsl: 'Mrs Okafor', dslPhone: '01234 000111' });
  });

  it('opens details saved before the safeguarding lead was added', async () => {
    const { dsl: _dsl, dslPhone: _phone, ...old } = EMPTY_SCHOOL_INFO;
    void _dsl;
    void _phone;
    await schoolInfoSetting.set(old as never);
    render(<SafeguardingTab />, container);
    expect(container.textContent).toContain('Add the designated safeguarding lead below');
  });
});

describe('ClassroomTab', () => {
  it('changes the top bar and the first page only after asking, and says so', async () => {
    render(<ClassroomTab />, container);
    act(() => button('Use the school top bar').click());
    act(() => button('Not now').click());
    expect(await getQuickAccess()).not.toEqual(SCHOOL_QUICK_ACCESS);

    act(() => button('Use the school top bar').click());
    act(() => button('Yes, change them').click());
    await waitFor(async () => (await getQuickAccess()).join() === SCHOOL_QUICK_ACCESS.join());
    expect((await getActiveProfile()).id).toBe('school');
    expect(container.textContent).toContain('The top bar is now Home, Help, Yes, No, Break and Question');
  });

  it('starts a typical school day only when there is no timetable', async () => {
    render(<ClassroomTab />, container);
    act(() => button('Start from a typical school day').click());
    await waitFor(() => !routineIsEmpty(weeklyRoutineSetting.signal.value));
    expect(weeklyRoutineSetting.signal.value.mon.map((a) => a.name)).toContain('Registration');
    await waitFor(() => button('Start from a typical school day').disabled);
  });

  it('chooses how long before School Mode closes', async () => {
    render(<ClassroomTab />, container);
    const select = container.querySelector<HTMLSelectElement>('select')!;
    expect(select.value).toBe('10');
    act(() => {
      select.value = '30';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => schoolTimeoutSetting.signal.value === 30);
  });

  it('chooses a new School PIN from inside, after the old one was used to get in', async () => {
    await setSchoolPin('2468');
    render(<ClassroomTab />, container);
    act(() => button('Choose a new School PIN').click());
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent?.includes('new School PIN') ?? false);
    const enter = (pin: string) => {
      for (const digit of pin) act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.pin-gate__key')).find((k) => k.textContent === digit)!.click());
      act(() => container.querySelector<HTMLButtonElement>('.pin-gate__key--submit')!.click());
    };
    enter('1122');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enter('1122');
    await waitFor(async () => await verifySchoolPin('1122'));
    await waitFor(() => container.textContent!.includes('The School PIN is changed.'));
  });
});

describe('Notes with a kind', () => {
  it('records what sort of note it is, shows it, and can show only one sort', async () => {
    render(<NotesTab />, container);
    const addNote = async (kind: string, text: string) => {
      const select = container.querySelector<HTMLSelectElement>('.notes-tab__form select')!;
      act(() => {
        select.value = kind;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      typeInto(container.querySelector<HTMLTextAreaElement>('.notes-tab__form textarea')!, text);
      await waitFor(() => !buttonIncluding('Add note').disabled);
      act(() => void container.querySelector('.notes-tab__form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
      await waitFor(() => staffNotesSetting.signal.value.some((n) => n.text === text));
    };
    await addNote('success', 'Asked for more, twice.');
    await addNote('idea', 'Try the snack page.');
    await waitFor(() => container.querySelectorAll('.notes-tab__note').length === 2);
    expect(container.textContent).toContain('Something that went well');
    expect(container.textContent).toContain('An idea to try');

    act(() => button('An idea to try').click());
    await waitFor(() => container.querySelectorAll('.notes-tab__note').length === 1);
    expect(container.querySelector('.notes-tab__note')!.textContent).toContain('Try the snack page.');
    act(() => button('Something to follow up').click());
    await waitFor(() => container.textContent!.includes('No notes of this kind.'));
  });

  it('shows notes written before kinds existed as something noticed', async () => {
    await staffNotesSetting.set([{ id: 'o', at: Date.now(), by: '', text: 'An older note.' }]);
    render(<NotesTab />, container);
    expect(container.querySelector('.notes-tab__meta')!.textContent).toContain('Something I noticed');
    act(() => button('Something I noticed').click());
    expect(container.querySelectorAll('.notes-tab__note')).toHaveLength(1);
  });
});
