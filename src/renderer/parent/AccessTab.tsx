import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  DEFAULT_ACCESS_SETTINGS,
  DEFAULT_PRESS_MODE,
  DEFAULT_SPEECH_PITCH,
  DEFAULT_SPEECH_RATE,
  getAccessSettings,
  getPreferredSpeechPitch,
  getPreferredSpeechRate,
  getPressMode,
  setAccessSettings,
  setPreferredSpeechPitch,
  setPreferredSpeechRate,
  setPressMode,
} from '../store/db';
import type { AccessSettings, ContrastMode, PressMode, ScanningMode } from '../store/types';

// Access (PLAN.md Phase 7): everything here defaults off, and stays off
// for a family that never opens this tab — ordinary touch/mouse behaviour
// is unaffected until an adult deliberately turns something on.
export function AccessTab() {
  const settings = useSignal<AccessSettings>(DEFAULT_ACCESS_SETTINGS);
  const speechRate = useSignal<number>(DEFAULT_SPEECH_RATE);
  const speechPitch = useSignal<number>(DEFAULT_SPEECH_PITCH);
  const press = useSignal<PressMode>(DEFAULT_PRESS_MODE);
  const loaded = useSignal(false);

  useEffect(() => {
    void Promise.all([
      getAccessSettings(),
      getPreferredSpeechRate(),
      getPreferredSpeechPitch(),
      getPressMode(),
    ]).then(([loadedSettings, loadedRate, loadedPitch, loadedPress]) => {
      settings.value = loadedSettings;
      speechRate.value = loadedRate;
      speechPitch.value = loadedPitch;
      press.value = loadedPress;
      loaded.value = true;
    });
  }, []);

  async function update(next: AccessSettings): Promise<void> {
    settings.value = next;
    await setAccessSettings(next);
  }

  async function updateSpeechRate(rate: number): Promise<void> {
    speechRate.value = rate;
    await setPreferredSpeechRate(rate);
  }

  async function updateSpeechPitch(pitch: number): Promise<void> {
    speechPitch.value = pitch;
    await setPreferredSpeechPitch(pitch);
  }

  async function updatePressMode(mode: PressMode): Promise<void> {
    press.value = mode;
    await setPressMode(mode);
  }

  if (!loaded.value) return null;

  return (
    <div class="parent-mode-screen__body access-tab">
      <section class="access-tab__section">
        <h2 class="access-tab__heading">Speech rate</h2>
        <p class="access-tab__hint">
          How fast spoken output is read out. Some people follow speech better when it's slower.
        </p>
        <label class="access-tab__slider-row">
          ×{speechRate.value.toFixed(2)}
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={speechRate.value}
            onInput={(event) => void updateSpeechRate(Number((event.target as HTMLInputElement).value))}
          />
        </label>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Voice pitch</h2>
        <p class="access-tab__hint">
          How high or low the voice sounds. Lower can feel calmer; higher can sound younger.
        </p>
        <label class="access-tab__slider-row">
          Pitch ×{speechPitch.value.toFixed(2)}
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={speechPitch.value}
            onInput={(event) => void updateSpeechPitch(Number((event.target as HTMLInputElement).value))}
          />
        </label>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">When a button is pressed</h2>
        <p class="access-tab__hint">
          On the Talk board and My Pages. Words are only ever spoken because someone pressed
          something — this just chooses what that press does.
        </p>
        <label class="access-tab__select-row">
          A press
          <select
            value={press.value}
            onChange={(event) => void updatePressMode((event.target as HTMLSelectElement).value as PressMode)}
          >
            <option value="sentence">Adds the word to the sentence (speak with Speak)</option>
            <option value="speak">Speaks the word straight away</option>
            <option value="both">Does both</option>
          </select>
        </label>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Hold-to-select</h2>
        <p class="access-tab__hint">
          For eye gaze or a head pointer — a button activates once the pointer or focus has
          rested on it this long, instead of on tap. 0 turns this off.
        </p>
        <label class="access-tab__slider-row">
          {settings.value.dwellMs}ms
          <input
            type="range"
            min={0}
            max={1500}
            step={50}
            value={settings.value.dwellMs}
            onInput={(event) =>
              void update({ ...settings.value, dwellMs: Number((event.target as HTMLInputElement).value) })
            }
          />
        </label>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Repeat-press suppression</h2>
        <p class="access-tab__hint">
          Ignores a second press of the same button within this long of the first — for a
          switch or finger that sometimes double-fires. 0 turns this off.
        </p>
        <label class="access-tab__slider-row">
          {settings.value.repeatSuppressMs}ms
          <input
            type="range"
            min={0}
            max={2000}
            step={100}
            value={settings.value.repeatSuppressMs}
            onInput={(event) =>
              void update({
                ...settings.value,
                repeatSuppressMs: Number((event.target as HTMLInputElement).value),
              })
            }
          />
        </label>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Switch scanning</h2>
        <p class="access-tab__hint">
          Row/column scanning driven by Space and Enter, so any keyboard-emulating switch
          interface works. While this is on, buttons in Talk, Feelings and Favourites are
          reached only by scanning, not by touch or tab.
        </p>
        <label class="access-tab__select-row">
          Mode
          <select
            value={settings.value.scanningMode}
            onChange={(event) =>
              void update({
                ...settings.value,
                scanningMode: (event.target as HTMLSelectElement).value as ScanningMode,
              })
            }
          >
            <option value="off">Off</option>
            <option value="twoSwitchStepped">Two switches (Space advances, Enter selects)</option>
            <option value="oneSwitchTimed">One switch (Space selects; auto-advances on its own)</option>
          </select>
        </label>
        {settings.value.scanningMode === 'oneSwitchTimed' && (
          <label class="access-tab__slider-row">
            Auto-advance every {settings.value.scanIntervalMs}ms
            <input
              type="range"
              min={500}
              max={4000}
              step={100}
              value={settings.value.scanIntervalMs}
              onInput={(event) =>
                void update({
                  ...settings.value,
                  scanIntervalMs: Number((event.target as HTMLInputElement).value),
                })
              }
            />
          </label>
        )}
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Visual</h2>
        <label class="access-tab__select-row">
          High contrast
          <select
            value={settings.value.highContrast}
            onChange={(event) =>
              void update({
                ...settings.value,
                highContrast: (event.target as HTMLSelectElement).value as ContrastMode,
              })
            }
          >
            <option value="off">Off</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label class="access-tab__slider-row">
          Text size ×{settings.value.textScale}
          <input
            type="range"
            min={1}
            max={2}
            step={0.25}
            value={settings.value.textScale}
            onInput={(event) =>
              void update({ ...settings.value, textScale: Number((event.target as HTMLInputElement).value) })
            }
          />
        </label>
        <label class="access-tab__checkbox">
          <input
            type="checkbox"
            checked={settings.value.reduceMotion}
            onChange={(event) =>
              void update({ ...settings.value, reduceMotion: (event.target as HTMLInputElement).checked })
            }
          />
          Reduce motion
        </label>
        <label class="access-tab__checkbox">
          <input
            type="checkbox"
            checked={settings.value.lowArousalPalette}
            onChange={(event) =>
              void update({
                ...settings.value,
                lowArousalPalette: (event.target as HTMLInputElement).checked,
              })
            }
          />
          Low-arousal colours (same word classes, muted)
        </label>
      </section>
    </div>
  );
}
