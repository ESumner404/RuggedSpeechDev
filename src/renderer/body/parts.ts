import type { BodyLook, EquipmentId } from './look';

// The parts of the body a child can point to, and how pointing becomes a
// sentence. The private area is only ever "under my pants": the picture shows
// no anatomy, and the words are the words a child is taught to use for it.
// Pointing is spoken like any other press and kept like any other utterance;
// nothing here logs it specially, flags it or tells anyone (PRINCIPLES.md section 6).

export type View = 'front' | 'back';

export type Shape =
  | { k: 'e'; cx: number; cy: number; rx: number; ry: number }
  | { k: 'r'; x: number; y: number; w: number; h: number; r?: number };

export type PartId =
  | 'head' | 'eyes' | 'ears' | 'nose' | 'mouth' | 'throat' | 'chest' | 'tummy'
  | 'neck' | 'back' | 'lowerBack'
  | 'armL' | 'armR' | 'handL' | 'handR'
  | 'pants'
  | 'legL' | 'legR' | 'kneeL' | 'kneeR' | 'footL' | 'footR'
  | 'hearing' | 'cochlear' | 'oxygen' | 'trach' | 'feedtube' | 'pump' | 'sensor' | 'braces';

/** The groups an adult-sized list offers: a button for "Arms" toggles both sides. */
export type PartGroup = { id: string; label: string; parts: PartId[] };

export const PART_LABELS: Record<PartId, string> = {
  head: 'Head', eyes: 'Eyes', ears: 'Ears', nose: 'Nose', mouth: 'Mouth', throat: 'Throat',
  chest: 'Chest', tummy: 'Tummy', neck: 'Neck', back: 'Back', lowerBack: 'Lower back',
  armL: 'Arm', armR: 'Arm', handL: 'Hand', handR: 'Hand', pants: 'Under my pants',
  legL: 'Leg', legR: 'Leg', kneeL: 'Knee', kneeR: 'Knee', footL: 'Foot', footR: 'Foot',
  hearing: 'Hearing aids', cochlear: 'Implant', oxygen: 'Oxygen tube', trach: 'Neck tube',
  feedtube: 'Tummy tube', pump: 'Pump', sensor: 'Sensor', braces: 'Leg braces',
};

export const FRONT_GROUPS: PartGroup[] = [
  { id: 'head', label: 'Head', parts: ['head'] },
  { id: 'eyes', label: 'Eyes', parts: ['eyes'] },
  { id: 'ears', label: 'Ears', parts: ['ears'] },
  { id: 'nose', label: 'Nose', parts: ['nose'] },
  { id: 'mouth', label: 'Mouth', parts: ['mouth'] },
  { id: 'throat', label: 'Throat', parts: ['throat'] },
  { id: 'chest', label: 'Chest', parts: ['chest'] },
  { id: 'tummy', label: 'Tummy', parts: ['tummy'] },
  { id: 'arms', label: 'Arms', parts: ['armL', 'armR'] },
  { id: 'hands', label: 'Hands', parts: ['handL', 'handR'] },
  { id: 'pants', label: 'Under my pants', parts: ['pants'] },
  { id: 'legs', label: 'Legs', parts: ['legL', 'legR'] },
  { id: 'knees', label: 'Knees', parts: ['kneeL', 'kneeR'] },
  { id: 'feet', label: 'Feet', parts: ['footL', 'footR'] },
];

export const BACK_GROUPS: PartGroup[] = [
  { id: 'head', label: 'Head', parts: ['head'] },
  { id: 'ears', label: 'Ears', parts: ['ears'] },
  { id: 'neck', label: 'Neck', parts: ['neck'] },
  { id: 'back', label: 'Back', parts: ['back'] },
  { id: 'lowerBack', label: 'Lower back', parts: ['lowerBack'] },
  { id: 'arms', label: 'Arms', parts: ['armL', 'armR'] },
  { id: 'hands', label: 'Hands', parts: ['handL', 'handR'] },
  { id: 'pants', label: 'Under my pants', parts: ['pants'] },
  { id: 'legs', label: 'Legs', parts: ['legL', 'legR'] },
  { id: 'knees', label: 'Knees', parts: ['kneeL', 'kneeR'] },
  { id: 'feet', label: 'Feet', parts: ['footL', 'footR'] },
];

/** The buttons for equipment, in the order of the picture, only for what the figure is shown with. */
const EXTRA_GROUPS: { extra: EquipmentId; group: PartGroup; front?: boolean }[] = [
  { extra: 'hearingAids', group: { id: 'hearing', label: 'Hearing aids', parts: ['hearing'] } },
  { extra: 'cochlear', group: { id: 'cochlear', label: 'Implant', parts: ['cochlear'] } },
  { extra: 'oxygen', group: { id: 'oxygen', label: 'Oxygen tube', parts: ['oxygen'] }, front: true },
  { extra: 'trach', group: { id: 'trach', label: 'Neck tube', parts: ['trach'] }, front: true },
  { extra: 'feedingTube', group: { id: 'feedtube', label: 'Tummy tube', parts: ['feedtube'] }, front: true },
  { extra: 'pump', group: { id: 'pump', label: 'Pump', parts: ['pump'] } },
  { extra: 'sensor', group: { id: 'sensor', label: 'Sensor', parts: ['sensor'] } },
  { extra: 'braces', group: { id: 'braces', label: 'Leg braces', parts: ['braces'] } },
];

