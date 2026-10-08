import { afterEach, describe, expect, it } from 'vitest';
import { FITZGERALD_COLORS, resolveBackgroundColor } from './fitzgerald';
import {
  DEFAULT_THEME,
  FUN_COLOURS,
  FUN_COLOUR_IDS,
  SCHEME_IDS,
  THEME_PRESETS,
  applyTheme,
  colourDistance,
  contrastRatio,
  isDark,
  isTheme,
  mix,
  readableOn,
  wordColourOverrides,
} from './theme';

afterEach(() => {
  wordColourOverrides.value = {};
  document.documentElement.removeAttribute('style');
});

describe('contrast', () => {
  it('knows black on white from grey on grey', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(contrastRatio('#777777', '#808080')).toBeLessThan(1.5);
  });

  it('chooses dark writing on a pale colour and light writing on a dark one', () => {
    expect(readableOn('#fef08a')).toBe('#1a1a1a');
    expect(readableOn('#14181f')).toBe('#ffffff');
  });

  it('every ready-made scheme has writing that is easy to read on its background', () => {
    for (const [id, preset] of Object.entries(THEME_PRESETS)) {
      expect(contrastRatio(preset.colours.background, preset.colours.text), id).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(preset.colours.background, preset.colours.accent), `${id} highlight`).toBeGreaterThanOrEqual(3);
    }
  });

  it('mixes colours and measures how alike two are', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(colourDistance('#ff0000', '#fe0000')).toBeLessThan(2);
  });
});

describe('favourite colours', () => {
  it('offers pink and orange among the favourites, and each one is a ready-made look', () => {
    expect(FUN_COLOUR_IDS).toEqual(expect.arrayContaining(['pink', 'orange']));
    for (const id of FUN_COLOUR_IDS) {
      expect(THEME_PRESETS[id].name).toBe(FUN_COLOURS[id].name);
      expect(isTheme({ ...DEFAULT_THEME, preset: id })).toBe(true);
      expect(isDark(THEME_PRESETS[id].colours.background), id).toBe(false);
    }
  });

  it('washes the screen with the colour chosen', () => {
    applyTheme({ ...DEFAULT_THEME, preset: 'pink' }, false);
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-background')).toBe(THEME_PRESETS.pink.colours.background);
    expect(root.style.getPropertyValue('--color-accent')).toBe('#be185d');
  });

  it('keeps the schemes and the favourites apart', () => {
    for (const id of SCHEME_IDS) expect(FUN_COLOUR_IDS as string[]).not.toContain(id);
  });
});

describe('isTheme', () => {
  it('accepts the default, and refuses anything half-made', () => {
    expect(isTheme(DEFAULT_THEME)).toBe(true);
    expect(isTheme({ ...DEFAULT_THEME, preset: 'nonsense' })).toBe(false);
    expect(isTheme({ ...DEFAULT_THEME, custom: { ...DEFAULT_THEME.custom, text: 'red' } })).toBe(false);
    expect(isTheme({ ...DEFAULT_THEME, wordColours: { people: 'yellow' } })).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe('applyTheme', () => {
  it('puts a chosen scheme on the page, and takes it off for the standard one', () => {
    applyTheme({ ...DEFAULT_THEME, preset: 'night' }, false);
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-background')).toBe('#14181f');
    expect(root.style.getPropertyValue('--color-accent')).toBe('#7db3ff');
    expect(root.style.colorScheme).toBe('dark');

    applyTheme(DEFAULT_THEME, false);
    expect(root.style.getPropertyValue('--color-background')).toBe('');
  });

  it('leaves the high contrast setting in charge while it is on', () => {
    applyTheme({ ...DEFAULT_THEME, preset: 'cream' }, true);
    expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('');
  });

  it('uses the custom colours for a custom scheme', () => {
    applyTheme({ ...DEFAULT_THEME, preset: 'custom', custom: { ...DEFAULT_THEME.custom, background: '#202040' } }, false);
    expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#202040');
  });
});

describe('word colours', () => {
  it('a colour chosen for a kind of word replaces the usual one, and only for that kind', () => {
    const yellow = FITZGERALD_COLORS.people;
    expect(resolveBackgroundColor(yellow, false)).toBe(yellow);
    applyTheme({ ...DEFAULT_THEME, wordColours: { people: '#ffcc00' } }, false);
    expect(resolveBackgroundColor(yellow, false)).toBe('#ffcc00');
    expect(resolveBackgroundColor(yellow, true)).toBe('#ffcc00');
    expect(resolveBackgroundColor(FITZGERALD_COLORS.doing, false)).toBe(FITZGERALD_COLORS.doing);
  });

  it('leaves a button whose colour is not one of the key alone', () => {
    applyTheme({ ...DEFAULT_THEME, wordColours: { people: '#ffcc00' } }, false);
    expect(resolveBackgroundColor('#123456', false)).toBe('#123456');
  });
});
