// Not a security boundary (CLAUDE.md §3: the PIN protects settings, not
// the device) — a memorable three-word code is easier for a tired adult
// to write down correctly than a random digit string, and that's the
// property that matters for a *documented reset procedure*, not entropy.
const WORDS = [
  'anchor',
  'meadow',
  'violet',
  'cobalt',
  'summit',
  'harbor',
  'lantern',
  'willow',
  'granite',
  'copper',
  'ember',
  'thistle',
];

export function generateRecoveryCode(random: () => number = Math.random): string {
  const pick = (): string => WORDS[Math.floor(random() * WORDS.length)]!;
  return `${pick()}-${pick()}-${pick()}`;
}
