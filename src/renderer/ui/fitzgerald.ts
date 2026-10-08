// Button colour encodes word class, not decoration (PRINCIPLES.md §5). Every
// button's background_color must come from this map, never a freehand
// colour picked for visual variety.

import { wordColourOverrides } from './theme';

export type FitzgeraldClass =
  | 'people'
  | 'doing'
  | 'describing'
  | 'things'
  | 'places'
  | 'social'
  | 'littleWords'
  | 'noStop';

export const FITZGERALD_COLORS: Record<FitzgeraldClass, string> = {
  people: '#fef08a',
  doing: '#bbf7d0',
  describing: '#bfdbfe',
  things: '#fed7aa',
  places: '#99f6e4',
  social: '#fbcfe8',
  littleWords: '#e9d5ff',
  noStop: '#fecaca',
};

// Low-arousal palette (docs/build-plan.md Phase 7), the same colour meanings, muted,
// for a child overwhelmed by saturated colour. A deliberate adult choice
// in Parent Mode, not a replacement for the key itself (PRINCIPLES.md §5).
export const LOW_AROUSAL_COLORS: Record<FitzgeraldClass, string> = {
  people: '#f5f0dc',
  doing: '#dcebdc',
  describing: '#dce6f0',
  things: '#f0e3d4',
  places: '#d9ece8',
  social: '#f0dce6',
  littleWords: '#e6dcf0',
  noStop: '#f0d9d9',
};

const HEX_TO_CLASS: Partial<Record<string, FitzgeraldClass>> = Object.fromEntries(
  Object.entries(FITZGERALD_COLORS).map(([cls, hex]) => [hex, cls as FitzgeraldClass]),
);

/** Every stored background_color is always one of FITZGERALD_COLORS'
 * values (PRINCIPLES.md §5), this swaps it for the low-arousal equivalent at
 * render time without touching the stored data, so a board looks the same
 * again the moment the setting is turned back off. */
export function resolveBackgroundColor(hex: string | undefined, lowArousal: boolean): string | undefined {
  if (!hex) return hex;
  const cls = HEX_TO_CLASS[hex];
  if (!cls) return hex;
  // A colour an adult chose for this kind of word wins; then the muted set.
  const chosen = wordColourOverrides.value[cls];
  if (chosen) return chosen;
  return lowArousal ? LOW_AROUSAL_COLORS[cls] : hex;
}

/** What an adult sees in a colour picker: the kind of word, not a code name. */
export const FITZGERALD_LABELS: Record<FitzgeraldClass, string> = {
  people: 'People (yellow)',
  doing: 'Doing words (green)',
  describing: 'Describing words (blue)',
  things: 'Things (orange)',
  places: 'Places (teal)',
  social: 'Social words (pink)',
  littleWords: 'Little words (purple)',
  noStop: 'No and stop (red)',
};

export const FITZGERALD_CLASSES = Object.keys(FITZGERALD_COLORS) as FitzgeraldClass[];

/** Which word class a stored colour belongs to, if it is one of the key's colours. */
export function classOfColor(hex: string | undefined): FitzgeraldClass | undefined {
  return hex ? HEX_TO_CLASS[hex] : undefined;
}
