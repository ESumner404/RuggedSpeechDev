import { describe, expect, it } from 'vitest';
import { PAGE_TEMPLATES } from './pageTemplates';
import {
  DEFAULT_SEASONS_CONFIG,
  MORE_SEASONS,
  SEASONS,
  TRADITIONS,
  easterSunday,
  effectiveSeasons,
  isSeasonShown,
  isSeasonsConfig,
  seasonItems,
  seasonTemplate,
  suggestedSeason,
} from './seasons';

const on = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe('Easter', () => {
  it('works out the date for several years', () => {
    expect(easterSunday(2025)).toEqual(on(2025, 4, 20));
    expect(easterSunday(2026)).toEqual(on(2026, 4, 5));
    expect(easterSunday(2027)).toEqual(on(2027, 3, 28));
    expect(easterSunday(2038)).toEqual(on(2038, 4, 25));
  });
});

describe('which season suits a date', () => {
  it('picks the celebration when it is near, and otherwise the time of year', () => {
    expect(suggestedSeason(on(2026, 12, 14))).toBe('christmas');
    expect(suggestedSeason(on(2026, 10, 20))).toBe('halloween');
    expect(suggestedSeason(on(2026, 11, 3))).toBe('bonfire');
    expect(suggestedSeason(on(2026, 4, 1))).toBe('easter');
    expect(suggestedSeason(on(2026, 3, 10))).toBe('spring');
    expect(suggestedSeason(on(2026, 7, 4))).toBe('summer');
    expect(suggestedSeason(on(2026, 9, 20))).toBe('autumn');
    expect(suggestedSeason(on(2026, 1, 20))).toBe('winter');
  });

  it('never marks a celebration that follows the lunar calendar', () => {
    for (let month = 0; month < 12; month += 1) {
      const id = suggestedSeason(new Date(2026, month, 15));
      expect(['diwali', 'eid', 'hanukkah']).not.toContain(id);
    }
  });
});

