import { describe, expect, it } from 'vitest';
import { GOAL_BANK } from './goalBank';
import { MODELLING_WORDS, modellingFocus, weekNumber } from './modelling';
import { TARGET_AREAS } from '../store/staff';

describe('the goal bank', () => {
  it('covers every kind of target that has an example, with no repeats', () => {
    const areas = new Set(GOAL_BANK.map((goal) => goal.area));
    for (const area of TARGET_AREAS.filter((a) => a.id !== 'other')) expect(areas.has(area.id), area.id).toBe(true);
    expect(new Set(GOAL_BANK.map((goal) => goal.text)).size).toBe(GOAL_BANK.length);
  });

  it('keeps to the project’s tone: plain, positive, no deficit wording', () => {
    const text = JSON.stringify(GOAL_BANK).toLowerCase();
    for (const word of ['problem', 'behaviour', 'disorder', 'naughty', 'fails to', 'cannot', 'deficit']) expect(text).not.toContain(word);
  });
});

describe('the word to model this week', () => {
  it('has something to try for every word', () => {
    for (const word of MODELLING_WORDS) {
      expect(word.why.length).toBeGreaterThan(10);
      expect(word.try.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('numbers weeks from Monday, so a word lasts a week', () => {
    expect(weekNumber(new Date(2026, 0, 5))).toBe(weekNumber(new Date(2026, 0, 11)));
    expect(weekNumber(new Date(2026, 0, 12))).toBe(weekNumber(new Date(2026, 0, 5)) + 1);
  });

  it('is the same all week and moves on the next, through every word in turn', () => {
    expect(modellingFocus(new Date(2026, 2, 2)).word).toBe(modellingFocus(new Date(2026, 2, 8)).word);
    const seen = new Set<string>();
    for (let week = 0; week < MODELLING_WORDS.length; week += 1) seen.add(modellingFocus(new Date(2026, 0, 5 + week * 7)).word);
    expect(seen.size).toBe(MODELLING_WORDS.length);
  });
});
