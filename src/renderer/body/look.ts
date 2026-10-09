// What the figure in My body looks like. It is meant to look like the child,
// so an adult can choose the figure, skin, hair, clothes, a wheelchair and
// any equipment the child uses. It is always drawn clothed. Nothing here is
// about anatomy.

export type Figure = 'boy' | 'girl' | 'neutral';
export type HairStyle = 'short' | 'long' | 'tied' | 'curly' | 'none';
export type Outfit = 'shorts' | 'skirt' | 'trousers' | 'dress';
export type Headwear = 'none' | 'hijab' | 'turban' | 'kippah';

/** Equipment and aids that can be shown on the figure, and pointed to when they hurt or are not working. */
export type EquipmentId =
  | 'hearingAids'
  | 'cochlear'
  | 'eyePatch'
  | 'helmet'
  | 'oxygen'
  | 'trach'
  | 'feedingTube'
  | 'pump'
  | 'sensor'
  | 'braces'
  | 'crutches'
  | 'frame'
  | 'prostheticArm'
  | 'prostheticLeg';

export const EQUIPMENT: { id: EquipmentId; label: string; hint: string; notWithChair?: boolean }[] = [
  { id: 'hearingAids', label: 'Hearing aids', hint: 'Behind the ears.' },
  { id: 'cochlear', label: 'Cochlear implant', hint: 'One side, behind the ear.' },
  { id: 'eyePatch', label: 'Eye patch', hint: 'Over one eye.' },
  { id: 'helmet', label: 'Helmet', hint: 'A soft helmet.' },
  { id: 'oxygen', label: 'Oxygen tube', hint: 'A tube under the nose.' },
  { id: 'trach', label: 'Neck tube (tracheostomy)', hint: 'At the throat.' },
  { id: 'feedingTube', label: 'Tummy tube (feeding tube)', hint: 'On the tummy.' },
  { id: 'pump', label: 'Insulin pump', hint: 'Clipped at the waist.' },
  { id: 'sensor', label: 'Glucose sensor', hint: 'A round patch on the arm.' },
  { id: 'braces', label: 'Leg braces', hint: 'Supports on the lower legs.' },
  { id: 'crutches', label: 'Crutches', hint: 'When standing.', notWithChair: true },
  { id: 'frame', label: 'Walking frame', hint: 'When standing.', notWithChair: true },
  { id: 'prostheticArm', label: 'Artificial arm', hint: 'On one side.' },
  { id: 'prostheticLeg', label: 'Artificial leg', hint: 'On one side.' },
];

export type BodyLook = {
  figure: Figure;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  /** A head covering worn for faith or culture. A hijab or a turban covers the hair. */
  headwear: Headwear;
  headwearColour: string;
  outfit: Outfit;
  top: string;
  bottom: string;
  wheelchair: boolean;
  glasses: boolean;
  extras: EquipmentId[];
};

export const DEFAULT_BODY_LOOK: BodyLook = {
  figure: 'neutral',
  skin: '#e0ac69',
  hair: '#4a2c17',
  hairStyle: 'short',
  headwear: 'none',
  headwearColour: '#7c3aed',
  outfit: 'trousers',
  top: '#38bdf8',
  bottom: '#2563eb',
  wheelchair: false,
  glasses: false,
  extras: [],
};

/** Good starting points for each figure, to change from. */
export const FIGURE_STARTS: Record<Figure, { label: string; changes: Partial<BodyLook> }> = {
  boy: { label: 'Boy', changes: { figure: 'boy', hairStyle: 'short', outfit: 'shorts', top: '#2563eb', bottom: '#1a1a1a' } },
  girl: { label: 'Girl', changes: { figure: 'girl', hairStyle: 'long', outfit: 'dress', top: '#f472b6', bottom: '#f472b6' } },
  neutral: { label: 'Non-binary', changes: { figure: 'neutral', hairStyle: 'short', outfit: 'trousers', top: '#22a559', bottom: '#2563eb' } },
};

export const SKIN_TONES = ['#fde7d3', '#ffdbb4', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#6b4423', '#4a2f1b'];
export const HAIR_COLOURS = ['#1a1a1a', '#4a2c17', '#8b5a2b', '#a0522d', '#e6c15a', '#c8571e', '#b0b0b0', '#f2f2f2', '#f472b6', '#38bdf8'];
export const CLOTHES_COLOURS = ['#e11d48', '#f97316', '#facc15', '#22a559', '#38bdf8', '#2563eb', '#9333ea', '#f472b6', '#8a8a8a', '#1a1a1a'];

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'long', label: 'Long' },
  { id: 'tied', label: 'Tied up' },
  { id: 'curly', label: 'Curly' },
  { id: 'none', label: 'No hair' },
];

export const HEADWEAR: { id: Headwear; label: string; hint: string }[] = [
  { id: 'none', label: 'None', hint: '' },
  { id: 'hijab', label: 'Hijab', hint: 'A headscarf worn by many Muslim women and girls. It covers the hair and neck.' },
  { id: 'turban', label: 'Turban', hint: 'Worn by many Sikh men and boys, and by others. It covers the hair.' },
  { id: 'kippah', label: 'Kippah', hint: 'A small cap worn by many Jewish men and boys, also called a yarmulke. It sits on top of the hair.' },
];

/** A hijab or a turban covers all of the hair. */
export const coversHair = (headwear: Headwear): boolean => headwear === 'hijab' || headwear === 'turban';

export const OUTFITS: { id: Outfit; label: string }[] = [
  { id: 'trousers', label: 'Trousers' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'skirt', label: 'Skirt' },
  { id: 'dress', label: 'Dress' },
];

const HEX = /^#[0-9a-f]{6}$/i;
const FIGURES: Figure[] = ['boy', 'girl', 'neutral'];

/** Anything saved before the figure and equipment were added still opens. */
export function withDefaults(look: Partial<BodyLook> | BodyLook): BodyLook {
  return { ...DEFAULT_BODY_LOOK, ...look, extras: look.extras ?? [] };
}

export function isBodyLook(value: unknown): value is BodyLook {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const extras = v['extras'];
  return (
    ['skin', 'hair', 'top', 'bottom'].every((key) => typeof v[key] === 'string' && HEX.test(v[key] as string)) &&
    HAIR_STYLES.some((style) => style.id === v['hairStyle']) &&
    OUTFITS.some((outfit) => outfit.id === v['outfit']) &&
    (v['headwear'] === undefined || HEADWEAR.some((item) => item.id === v['headwear'])) &&
    (v['headwearColour'] === undefined || (typeof v['headwearColour'] === 'string' && HEX.test(v['headwearColour']))) &&
    typeof v['wheelchair'] === 'boolean' &&
    typeof v['glasses'] === 'boolean' &&
    (v['figure'] === undefined || FIGURES.includes(v['figure'] as Figure)) &&
    (extras === undefined || (Array.isArray(extras) && extras.every((id) => EQUIPMENT.some((e) => e.id === id))))
  );
}

export const hasExtra = (look: BodyLook, id: EquipmentId): boolean => look.extras.includes(id);
