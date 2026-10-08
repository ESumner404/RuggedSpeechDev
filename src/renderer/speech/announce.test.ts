import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import { announceItem, announceSentence, announceText } from './announce';
import {
  getRecentEntries,
  preferredSpeechRate,
  preferredVoiceURI,
  pronunciationsSetting,
  resetDBConnectionForTests,
  setRecentEnabled,
  speakStyleSetting,
  speechVolumeSetting,
} from '../store/db';

type SpokenUtterance = { text: string; rate: number; volume: number; voice: SpeechSynthesisVoice | null };

function stubSpeech(): SpokenUtterance[] {
  const spoken: SpokenUtterance[] = [];
  const voices: SpeechSynthesisVoice[] = [
    { voiceURI: 'Voice A', name: 'Voice A', localService: true } as SpeechSynthesisVoice,
    { voiceURI: 'Voice B', name: 'Voice B', localService: true } as SpeechSynthesisVoice,
  ];
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => voices,
    cancel: () => {},
    speak: (utterance: SpokenUtterance) => spoken.push(utterance),
  };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string;
    rate = 1;
    pitch = 1;
    volume = 1;
    voice: SpeechSynthesisVoice | null = null;
    constructor(text: string) {
      this.text = text;
    }
  };
  return spoken;
}

describe('announce (docs/build-plan.md Phase 8: the first-run voice choice applies everywhere)', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
  });

  it('announceText uses the default voice when nothing has been chosen', () => {
    const spoken = stubSpeech();
    announceText('hello');
    expect(spoken[0]?.voice?.voiceURI).toBe('Voice A');
  });

  it('announceText uses the preferred voice once one has been set', () => {
    const spoken = stubSpeech();
    preferredVoiceURI.value = 'Voice B';
    announceText('hello');
    expect(spoken[0]?.voice?.voiceURI).toBe('Voice B');
  });

  it('announceItem also uses the preferred voice', async () => {
    const spoken = stubSpeech();
    preferredVoiceURI.value = 'Voice B';
    await announceItem({ id: 'i', label: 'I' });
    expect(spoken[0]?.voice?.voiceURI).toBe('Voice B');
  });

  it('an explicit per-call voice still wins over the preferred one', async () => {
    const spoken = stubSpeech();
    preferredVoiceURI.value = 'Voice B';
    await announceItem({ id: 'i', label: 'I' }, { voiceURI: 'Voice A' });
    expect(spoken[0]?.voice?.voiceURI).toBe('Voice A');
  });

  it('uses the default 1x rate when nothing has been chosen', () => {
    const spoken = stubSpeech();
    announceText('hello');
    expect(spoken[0]?.rate).toBe(1);
  });

  it('announceText and announceItem both use a deliberately slower rate', async () => {
    const spoken = stubSpeech();
    preferredSpeechRate.value = 0.75;
    announceText('hello');
    await announceItem({ id: 'i', label: 'I' });
    expect(spoken[0]?.rate).toBe(0.75);
    expect(spoken[1]?.rate).toBe(0.75);
  });

  describe('volume and "say it like this"', () => {
    it('speaks at full volume by default, and at the chosen volume once set', async () => {
      const spoken = stubSpeech();
      announceText('hello');
      expect(spoken[0]?.volume).toBe(1);

      speechVolumeSetting.signal.value = 0.4;
      announceText('hello');
      await announceItem({ id: 'i', label: 'I' });
      expect(spoken[1]?.volume).toBe(0.4);
      expect(spoken[2]?.volume).toBe(0.4);
    });

    it('hands the voice the pronunciation, in sentences and on single buttons alike', async () => {
      const spoken = stubSpeech();
      pronunciationsSetting.signal.value = [{ written: 'Niamh', spoken: 'Neev' }];
      announceText('I want Niamh');
      await announceItem({ id: 'n', label: 'Niamh' });
      await announceItem({ id: 'm', label: 'Mum', vocalization: 'Mum and Niamh' });
      expect(spoken.map((u) => u.text)).toEqual(['I want Neev', 'Neev', 'Mum and Neev']);
    });

    it('keeps what is recorded in Recent history as it was written', async () => {
      stubSpeech();
      await setRecentEnabled(true);
      pronunciationsSetting.signal.value = [{ written: 'Niamh', spoken: 'Neev' }];
      announceText('I want Niamh');
      await new Promise((resolve) => setTimeout(resolve, 40));
      expect((await getRecentEntries()).map((entry) => entry.text)).toEqual(['I want Niamh']);
    });
  });

  describe('reading a sentence out (announceSentence)', () => {
    it('reads it all together by default', () => {
      const spoken = stubSpeech();
      announceSentence(['I', 'want', 'water']);
      expect(spoken.map((u) => u.text)).toEqual(['I want water']);
    });

    it('can leave small gaps between the words and go a little slower', () => {
      const spoken = stubSpeech();
      speakStyleSetting.signal.value = 'clear';
      announceSentence(['I', 'want', 'water']);
      expect(spoken.map((u) => u.text)).toEqual(['I, want, water']);
      expect(spoken[0]!.rate).toBeCloseTo(0.9);
    });

    it('can read one word at a time and say which word is being said', () => {
      const spoken = stubSpeech();
      speakStyleSetting.signal.value = 'wordByWord';
      const lit: (number | null)[] = [];
      announceSentence(['I', 'want', 'Niamh'], (i) => lit.push(i));
      pronunciationsSetting.signal.value = [];
      expect(spoken.map((u) => u.text)).toEqual(['I']);
      expect(lit).toEqual([0]);
    });

    it('applies the way an adult asked for a name to be said, word by word too', () => {
      const spoken = stubSpeech();
      speakStyleSetting.signal.value = 'wordByWord';
      pronunciationsSetting.signal.value = [{ written: 'Niamh', spoken: 'Neev' }];
      announceSentence(['Niamh'], () => {});
      expect(spoken.map((u) => u.text)).toEqual(['Neev']);
      pronunciationsSetting.signal.value = [];
    });

    it('says nothing for an empty sentence, and keeps the whole sentence in Recent once', async () => {
      const spoken = stubSpeech();
      announceSentence([]);
      expect(spoken).toEqual([]);
      await setRecentEnabled(true);
      speakStyleSetting.signal.value = 'wordByWord';
      announceSentence(['I', 'want'], () => {});
      await new Promise((resolve) => setTimeout(resolve, 40));
      expect((await getRecentEntries()).map((entry) => entry.text)).toEqual(['I want']);
    });
  });
});
