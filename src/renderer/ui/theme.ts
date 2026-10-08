import { signal } from '@preact/signals';
import type { FitzgeraldClass } from './fitzgerald';

// Looks: ready-made colour schemes and a custom one an adult can build. This
// changes the screen's own colours (background, writing, bars, outlines and
// the highlight), never the meaning of a word's colour. Word colours can be
// changed too, but each kind of word keeps one colour of its own so the
// colour still tells a child what sort of word it is (PRINCIPLES.md section 5).

export type ThemeColours = {
  background: string;
  text: string;
  border: string;
  bars: string;
  accent: string;
};

export type FunColourId = 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'turquoise' | 'blue' | 'purple';

export type ThemePresetId =
  | 'standard'
  | 'calm'
  | 'sunny'
  | 'forest'
  | 'cream'
  | 'night'
  | 'yellowOnBlack'
  | FunColourId
  | 'custom';

export type Theme = {
  preset: ThemePresetId;
  custom: ThemeColours;
  /** A colour of the adult's choice for a kind of word; absent means the usual one. */
  wordColours: Partial<Record<FitzgeraldClass, string>>;
};

type Preset = { name: string; hint: string; colours: ThemeColours };

/**
 * Favourite colours. Each is a pale wash of the colour behind everything, a
 * stronger tint for the bars, and a deep shade of it for the highlight, with
 * dark writing throughout so it stays easy to read. The tints are worked out
 * from one chosen colour so every one of them behaves the same way.
 */
function funPreset(name: string, base: string, deep: string): Preset {
  return {
    name,
    hint: 'A favourite colour.',
    colours: {
      background: mix('#ffffff', base, 0.14),
      text: '#1a1a1a',
      border: mix('#ffffff', base, 0.6),
      bars: mix('#ffffff', base, 0.32),
      accent: deep,
    },
  };
}

/** The colours offered as favourites, in the order they are shown. */
export const FUN_COLOUR_IDS: FunColourId[] = ['pink', 'orange', 'red', 'yellow', 'green', 'turquoise', 'blue', 'purple'];

export const FUN_COLOURS: Record<FunColourId, Preset & { swatch: string }> = {
  pink: { ...funPreset('Pink', '#f472b6', '#be185d'), swatch: '#f472b6' },
  orange: { ...funPreset('Orange', '#fb923c', '#c2410c'), swatch: '#fb923c' },
  red: { ...funPreset('Red', '#f87171', '#b91c1c'), swatch: '#f87171' },
  yellow: { ...funPreset('Yellow', '#facc15', '#a16207'), swatch: '#facc15' },
  green: { ...funPreset('Green', '#4ade80', '#15803d'), swatch: '#4ade80' },
  turquoise: { ...funPreset('Turquoise', '#2dd4bf', '#0f766e'), swatch: '#2dd4bf' },
  blue: { ...funPreset('Blue', '#60a5fa', '#1d4ed8'), swatch: '#60a5fa' },
  purple: { ...funPreset('Purple', '#a78bfa', '#6d28d9'), swatch: '#a78bfa' },
};

export const isFunColour = (id: string): id is FunColourId => id in FUN_COLOURS;

/** The ready-made schemes that are not favourite colours: light, soft, dark and strong contrast. */
export const SCHEME_IDS = ['standard', 'calm', 'sunny', 'forest', 'cream', 'night', 'yellowOnBlack'] as const;

export const THEME_PRESETS: Record<Exclude<ThemePresetId, 'custom'>, Preset> = {
  ...FUN_COLOURS,
  standard: {
    name: 'Standard',
    hint: 'White and clear.',
    colours: { background: '#ffffff', text: '#1a1a1a', border: '#d4d4d4', bars: '#f5f5f5', accent: '#1d4ed8' },
  },
  calm: {
    name: 'Calm',
    hint: 'Soft blue-grey, gentle on the eyes.',
    colours: { background: '#eef3f8', text: '#1f2933', border: '#b8c4d0', bars: '#dfe8f1', accent: '#3b6ea5' },
  },
  sunny: {
    name: 'Sunny',
    hint: 'Warm and light.',
    colours: { background: '#fffbea', text: '#2b2b2b', border: '#e3d9a8', bars: '#fff1b8', accent: '#b45309' },
  },
  forest: {
    name: 'Forest',
    hint: 'Pale green.',
    colours: { background: '#f0f7f1', text: '#1b2b1f', border: '#b5ccb8', bars: '#dcebdd', accent: '#2f7d4a' },
  },
  cream: {
    name: 'Cream',
    hint: 'Off-white, easier than bright white for some readers.',
    colours: { background: '#fbf3df', text: '#222222', border: '#d8c9a0', bars: '#f3e7c6', accent: '#7a3e9d' },
  },
  night: {
    name: 'Night',
    hint: 'Dark, with soft light writing.',
    colours: { background: '#14181f', text: '#f2f4f7', border: '#4b5563', bars: '#1e242e', accent: '#7db3ff' },
  },
  yellowOnBlack: {
    name: 'Yellow on black',
    hint: 'Very strong contrast.',
    colours: { background: '#000000', text: '#ffee00', border: '#ffee00', bars: '#000000', accent: '#ffffff' },
  },
};

