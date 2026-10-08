import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { BoardsTab } from './BoardsTab';
import { MyPagesTab } from './MyPagesTab';
import { PeoplePlacesTab } from './PeoplePlacesTab';
import { ProfilesTab } from './ProfilesTab';
import { QuickAccessTab } from './QuickAccessTab';
import { AccessTab } from './AccessTab';
import { LookTab } from './LookTab';
import { BodyTab } from './BodyTab';
import { MusicTab } from './MusicTab';
import { JokesTab } from './JokesTab';
import { LostModeTab } from './LostModeTab';
import { GuideTab } from '../guide/GuideTab';
import { ActivityTab } from './ActivityTab';
import { TargetsTab } from './TargetsTab';
import { NotesTab } from './NotesTab';
import { ReportsTab } from './ReportsTab';
import { UserTab } from './UserTab';
import { LearningTab } from './LearningTab';
import { AboutMeTab } from './AboutMeTab';
import { SchoolTab } from './SchoolTab';
import { GeneralTab } from './GeneralTab';
import { MedicalInfoTab } from './MedicalInfoTab';
import { DayBuilderTab } from '../day/DayBuilderTab';
import { BackupTab } from '../backup/BackupTab';
import { PrintTab } from '../print/PrintTab';
import { hasContentWorthBackingUp, lastBackupSetting, parentModeTimeoutSetting } from '../store/db';
import { modeName } from '../ui/modeName';

type Props = {
  onExit: () => void;
};

// The tabs, in groups so a long list is easy to find your way around. The
// guide comes first, because it answers "what do I do?".
const GROUPS = [
  { title: 'Start here', tabs: [{ id: 'guide', label: 'User guide' }] },
  {
    title: 'About the child',
    tabs: [
      { id: 'user', label: 'User' },
      { id: 'aboutme', label: 'About me' },
      { id: 'medical', label: 'Medical' },
      { id: 'body', label: 'My body' },
    ],
  },
  {
    title: 'Words and pages',
    tabs: [
      { id: 'boards', label: 'Boards' },
      { id: 'people', label: 'People' },
      { id: 'places', label: 'Places' },
      { id: 'mypages', label: 'My Pages' },
      { id: 'quickaccess', label: 'Quick Access' },
      { id: 'profiles', label: 'Profiles' },
    ],
  },
  {
    title: 'Day and fun',
    tabs: [
      { id: 'myday', label: 'My Day' },
      { id: 'music', label: 'Music' },
      { id: 'jokes', label: 'Jokes' },
    ],
  },
  {
    title: 'How it looks and works',
    tabs: [
      { id: 'access', label: 'Access' },
      { id: 'look', label: 'Look' },
    ],
  },
  {
    title: 'Learning and school',
    tabs: [
      { id: 'learning', label: 'Learning' },
      { id: 'targets', label: 'Targets' },
      { id: 'notes', label: 'Notes' },
      { id: 'activity', label: 'Activity' },
      { id: 'reports', label: 'Reports' },
      { id: 'school', label: 'School' },
    ],
  },
  {
    title: 'Safety and data',
    tabs: [
      { id: 'lost', label: 'Lost mode' },
      { id: 'backup', label: 'Backup' },
      { id: 'print', label: 'Print' },
      { id: 'general', label: 'General' },
    ],
  },
] as const;

type Tab = (typeof GROUPS)[number]['tabs'][number]['id'];

const BACKUP_REMINDER_DAYS = 30;
const IDLE_CHECK_MS = 5_000;