describe('the words', () => {
  it('has a fixed set of seasons, each with a few words that fit a page of nine', () => {
    expect(SEASONS.map((s) => s.id)).toEqual(['spring', 'summer', 'autumn', 'winter', 'christmas', 'easter', 'halloween', 'bonfire', 'diwali', 'eid', 'hanukkah']);
    for (const season of SEASONS) {
      expect(season.words.length, season.name).toBeGreaterThanOrEqual(6);
      expect(season.words.length, season.name).toBeLessThanOrEqual(9);
      const labels = season.words.map((w) => w.label.toLowerCase());
      expect(new Set(labels).size, `${season.name} has no repeated word`).toBe(labels.length);
      for (const word of season.words) expect(word.emoji, `${word.label} needs a picture`).toBeTruthy();
    }
  });

  it('makes game buttons with their own ids, a picture and a word-class colour', () => {
    const items = seasonItems(SEASONS[4]!);
    expect(items.map((i) => i.label)).toContain('tree');
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (const item of items) {
      expect(item.image?.kind).toBe('emoji');
      expect(item.background_color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('is offered as a ready-made page for each season, and keeps to the project\'s tone', () => {
    for (const season of SEASONS) {
      const template = seasonTemplate(season);
      expect(PAGE_TEMPLATES.some((t) => t.id === template.id && t.name === season.name)).toBe(true);
    }
    const text = JSON.stringify(SEASONS).toLowerCase();
    for (const word of ['problem', 'behaviour', 'disorder', 'naughty']) expect(text).not.toContain(word);
  });

  it('suggests ear defenders and a way to say it is too loud for Bonfire Night', () => {
    const labels = SEASONS.find((s) => s.id === 'bonfire')!.words.map((w) => w.label);
    expect(labels).toEqual(expect.arrayContaining(['ear defenders', 'too loud']));
  });
});

describe('terminology', () => {
  const words = (id: string) => SEASONS.find((s) => s.id === id)!.words.map((w) => w.label);

  it('uses the names and greetings each tradition uses', () => {
    expect(words('eid')).toEqual(expect.arrayContaining(['mosque', 'prayers', 'Eid Mubarak']));
    expect(words('diwali')).toEqual(expect.arrayContaining(['diya', 'rangoli', 'Happy Diwali']));
    expect(words('hanukkah')).toEqual(expect.arrayContaining(['menorah', 'Star of David', 'Happy Hanukkah']));
    expect(words('christmas')).toContain('Merry Christmas');
    expect(words('easter')).toContain('Happy Easter');
    expect(MORE_SEASONS.find((s) => s.id === 'ramadan')!.words.map((w) => w.label)).toEqual(expect.arrayContaining(['Qur\u2019an', 'iftar', 'Ramadan Mubarak']));
    expect(MORE_SEASONS.find((s) => s.id === 'passover')!.words.map((w) => w.label)).toEqual(expect.arrayContaining(['seder', 'matzah']));
  });

  it('explains which festivals a name covers, for the adult', () => {
    expect(SEASONS.find((s) => s.id === 'eid')!.note).toMatch(/Eid al-Fitr/);
    expect(SEASONS.find((s) => s.id === 'eid')!.note).toMatch(/Eid al-Adha/);
    expect(SEASONS.find((s) => s.id === 'diwali')!.note).toMatch(/Deepavali/);
    expect(SEASONS.find((s) => s.id === 'hanukkah')!.note).toMatch(/Chanukah/);
  });

  it('every season and celebration belongs to a heading the adult sees', () => {
    for (const season of [...SEASONS, ...MORE_SEASONS]) expect(TRADITIONS as readonly string[], season.name).toContain(season.tradition);
    const ids = [...SEASONS, ...MORE_SEASONS].map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps to the project\'s tone in the extra celebrations too', () => {
    const text = JSON.stringify(MORE_SEASONS).toLowerCase();
    for (const word of ['problem', 'behaviour', 'disorder', 'naughty']) expect(text).not.toContain(word);
  });
});

describe('what an adult chooses', () => {
  it('starts as the usual seasons, all shown', () => {
    const all = effectiveSeasons(DEFAULT_SEASONS_CONFIG);
    expect(all.map((s) => s.id)).toEqual(SEASONS.map((s) => s.id));
    expect(all.every((s) => isSeasonShown(DEFAULT_SEASONS_CONFIG, s.id))).toBe(true);
  });

  it('uses the adult\'s words, and puts their own celebrations after the usual ones', () => {
    const config = {
      hidden: ['christmas'],
      words: { eid: [{ label: 'Eid prayers', emoji: '🤲', colour: 'doing' as const }], own1: [{ label: 'kite', emoji: '🪁', colour: 'things' as const }] },
      custom: [{ id: 'own1', name: 'Kite day', emoji: '🪁', tradition: 'Your own' }],
    };
    expect(isSeasonsConfig(config)).toBe(true);
    const all = effectiveSeasons(config);
    expect(all[all.length - 1]!.name).toBe('Kite day');
    expect(all.find((s) => s.id === 'eid')!.words.map((w) => w.label)).toEqual(['Eid prayers']);
    expect(all.find((s) => s.id === 'diwali')!.words.length).toBeGreaterThan(5);
    expect(isSeasonShown(config, 'christmas')).toBe(false);
  });

  it('checks a saved choice before using it', () => {
    expect(isSeasonsConfig(DEFAULT_SEASONS_CONFIG)).toBe(true);
    expect(isSeasonsConfig({ hidden: [1], words: {}, custom: [] })).toBe(false);
    expect(isSeasonsConfig({ hidden: [], words: { a: [{ label: 'x', emoji: '🎉', colour: 'purple' }] }, custom: [] })).toBe(false);
    expect(isSeasonsConfig({ hidden: [], words: { a: Array.from({ length: 13 }, () => ({ label: 'x', emoji: '🎉', colour: 'things' })) }, custom: [] })).toBe(false);
    expect(isSeasonsConfig(null)).toBe(false);
  });

  it('leaves out a word with no label, and a repeated word, so the games stay fair', () => {
    const season = { id: 'x', name: 'X', emoji: '🎉', tradition: 'Your own', words: [
      { label: 'cake', emoji: '🎂', colour: 'things' as const },
      { label: '  ', emoji: '🎈', colour: 'things' as const },
      { label: 'Cake', emoji: '🍰', colour: 'things' as const },
      { label: 'balloon', emoji: '🎈', colour: 'things' as const, says: ' I want a balloon ' },
    ] };
    const items = seasonItems(season);
    expect(items.map((i) => i.label)).toEqual(['cake', 'balloon']);
    expect(items[1]!.vocalization).toBe('I want a balloon');
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });
});
