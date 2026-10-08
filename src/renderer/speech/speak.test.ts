import { describe, expect, it } from 'vitest';
import { getOfflineVoices } from './speak';

function voice(name: string, localService?: boolean): SpeechSynthesisVoice {
  return { name, localService } as SpeechSynthesisVoice;
}

describe('getOfflineVoices', () => {
  it('drops voices explicitly marked network-backed', () => {
    const voices = [voice('SAPI Anna', true), voice('Natural Ryan', false), voice('No flag')];
    expect(getOfflineVoices(voices).map((v) => v.name)).toEqual(['SAPI Anna', 'No flag']);
  });

  it('keeps every voice when none are network-backed', () => {
    const voices = [voice('A', true), voice('B', true)];
    expect(getOfflineVoices(voices)).toHaveLength(2);
  });
});

describe('speakWordByWord', () => {
  type Fake = { text: string; onend?: () => void; onerror?: () => void };

  function stubSequenceSynth() {
    const said: Fake[] = [];
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: Fake) => said.push(utterance),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      rate = 1;
      pitch = 1;
      volume = 1;
      voice = null;
      onend?: () => void;
      onerror?: () => void;
      constructor(public text: string) {}
    };
    return said;
  }

  it('says one word, lights it, and only moves on when that word has finished', async () => {
    const { speakWordByWord } = await import('./speak');
    const said = stubSequenceSynth();
    const lit: (number | null)[] = [];
    speakWordByWord(['I', 'want', 'water'], {}, (i) => lit.push(i));
    expect(said.map((u) => u.text)).toEqual(['I']);
    expect(lit).toEqual([0]);

    said[0]!.onend!();
    said[1]!.onend!();
    expect(said.map((u) => u.text)).toEqual(['I', 'want', 'water']);
    expect(lit).toEqual([0, 1, 2]);

    said[2]!.onend!();
    expect(lit).toEqual([0, 1, 2, null]);
  });

  it('stops where it is if something else is said, and leaves the later words unsaid', async () => {
    const { speak, speakWordByWord } = await import('./speak');
    const said = stubSequenceSynth();
    const lit: (number | null)[] = [];
    speakWordByWord(['I', 'want', 'water'], {}, (i) => lit.push(i));
    speak('help');
    said[0]!.onend!(); // the cancelled word reports back, late
    expect(said.map((u) => u.text)).toEqual(['I', 'help']);
  });

  it('carries on if one word fails to speak', async () => {
    const { speakWordByWord } = await import('./speak');
    const said = stubSequenceSynth();
    speakWordByWord(['I', 'want'], {}, () => {});
    said[0]!.onerror!();
    expect(said.map((u) => u.text)).toEqual(['I', 'want']);
  });
});