export const groupsFor = (view: View, look?: BodyLook): PartGroup[] => {
  const base = view === 'front' ? FRONT_GROUPS : BACK_GROUPS;
  if (!look) return base;
  const extra = EXTRA_GROUPS.filter((e) => look.extras.includes(e.extra) && (view === 'front' || !e.front)).map((e) => e.group);
  return [...base, ...extra];
};

export type Region = { id: PartId; shapes: Shape[] };

/** Where things are on the figure (a 200 by 420 picture), standing or seated in a wheelchair. */
export function geometry(wheelchair: boolean) {
  // Seated, the thighs are seen end-on, so the knees come soon after the hips.
  const legEnd = wheelchair ? 342 : 384;
  const kneeY = wheelchair ? 272 : 252 + (legEnd - 252) * 0.45;
  return { legEnd, kneeY, hipTop: 204, hipBottom: 252 };
}

export function regionsFor(view: View, look: BodyLook | boolean): Region[] {
  const wheelchair = typeof look === 'boolean' ? look : look.wheelchair;
  const extras = typeof look === 'boolean' ? [] : look.extras;
  const { legEnd, kneeY, hipTop, hipBottom } = geometry(wheelchair);
  const e = (cx: number, cy: number, rx: number, ry: number): Shape => ({ k: 'e', cx, cy, rx, ry });
  const r = (x: number, y: number, w: number, h: number, radius = 8): Shape => ({ k: 'r', x, y, w, h, r: radius });
  const arms = (id: 'armL' | 'armR'): Region => ({ id, shapes: [id === 'armL' ? r(36, 98, 24, 88, 10) : r(140, 98, 24, 88, 10)] });
  const hands = (id: 'handL' | 'handR'): Region => ({ id, shapes: [id === 'handL' ? e(48, 197, 12, 12) : e(152, 197, 12, 12)] });
  const lowerBody: Region[] = [
    { id: 'legL', shapes: [r(70, hipBottom, 28, legEnd - hipBottom - 6, 10)] },
    { id: 'legR', shapes: [r(102, hipBottom, 28, legEnd - hipBottom - 6, 10)] },
    { id: 'kneeL', shapes: [e(84, kneeY, 15, 12)] },
    { id: 'kneeR', shapes: [e(116, kneeY, 15, 12)] },
    { id: 'footL', shapes: [e(82, legEnd, 17, 10)] },
    { id: 'footR', shapes: [e(118, legEnd, 17, 10)] },
  ];

  // Equipment is pressed ahead of the part of the body it is on, so it is
  // drawn after (above) it.
  const equipment: Region[] = [];
  const has = (id: EquipmentId) => extras.includes(id);
  if (has('hearingAids')) equipment.push({ id: 'hearing', shapes: [e(64, 58, 6, 11), e(136, 58, 6, 11)] });
  if (has('cochlear')) equipment.push({ id: 'cochlear', shapes: [e(136, 58, 7, 12)] });
  if (has('braces')) equipment.push({ id: 'braces', shapes: [r(70, kneeY + 14, 28, legEnd - kneeY - 30, 6), r(102, kneeY + 14, 28, legEnd - kneeY - 30, 6)] });
  if (has('sensor')) equipment.push({ id: 'sensor', shapes: [e(152, 126, 9, 9)] });
  if (has('pump')) equipment.push({ id: 'pump', shapes: [r(118, 208, 18, 24, 4)] });

  if (view === 'front') {
    if (has('oxygen')) equipment.push({ id: 'oxygen', shapes: [e(100, 60, 14, 8)] });
    if (has('trach')) equipment.push({ id: 'trach', shapes: [e(100, 88, 8, 7)] });
    if (has('feedingTube')) equipment.push({ id: 'feedtube', shapes: [e(100, 178, 9, 9)] });
    return [
      { id: 'head', shapes: [e(100, 50, 30, 30)] },
      { id: 'ears', shapes: [e(70, 52, 8, 9), e(130, 52, 8, 9)] },
      { id: 'throat', shapes: [r(88, 78, 24, 18, 4)] },
      { id: 'chest', shapes: [r(66, 96, 68, 54, 8)] },
      { id: 'tummy', shapes: [r(66, 150, 68, 54, 8)] },
      arms('armL'), arms('armR'), hands('handL'), hands('handR'),
      { id: 'pants', shapes: [r(64, hipTop, 72, hipBottom - hipTop, 10)] },
      ...lowerBody,
      { id: 'eyes', shapes: [e(88, 46, 8, 7), e(112, 46, 8, 7)] },
      { id: 'nose', shapes: [e(100, 57, 6, 6)] },
      { id: 'mouth', shapes: [e(100, 68, 12, 6)] },
      ...equipment,
    ];
  }
  return [
    { id: 'head', shapes: [e(100, 50, 30, 30)] },
    { id: 'ears', shapes: [e(70, 52, 8, 9), e(130, 52, 8, 9)] },
    { id: 'neck', shapes: [r(88, 78, 24, 18, 4)] },
    { id: 'back', shapes: [r(66, 96, 68, 54, 8)] },
    { id: 'lowerBack', shapes: [r(66, 150, 68, 54, 8)] },
    arms('armL'), arms('armR'), hands('handL'), hands('handR'),
    { id: 'pants', shapes: [r(64, hipTop, 72, hipBottom - hipTop, 10)] },
    ...lowerBody,
    ...equipment,
  ];
}

