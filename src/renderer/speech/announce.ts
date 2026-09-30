import { speak, type SpeakOptions } from './speak';
import { getVoiceClip, preferredSpeechRate, preferredVoiceURI, recordUtteranceIfEnabled } from '../store/db';
import type { Item } from '../store/types';

function baseSpeakOptions(): SpeakOptions {
  return {
    rate: preferredSpeechRate.value,
    ...(preferredVoiceURI.value ? { voiceURI: preferredVoiceURI.value } : {}),
  };
}

function playBlob(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
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
 * (PLAN.md Phase 4: "a familiar person's voice can say it instead of the
 * synthesiser"). Either way the utterance is recorded through the same
 * single path as everything else (CLAUDE.md §6).
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
  speak(text, { ...baseSpeakOptions(), ...options });
  void recordUtteranceIfEnabled(text);
}

/** For plain text that isn't tied to a specific Item (e.g. a composed sentence). */
export function announceText(text: string): void {
  speak(text, baseSpeakOptions());
  void recordUtteranceIfEnabled(text);
}
