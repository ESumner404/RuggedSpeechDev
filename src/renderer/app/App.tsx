import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { HomeScreen, type HomeTileId } from './HomeScreen';
import { FeelingsHelpScreen, type FeelingsHelpTab } from './FeelingsHelpScreen';
import { FavouritesScreen, type FavouritesTab } from './FavouritesScreen';
import { QuickAccessBar, type QuickAccessTarget } from './QuickAccessBar';
import { TalkScreen } from '../board/TalkScreen';
import { MyPagesScreen } from '../board/MyPagesScreen';
import { KeyboardScreen } from '../keyboard/KeyboardScreen';
import { MyDayScreen } from '../day/MyDayScreen';
import { PinGate } from '../parent/PinGate';
import { ParentModeScreen } from '../parent/ParentModeScreen';
import { announceText } from '../speech/announce';
import {
  DEFAULT_ACCESS_SETTINGS,
  accessSettingsVersion,
  getAccessSettings,
  getPreferredSpeechRate,
  getPreferredVoiceURI,
  hasCompletedFirstRun,
  preferredSpeechRate,
  preferredVoiceURI,
} from '../store/db';
import { applyAccessSettings } from '../access/applyAccessSettings';
import { focusNext } from '../access/focusOrder';
import { gridScanningActive } from '../access/scanning';
import { MedicalInfoButton } from '../safety/MedicalInfoButton';
import { FirstRunWizard } from '../setup/FirstRunWizard';

type AppScreen =
  | { name: 'home' }
  | { name: 'talk' }
  | { name: 'keyboard' }
  | { name: 'myday' }
  | { name: 'mypages' }
  | { name: 'feelings'; tab?: FeelingsHelpTab }
  | { name: 'favourites'; tab?: FavouritesTab };

const GIVE_ME_TIME_PHRASE = 'I know what I want to say. Please give me a moment.';

function pressGiveMeTime(): void {
  announceText(GIVE_ME_TIME_PHRASE);
}

export function App() {
  const screen = useSignal<AppScreen>({ name: 'home' });
  const mode = useSignal<'child' | 'parent'>('child');
  const pinGateOpen = useSignal(false);
  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const firstRunDone = useSignal<boolean | null>(null);

  useEffect(() => {
    void hasCompletedFirstRun().then((done) => (firstRunDone.value = done));
    void getPreferredVoiceURI().then((uri) => (preferredVoiceURI.value = uri));
    void getPreferredSpeechRate().then((rate) => (preferredSpeechRate.value = rate));
  }, []);

  // Applies immediately when an adult changes a visual or scanning setting
  // in Parent Mode, not only on the next launch.
  const accessVersion = accessSettingsVersion.value;
  useEffect(() => {
    void getAccessSettings().then((settings) => {
      access.value = settings;
      applyAccessSettings(settings);
    });
  }, [accessVersion]);

  // "Operable with two switches and nothing else" (PLAN.md Phase 7) beyond
  // the board grid's own dedicated scanning: Space advances focus through
  // whatever's on screen, the same way it advances the scan highlight
  // inside a grid, and Enter's native browser behaviour already activates
  // a focused button — so the same two inputs work everywhere. Skipped
  // whenever a Grid is mounted and already scanning, so the two mechanisms
  // never both act on the same keypress.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (access.value.scanningMode === 'off') return;
      if (gridScanningActive.count > 0) return;
      if (event.code === 'Space') {
        event.preventDefault();
        focusNext();
      }
    }
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  function goHome(): void {
    screen.value = { name: 'home' };
  }

  function handleHomeSelect(tile: HomeTileId): void {
    screen.value = { name: tile };
  }

  function handleQuickAccess(target: QuickAccessTarget): void {
    if (target === 'help') {
      screen.value = { name: 'feelings', tab: 'help' };
      return;
    }
    screen.value = { name: target };
  }

  // A single press opens the PIN gate — Parent Mode itself still requires
  // the correct PIN behind it (invariant I4: complexity lives behind the
  // PIN), so a standard button doesn't expose anything a hold gesture was
  // protecting; it only changes how quickly an adult reaches the PIN
  // screen. An earlier hold-to-open design was replaced after repeated
  // feedback that a plain tap doing nothing read as broken.
  function openParentModeGate(): void {
    pinGateOpen.value = true;
  }

  function renderScreen() {
    switch (screen.value.name) {
      case 'home':
        return <HomeScreen onSelect={handleHomeSelect} />;
      case 'talk':
        return <TalkScreen onExit={goHome} />;
      case 'keyboard':
        return <KeyboardScreen />;
      case 'myday':
        return <MyDayScreen />;
      case 'mypages':
        return <MyPagesScreen onExit={goHome} />;
      case 'feelings':
        return (
          <FeelingsHelpScreen
            tab={screen.value.tab ?? 'feelings'}
            onTabChange={(tab) => (screen.value = { name: 'feelings', tab })}
          />
        );
      case 'favourites':
        return (
          <FavouritesScreen
            tab={screen.value.tab ?? 'favourites'}
            onTabChange={(tab) => (screen.value = { name: 'favourites', tab })}
          />
        );
    }
  }

  if (firstRunDone.value === null) {
    return null;
  }

  if (!firstRunDone.value) {
    return <FirstRunWizard onComplete={() => (firstRunDone.value = true)} />;
  }

  if (mode.value === 'parent') {
    return <ParentModeScreen onExit={() => (mode.value = 'child')} />;
  }

  return (
    <div class="app-shell">
      <QuickAccessBar onNavigate={handleQuickAccess} />
      {/* Persistent and separate from Quick Access — fires from any screen,
          including mid-typing on the Keyboard screen, without disturbing
          whatever that screen's own state is (PLAN.md Phase 3 acceptance). */}
      <button type="button" class="give-me-time-bar" onClick={pressGiveMeTime}>
        Give me time
      </button>
      {/* A row of its own, not floated over the screen below — a screen's
          own content (e.g. Keyboard's mode tabs) sits flush at the top of
          app-shell__screen, so overlaying these there collided with it. */}
      <div class="app-shell__toolbar">
        <MedicalInfoButton />
        <button type="button" class="parent-mode-button" onClick={openParentModeGate}>
          Parent Mode
        </button>
      </div>
      <div class="app-shell__screen">{renderScreen()}</div>
      {pinGateOpen.value && (
        <div class="pin-gate-overlay">
          <PinGate
            onUnlock={() => {
              pinGateOpen.value = false;
              mode.value = 'parent';
            }}
            onCancel={() => (pinGateOpen.value = false)}
          />
        </div>
      )}
    </div>
  );
}
