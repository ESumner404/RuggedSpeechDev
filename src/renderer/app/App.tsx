import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
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
  activeProfileVersion,
  appleLinkSetting,
  boardsVersion,
  clearAfterSpeakSetting,
  getActiveProfile,
  getAllBoards,
  pronunciationsSetting,
  speechVolumeSetting,
  wordStageSetting,
  dayPlanVersion,
  favouritesVersion,
  getEffectiveDayPlan,
  getFavourites,
  trafficSetting,
  followDeviceAccessibilitySetting,
  pressBuzzSetting,
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
  schoolDayOnHomeSetting,
  labelStyleSetting,
  symbolStyleSetting,
  themeSetting,
  userProfileSetting,
} from '../store/db';
import { applyAccessSettings } from '../access/applyAccessSettings';
import { buzzOnPress, deviceAccessibility, followDevice, watchDeviceAccessibility } from '../platform/deviceAccessibility';
import { buildLinkState, buildSentenceMessage, buildSyncMessage, startLink, type LinkCommand, type LinkSession } from '../platform/appleLink';
import { lastSaid, liveSentence } from '../platform/liveSpeech';
import { controllerSpec, linkPeers } from '../platform/linkStatus';
import { ControllerScreen } from '../game/ControllerScreen';
import { FamilyScreen } from '../family/FamilyScreen';
import { MoviesScreen } from '../movies/MoviesScreen';
import { AppsScreen } from '../apps/AppsScreen';
import { readSchoolNow } from '../day/schoolDay';
import { TimerScreen } from '../timer/TimerScreen';
import { StoriesScreen } from '../stories/StoriesScreen';
import { getDateString } from '../day/dayLogic';
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
import { favouriteNotice } from '../board/favouriteNotice';

