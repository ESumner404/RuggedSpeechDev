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
