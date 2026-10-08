// A very basic piano: eight white keys, C to the C above, played with the
// computer's own sound synthesis, so it needs no files and no internet. The
// colours are the ones many music classes use for the notes (one colour for
// each), so a child can match a coloured key to a coloured note.

export type Note = { name: string; letter: string; frequency: number; colour: string; key: string };

export const NOTES: Note[] = [
  { name: 'C', letter: 'C', frequency: 261.63, colour: '#ef4444', key: 'a' },
  { name: 'D', letter: 'D', frequency: 293.66, colour: '#f97316', key: 's' },
  { name: 'E', letter: 'E', frequency: 329.63, colour: '#facc15', key: 'd' },
  { name: 'F', letter: 'F', frequency: 349.23, colour: '#22c55e', key: 'f' },
  { name: 'G', letter: 'G', frequency: 392.0, colour: '#38bdf8', key: 'g' },
  { name: 'A', letter: 'A', frequency: 440.0, colour: '#6366f1', key: 'h' },
  { name: 'B', letter: 'B', frequency: 493.88, colour: '#a855f7', key: 'j' },
  { name: 'C', letter: 'C', frequency: 523.25, colour: '#ef4444', key: 'k' },
];

export type Tune = { id: string; name: string; /** Positions in NOTES, 0 to 7. */ notes: number[] };

// Short and familiar, each using only a few keys.
export const TUNES: Tune[] = [
  { id: 'hotcross', name: 'Hot cross buns', notes: [2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 0] },
  { id: 'mary', name: 'Mary had a little lamb', notes: [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4] },
  { id: 'twinkle', name: 'Twinkle twinkle', notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0] },
  { id: 'ode', name: 'Ode to joy', notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1] },
  { id: 'rowrow', name: 'Row, row, row your boat', notes: [0, 0, 0, 1, 2, 2, 1, 2, 3, 4] },
];

/** The note a physical keyboard key plays, if any. */
export function noteForKey(key: string): number | undefined {
  const index = NOTES.findIndex((note) => note.key === key.toLowerCase());
  return index === -1 ? undefined : index;
}

type AudioContextLike = {
  currentTime: number;
  destination: unknown;
  state?: string;
  resume?: () => Promise<void>;
  createOscillator: () => { type: string; frequency: { value: number }; connect: (n: unknown) => void; start: (t?: number) => void; stop: (t?: number) => void };
  createGain: () => { gain: { value: number; setValueAtTime: (v: number, t: number) => void; exponentialRampToValueAtTime: (v: number, t: number) => void }; connect: (n: unknown) => void };
};

let context: AudioContextLike | null = null;

function audioContext(): AudioContextLike | null {
  if (context) return context;
  const Ctor = (window as unknown as { AudioContext?: new () => AudioContextLike; webkitAudioContext?: new () => AudioContextLike }).AudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  return context;
}

/**
 * Plays one note, a soft round tone that fades out. Only ever from a press
 * (or from a tune an adult or child asked to hear). Returns false if this
 * computer has no sound synthesis.
 */
export function playNote(frequency: number, volume: number, seconds = 0.9): boolean {
  const ctx = audioContext();
  if (!ctx) return false;
  void ctx.resume?.();
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(Math.max(0.0001, volume * 0.5), now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + seconds + 0.05);
  return true;
}

export function resetAudioForTests(): void {
  context = null;
}
