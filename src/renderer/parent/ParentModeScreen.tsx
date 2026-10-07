import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { BoardsTab } from './BoardsTab';
import { MyPagesTab } from './MyPagesTab';
import { PeoplePlacesTab } from './PeoplePlacesTab';
import { ProfilesTab } from './ProfilesTab';
import { QuickAccessTab } from './QuickAccessTab';
import { AccessTab } from './AccessTab';
import { GeneralTab } from './GeneralTab';
import { MedicalInfoTab } from './MedicalInfoTab';
import { DayBuilderTab } from '../day/DayBuilderTab';
import { BackupTab } from '../backup/BackupTab';
import { PrintTab } from '../print/PrintTab';

type Props = {
  onExit: () => void;
};

type Tab =
  | 'boards'
  | 'people'
  | 'places'
  | 'myday'
  | 'mypages'
  | 'quickaccess'
  | 'profiles'
  | 'access'
  | 'backup'
  | 'print'
  | 'general'
  | 'medical';

export function ParentModeScreen({ onExit }: Props) {
  const tab = useSignal<Tab>('boards');
  const fullscreen = useSignal(false);

  useEffect(() => {
    void window.myWords.parentMode.isFullscreen().then((value) => {
      fullscreen.value = value;
    });
  }, []);

  async function toggleFullscreen(): Promise<void> {
    const next = !fullscreen.value;
    await window.myWords.parentMode.setFullscreen(next);
    fullscreen.value = next;
  }

  return (
    <div class="parent-mode-screen">
      <header class="parent-mode-screen__header">
        <h1 class="parent-mode-screen__title">Parent Mode</h1>
        <div class="parent-mode-screen__header-actions">
          <button type="button" class="parent-mode-screen__button" onClick={() => void toggleFullscreen()}>
            Fullscreen: {fullscreen.value ? 'On' : 'Off'}
          </button>
          <button type="button" class="parent-mode-screen__button parent-mode-screen__exit" onClick={onExit}>
            Exit Parent Mode
          </button>
        </div>
      </header>

      <div class="page-tabs">
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'boards'}
          onClick={() => (tab.value = 'boards')}
        >
          Boards
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'people'}
          onClick={() => (tab.value = 'people')}
        >
          People
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'places'}
          onClick={() => (tab.value = 'places')}
        >
          Places
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'myday'}
          onClick={() => (tab.value = 'myday')}
        >
          My Day
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'mypages'}
          onClick={() => (tab.value = 'mypages')}
        >
          My Pages
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'quickaccess'}
          onClick={() => (tab.value = 'quickaccess')}
        >
          Quick Access
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'profiles'}
          onClick={() => (tab.value = 'profiles')}
        >
          Profiles
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'access'}
          onClick={() => (tab.value = 'access')}
        >
          Access
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'backup'}
          onClick={() => (tab.value = 'backup')}
        >
          Backup
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'print'}
          onClick={() => (tab.value = 'print')}
        >
          Print
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'general'}
          onClick={() => (tab.value = 'general')}
        >
          General
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab.value === 'medical'}
          onClick={() => (tab.value = 'medical')}
        >
          Medical
        </button>
      </div>

      {tab.value === 'boards' && <BoardsTab />}
      {tab.value === 'people' && <PeoplePlacesTab kind="people" />}
      {tab.value === 'places' && <PeoplePlacesTab kind="places" />}
      {tab.value === 'myday' && <DayBuilderTab />}
      {tab.value === 'mypages' && <MyPagesTab />}
      {tab.value === 'quickaccess' && <QuickAccessTab />}
      {tab.value === 'profiles' && <ProfilesTab />}
      {tab.value === 'access' && <AccessTab />}
      {tab.value === 'backup' && <BackupTab />}
      {tab.value === 'print' && <PrintTab />}
      {tab.value === 'general' && <GeneralTab />}
      {tab.value === 'medical' && <MedicalInfoTab />}
    </div>
  );
}
