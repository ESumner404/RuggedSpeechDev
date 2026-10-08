// Starting points for how the voice sounds, named for what a listener
// notices rather than for a person's age or need. Each sets the speed and
// pitch together; an adult can then fine-tune either. None is "right":
// children differ in what they find easy to listen to, so the way to choose
// is to press Hear it and watch the child.
export type VoicePreset = { id: string; name: string; hint: string; rate: number; pitch: number };

export const VOICE_PRESETS: VoicePreset[] = [
  { id: 'usual', name: 'Usual', hint: 'The voice as it comes.', rate: 1, pitch: 1 },
  { id: 'gentle', name: 'Gentle', hint: 'A little slower and softer.', rate: 0.85, pitch: 0.95 },
  { id: 'clear', name: 'Slow and clear', hint: 'Slower, so each word stands out.', rate: 0.7, pitch: 1 },
  { id: 'bright', name: 'Bright', hint: 'A little quicker, and higher.', rate: 1.1, pitch: 1.2 },
  { id: 'young', name: 'Young', hint: 'Higher, for a younger sound.', rate: 1, pitch: 1.35 },
];

/** The preset that exactly matches this speed and pitch, if any. */
export function matchingPreset(rate: number, pitch: number): VoicePreset | undefined {
  return VOICE_PRESETS.find((p) => Math.abs(p.rate - rate) < 0.001 && Math.abs(p.pitch - pitch) < 0.001);
}
