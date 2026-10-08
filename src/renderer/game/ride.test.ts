import { describe, expect, it } from 'vitest';
import type { Item } from '../store/types';
import { DESCRIBERS, HINT_AFTER, LEVELS, STEPS, VERBS, makeRide, progress, rideThings, sentenceFor } from './ride';

const item = (id: string, label = id): Item => ({ id, label, image: { kind: 'emoji', char: '🙂' } });
const things = Array.from({ length: 12 }, (_, i) => item(`t${i}`));

describe('makeRide', () => {
  it('makes a hill for each sentence, each with its picture among four different words', () => {
    for (const hills of [3, 5]) {
      const ride = makeRide([...things, item('i', 'I'), item('want', 'want')], hills)!;
      expect(ride).toHaveLength(hills);
      expect(new Set(ride.map((hill) => hill.target.id)).size).toBe(hills);
      for (const hill of ride) {
        expect(hill.options).toHaveLength(4);
        expect(new Set(hill.options.map((o) => o.id)).size).toBe(4);
        expect(hill.options.filter((o) => o.id === hill.target.id)).toHaveLength(1);
        expect(hill.describers).toHaveLength(3);
        expect(hill.describers.every((d) => (DESCRIBERS as readonly string[]).includes(d))).toBe(true);
      }
    }
  });

  it('never asks for the little words the sentence already has, or a describing word', () => {
    const labels = rideThings([item('a', 'I'), item('b', 'want'), item('c', 'like'), item('d', 'ball'), item('e', 'big'), item('f', 'red')]).map((w) => w.label);
    expect(labels).toEqual(['ball']);
  });

  it('only uses single words, so every sentence is the length it says', () => {
    const labels = rideThings([item('a', 'ball'), item('b', 'thank you'), item('c', "I don't know"), item('d', 'a drink')]).map((w) => w.label);
    expect(labels).toEqual(['ball']);
  });

  it('makes nothing from too few things', () => {
    expect(makeRide(things.slice(0, 4), 5)).toBeUndefined();
    expect(makeRide(things.slice(0, 6), 3)).toBeDefined();
  });
});

describe('levels', () => {
  it('build up from two words to four', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['two', 'three', 'four']);
    expect(STEPS.two).toEqual(['verb', 'thing']);
    expect(STEPS.three).toEqual(['start', 'verb', 'thing']);
    expect(STEPS.four).toEqual(['start', 'verb', 'describer', 'thing']);
    expect(VERBS).toContain('want');
  });

  it('write the sentence a word at a time, in order', () => {
    const none = { verb: null, describer: null, thing: null, started: false };
    expect(sentenceFor('two', { ...none, verb: 'want', thing: 'ball' })).toBe('want ball');
    expect(sentenceFor('three', { ...none, started: true, verb: 'want' })).toBe('I want');
    expect(sentenceFor('three', { ...none, started: true, verb: 'want', thing: 'ball' })).toBe('I want ball');
    expect(sentenceFor('four', { started: true, verb: 'see', describer: 'big', thing: 'dog' })).toBe('I see big dog');
    expect(sentenceFor('four', none)).toBe('');
  });

  it('give a hint after two wrong tries, not before', () => {
    expect(HINT_AFTER).toBe(2);
  });
});

describe('progress', () => {
  it('moves along the track a step at a time, and stops at the end', () => {
    expect(progress(0, 0, 3, 5)).toBe(0);
    expect(progress(0, 3, 3, 5)).toBeCloseTo(1 / 5);
    expect(progress(4, 3, 3, 5)).toBe(1);
    expect(progress(5, 0, 3, 5)).toBe(1);
    expect(progress(1, 1, 2, 3)).toBeCloseTo(3 / 6);
  });
});
