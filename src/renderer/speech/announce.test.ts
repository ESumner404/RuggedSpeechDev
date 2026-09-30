import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import { announceItem, announceText } from './announce';
import { preferredSpeechRate, preferredVoiceURI, resetDBConnectionForTests } from '../store/db';

type SpokenUtterance = { text: string; rate: number; voice: SpeechSynthesisVoice | null };

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
    voice: SpeechSynthesisVoice | null = null;
    constructor(text: string) {
      this.text = text;
    }
  };
  return spoken;
}

describe('announce (PLAN.md Phase 8: the first-run voice choice applies everywhere)', () => {
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
});
