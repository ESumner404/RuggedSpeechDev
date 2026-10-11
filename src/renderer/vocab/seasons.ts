import type { Item } from '../store/types';
import type { FitzgeraldClass } from '../ui/fitzgerald';
import { FITZGERALD_COLORS } from '../ui/fitzgerald';
import type { PageTemplate } from './pageTemplates';

// Words for times of the year and for celebrations. They live in one place,
// and are used three ways: as ready-made My Pages pages, and as the words in
// the Seasons game (to look at, to find, and to match in Snap). Nothing here
// changes the Home screen or any button that is already on a board. Like the
// starter vocabulary, the wording is a placeholder for a speech and language
// therapist, and for the family, to change: which celebrations matter is the
// family's own business.

export type SeasonId =
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'christmas'
  | 'easter'
  | 'halloween'
  | 'bonfire'
  | 'diwali'
  | 'eid'
  | 'hanukkah';

export type SeasonWord = { label: string; emoji: string; colour: FitzgeraldClass; says?: string };

export type Season = {
  id: string;
  name: string;
  emoji: string;
  /** Which tradition or part of the year it belongs to; only used to group the choices for an adult. */
  tradition: string;
  /** A line of explanation for the adult, such as which festivals "Eid" covers. */
  note?: string;
  words: SeasonWord[];
};

/** The headings an adult sees the choices grouped under, in this order. */
export const TRADITIONS = ['The year', 'Christian', 'Muslim', 'Jewish', 'Hindu', 'Sikh', 'Chinese', 'Other celebrations', 'Your own'] as const;