export function ParentModeScreen({ onExit }: Props) {
  const tab = useSignal<Tab>('boards');
  const fullscreen = useSignal(false);
  const needsBackup = useSignal(false);

  useEffect(() => {
    void window.myWords.parentMode.isFullscreen().then((value) => {
      fullscreen.value = value;
    });
  }, []);

  // A nudge, never a nag: only when there is something worth protecting and
  // no backup in the last month.
  useEffect(() => {
    void Promise.all([lastBackupSetting.get(), hasContentWorthBackingUp()]).then(([last, hasContent]) => {
      const stale = last === null || Date.now() - last > BACKUP_REMINDER_DAYS * 24 * 60 * 60 * 1000;
      needsBackup.value = hasContent && stale;
    });
  }, []);

  // Closes itself after a while without use, so a shared or unattended
  // device is not left open (an adult-chosen setting; off unless set, and set
  // for you by School Mode). Any press, key or typing counts as use.
  const timeoutMinutes = parentModeTimeoutSetting.signal.value;
  useEffect(() => {
    if (timeoutMinutes <= 0) return;
    let lastActivity = Date.now();
    const noteActivity = (): void => {
      lastActivity = Date.now();
    };
    const events = ['pointerdown', 'keydown', 'input', 'wheel'] as const;
    for (const name of events) document.addEventListener(name, noteActivity, true);
    const timer = setInterval(() => {
      if (Date.now() - lastActivity >= timeoutMinutes * 60_000) {
        clearInterval(timer);
        onExit();
      }
    }, IDLE_CHECK_MS);
    return () => {
      for (const name of events) document.removeEventListener(name, noteActivity, true);
      clearInterval(timer);
    };
  }, [timeoutMinutes]);

  async function toggleFullscreen(): Promise<void> {
    const next = !fullscreen.value;
    await window.myWords.parentMode.setFullscreen(next);
    fullscreen.value = next;
  }

  const name = modeName();

  return (
    <div class="parent-mode-screen">
      <header class="parent-mode-screen__header">
        <h1 class="parent-mode-screen__title">{name}</h1>
        <div class="parent-mode-screen__header-actions">
          <button type="button" class="parent-mode-screen__button" onClick={() => void toggleFullscreen()}>
            Fullscreen: {fullscreen.value ? 'On' : 'Off'}
          </button>
          <button type="button" class="parent-mode-screen__button parent-mode-screen__exit" onClick={onExit}>
            Exit {name}
          </button>
        </div>
      </header>

      {needsBackup.value && (
        <div class="parent-mode-screen__notice" role="status">
          <span>
            There's no recent backup. A backup keeps the photos, pages and settings safe if this computer is
            lost or breaks.
          </span>
          <button
            type="button"
            class="parent-mode-screen__button"
            onClick={() => {
              tab.value = 'backup';
            }}
          >
            Go to Backup
          </button>
        </div>
      )}

      <div class="parent-mode-screen__layout">
      <nav class="parent-nav" aria-label={`${name} sections`}>
        {GROUPS.map((group) => (
          <div class="parent-nav__group" key={group.title}>
            <p class="parent-nav__heading">{group.title}</p>
            {group.tabs.map((entry) => (
              <button
                type="button"
                class="page-tabs__tab parent-nav__tab"
                key={entry.id}
                aria-pressed={tab.value === entry.id}
                onClick={() => (tab.value = entry.id)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <main class="parent-mode-screen__main">
      {tab.value === 'guide' && <GuideTab />}
      {tab.value === 'user' && <UserTab />}
      {tab.value === 'boards' && <BoardsTab />}
      {tab.value === 'people' && <PeoplePlacesTab kind="people" />}
      {tab.value === 'places' && <PeoplePlacesTab kind="places" />}
      {tab.value === 'myday' && <DayBuilderTab />}
      {tab.value === 'mypages' && <MyPagesTab />}
      {tab.value === 'quickaccess' && <QuickAccessTab />}
      {tab.value === 'profiles' && <ProfilesTab />}
      {tab.value === 'access' && <AccessTab />}
      {tab.value === 'look' && <LookTab />}
      {tab.value === 'body' && <BodyTab />}
      {tab.value === 'music' && <MusicTab />}
      {tab.value === 'jokes' && <JokesTab />}
      {tab.value === 'lost' && <LostModeTab />}
      {tab.value === 'learning' && <LearningTab />}
      {tab.value === 'targets' && <TargetsTab />}
      {tab.value === 'notes' && <NotesTab />}
      {tab.value === 'activity' && <ActivityTab />}
      {tab.value === 'reports' && <ReportsTab />}
      {tab.value === 'aboutme' && <AboutMeTab />}
      {tab.value === 'school' && <SchoolTab />}
      {tab.value === 'backup' && <BackupTab />}
      {tab.value === 'print' && <PrintTab />}
      {tab.value === 'general' && <GeneralTab />}
      {tab.value === 'medical' && <MedicalInfoTab />}
      </main>
      </div>
    </div>
  );
}
