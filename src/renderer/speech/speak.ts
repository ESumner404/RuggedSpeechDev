/**
 * Chromium's "Natural" network-backed voices vanish the moment wifi does
 * (invariant I1). `localService === false` marks those; keep everything
 * else, including voices that don't report the flag at all.
 */
export function getOfflineVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter((voice) => voice.localService !== false);
}

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  voiceURI?: string;
};

/** Speech is never automatic (invariant I5) — only call this from a press handler. */
export function speak(text: string, options: SpeakOptions = {}): void {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;

  const offlineVoices = getOfflineVoices(synth.getVoices());
  const chosenVoice = options.voiceURI
    ? offlineVoices.find((voice) => voice.voiceURI === options.voiceURI)
    : offlineVoices[0];
  if (chosenVoice) utterance.voice = chosenVoice;

  synth.cancel();
  synth.speak(utterance);
}
