import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { announceText } from '../speech/announce';
import { VOICE_PRESETS, matchingPreset } from '../speech/presets';
import { getOfflineVoices } from '../speech/speak';
import {
  preferredSpeechPitch,
  preferredSpeechRate,
  preferredVoiceURI,
  setPreferredSpeechPitch,
  setPreferredSpeechRate,
  setPreferredVoiceURI,
  speakStyleSetting,
} from '../store/db';
import type { SpeakStyle } from '../store/types';

const SAMPLE = 'This is what I sound like.';

// Choosing how the app sounds, at any time: the voice itself, a starting
// point for speed and pitch, and how a built sentence is read out. Every
// change can be heard straight away, because it is the child's own voice and
// an adult should hear it before the child does.
export function VoiceSettings() {
  const voices = useSignal<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const load = () => (voices.value = getOfflineVoices(synth.getVoices()));
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, []);

  const rate = preferredSpeechRate.value;
  const pitch = preferredSpeechPitch.value;
  const current = matchingPreset(rate, pitch);
  const chosenVoice = preferredVoiceURI.value ?? voices.value[0]?.voiceURI ?? '';

  async function choosePreset(id: string): Promise<void> {
    const preset = VOICE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    await Promise.all([setPreferredSpeechRate(preset.rate), setPreferredSpeechPitch(preset.pitch)]);
    announceText(SAMPLE, { keepInHistory: false });
  }

  async function chooseVoice(uri: string): Promise<void> {
    await setPreferredVoiceURI(uri || undefined);
    announceText(SAMPLE, { keepInHistory: false });
  }

  return (
    <>
      <section class="access-tab__section">
        <h2 class="access-tab__heading">Voice</h2>
        <p class="access-tab__hint">
          Which voice speaks. Only voices that work without the internet are listed. Try a few: children often
          prefer one over another, and a voice that sounds friendly to an adult may not to a child.
        </p>
        {voices.value.length === 0 ? (
          <p class="access-tab__hint">No voices that work without the internet were found on this computer.</p>
        ) : (
          <label class="access-tab__select-row">
            Voice
            <select value={chosenVoice} onChange={(event) => void chooseVoice((event.target as HTMLSelectElement).value)}>
              {voices.value.map((voice) => (
                <option value={voice.voiceURI} key={voice.voiceURI}>
                  {voice.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          type="button"
          class="parent-mode-screen__button access-tab__add"
          onClick={() => announceText(SAMPLE, { keepInHistory: false })}
        >
          Hear this voice
        </button>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">How it sounds</h2>
        <p class="access-tab__hint">
          A quick way to set the speed and pitch together. Pick one, listen, then fine-tune with the sliders if you
          like.
        </p>
        <div class="access-tab__presets" role="group" aria-label="How it sounds">
          {VOICE_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.id}
              class={`access-tab__preset${current?.id === preset.id ? ' access-tab__preset--chosen' : ''}`}
              aria-pressed={current?.id === preset.id}
              onClick={() => void choosePreset(preset.id)}
            >
              <span class="access-tab__preset-name">{preset.name}</span>
              <span class="access-tab__preset-hint">{preset.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Reading a sentence out</h2>
        <p class="access-tab__hint">
          How Speak reads out the words in the sentence. Word by word lights each word as it is said, so a child
          can see which word they are hearing.
        </p>
        <label class="access-tab__select-row">
          Speak
          <select
            value={speakStyleSetting.signal.value}
            onChange={(event) => void speakStyleSetting.set((event.target as HTMLSelectElement).value as SpeakStyle)}
          >
            <option value="normal">All together, like a sentence</option>
            <option value="clear">With small gaps between the words, a little slower</option>
            <option value="wordByWord">One word at a time, lighting each word</option>
          </select>
        </label>
      </section>
    </>
  );
}
