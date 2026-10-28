// "Is everything ready?": a short list of the things that make a device work well for a child, each with where to go to
// sort it out. Written plainly, never as a failing grade: a tick means done, and an empty circle means "not yet".

export type CheckInput = {
  hasVoice: boolean;
  lastBackupAt: number | null;
  now: number;
  hasFamily: boolean;
  hasAboutMe: boolean;
  hasFavourites: boolean;
  /** School Mode only. */
  school?: { hasDetails: boolean; hasTimetable: boolean; hasLessonPages: boolean; hasTargets: boolean };
};

export type CheckItem = { id: string; done: boolean; text: string; go: string; goLabel: string };

const BACKUP_DAYS = 30;

export function parentChecks(input: CheckInput): CheckItem[] {
  const recentBackup = input.lastBackupAt !== null && input.now - input.lastBackupAt < BACKUP_DAYS * 86_400_000;
  return [
    { id: 'voice', done: input.hasVoice, text: 'A voice has been chosen and listened to.', go: 'access', goLabel: 'Choose a voice' },
    { id: 'aboutme', done: input.hasAboutMe, text: 'About me is filled in, for new people who meet the child.', go: 'aboutme', goLabel: 'Fill in About me' },
    { id: 'family', done: input.hasFamily, text: 'The people who matter are in My family, with photos.', go: 'family', goLabel: 'Add people' },
    { id: 'favourites', done: input.hasFavourites, text: 'A few favourite words are saved (hold a word to add it).', go: 'general', goLabel: 'See favourites' },
    { id: 'backup', done: recentBackup, text: 'A backup was saved in the last month.', go: 'backup', goLabel: 'Save a backup' },
  ];
}

export function schoolChecks(input: CheckInput): CheckItem[] {
  const school = input.school ?? { hasDetails: false, hasTimetable: false, hasLessonPages: false, hasTargets: false };
  return [
    { id: 'details', done: school.hasDetails, text: 'The school, class and key adults are filled in.', go: 'pupil', goLabel: 'Pupil and school' },
    { id: 'timetable', done: school.hasTimetable, text: 'There is a timetable, so My Day is filled in each week.', go: 'timetable', goLabel: 'Timetable' },
    { id: 'lessons', done: school.hasLessonPages, text: 'Lesson pages are made for the main subjects.', go: 'lessons', goLabel: 'Lesson pages' },
    { id: 'targets', done: school.hasTargets, text: 'There is at least one target, written in plain words.', go: 'targets', goLabel: 'Targets' },
    { id: 'backup', done: input.lastBackupAt !== null && input.now - input.lastBackupAt < BACKUP_DAYS * 86_400_000, text: 'A backup was saved in the last month (ask whoever has the Parent PIN).', go: '', goLabel: '' },
  ];
}

/** How many are done, for "3 of 5". */
export function progressOf(items: CheckItem[]): { done: number; total: number } {
  return { done: items.filter((item) => item.done).length, total: items.length };
}
