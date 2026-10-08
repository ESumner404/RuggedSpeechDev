import type { DayActivity, WeeklyRoutine } from './types';

// For the adults who work with a child in school or at home: where the child
// is in school and who to go to, communication targets, and notes after a
// session. All of it stays on this computer, and none of it is shown on the
// child's screen. It is part of a backup only if an adult saves one.

export type SchoolInfo = {
  school: string;
  className: string;
  teacher: string;
  keyAdult: string;
  senco: string;
  slt: string;
  phone: string;
  /** The designated safeguarding lead, and how to reach them. */
  dsl: string;
  dslPhone: string;
};

export const EMPTY_SCHOOL_INFO: SchoolInfo = { school: '', className: '', teacher: '', keyAdult: '', senco: '', slt: '', phone: '', dsl: '', dslPhone: '' };

export const SCHOOL_INFO_FIELDS: { id: keyof SchoolInfo; label: string; placeholder: string }[] = [
  { id: 'school', label: 'School or setting', placeholder: 'Oakfield Primary' },
  { id: 'className', label: 'Class or year group', placeholder: 'Year 2, Robins' },
  { id: 'teacher', label: 'Class teacher', placeholder: '' },
  { id: 'keyAdult', label: 'Key adult or teaching assistant', placeholder: '' },
  { id: 'senco', label: 'SENCo', placeholder: '' },
  { id: 'slt', label: 'Speech and language therapist', placeholder: '' },
  { id: 'phone', label: 'School phone', placeholder: '' },
  { id: 'dsl', label: 'Designated safeguarding lead', placeholder: '' },
  { id: 'dslPhone', label: 'Safeguarding lead phone', placeholder: '' },
];

// Details saved before the safeguarding lead was added still open.
export const isSchoolInfo = (value: unknown): value is SchoolInfo =>
  typeof value === 'object' &&
  value !== null &&
  Object.keys(EMPTY_SCHOOL_INFO)
    .filter((key) => key !== 'dsl' && key !== 'dslPhone')
    .every((key) => typeof (value as Record<string, unknown>)[key] === 'string');

export type TargetArea = 'understand' | 'express' | 'social' | 'access' | 'other';
export type TargetStatus = 'working' | 'achieved' | 'paused';

export type Target = {
  id: string;
  text: string;
  area: TargetArea;
  status: TargetStatus;
  /** When it was set, and when it will be looked at again ("YYYY-MM-DD", or blank). */
  set: string;
  review: string;
  /** How it is going. */
  notes: string;
};

export const TARGET_AREAS: { id: TargetArea; label: string; example: string }[] = [
  { id: 'express', label: 'Saying things', example: 'Uses “want” plus a word to ask for something, 4 times a day.' },
  { id: 'understand', label: 'Understanding', example: 'Follows a two-step instruction with a picture to help.' },
  { id: 'social', label: 'Talking with others', example: 'Says hello and goodbye to a friend, with a reminder.' },
  { id: 'access', label: 'Using the device', example: 'Finds the Help button without help.' },
  { id: 'other', label: 'Something else', example: '' },
];

export const TARGET_STATUS_LABELS: Record<TargetStatus, string> = {
  working: 'Working on it',
  achieved: 'Achieved',
  paused: 'Paused',
};

export const MAX_TARGETS = 60;

export const isTargetList = (value: unknown): value is Target[] =>
  Array.isArray(value) &&
  value.length <= MAX_TARGETS &&
  value.every((t) => {
    if (typeof t !== 'object' || t === null) return false;
    const target = t as Record<string, unknown>;
    return (
      ['id', 'text', 'set', 'review', 'notes'].every((key) => typeof target[key] === 'string') &&
      TARGET_AREAS.some((a) => a.id === target['area']) &&
      ['working', 'achieved', 'paused'].includes(target['status'] as string)
    );
  });

export type NoteKind = 'observation' | 'success' | 'idea' | 'concern';

export const NOTE_KINDS: { id: NoteKind; label: string }[] = [
  { id: 'observation', label: 'Something I noticed' },
  { id: 'success', label: 'Something that went well' },
  { id: 'idea', label: 'An idea to try' },
  { id: 'concern', label: 'Something to follow up' },
];

export type StaffNote = { id: string; at: number; by: string; text: string; kind?: NoteKind };

export const MAX_NOTES = 500;

export const isNoteList = (value: unknown): value is StaffNote[] =>
  Array.isArray(value) &&
  value.length <= MAX_NOTES &&
  value.every((n) => {
    if (typeof n !== 'object' || n === null) return false;
    const note = n as Record<string, unknown>;
    return typeof note['id'] === 'string' && typeof note['at'] === 'number' && typeof note['by'] === 'string' && typeof note['text'] === 'string';
  });

/** Targets still being worked on come first, then paused, then achieved; each group in the order they were added. */
export function sortedTargets(targets: Target[]): Target[] {
  const rank: Record<TargetStatus, number> = { working: 0, paused: 1, achieved: 2 };
  return [...targets].sort((a, b) => rank[a.status] - rank[b.status]);
}

/** A target whose review date is today or earlier and is still being worked on. */
export function reviewDue(target: Target, today: string): boolean {
  return target.status === 'working' && target.review !== '' && target.review <= today;
}

export function schoolInfoLines(info: SchoolInfo): { label: string; value: string }[] {
  return SCHOOL_INFO_FIELDS.filter((field) => (info[field.id] ?? '').trim() !== '').map((field) => ({
    label: field.label,
    value: (info[field.id] ?? '').trim(),
  }));
}

/** Who a lost device should go back to, for Lost mode, from what is known about the school. */
export function suggestedReturnTo(info: SchoolInfo): string {
  return [info.school.trim(), info.className.trim()].filter(Boolean).join(', ');
}

const act = (id: string, name: string, time: string): DayActivity => ({ id, name, time });

function weekday(day: string): DayActivity[] {
  return [
    act(`${day}-reg`, 'Registration', '08:50'),
    act(`${day}-lesson1`, 'Lesson 1', '09:15'),
    act(`${day}-break`, 'Break', '10:30'),
    act(`${day}-lesson2`, 'Lesson 2', '10:50'),
    act(`${day}-lunch`, 'Lunch', '12:00'),
    act(`${day}-play`, 'Playtime', '12:30'),
    act(`${day}-lesson3`, 'Lesson 3', '13:15'),
    act(`${day}-story`, 'Story time', '14:45'),
    act(`${day}-home`, 'Home time', '15:15'),
  ];
}

/** A typical primary school day, Monday to Friday, to be changed to match the real timetable. */
export function typicalSchoolWeek(): WeeklyRoutine {
  return {
    mon: weekday('mon'),
    tue: weekday('tue'),
    wed: weekday('wed'),
    thu: weekday('thu'),
    fri: weekday('fri'),
    sat: [],
    sun: [],
  };
}

export const routineIsEmpty = (routine: WeeklyRoutine): boolean => Object.values(routine).every((day) => day.length === 0);
