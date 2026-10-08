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
  volume?: number;
  voiceURI?: string;
};

// Each new thing said ends whatever was being said before it, including a
// word-by-word sentence part way through. Callbacks from the utterance that
// was cut off must then do nothing.
let currentSpeech = 0;

function makeUtterance(text: string, options: SpeakOptions): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;

  const offlineVoices = getOfflineVoices(window.speechSynthesis.getVoices());
  const chosenVoice = options.voiceURI
    ? offlineVoices.find((voice) => voice.voiceURI === options.voiceURI)
    : offlineVoices[0];
  if (chosenVoice) utterance.voice = chosenVoice;
  return utterance;
}

/** Speech is never automatic (invariant I5), only call this from a press handler. */
export function speak(text: string, options: SpeakOptions = {}): void {
  const synth = window.speechSynthesis;
  currentSpeech += 1;
  synth.cancel();
  synth.speak(makeUtterance(text, options));
}

/**
 * Says the words one at a time, calling `onWord` with the position of the
 * word being said and then with null at the end, so the screen can light
 * each word as it is heard. Like `speak`, only ever from a press handler.
 */
export function speakWordByWord(words: string[], options: SpeakOptions, onWord: (index: number | null) => void): void {
  const synth = window.speechSynthesis;
  currentSpeech += 1;
  const mine = currentSpeech;
  synth.cancel();
  if (words.length === 0) {
    onWord(null);
    return;
  }

  function sayFrom(index: number): void {
    if (mine !== currentSpeech) return;
    if (index >= words.length) {
      onWord(null);
      return;
    }
    const utterance = makeUtterance(words[index]!, options);
    const next = () => {
      if (mine === currentSpeech) sayFrom(index + 1);
      else if (index === words.length - 1) onWord(null);
    };
    utterance.onend = next;
    utterance.onerror = next;
    onWord(index);
    synth.speak(utterance);
  }
  sayFrom(0);
}