export const DEFAULT_THEME: Theme = {
  preset: 'standard',
  custom: { ...THEME_PRESETS.standard.colours },
  wordColours: {},
};

/** The colours in use for this theme. */
export function coloursFor(theme: Theme): ThemeColours {
  return theme.preset === 'custom' ? theme.custom : THEME_PRESETS[theme.preset].colours;
}

const HEX = /^#[0-9a-f]{6}$/i;
export const isHex = (value: unknown): value is string => typeof value === 'string' && HEX.test(value);

export function isTheme(value: unknown): value is Theme {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const custom = v['custom'] as Record<string, unknown> | undefined;
  const words = v['wordColours'] as Record<string, unknown> | undefined;
  return (
    (v['preset'] === 'custom' || (typeof v['preset'] === 'string' && v['preset'] in THEME_PRESETS)) &&
    typeof custom === 'object' &&
    custom !== null &&
    ['background', 'text', 'border', 'bars', 'accent'].every((key) => isHex(custom[key])) &&
    typeof words === 'object' &&
    words !== null &&
    Object.values(words).every(isHex)
  );
}

function channels(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function toHex(values: number[]): string {
  return `#${values.map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')).join('')}`;
}

/** Mixes two colours; `amount` is how much of `b` (0 to 1). */
export function mix(a: string, b: string, amount: number): string {
  const [ar, ag, ab] = channels(a);
  const [br, bg, bb] = channels(b);
  return toHex([ar + (br - ar) * amount, ag + (bg - ag) * amount, ab + (bb - ab) * amount]);
}

function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colours, 1 (none) to 21 (black on white). */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

export const isDark = (hex: string): boolean => luminance(hex) < 0.18;

/** Black or white writing, whichever is easier to read on this colour. */
export function readableOn(background: string): string {
  return contrastRatio(background, '#1a1a1a') >= contrastRatio(background, '#ffffff') ? '#1a1a1a' : '#ffffff';
}

/** How different two colours look; small numbers look alike. */
export function colourDistance(a: string, b: string): number {
  const [ar, ag, ab] = channels(a);
  const [br, bg, bb] = channels(b);
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2);
}

/** Word colours the adult has chosen, read wherever a button is drawn. */
export const wordColourOverrides = signal<Partial<Record<FitzgeraldClass, string>>>({});

const VARIABLES = ['--color-background', '--color-text', '--color-border', '--color-nav-background', '--color-chip-background', '--color-accent'];

/**
 * Puts the theme on the page. The high contrast setting in Access takes
 * priority while it is on, so that choice is never quietly undone by a theme.
 */
export function applyTheme(theme: Theme, highContrastOn: boolean): void {
  wordColourOverrides.value = theme.wordColours;
  const root = document.documentElement;
  if (highContrastOn || theme.preset === 'standard') {
    for (const name of VARIABLES) root.style.removeProperty(name);
    root.style.removeProperty('color-scheme');
    root.style.setProperty('--color-accent', '#1d4ed8');
    return;
  }
  const c = coloursFor(theme);
  root.style.setProperty('--color-background', c.background);
  root.style.setProperty('--color-text', c.text);
  root.style.setProperty('--color-border', c.border);
  root.style.setProperty('--color-nav-background', c.bars);
  root.style.setProperty('--color-chip-background', mix(c.background, c.accent, 0.12));
  root.style.setProperty('--color-accent', c.accent);
  root.style.colorScheme = isDark(c.background) ? 'dark' : 'light';
}