/** In the order they are shown. This order never changes. */
export const SEASONS: Season[] = [
  {
    id: 'spring',
    tradition: 'The year',
    name: 'Spring',
    emoji: '🌷',
    words: [
      { label: 'flower', emoji: '🌸', colour: 'things' },
      { label: 'rain', emoji: '🌧️', colour: 'things' },
      { label: 'lamb', emoji: '🐑', colour: 'things' },
      { label: 'seed', emoji: '🌱', colour: 'things' },
      { label: 'butterfly', emoji: '🦋', colour: 'things' },
      { label: 'wellies', emoji: '🥾', colour: 'things' },
      { label: 'puddle', emoji: '💦', colour: 'things' },
      { label: 'bird', emoji: '🐦', colour: 'things' },
      { label: 'sunny', emoji: '☀️', colour: 'describing' },
    ],
  },
  {
    id: 'summer',
    tradition: 'The year',
    name: 'Summer',
    emoji: '☀️',
    words: [
      { label: 'sun', emoji: '☀️', colour: 'things' },
      { label: 'ice cream', emoji: '🍦', colour: 'things', says: 'I want an ice cream' },
      { label: 'beach', emoji: '🏖️', colour: 'places' },
      { label: 'swim', emoji: '🏊', colour: 'doing' },
      { label: 'picnic', emoji: '🧺', colour: 'things' },
      { label: 'sunglasses', emoji: '😎', colour: 'things' },
      { label: 'water', emoji: '💧', colour: 'things' },
      { label: 'hot', emoji: '🥵', colour: 'describing' },
      { label: 'sandcastle', emoji: '🏰', colour: 'things' },
    ],
  },
  {
    id: 'autumn',
    tradition: 'The year',
    name: 'Autumn',
    emoji: '🍂',
    words: [
      { label: 'leaf', emoji: '🍂', colour: 'things' },
      { label: 'conker', emoji: '🌰', colour: 'things' },
      { label: 'wind', emoji: '💨', colour: 'things' },
      { label: 'apple', emoji: '🍎', colour: 'things' },
      { label: 'hedgehog', emoji: '🦔', colour: 'things' },
      { label: 'squirrel', emoji: '🐿️', colour: 'things' },
      { label: 'mushroom', emoji: '🍄', colour: 'things' },
      { label: 'coat', emoji: '🧥', colour: 'things' },
      { label: 'rain', emoji: '🌧️', colour: 'things' },
    ],
  },
  {
    id: 'winter',
    tradition: 'The year',
    name: 'Winter',
    emoji: '❄️',
    words: [
      { label: 'snow', emoji: '❄️', colour: 'things' },
      { label: 'snowman', emoji: '⛄', colour: 'things' },
      { label: 'ice', emoji: '🧊', colour: 'things' },
      { label: 'scarf', emoji: '🧣', colour: 'things' },
      { label: 'gloves', emoji: '🧤', colour: 'things' },
      { label: 'hot chocolate', emoji: '☕', colour: 'things', says: 'I want a hot chocolate' },
      { label: 'coat', emoji: '🧥', colour: 'things' },
      { label: 'cold', emoji: '🥶', colour: 'describing' },
      { label: 'warm', emoji: '🔥', colour: 'describing' },
    ],
  },
  {
    id: 'christmas',
    tradition: 'Christian',
    note: 'A Christian festival, also kept by many families as a family holiday.',
    name: 'Christmas',
    emoji: '🎄',
    words: [
      { label: 'tree', emoji: '🎄', colour: 'things' },
      { label: 'present', emoji: '🎁', colour: 'things' },
      { label: 'Santa', emoji: '🎅', colour: 'people' },
      { label: 'star', emoji: '⭐', colour: 'things' },
      { label: 'reindeer', emoji: '🦌', colour: 'things' },
      { label: 'snowman', emoji: '⛄', colour: 'things' },
      { label: 'bell', emoji: '🔔', colour: 'things' },
      { label: 'lights', emoji: '💡', colour: 'things' },
      { label: 'Merry Christmas', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'easter',
    tradition: 'Christian',
    note: 'A Christian festival, also kept by many families with eggs and bunnies.',
    name: 'Easter',
    emoji: '🐣',
    words: [
      { label: 'egg', emoji: '🥚', colour: 'things' },
      { label: 'chick', emoji: '🐥', colour: 'things' },
      { label: 'bunny', emoji: '🐰', colour: 'things' },
      { label: 'basket', emoji: '🧺', colour: 'things' },
      { label: 'chocolate', emoji: '🍫', colour: 'things', says: 'I want chocolate' },
      { label: 'egg hunt', emoji: '🔍', colour: 'doing' },
      { label: 'lamb', emoji: '🐑', colour: 'things' },
      { label: 'flower', emoji: '🌷', colour: 'things' },
      { label: 'Happy Easter', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'halloween',
    tradition: 'Other celebrations',
    note: '31 October.',
    name: 'Halloween',
    emoji: '🎃',
    words: [
      { label: 'pumpkin', emoji: '🎃', colour: 'things' },
      { label: 'ghost', emoji: '👻', colour: 'things' },
      { label: 'bat', emoji: '🦇', colour: 'things' },
      { label: 'spider', emoji: '🕷️', colour: 'things' },
      { label: 'witch', emoji: '🧙', colour: 'people' },
      { label: 'black cat', emoji: '🐈‍⬛', colour: 'things' },
      { label: 'costume', emoji: '🎭', colour: 'things' },
      { label: 'sweets', emoji: '🍬', colour: 'things', says: 'I want sweets' },
      { label: 'trick or treat', emoji: '🏠', colour: 'social' },
    ],
  },
  {
    id: 'bonfire',
    tradition: 'Other celebrations',
    note: 'Bonfire Night, or Guy Fawkes Night, 5 November. It includes ways to say it is too loud.',
    name: 'Bonfire Night',
    emoji: '🎆',
    words: [
      { label: 'fireworks', emoji: '🎆', colour: 'things' },
      { label: 'sparkler', emoji: '🎇', colour: 'things' },
      { label: 'bonfire', emoji: '🔥', colour: 'things' },
      { label: 'bang', emoji: '💥', colour: 'things' },
      { label: 'loud', emoji: '🔊', colour: 'describing' },
      { label: 'ear defenders', emoji: '🎧', colour: 'things', says: 'I want my ear defenders' },
      { label: 'hot dog', emoji: '🌭', colour: 'things' },
      { label: 'too loud', emoji: '🙉', colour: 'social', says: 'It is too loud' },
      { label: 'watch', emoji: '👀', colour: 'doing' },
    ],
  },
  {
    id: 'diwali',
    tradition: 'Hindu',
    note: 'Diwali, or Deepavali, the festival of lights. Kept by Hindus, Sikhs and Jains.',
    name: 'Diwali',
    emoji: '🪔',
    words: [
      { label: 'diya', emoji: '🪔', colour: 'things' },
      { label: 'candle', emoji: '🕯️', colour: 'things' },
      { label: 'lights', emoji: '💡', colour: 'things' },
      { label: 'rangoli', emoji: '🌺', colour: 'things' },
      { label: 'fireworks', emoji: '🎆', colour: 'things' },
      { label: 'sweets', emoji: '🍬', colour: 'things', says: 'I want sweets' },
      { label: 'new clothes', emoji: '👗', colour: 'things' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Happy Diwali', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'eid',
    tradition: 'Muslim',
    note: 'Eid al-Fitr, at the end of Ramadan, and Eid al-Adha.',
    name: 'Eid',
    emoji: '🌙',
    words: [
      { label: 'moon', emoji: '🌙', colour: 'things' },
      { label: 'mosque', emoji: '🕌', colour: 'places' },
      { label: 'prayers', emoji: '🤲', colour: 'doing' },
      { label: 'new clothes', emoji: '👗', colour: 'things' },
      { label: 'special food', emoji: '🍽️', colour: 'things' },
      { label: 'sweets', emoji: '🍬', colour: 'things', says: 'I want sweets' },
      { label: 'present', emoji: '🎁', colour: 'things' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Eid Mubarak', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'hanukkah',
    tradition: 'Jewish',
    note: 'Hanukkah, also spelled Chanukah, the festival of lights.',
    name: 'Hanukkah',
    emoji: '🕎',
    words: [
      { label: 'menorah', emoji: '🕎', colour: 'things' },
      { label: 'candle', emoji: '🕯️', colour: 'things' },
      { label: 'doughnut', emoji: '🍩', colour: 'things', says: 'I want a doughnut' },
      { label: 'coins', emoji: '🪙', colour: 'things' },
      { label: 'present', emoji: '🎁', colour: 'things' },
      { label: 'Star of David', emoji: '✡️', colour: 'things' },
      { label: 'lights', emoji: '💡', colour: 'things' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Happy Hanukkah', emoji: '🎉', colour: 'social' },
    ],
  },
];

export const seasonById = (id: string): Season | undefined => SEASONS.find((season) => season.id === id);

/** The words of a season as buttons, for the games. */
export function seasonItems(season: Season): Item[] {
  const seen = new Set<string>();
  const items: Item[] = [];
  season.words.forEach((word, index) => {
    const key = word.label.trim().toLowerCase();
    // A word with no label, or a second with the same label, is left out: two pictures for one word would make a fair answer look wrong.
    if (!key || seen.has(key)) return;
    seen.add(key);
    items.push({
      id: `season-${season.id}-${index}`,
      label: word.label.trim(),
      ...(word.says?.trim() ? { vocalization: word.says.trim() } : {}),
      image: { kind: 'emoji', char: word.emoji },
      background_color: FITZGERALD_COLORS[word.colour],
    });
  });
  return items;
}

/** The same words as a ready-made My Pages page. */
export function seasonTemplate(season: Season): PageTemplate {
  return {
    id: `season-${season.id}`,
    name: season.name,
    description: `Words for ${season.name}. Change them to match what your family does.`,
    buttons: season.words.map((word) => ({
      label: word.label,
      emoji: word.emoji,
      colour: word.colour,
      ...(word.says ? { says: word.says } : {}),
    })),
  };
}

/** Easter Sunday for a year (the usual Gregorian calculation, no network needed). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Which season suits a date, for a small "now" marker. A celebration whose
 * date is fixed (Christmas, Halloween, Bonfire Night) or easy to work out
 * (Easter) wins when it is near. Diwali, Eid and Hanukkah move with the
 * lunar calendar, which cannot be worked out here without a list that goes
 * out of date, so they are never marked: a family chooses them for
 * themselves. Otherwise it is the time of year, by month.
 */
export function suggestedSeason(date: Date): SeasonId {
  const month = date.getMonth(); // 0 = January
  const day = date.getDate();
  if (month === 11) return 'christmas';
  if (month === 9 && day >= 15) return 'halloween';
  if (month === 10 && day <= 8) return 'bonfire';
  const easter = easterSunday(date.getFullYear()).getTime();
  const today = new Date(date.getFullYear(), month, day).getTime();
  if (today >= easter - 14 * DAY && today <= easter + 7 * DAY) return 'easter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

/**
 * More celebrations an adult can add from a list, for families whose
 * traditions are not among the usual ones. They are a starting point to
 * change, not a finished list: only the family knows how they keep a
 * celebration and which words they use.
 */
export const MORE_SEASONS: Season[] = [
  {
    id: 'ramadan',
    name: 'Ramadan',
    emoji: '🌙',
    tradition: 'Muslim',
    note: 'The month of fasting. Many children join in part of it, if at all.',
    words: [
      { label: 'moon', emoji: '🌙', colour: 'things' },
      { label: 'mosque', emoji: '🕌', colour: 'places' },
      { label: 'prayers', emoji: '🤲', colour: 'doing' },
      { label: 'Qur’an', emoji: '📖', colour: 'things' },
      { label: 'iftar', emoji: '🍽️', colour: 'things', says: 'It is time for iftar' },
      { label: 'lantern', emoji: '🏮', colour: 'things' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Ramadan Mubarak', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'vaisakhi',
    name: 'Vaisakhi',
    emoji: '🥁',
    tradition: 'Sikh',
    note: 'Also called Baisakhi. A Sikh festival, and a spring harvest festival for many Hindus.',
    words: [
      { label: 'turban', emoji: '👳', colour: 'things' },
      { label: 'drum', emoji: '🥁', colour: 'things' },
      { label: 'singing', emoji: '🎶', colour: 'doing' },
      { label: 'langar', emoji: '🍛', colour: 'things', says: 'I want langar' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Happy Vaisakhi', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    tradition: 'Hindu',
    note: 'The festival of colours, in spring.',
    words: [
      { label: 'colours', emoji: '🎨', colour: 'things' },
      { label: 'water', emoji: '💦', colour: 'things' },
      { label: 'bonfire', emoji: '🔥', colour: 'things' },
      { label: 'sweets', emoji: '🍬', colour: 'things', says: 'I want sweets' },
      { label: 'friends', emoji: '👫', colour: 'people' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Happy Holi', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'passover',
    name: 'Passover',
    emoji: '🍽️',
    tradition: 'Jewish',
    note: 'Pesach. The seder is the special meal.',
    words: [
      { label: 'seder', emoji: '🍽️', colour: 'things' },
      { label: 'matzah', emoji: '🫓', colour: 'things' },
      { label: 'story', emoji: '📖', colour: 'things' },
      { label: 'singing', emoji: '🎶', colour: 'doing' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Happy Passover', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'newyear',
    name: 'Chinese New Year',
    emoji: '🧧',
    tradition: 'Chinese',
    note: 'Also called Lunar New Year or Spring Festival.',
    words: [
      { label: 'lantern', emoji: '🏮', colour: 'things' },
      { label: 'dragon', emoji: '🐉', colour: 'things' },
      { label: 'red envelope', emoji: '🧧', colour: 'things' },
      { label: 'fireworks', emoji: '🎆', colour: 'things' },
      { label: 'dumplings', emoji: '🥟', colour: 'things', says: 'I want dumplings' },
      { label: 'family', emoji: '👨‍👩‍👧', colour: 'people' },
      { label: 'Happy New Year', emoji: '🎉', colour: 'social' },
    ],
  },
  {
    id: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    tradition: 'Other celebrations',
    words: [
      { label: 'cake', emoji: '🎂', colour: 'things' },
      { label: 'candle', emoji: '🕯️', colour: 'things' },
      { label: 'present', emoji: '🎁', colour: 'things' },
      { label: 'balloon', emoji: '🎈', colour: 'things' },
      { label: 'party', emoji: '🥳', colour: 'things' },
      { label: 'card', emoji: '✉️', colour: 'things' },
      { label: 'singing', emoji: '🎶', colour: 'doing' },
      { label: 'Happy Birthday', emoji: '🎉', colour: 'social' },
    ],
  },
];

export const MAX_SEASON_WORDS = 12;
export const MAX_CUSTOM_SEASONS = 12;

/** A celebration an adult has added, with its words kept in `SeasonsConfig.words`. */
export type CustomSeason = { id: string; name: string; emoji: string; tradition: string };

/**
 * What an adult has chosen about seasons and celebrations (Parent Mode,
 * Seasons): which to leave out, their own words for any of them, and any they
 * have added. Nothing here changes a board or the Home screen.
 */
export type SeasonsConfig = {
  /** Ids that are not shown. A hidden one leaves its place empty, so nothing else moves. */
  hidden: string[];
  /** Replacement words for a season, by id. Absent means the usual words. */
  words: Record<string, SeasonWord[]>;
  custom: CustomSeason[];
};

export const DEFAULT_SEASONS_CONFIG: SeasonsConfig = { hidden: [], words: {}, custom: [] };

const isText = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

export const isSeasonWord = (value: unknown): value is SeasonWord => {
  if (typeof value !== 'object' || value === null) return false;
  const w = value as Record<string, unknown>;
  // A label or emoji may be empty while an adult is part way through typing it; a word with no label is left out of the games.
  return (
    typeof w['label'] === 'string' &&
    w['label'].length <= 40 &&
    typeof w['emoji'] === 'string' &&
    w['emoji'].length <= 16 &&
    typeof w['colour'] === 'string' &&
    w['colour'] in FITZGERALD_COLORS &&
    (w['says'] === undefined || (typeof w['says'] === 'string' && w['says'].length <= 80))
  );
};

export const isSeasonsConfig = (value: unknown): value is SeasonsConfig => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const words = v['words'];
  const custom = v['custom'];
  return (
    Array.isArray(v['hidden']) &&
    v['hidden'].length <= 60 &&
    v['hidden'].every((id) => typeof id === 'string') &&
    typeof words === 'object' &&
    words !== null &&
    !Array.isArray(words) &&
    Object.values(words).every((list) => Array.isArray(list) && list.length <= MAX_SEASON_WORDS && list.every(isSeasonWord)) &&
    Array.isArray(custom) &&
    custom.length <= MAX_CUSTOM_SEASONS &&
    custom.every((c) => {
      if (typeof c !== 'object' || c === null) return false;
      const item = c as Record<string, unknown>;
      return isText(item['id'], 60) && typeof item['name'] === 'string' && item['name'].length <= 40 && typeof item['emoji'] === 'string' && item['emoji'].length <= 16 && isText(item['tradition'], 40);
    })
  );
};

/** Every season and celebration to offer, with the adult's words in place of the usual ones, in the usual order and then the ones added. */
export function effectiveSeasons(config: SeasonsConfig): Season[] {
  const own = (season: Season): Season => ({ ...season, words: config.words[season.id] ?? season.words });
  const added: Season[] = config.custom.map((entry) => ({
    id: entry.id,
    name: entry.name.trim() || 'Untitled',
    emoji: entry.emoji || '🎉',
    tradition: entry.tradition,
    words: config.words[entry.id] ?? [],
  }));
  return [...SEASONS.map(own), ...added];
}

export const isSeasonShown = (config: SeasonsConfig, id: string): boolean => !config.hidden.includes(id);
