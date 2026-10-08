import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  EMPTY_USER_PROFILE,
  getQuickAccess,
  getRootBoard,
  preferredVoiceURI,
  pressMode,
  setFirstRunCompleted,
  setPreferredVoiceURI,
  getAccessSettings,
  setAccessSettings,
  setPressMode,
  setQuickAccess,
  symbolStyleSetting,
  themeSetting,
  updateBoard,
  userProfileSetting,
} from '../store/db';
import { DEFAULT_THEME, FUN_COLOURS, THEME_PRESETS, isFunColour, type ThemePresetId } from '../ui/theme';
import { deviceTitle } from '../ui/deviceName';
import { getOfflineVoices, speak } from '../speech/speak';
import { resizeGrid } from '../parent/boardEditing';
import { VALID_GRID_SIZES, type Board, type GridSize } from '../store/types';
import { PinGate } from '../parent/PinGate';
import { PictureChoices } from '../symbols/PictureChoices';
import type { PressMode } from '../store/types';

type Screen = 'welcome' | 'about' | 'voice' | 'grid' | 'pictures' | 'press' | 'look' | 'pin' | 'ready';

/** The colour schemes offered while setting up; all the rest are in Parent Mode, under Look. */
const STARTING_LOOKS: Exclude<ThemePresetId, 'custom'>[] = ['standard', 'pink', 'orange', 'green', 'turquoise', 'blue', 'purple', 'night'];

const STEP_NUMBERS: Record<Screen, number> = { welcome: 0, about: 1, voice: 2, grid: 3, pictures: 4, press: 5, look: 6, pin: 7, ready: 8 };
const TEXT_SIZES = [
  { scale: 1, label: 'Usual' },
  { scale: 1.25, label: 'Larger' },
  { scale: 1.5, label: 'Much larger' },
];

type Props = {
  onComplete: () => void;
};

