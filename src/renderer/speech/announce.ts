import { speak, speakWordByWord, type SpeakOptions } from './speak';
import {
  getVoiceClip,
  preferredSpeechPitch,
  preferredSpeechRate,
  preferredVoiceURI,
  pronunciationsSetting,
  recordUtteranceIfEnabled,
  speakStyleSetting,
  speechVolumeSetting,
} from '../store/db';
import { applyPronunciations } from './pronunciation';
import type { Item } from '../store/types';

function baseSpeakOptions(): SpeakOptions {
  return {
    rate: preferredSpeechRate.value,
    pitch: preferredSpeechPitch.value,
    volume: speechVolumeSetting.signal.value,
    ...(preferredVoiceURI.value ? { voiceURI: preferredVoiceURI.value } : {}),
  };
}

function playBlob(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = speechVolumeSetting.signal.value;
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(url);
      resolve();
    });
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('voice clip playback failed'));
    });
    void audio.play();
  });
}

/**
 * Speaks an item's text, or plays its recorded voice clip if it has one
 * (docs/build-plan.md Phase 4: "a familiar person's voice can say it instead of the
 * synthesiser"). Either way the utterance is recorded through the same
 * single path as everything else (PRINCIPLES.md §6).
 */
export async function announceItem(item: Item, options?: SpeakOptions): Promise<void> {
  const text = item.vocalization ?? item.label;
  if (item.voiceClipBlobId) {
    const blob = await getVoiceClip(item.voiceClipBlobId);
    if (blob) {
      await playBlob(blob);
      void recordUtteranceIfEnabled(text);
      return;
    }
  }
  speak(applyPronunciations(text, pronunciationsSetting.signal.value), { ...baseSpeakOptions(), ...options });
  void recordUtteranceIfEnabled(text);
}

/** For plain text that isn't tied to a specific Item (e.g. a composed sentence).
 * `keepInHistory: false` is for practice, such as the game, which is not
 * something the person said and does not belong in Recent. */
export function announceText(text: string, options?: { keepInHistory?: boolean }): void {
  speak(applyPronunciations(text, pronunciationsSetting.signal.value), baseSpeakOptions());
  if (options?.keepInHistory !== false) void recordUtteranceIfEnabled(text);
}

/**
 * Reads out a sentence the way an adult has chosen (Access): all together; with
 * clearer gaps between the words and a touch slower, which some listeners find
 * easier to follow; or one word at a time, lighting each as it is said so the
 * person can see which word they are hearing. `onWord` is only used for the
 * last. The whole sentence is kept in Recent once, however it is read.
 */
export function announceSentence(words: string[], onWord: (index: number | null) => void = () => {}): void {
  const parts = words.map((word) => word.trim()).filter(Boolean);
  if (parts.length === 0) return;
  const style = speakStyleSetting.signal.value;
  const pronunciations = pronunciationsSetting.signal.value;
  if (style === 'wordByWord') {
    speakWordByWord(parts.map((part) => applyPronunciations(part, pronunciations)), baseSpeakOptions(), onWord);
    void recordUtteranceIfEnabled(parts.join(' '));
    return;
  }
  const base = baseSpeakOptions();
  if (style === 'clear') {
    speak(applyPronunciations(parts.join(', '), pronunciations), { ...base, rate: (base.rate ?? 1) * 0.9 });
  } else {
    speak(applyPronunciations(parts.join(' '), pronunciations), base);
  }
  void recordUtteranceIfEnabled(parts.join(' '));
}
