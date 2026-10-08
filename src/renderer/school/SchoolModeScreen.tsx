import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { DayBuilderTab } from '../day/DayBuilderTab';
import { GuideTab } from '../guide/GuideTab';
import { schoolTimeoutSetting } from '../store/db';
import { SCHOOL_MODE_NAME } from '../ui/modeName';
import { ActivityTab } from '../parent/ActivityTab';
import { AboutMeTab } from '../parent/AboutMeTab';
import { LearningTab } from '../parent/LearningTab';
import { MyPagesTab } from '../parent/MyPagesTab';
import { NotesTab } from '../parent/NotesTab';
import { ReportsTab } from '../parent/ReportsTab';
import { TargetsTab } from '../parent/TargetsTab';
import { ClassroomTab } from './ClassroomTab';
import { PupilTab } from './PupilTab';
import { SafeguardingTab } from './SafeguardingTab';
import { TodayTab } from './TodayTab';

export type SchoolSection =
  | 'today'
  | 'pupil'
  | 'aboutme'
  | 'safeguarding'
  | 'timetable'
  | 'lessons'
  | 'vocabulary'
  | 'targets'
  | 'notes'
  | 'activity'
  | 'reports'
  | 'classroom'
  | 'guide';

const GROUPS: { title: string; sections: { id: SchoolSection; label: string }[] }[] = [
  { title: 'Today', sections: [{ id: 'today', label: 'Today' }] },
  {
    title: 'The pupil',
    sections: [
      { id: 'pupil', label: 'Pupil and school' },
      { id: 'aboutme', label: 'About me' },
      { id: 'safeguarding', label: 'Safeguarding' },
    ],
  },
  {
    title: 'Planning',
    sections: [
      { id: 'timetable', label: 'Timetable' },
      { id: 'lessons', label: 'Lesson pages' },
      { id: 'vocabulary', label: 'Vocabulary' },
    ],
  },
  {
    title: 'Working together',
    sections: [
      { id: 'targets', label: 'Targets' },
      { id: 'notes', label: 'Notes' },
      { id: 'activity', label: 'Activity' },
      { id: 'reports', label: 'Reports' },
    ],
  },
  {
    title: 'Set-up',
    sections: [
      { id: 'classroom', label: 'Classroom set-up' },
      { id: 'guide', label: 'School guide' },
    ],
  },
];

const IDLE_CHECK_MS = 5_000;

type Props = { onExit: () => void };

// School Mode: the part of the app for the teachers and staff who work with a
// child in school. It has its own button next to Parent Mode and its own PIN,
// its own look, and its own menu. It is one device and one pupil: there are no
// pupil accounts and no class lists.
export function SchoolModeScreen({ onExit }: Props) {
  const section = useSignal<SchoolSection>('today');
  const minutes = schoolTimeoutSetting.signal.value;

  // Closes itself after a while without use, so a device left on a desk is not left open.
  useEffect(() => {
    if (minutes <= 0) return;
    let lastActivity = Date.now();
    const noteActivity = () => {
      lastActivity = Date.now();
    };
    const events = ['pointerdown', 'keydown', 'input', 'wheel'] as const;
    for (const name of events) document.addEventListener(name, noteActivity, true);
    const timer = setInterval(() => {
      if (Date.now() - lastActivity >= minutes * 60_000) {
        clearInterval(timer);
        onExit();
      }
    }, IDLE_CHECK_MS);
    return () => {
      for (const name of events) document.removeEventListener(name, noteActivity, true);
      clearInterval(timer);
    };
  }, [minutes]);

  const go = (next: SchoolSection) => (section.value = next);

  return (
    <div class="parent-mode-screen school-mode-screen">
      <header class="parent-mode-screen__header school-mode-screen__header">
        <h1 class="parent-mode-screen__title school-mode-screen__title">{SCHOOL_MODE_NAME}</h1>
        <div class="parent-mode-screen__header-actions">
          <button type="button" class="parent-mode-screen__button parent-mode-screen__exit school-mode-screen__exit" onClick={onExit}>
            Exit {SCHOOL_MODE_NAME}
          </button>
        </div>
      </header>

      <div class="parent-mode-screen__layout">
        <nav class="parent-nav school-nav" aria-label={`${SCHOOL_MODE_NAME} sections`}>
          {GROUPS.map((group) => (
            <div class="parent-nav__group" key={group.title}>
              <p class="parent-nav__heading">{group.title}</p>
              {group.sections.map((entry) => (
                <button
                  type="button"
                  class="page-tabs__tab parent-nav__tab school-nav__tab"
                  key={entry.id}
                  aria-pressed={section.value === entry.id}
                  onClick={() => go(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <main class="parent-mode-screen__main">
          {section.value === 'today' && <TodayTab go={go} />}
          {section.value === 'pupil' && <PupilTab />}
          {section.value === 'aboutme' && <AboutMeTab />}
          {section.value === 'safeguarding' && <SafeguardingTab />}
          {section.value === 'timetable' && <DayBuilderTab />}
          {section.value === 'lessons' && <MyPagesTab />}
          {section.value === 'vocabulary' && <LearningTab />}
          {section.value === 'targets' && <TargetsTab />}
          {section.value === 'notes' && <NotesTab />}
          {section.value === 'activity' && <ActivityTab />}
          {section.value === 'reports' && <ReportsTab />}
          {section.value === 'classroom' && <ClassroomTab />}
          {section.value === 'guide' && <GuideTab start="staff" />}
        </main>
      </div>
    </div>
  );
}
