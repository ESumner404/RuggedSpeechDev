import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { HomeScreen, type HomeTileId } from './HomeScreen';
import { FeelingsHelpScreen, type FeelingsHelpTab } from './FeelingsHelpScreen';
import { FavouritesScreen, type FavouritesTab } from './FavouritesScreen';
import { QuickAccessBar, type QuickAccessTarget } from './QuickAccessBar';
import { TalkScreen } from '../board/TalkScreen';
import { MyPagesScreen } from '../board/MyPagesScreen';
import { FirstThenScreen } from './FirstThenScreen';
import { GamesScreen } from '../game/GamesScreen';
import { DrawScreen } from '../draw/DrawScreen';
import { MyBodyScreen } from '../body/MyBodyScreen';
import { MusicScreen } from '../music/MusicScreen';
import { TrafficChip, TrafficScreen } from '../signals/TrafficScreen';
import { LostModeScreen } from '../safety/LostModeScreen';
import { KeyboardScreen } from '../keyboard/KeyboardScreen';
import { MyDayScreen } from '../day/MyDayScreen';
import { PinGate } from '../parent/PinGate';
import { ParentModeScreen } from '../parent/ParentModeScreen';
import { SchoolModeScreen } from '../school/SchoolModeScreen';
import { announceText } from '../speech/announce';
import {
  DEFAULT_ACCESS_SETTINGS,
  accessSettingsVersion,
  getAccessSettings,
  getPreferredSpeechPitch,
  getPreferredSpeechRate,
  getPreferredVoiceURI,
  getPressMode,
  getQuickAccess,
  hasCompletedFirstRun,
  loadStoredSettings,
  preferredSpeechPitch,
  preferredSpeechRate,
  preferredVoiceURI,
  pressMode,
  quickAccessButtons,
  lostModeSetting,
  recordActivity,
  schoolModeSetting,
  labelStyleSetting,
  symbolStyleSetting,
  themeSetting,
  userProfileSetting,
} from '../store/db';
import { applyAccessSettings } from '../access/applyAccessSettings';
import { applyTheme } from '../ui/theme';
import { applyLabelStyle, applySymbolStyle } from '../symbols/icons';
import { deviceTitle } from '../ui/deviceName';
import { focusNext } from '../access/focusOrder';
import { gridScanningActive } from '../access/scanning';
import { MedicalInfoButton } from '../safety/MedicalInfoButton';
import { AboutMeButton } from '../safety/AboutMeButton';
import { SCHOOL_MODE_NAME, modeName } from '../ui/modeName';
import { FirstRunWizard } from '../setup/FirstRunWizard';
import { SplashScreen } from '../setup/SplashScreen';

type AppScreen =
  | { name: 'home' }
  | { name: 'talk' }
  | { name: 'keyboard' }
  | { name: 'myday' }
  | { name: 'mypages' }
  | { name: 'firstthen' }
  | { name: 'game' }
  | { name: 'draw' }
  | { name: 'body' }
  | { name: 'music' }
  | { name: 'traffic' }
  | { name: 'feelings'; tab?: FeelingsHelpTab }
  | { name: 'favourites'; tab?: FavouritesTab };

const SCREEN_LABELS: Record<AppScreen['name'], string> = {
  home: 'Home',
  talk: 'Talk',
  keyboard: 'Keyboard',
  myday: 'My Day',
  mypages: 'My Pages',
  firstthen: 'First / Then',
  game: 'Games',
  draw: 'Draw',
  body: 'My body',
  music: 'Music',
  traffic: 'Traffic light',
  feelings: 'Feelings & Help',
  favourites: 'Favourites',
};

const GIVE_ME_TIME_PHRASE = 'I know what I want to say. Please give me a moment.';

function pressGiveMeTime(): void {
  announceText(GIVE_ME_TIME_PHRASE);
}

