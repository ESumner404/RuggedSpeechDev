// Not a security boundary on its own (PRINCIPLES.md §3: the PIN protects settings,
// not the device). It is the only way back in if the PIN is forgotten, so it is
// four plain words, easy for a tired adult to write down correctly, drawn
// from 64 words with the computer's own secure random numbers. It is shown
// once, and only a hash of it is kept.
export const WORDS: string[] = [
  'anchor',
  'meadow',
  'violet',
  'cobalt',
  'summit',
  'harbour',
  'lantern',
  'willow',
  'granite',
  'copper',
  'ember',
  'thistle',
  'river',
  'maple',
  'pebble',
  'sparrow',
  'orchard',
  'velvet',
  'bramble',
  'cedar',
  'dolphin',
  'falcon',
  'glacier',
  'hazel',
  'indigo',
  'juniper',
  'kestrel',
  'lagoon',
  'marble',
  'nutmeg',
  'otter',
  'prairie',
  'quartz',
  'rowan',
  'saffron',
  'tulip',
  'umber',
  'valley',
  'walnut',
  'yarrow',
  'zephyr',
  'acorn',
  'beacon',
  'clover',
  'daisy',
  'elm',
  'fern',
  'garnet',
  'heather',
  'ivory',
  'jasmine',
  'kettle',
  'lilac',
  'mosaic',
  'nectar',
  'olive',
  'plum',
  'quill',
  'raven',
  'sorrel',
  'thyme',
  'urchin',
  'violin',
  'wren',
];

type RandomBytes = (bytes: Uint8Array) => void;

function pickIndex(count: number, fill: RandomBytes): number {
  // Rejection sampling, so every word is equally likely.
  const limit = Math.floor(256 / count) * count;
  const byte = new Uint8Array(1);
  do {
    fill(byte);
  } while (byte[0]! >= limit);
  return byte[0]! % count;
}

export function generateRecoveryCode(fill: RandomBytes = (bytes) => void crypto.getRandomValues(bytes)): string {
  return Array.from({ length: 4 }, () => WORDS[pickIndex(WORDS.length, fill)]!).join('-');
}