type AppScreen =
  | { name: 'home' }
  | { name: 'talk' }
  | { name: 'keyboard' }
  | { name: 'myday' }
  | { name: 'mypages'; pageId?: string }
  | { name: 'firstthen' }
  | { name: 'game' }
  | { name: 'draw' }
  | { name: 'body' }
  | { name: 'family' }
  | { name: 'movies' }
  | { name: 'apps' }
  | { name: 'timer' }
  | { name: 'stories' }
  | { name: 'music' }
  | { name: 'traffic' }
  | { name: 'controller' }
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
  family: 'My family',
  movies: 'Movies',
  apps: 'Apps',
  timer: 'Timer',
  stories: 'My stories',
  music: 'Music',
  traffic: 'Traffic light',
  controller: 'Game controller',
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
  const accessLoaded = useSignal(false);

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
      accessLoaded.value = true;
    });
  }, [accessVersion]);

  // On a phone or tablet, the device's own accessibility settings are added to
  // the app's (never taking anything away), unless an adult turned that off.
  useEffect(() => watchDeviceAccessibility(), []);
  const followDeviceNow = followDeviceAccessibilitySetting.signal.value && settingsReady.value;
  const device = deviceAccessibility.value;
  useEffect(() => {
    if (!accessLoaded.value) return;
    const effective = followDeviceNow ? followDevice(access.value, device) : access.value;
    applyAccessSettings(effective, { boldText: followDeviceNow && device.boldText });
  }, [access.value, accessLoaded.value, followDeviceNow, device]);

  // The link to the family's own Apple Watch and Apple TV, only if an adult turned it on. Other devices may ask for a
  // page to open or the traffic light to change, never for anything to be spoken, and never while an adult has
  // Parent Mode or School Mode open.
  const linkSettings = appleLinkSetting.signal.value;
  const linkOn = linkSettings.enabled && /^\d{4}$/.test(linkSettings.code) && settingsReady.value;
  const linkRef = useRef<LinkSession | undefined>(undefined);
  function handleLinkCommand(command: LinkCommand): void {
    if (command.kind === 'sync') {
      linkRef.current?.resend();
      return;
    }
    if (command.kind === 'controller') {
      // A game on the television asks for its buttons here; an empty set means it has finished.
      controllerSpec.value = command.spec;
      if (mode.value !== 'child') return;
      if (command.spec) screen.value = { name: 'controller' };
      else if (screen.value.name === 'controller') screen.value = { name: 'home' };
      return;
    }
    if (mode.value !== 'child') return;
    if (command.kind === 'open') {
      screen.value = command.screen === 'feelings' ? { name: 'feelings' } : command.screen === 'favourites' ? { name: 'favourites' } : { name: command.screen };
    } else {
      void trafficSetting.set({ ...trafficSetting.signal.value, status: command.status });
    }
  }
  useEffect(() => {
    if (!linkOn) return undefined;
    const session = startLink(linkSettings.code, handleLinkCommand, (count) => (linkPeers.value = count));
    linkRef.current = session;
    return () => {
      session?.stop();
      linkRef.current = undefined;
      linkPeers.value = 0;
    };
  }, [linkOn, linkSettings.code]);
  const favouritesNow = favouritesVersion.value;
  const planNow = dayPlanVersion.value;
  const trafficNow = trafficSetting.signal.value.status;
  const linkedScreen = screen.value.name;
  useEffect(() => {
    if (!linkRef.current) return;
    void Promise.all([getFavourites(), getEffectiveDayPlan(getDateString(new Date()))]).then(([favourites, { plan }]) => {
      linkRef.current?.publish(buildLinkState({ screen: linkedScreen, traffic: trafficNow, plan: plan.activities, favourites }));
    });
  }, [linkOn, favouritesNow, planNow, trafficNow, linkedScreen]);

  // The words on the boards and how the app is set up, for the television, so it says the same words in the same
  // places with the same voice. Sent again whenever any of it changes.
  const boardsNow = boardsVersion.value;
  const activeProfileNow = activeProfileVersion.value;
  const speechRateNow = preferredSpeechRate.value;
  const speechPitchNow = preferredSpeechPitch.value;
  const speechVolumeNow = speechVolumeSetting.signal.value;
  const pronunciationsNow = pronunciationsSetting.signal.value;
  const labelStyleNow = labelStyleSetting.signal.value;
  const pressModeNow = pressMode.value;
  const clearAfterSpeakNow = clearAfterSpeakSetting.signal.value;
  const wordStageNow = wordStageSetting.signal.value;
  const deviceProfileNow = userProfileSetting.signal.value;
  const accessNow = access.value;
  useEffect(() => {
    if (!linkRef.current) return;
    void Promise.all([getAllBoards(), getActiveProfile()]).then(([boards, active]) => {
      linkRef.current?.publish(
        buildSyncMessage({
          deviceName: deviceTitle(deviceProfileNow),
          rootBoardId: active.rootBoardId,
          boards,
          wordStage: wordStageNow,
          speech: { rate: speechRateNow, pitch: speechPitchNow, volume: speechVolumeNow },
          pronunciations: pronunciationsNow,
          labelStyle: labelStyleNow,
          pressMode: pressModeNow,
          clearAfterSpeak: clearAfterSpeakNow,
          access: accessNow,
        }),
      );
    });
  }, [
    linkOn,
    boardsNow,
    activeProfileNow,
    speechRateNow,
    speechPitchNow,
    speechVolumeNow,
    pronunciationsNow,
    labelStyleNow,
    pressModeNow,
    clearAfterSpeakNow,
    wordStageNow,
    deviceProfileNow,
    accessNow,
  ]);

  // What is being built and said, for the television, only if an adult separately turned that on.
  const showSentence = linkSettings.showSentence === true;
  const sentenceNow = liveSentence.value;
  const saidNow = lastSaid.value;
  useEffect(() => {
    if (!linkRef.current) return;
    linkRef.current.publish(showSentence ? buildSentenceMessage(sentenceNow, saidNow?.text ?? null) : buildSentenceMessage([], null));
  }, [linkOn, showSentence, sentenceNow, saidNow]);

  const buzzNow = pressBuzzSetting.signal.value && settingsReady.value;
  useEffect(() => (buzzNow ? buzzOnPress() : undefined), [buzzNow]);

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
    if (target === 'lesson') {
      void openThisLesson();
      return;
    }
    screen.value = { name: target };
  }

  // The words for what is happening now at school; My Day when there are none to offer.
  async function openThisLesson(): Promise<void> {
    const pageId = (await readSchoolNow()).now?.pageId;
    screen.value = pageId ? { name: 'mypages', pageId } : { name: 'myday' };
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
        return (
          <HomeScreen
            onSelect={handleHomeSelect}
            {...(schoolModeSetting.signal.value && schoolDayOnHomeSetting.signal.value
              ? {
                  schoolDay: {
                    onOpenDay: () => (screen.value = { name: 'myday' }),
                    onOpenPage: (pageId: string) => (screen.value = { name: 'mypages', pageId }),
                  },
                }
              : {})}
          />
        );
      case 'talk':
        return <TalkScreen onExit={goHome} />;
      case 'keyboard':
        return <KeyboardScreen />;
      case 'controller':
        return <ControllerScreen onPress={(button) => linkRef.current?.sendNow({ type: 'input', button })} />;
      case 'myday':
        return <MyDayScreen onOpenPage={(pageId) => (screen.value = { name: 'mypages', pageId })} />;
      case 'mypages':
        return <MyPagesScreen onExit={goHome} {...(screen.value.name === 'mypages' && screen.value.pageId ? { initialPageId: screen.value.pageId } : {})} />;
      case 'firstthen':
        return <FirstThenScreen />;
      case 'game':
        return <GamesScreen />;
      case 'draw':
        return <DrawScreen />;
      case 'stories':
        return <StoriesScreen />;
      case 'timer':
        return <TimerScreen />;
      case 'movies':
        return <MoviesScreen />;
      case 'apps':
        return <AppsScreen />;
      case 'family':
        return <FamilyScreen />;
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
      <main class="app-shell__screen">{renderScreen()}</main>
      <div class="favourite-notice" role="status">
        {favouriteNotice.value}
      </div>
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