export type Feeling = 'hurts' | 'sore' | 'itchy' | 'funny' | 'hot' | 'cold' | 'tight' | 'notworking';
export type Amount = 'a little' | 'medium' | 'a lot';

export const FEELINGS: { id: Feeling; label: string; icon: string; one: string; many: string }[] = [
  { id: 'hurts', label: 'Hurts', icon: '😣', one: 'hurts', many: 'hurt' },
  { id: 'sore', label: 'Sore', icon: '🤕', one: 'is sore', many: 'are sore' },
  { id: 'itchy', label: 'Itchy', icon: '😖', one: 'is itchy', many: 'are itchy' },
  { id: 'funny', label: 'Feels funny', icon: '😕', one: 'feels funny', many: 'feel funny' },
  { id: 'hot', label: 'Hot', icon: '🥵', one: 'feels hot', many: 'feel hot' },
  { id: 'cold', label: 'Cold', icon: '🥶', one: 'feels cold', many: 'feel cold' },
  { id: 'tight', label: 'Too tight', icon: '😬', one: 'is too tight', many: 'are too tight' },
  { id: 'notworking', label: 'Not working', icon: '⚠️', one: 'is not working', many: 'are not working' },
];

export const AMOUNTS: Amount[] = ['a little', 'medium', 'a lot'];
const AMOUNT_WORDS: Record<Amount, string> = { 'a little': 'a little', medium: 'quite a lot', 'a lot': 'a lot' };

/** What each part is called when it is said, and whether the word is already plural. */
const NOUNS: Record<string, { one: string; many?: string; plural?: boolean }> = {
  head: { one: 'head' },
  eyes: { one: 'eyes', plural: true },
  ears: { one: 'ears', plural: true },
  nose: { one: 'nose' },
  mouth: { one: 'mouth' },
  throat: { one: 'throat' },
  chest: { one: 'chest' },
  tummy: { one: 'tummy' },
  neck: { one: 'neck' },
  back: { one: 'back' },
  lowerBack: { one: 'lower back' },
  arm: { one: 'arm', many: 'arms' },
  hand: { one: 'hand', many: 'hands' },
  leg: { one: 'leg', many: 'legs' },
  knee: { one: 'knee', many: 'knees' },
  foot: { one: 'foot', many: 'feet' },
  hearing: { one: 'hearing aids', plural: true },
  cochlear: { one: 'implant' },
  oxygen: { one: 'oxygen tube' },
  trach: { one: 'neck tube' },
  feedtube: { one: 'tummy tube' },
  pump: { one: 'pump' },
  sensor: { one: 'sensor' },
  braces: { one: 'leg braces', plural: true },
};

const SIDED = ['arm', 'hand', 'leg', 'knee', 'foot'] as const;

function nounFor(id: PartId): string | undefined {
  for (const base of SIDED) if (id === `${base}L` || id === `${base}R`) return base;
  return id === 'pants' ? undefined : id;
}

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * The sentence for what has been pointed to, and how it feels. Examples:
 * "My head and my tummy hurt a lot." / "My arm is sore." / "It hurts under my
 * pants." With nothing chosen to say about it, it is simply the parts named.
 */
export function bodySentence(selected: PartId[], feeling?: Feeling, amount?: Amount): string {
  const counts = new Map<string, number>();
  for (const id of selected) {
    const noun = nounFor(id);
    if (noun) counts.set(noun, (counts.get(noun) ?? 0) + 1);
  }
  const wordsFor = [...counts.entries()].map(([noun, count]) => {
    const entry = NOUNS[noun]!;
    return `my ${count > 1 && entry.many ? entry.many : entry.one}`;
  });
  const anyPlural = wordsFor.length > 1 || [...counts.entries()].some(([noun, count]) => (NOUNS[noun]!.plural ?? false) || count > 1);
  const how = feeling ? FEELINGS.find((f) => f.id === feeling) : undefined;
  const extent = amount ? ` ${AMOUNT_WORDS[amount]}` : '';

  const sentences: string[] = [];
  if (wordsFor.length > 0) {
    const subject = listOf(wordsFor);
    sentences.push(how ? `${capitalise(subject)} ${anyPlural ? how.many : how.one}${extent}.` : `${capitalise(subject)}.`);
  }
  if (selected.includes('pants')) {
    sentences.push(how ? `It ${how.one}${extent} under my pants.` : 'Under my pants.');
  }
  return sentences.join(' ');
}

const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
