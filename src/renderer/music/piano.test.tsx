import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NOTES, TUNES, noteForKey, playNote, resetAudioForTests } from './piano';
import { PianoScreen } from './PianoScreen';
import { resetDBConnectionForTests } from '../store/db';

type Played = { frequency: number; gain: number };

function stubAudio(): Played[] {
  const played: Played[] = [];
  class FakeContext {
    currentTime = 0;
    destination = {};
    resume = async () => {};
    createOscillator() {
      const osc = { type: '', frequency: { value: 0 }, connect() {}, start() { played.push({ frequency: osc.frequency.value, gain: 0 }); }, stop() {} };
      return osc;
    }
    createGain() {
      return { gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} };
    }
  }
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
  resetAudioForTests();
  return played;
}

describe('the notes and tunes', () => {
  it('has eight keys from C to the C above, rising, each with its own colour except the two Cs', () => {
    expect(NOTES.map((n) => n.name).join('')).toBe('CDEFGABC');
    expect(NOTES.every((n, i) => i === 0 || n.frequency > NOTES[i - 1]!.frequency)).toBe(true);
    expect(NOTES[7]!.frequency).toBeCloseTo(NOTES[0]!.frequency * 2, 0);
    expect(new Set(NOTES.map((n) => n.colour)).size).toBe(7);
  });

  it('plays a physical keyboard\'s home row, and nothing else', () => {
    expect(noteForKey('a')).toBe(0);
    expect(noteForKey('K')).toBe(7);
    expect(noteForKey('z')).toBeUndefined();
    expect(noteForKey('Enter')).toBeUndefined();
  });

  it('every tune only uses keys that are there, and is short', () => {
    for (const tune of TUNES) {
      expect(tune.notes.length, tune.name).toBeLessThanOrEqual(20);
      expect(tune.notes.every((n) => n >= 0 && n < NOTES.length), tune.name).toBe(true);
    }
    expect(TUNES.find((t) => t.id === 'twinkle')!.notes.slice(0, 7)).toEqual([0, 0, 4, 4, 5, 5, 4]); // C C G G A A G
  });

  it('plays a note through the computer\'s own sound, and says if it cannot', () => {
    const played = stubAudio();
    expect(playNote(440, 0.8)).toBe(true);
    expect(played[0]!.frequency).toBe(440);
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    resetAudioForTests();
    expect(playNote(440, 0.8)).toBe(false);
  });
});

describe('PianoScreen', () => {
  let container: HTMLElement;
  let played: Played[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    played = stubAudio();
    container = document.createElement('div');
    act(() => render(<PianoScreen />, container));
  });

  afterEach(() => {
    render(null, container);
    vi.useRealTimers();
  });

  const keys = () => Array.from(container.querySelectorAll<HTMLButtonElement>('.piano-key'));
  const press = (position: number) => act(() => keys()[position]!.click());
  const button = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === label)!;
  const message = () => container.querySelector('.game-screen__message')!.textContent;

  it('shows eight keys and plays nothing until one is pressed', () => {
    expect(keys()).toHaveLength(8);
    expect(played).toEqual([]);
    press(4);
    expect(played.map((p) => Math.round(p.frequency))).toEqual([392]);
  });

  it('a real keyboard plays too', () => {
    act(() => void document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' })));
    expect(played.map((p) => Math.round(p.frequency))).toEqual([330]);
  });

  it('points to the next key of a tune, moves on when it is pressed, and never punishes the wrong one', () => {
    act(() => button('Twinkle twinkle').click());
    const nextKey = () => keys().findIndex((k) => k.classList.contains('piano-key--next'));
    expect(nextKey()).toBe(0);
    expect(container.querySelector('.piano-screen__pointer')!.textContent).toBe('👇');

    press(5); // wrong
    expect(nextKey()).toBe(0);
    expect(message()).toBe('Look for the key with the pointer.');
    press(0);
    expect(nextKey()).toBe(0); // the second C
    press(0);
    expect(nextKey()).toBe(4);
    expect(played).toHaveLength(3); // every press made its sound, right or wrong
  });

  it('says when the whole tune is played, and has no key to point to', () => {
    act(() => button('Row, row, row your boat').click());
    const tune = TUNES.find((t) => t.id === 'rowrow')!;
    for (const position of tune.notes) press(position);
    expect(message()).toBe('You played the whole tune!');
    expect(keys().some((k) => k.classList.contains('piano-key--next'))).toBe(false);
  });

  it('plays the tune for you only when asked, at a steady pace, and can be stopped', () => {
    vi.useFakeTimers();
    act(() => button('Hot cross buns').click());
    expect(played).toEqual([]);
    act(() => button('Hear it').click());
    act(() => void vi.advanceTimersByTime(0));
    expect(played).toHaveLength(1);
    act(() => void vi.advanceTimersByTime(650));
    expect(played).toHaveLength(2);
    act(() => button('Stop').click());
    act(() => void vi.advanceTimersByTime(10_000));
    expect(played).toHaveLength(2);
  });

  it('playing freely has no pointer and no tune', () => {
    expect(container.querySelector('.piano-key--next')).toBeNull();
    expect((button('Hear it') as HTMLButtonElement).disabled).toBe(true);
  });
});
