import { describe, expect, it } from 'vitest';
import { BASIC_JOKES, isJokeList, nextJokeIndex, sillyMix } from './jokes';

describe('jokes', () => {
  it('has a good list of very short ones', () => {
    expect(BASIC_JOKES.length).toBeGreaterThanOrEqual(25);
    for (const joke of BASIC_JOKES) {
      expect(joke.q.endsWith('?'), joke.q).toBe(true);
      expect(joke.q.split(' ').length, joke.q).toBeLessThanOrEqual(12);
      expect(joke.a.split(' ').length, joke.a).toBeLessThanOrEqual(12);
    }
    expect(new Set(BASIC_JOKES.map((j) => j.q)).size).toBe(BASIC_JOKES.length);
  });

  it('goes through every joke before telling one again', () => {
    const told: number[] = [];
    for (let i = 0; i < BASIC_JOKES.length; i += 1) told.push(nextJokeIndex(BASIC_JOKES.length, told));
    expect(new Set(told).size).toBe(BASIC_JOKES.length);
  });

  it('never tells the same one twice running, even with two jokes', () => {
    expect(nextJokeIndex(2, [0])).toBe(1);
    expect(nextJokeIndex(2, [1])).toBe(0);
    expect(nextJokeIndex(1, [])).toBe(0);
  });

  it('mixes one joke\'s question with another\'s answer', () => {
    const jokes = [{ q: 'q1?', a: 'a1' }, { q: 'q2?', a: 'a2' }, { q: 'q3?', a: 'a3' }];
    for (let i = 0; i < 30; i += 1) {
      const mix = sillyMix(jokes)!;
      const q = jokes.find((j) => j.q === mix.q)!;
      expect(mix.a).not.toBe(q.a);
    }
    expect(sillyMix([jokes[0]!])).toBeUndefined();
  });

  it('checks a saved list', () => {
    expect(isJokeList([{ q: 'a?', a: 'b' }])).toBe(true);
    expect(isJokeList([{ q: 'a?' }])).toBe(false);
  });
});