export function App() {
  const screen = useSignal<AppScreen>({ name: 'home' });
  const mode = useSignal<'child' | 'parent' | 'school'>('child');
  // Which PIN box is open, if any: the Parent PIN or the School PIN.
  const pinGateOpen = useSignal<'parent' | 'school' | null>(null);
  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const firstRunDone = useSignal<boolean | null>(null);
  const settingsReady = useSignal(false);

  useEffect(() => {
    void hasCompletedFirstRun().then((done) => (firstRunDone.value = done));
    void getPreferredVoiceURI().then((uri) => (preferredVoiceURI.value = uri));
    void getPreferredSpeechRate().then((rate) => (preferredSpeechRate.value = rate));
    void getPreferredSpeechPitch().then((pitch) => (preferredSpeechPitch.value = pitch));
    void getPressMode().then((mode) => (pressMode.value = mode));
    void getQuickAccess().then((buttons) => (quickAccessButtons.value = buttons));
    void loadStoredSettings().then(() => (settingsReady.value = true));
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

  // Which part of the app is being used, for the activity log (if an adult
  // has turned that on). Only the name of the screen, nothing on it.
  const screenName = screen.value.name;
  useEffect(() => {
    if (firstRunDone.value) void recordActivity('screen', SCREEN_LABELS[screenName]);
  }, [screenName, firstRunDone.value]);

  // The window is named after whose device it is.
  const profile = userProfileSetting.signal.value;
  useEffect(() => {
    document.title = deviceTitle(profile);
  }, [profile]);

  // Drawn symbols or emoji, and pictures and words or just one.
  const symbolStyle = symbolStyleSetting.signal.value;
  const labelStyle = labelStyleSetting.signal.value;
  useEffect(() => {
    applySymbolStyle(symbolStyle);
  }, [symbolStyle]);
  useEffect(() => {
    applyLabelStyle(labelStyle);
  }, [labelStyle]);

  // The look an adult chose. High contrast, when on, takes priority.
  const theme = themeSetting.signal.value;
  useEffect(() => {
    applyTheme(theme, access.value.highContrast !== 'off');
  }, [theme, access.value.highContrast]);

  // "Operable with two switches and nothing else" (docs/build-plan.md Phase 7) beyond
  // the board grid's own dedicated scanning: Space advances focus through
  // whatever's on screen, the same way it advances the scan highlight
  // inside a grid, and Enter's native browser behaviour already activates
  // a focused button, so the same two inputs work everywhere. Skipped
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

  // A single press opens the PIN gate. Parent Mode itself still requires
  // the correct PIN behind it (invariant I4: complexity lives behind the
  // PIN), so a standard button doesn't expose anything a hold gesture was
  // protecting; it only changes how quickly an adult reaches the PIN
  // screen. An earlier hold-to-open design was replaced after repeated
  // feedback that a plain tap doing nothing read as broken.
  function openParentModeGate(): void {
    pinGateOpen.value = 'parent';
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
      case 'firstthen':
        return <FirstThenScreen />;
      case 'game':
        return <GamesScreen />;
      case 'draw':
        return <DrawScreen />;
      case 'body':
        return <MyBodyScreen />;
      case 'music':
        return <MusicScreen />;
      case 'traffic':
        return <TrafficScreen />;
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

  // Until the saved settings (colours, name, voice) are in, show the loading
  // screen, so the app never opens in one look and then jumps to another.
  if (firstRunDone.value === null || !settingsReady.value) {
    return <SplashScreen />;
  }

  if (!firstRunDone.value) {
    return <FirstRunWizard onComplete={() => (firstRunDone.value = true)} />;
  }

  if (mode.value === 'school') {
    return (
      <SchoolModeScreen
        onExit={() => {
          mode.value = 'child';
          void recordActivity('adult', `Closed ${SCHOOL_MODE_NAME}`);
        }}
      />
    );
  }

  if (mode.value === 'parent') {
    return (
      <ParentModeScreen
        onExit={() => {
          mode.value = 'child';
          void recordActivity('adult', `Closed ${modeName()}`);
        }}
      />
    );
  }

  // Lost mode covers everything, and only the PIN turns it off.
  if (lostModeSetting.signal.value.on) {
    return <LostModeScreen />;
  }

  return (
    <div class="app-shell">
      <QuickAccessBar onNavigate={handleQuickAccess} />
      {/* Persistent and separate from Quick Access, fires from any screen,
          including mid-typing on the Keyboard screen, without disturbing
          whatever that screen's own state is (docs/build-plan.md Phase 3 acceptance). */}
      <button type="button" class="give-me-time-bar" onClick={pressGiveMeTime}>
        Give me time
      </button>
      {/* A row of its own, not floated over the screen below, a screen's
          own content (e.g. Keyboard's mode tabs) sits flush at the top of
          app-shell__screen, so overlaying these there collided with it. */}
      <div class="app-shell__toolbar">
        {screen.value.name !== 'home' && (
          <button type="button" class="home-button" onClick={goHome}>
            <span aria-hidden="true">←</span> Home
          </button>
        )}
        {profile.showOnScreen && (profile.deviceName.trim() || profile.name.trim()) && (
          <span class="app-shell__device-name">
            {profile.emoji && <span aria-hidden="true">{profile.emoji} </span>}
            {deviceTitle(profile)}
          </span>
        )}
        <TrafficChip />
        <MedicalInfoButton />
        <AboutMeButton />
        <button type="button" class="parent-mode-button" onClick={openParentModeGate}>
          {modeName()}
        </button>
        {schoolModeSetting.signal.value && (
          <button type="button" class="school-mode-button" onClick={() => (pinGateOpen.value = 'school')}>
            {SCHOOL_MODE_NAME}
          </button>
        )}
      </div>
      <div class="app-shell__screen">{renderScreen()}</div>
      {pinGateOpen.value && (
        <div class="pin-gate-overlay">
          <PinGate
            kind={pinGateOpen.value}
            onUnlock={() => {
              const which = pinGateOpen.value;
              pinGateOpen.value = null;
              mode.value = which === 'school' ? 'school' : 'parent';
              void recordActivity('adult', `Opened ${which === 'school' ? SCHOOL_MODE_NAME : modeName()}`);
            }}
            onCancel={() => (pinGateOpen.value = null)}
          />
        </div>
      )}
    </div>
  );
}