// Setting up, one thing at a time: a welcome, whose device it is, the voice,
// how big the buttons are, the colours, the Parent PIN, and a short "you are
// ready". Everything except the PIN can be skipped, and everything can be
// changed later in Parent Mode. (This is more than the three screens docs/build-plan.md
// phase 8 first asked for; each added step is optional and says so.)
export function FirstRunWizard({ onComplete }: Props) {
  const screen = useSignal<Screen>('welcome');
  const personName = useSignal('');
  const deviceName = useSignal('');
  const age = useSignal('');
  const gamesOnBar = useSignal(false);
  const chosenPress = useSignal<PressMode>('sentence');
  const textScale = useSignal(1);
  const voices = useSignal<SpeechSynthesisVoice[]>([]);
  const chosenVoiceURI = useSignal<string | undefined>(undefined);
  const rootBoard = useSignal<Board | null>(null);
  const chosenSize = useSignal<GridSize>(4);
  const minSize = useSignal<GridSize>(4);
  const gridError = useSignal<string | null>(null);

  useEffect(() => {
    voices.value = getOfflineVoices(window.speechSynthesis.getVoices());
    chosenVoiceURI.value = voices.value[0]?.voiceURI;

    void getRootBoard().then((board) => {
      if (!board) return;
      rootBoard.value = board;
      chosenSize.value = board.grid.rows;
      const needed = VALID_GRID_SIZES.find((size) => size * size >= board.buttons.length) ?? 5;
      minSize.value = needed as GridSize;
    });
  }, []);

  function tryVoice(): void {
    speak('This is what I sound like.', chosenVoiceURI.value ? { voiceURI: chosenVoiceURI.value } : {});
  }

  async function confirmAbout(): Promise<void> {
    if (personName.value.trim() || deviceName.value.trim() || age.value.trim()) {
      await userProfileSetting.set({
        ...EMPTY_USER_PROFILE,
        name: personName.value.trim(),
        deviceName: deviceName.value.trim(),
        age: age.value.trim(),
      });
    }
    screen.value = 'voice';
  }

  async function confirmVoice(): Promise<void> {
    await setPreferredVoiceURI(chosenVoiceURI.value);
    preferredVoiceURI.value = chosenVoiceURI.value;
    screen.value = 'grid';
  }

  // Drawn symbols are chosen to begin with; emoji are one press away.
  function goToPictures(): void {
    void symbolStyleSetting.set('drawn');
    screen.value = 'pictures';
  }

  async function chooseTextSize(scale: number): Promise<void> {
    textScale.value = scale;
    await setAccessSettings({ ...(await getAccessSettings()), textScale: scale });
  }

  async function confirmPress(): Promise<void> {
    await setPressMode(chosenPress.value);
    pressMode.value = chosenPress.value;
    screen.value = 'look';
  }

  function chooseLook(preset: ThemePresetId): void {
    void themeSetting.set({ ...DEFAULT_THEME, ...themeSetting.signal.value, preset });
  }

  async function confirmGrid(): Promise<void> {
    if (!rootBoard.value) {
      goToPictures();
      return;
    }
    gridError.value = null;
    try {
      await updateBoard(resizeGrid(rootBoard.value, chosenSize.value, chosenSize.value));
      goToPictures();
    } catch (err) {
      gridError.value = err instanceof Error ? err.message : String(err);
    }
  }

  // Set up is done once the PIN is in place; the last screen is only a tour,
  // so closing the app there loses nothing.
  async function finishSetup(): Promise<void> {
    await setFirstRunCompleted();
    screen.value = 'ready';
  }

  async function start(): Promise<void> {
    if (gamesOnBar.value) {
      const bar = await getQuickAccess();
      // Games take the place of the last button, never Help.
      const lastIndex = bar.length - 1;
      if (!bar.includes('game')) await setQuickAccess(bar.map((id, i) => (i === lastIndex && id !== 'help' ? 'game' : id)));
    }
    onComplete();
  }

  const step = STEP_NUMBERS[screen.value];
  const looks = THEME_PRESETS;

  return (
    <div class="first-run-wizard">
      {screen.value === 'welcome' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Welcome to Rugged Speech Test</h1>
          <p class="first-run-wizard__hint">
            A way to say what you want to say, when speaking is hard. Words, pictures and a keyboard, spoken
            out loud, for children and young people.
          </p>
          <ul class="first-run-wizard__promises">
            <li>It works with no internet, always.</li>
            <li>Everything stays on this computer. Nothing is sent anywhere.</li>
            <li>Nothing is spoken unless someone presses something.</li>
            <li>An adult sets it up now. It takes about two minutes, and every choice can be changed later.</li>
          </ul>
          <div>
            <button
              type="button"
              class="first-run-wizard__button first-run-wizard__button--primary"
              onClick={() => (screen.value = 'about')}
            >
              Get started
            </button>
          </div>
        </div>
      )}

      {screen.value === 'about' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Whose device is this?</h1>
          <p class="first-run-wizard__hint">
            All optional. A name makes it clear whose device this is, if it is ever picked up by someone else.
            It stays on this computer.
          </p>
          <label class="first-run-wizard__field">
            Name
            <input
              type="text"
              autocomplete="off"
              placeholder="Lucy"
              value={personName.value}
              onInput={(event) => (personName.value = (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="first-run-wizard__field">
            Device name
            <input
              type="text"
              autocomplete="off"
              placeholder={personName.value.trim() ? `${personName.value.trim()}'s device` : "Lucy's device"}
              value={deviceName.value}
              onInput={(event) => (deviceName.value = (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="first-run-wizard__field">
            Age
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              autocomplete="off"
              value={age.value}
              onInput={(event) => (age.value = (event.target as HTMLInputElement).value.replace(/\D/g, ''))}
            />
          </label>
          <div>
            <button
              type="button"
              class="first-run-wizard__button first-run-wizard__button--primary"
              onClick={() => void confirmAbout()}
            >
              Next
            </button>
            <button type="button" class="first-run-wizard__button" onClick={() => (screen.value = 'voice')}>
              Skip
            </button>
            <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'welcome')}>
              Back
            </button>
          </div>
        </div>
      )}

      {screen.value === 'voice' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Choose a voice</h1>
          <p class="first-run-wizard__hint">This is the voice that speaks what's built on the board.</p>
          {voices.value.length === 0 && <p>No offline voices were found on this computer.</p>}
          <ul class="first-run-wizard__voice-list">
            {voices.value.map((voice) => (
              <li key={voice.voiceURI}>
                <label class="first-run-wizard__voice-option">
                  <input
                    type="radio"
                    name="voice"
                    checked={chosenVoiceURI.value === voice.voiceURI}
                    onChange={() => (chosenVoiceURI.value = voice.voiceURI)}
                  />
                  {voice.name}
                </label>
              </li>
            ))}
          </ul>
          <button type="button" class="first-run-wizard__button" onClick={tryVoice} disabled={!chosenVoiceURI.value}>
            Try it
          </button>
          <button
            type="button"
            class="first-run-wizard__button first-run-wizard__button--primary"
            onClick={() => void confirmVoice()}
          >
            Next
          </button>
          <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'about')}>
            Back
          </button>
        </div>
      )}

      {screen.value === 'grid' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Choose a grid size</h1>
          <p class="first-run-wizard__hint">
            Bigger buttons, fewer per page, or smaller buttons with more choices at once. This
            can be changed later in Parent Mode, but a child learns where buttons are, so
            it's worth getting right now.
          </p>
          {gridError.value && <p class="first-run-wizard__error">{gridError.value}</p>}
          <div class="first-run-wizard__grid-sizes">
            {VALID_GRID_SIZES.filter((size) => size >= minSize.value).map((size) => (
              <label class="first-run-wizard__grid-size-option" key={size}>
                <input
                  type="radio"
                  name="grid-size"
                  checked={chosenSize.value === size}
                  onChange={() => (chosenSize.value = size)}
                />
                {size} × {size}
              </label>
            ))}
          </div>
          <button
            type="button"
            class="first-run-wizard__button first-run-wizard__button--primary"
            onClick={() => void confirmGrid()}
          >
            Next
          </button>
          <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'voice')}>
            Back
          </button>
        </div>
      )}

      {screen.value === 'pictures' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Pictures and words</h1>
          <p class="first-run-wizard__hint">
            Choose what the buttons show. You can see the change straight away, and change it later in Parent Mode,
            under Look.
          </p>
          <PictureChoices />
          <div class="picture-choices" role="group" aria-label="Size of the writing">
            {TEXT_SIZES.map((size) => (
              <button
                type="button"
                key={size.scale}
                class={`picture-choices__option${textScale.value === size.scale ? ' picture-choices__option--on' : ''}`}
                aria-pressed={textScale.value === size.scale}
                onClick={() => void chooseTextSize(size.scale)}
              >
                <strong>{size.label} writing</strong>
                <span>Words and labels in the app.</span>
              </button>
            ))}
          </div>
          <div>
            <button type="button" class="first-run-wizard__button first-run-wizard__button--primary" onClick={() => (screen.value = 'press')}>
              Next
            </button>
            <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'grid')}>
              Back
            </button>
          </div>
        </div>
      )}

      {screen.value === 'press' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">What should pressing a word do?</h1>
          <p class="first-run-wizard__hint">
            For someone just starting, it often helps to hear the word the moment they press it, so they learn that
            pressing makes a sound. Someone building sentences may prefer to add words and then press Speak. You can
            change this at any time in Access.
          </p>
          <div class="first-run-wizard__grid-sizes" role="radiogroup" aria-label="What pressing a word does">
            {(
              [
                ['speak', 'Say the word straight away', 'Best for someone just starting.'],
                ['both', 'Say it, and add it to the sentence', 'Hears each word, and can build a sentence too.'],
                ['sentence', 'Only add it to the sentence', 'Then press Speak to say it all.'],
              ] as [PressMode, string, string][]
            ).map(([mode, label, hint]) => (
              <label class="first-run-wizard__press-option" key={mode}>
                <input type="radio" name="press-mode" checked={chosenPress.value === mode} onChange={() => (chosenPress.value = mode)} />
                <span>
                  <strong>{label}</strong>
                  <span class="first-run-wizard__press-hint">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          <div>
            <button type="button" class="first-run-wizard__button first-run-wizard__button--primary" onClick={() => void confirmPress()}>
              Next
            </button>
            <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'pictures')}>
              Back
            </button>
          </div>
        </div>
      )}

      {screen.value === 'look' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Choose the colours</h1>
          <p class="first-run-wizard__hint">
            Pick a favourite colour, or whatever is easiest on the eyes. You can see it change as you choose, and
            there are more choices, and your own colours, in {`Parent Mode`} later.
          </p>
          <div class="first-run-wizard__looks" role="group" aria-label="Colour scheme">
            {STARTING_LOOKS.map((id) => (
              <button
                type="button"
                key={id}
                class={`first-run-wizard__look${themeSetting.signal.value.preset === id ? ' first-run-wizard__look--chosen' : ''}`}
                aria-pressed={themeSetting.signal.value.preset === id}
                onClick={() => chooseLook(id)}
              >
                <span
                  class="look-tab__swatch"
                  style={{ background: isFunColour(id) ? FUN_COLOURS[id].swatch : looks[id].colours.background, color: looks[id].colours.text, borderColor: looks[id].colours.border }}
                  aria-hidden="true"
                >
                  Aa
                </span>
                {looks[id].name}
              </button>
            ))}
          </div>
          <div>
            <button
              type="button"
              class="first-run-wizard__button first-run-wizard__button--primary"
              onClick={() => (screen.value = 'pin')}
            >
              Next
            </button>
            <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'press')}>
              Back
            </button>
          </div>
        </div>
      )}

      {screen.value === 'pin' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Set a Parent PIN</h1>
          <p class="first-run-wizard__hint">
            This protects settings and editing. It does not lock the computer.
          </p>
          <PinGate onUnlock={() => void finishSetup()} onCancel={() => {}} showCancel={false} />
          <button type="button" class="first-run-wizard__button first-run-wizard__button--back" onClick={() => (screen.value = 'look')}>
            Back to colours
          </button>
        </div>
      )}

      {screen.value === 'ready' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">
            {userProfileSetting.signal.value.name.trim() ? `${deviceTitle(userProfileSetting.signal.value)} is ready` : 'You are ready'}
          </h1>
          <ul class="first-run-wizard__tour">
            <li>
              <strong>Talk</strong> is where words are built into a sentence. Press words, then press Speak.
            </li>
            <li>
              <strong>Help</strong> is always on the bar along the top.
            </li>
            <li>
              <strong>Parent Mode</strong> (top right, with your PIN) is where you add people, places, photos and
              pages, and change how everything looks and sounds.
            </li>
            <li>
              The <strong>User guide</strong> that came with the app explains everything, step by step.
            </li>
          </ul>
          <label class="access-tab__checkbox">
            <input
              type="checkbox"
              checked={gamesOnBar.value}
              onChange={(event) => (gamesOnBar.value = (event.target as HTMLInputElement).checked)}
            />
            Put Games and Draw on the top bar
          </label>
          <div>
            <button
              type="button"
              class="first-run-wizard__button first-run-wizard__button--primary"
              onClick={() => void start()}
            >
              Start
            </button>
          </div>
        </div>
      )}

      <p class="first-run-wizard__progress" aria-hidden={step === 0}>
        {step > 0 && step < 8 ? `Step ${step} of 7` : ''}
      </p>
    </div>
  );
}
