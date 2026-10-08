// Drawn symbols: an original set of simple, bold, flat pictures made for this
// app, as an alternative to emoji. They are drawn here as SVG, on a 64 by 64
// grid, with one outline weight and a small set of colours so they look like
// one family. Nothing is borrowed or licensed, and they need no internet.
//
// A symbol is picked when an item's picture is an emoji that has a drawing
// here (see EMOJI_TO_SYMBOL). An emoji with no drawing is simply shown as the
// emoji, so a family never sees a gap.

const INK = '#1f2937';
const SKIN = '#f4b98c';
const RED = '#ef4444';
const ORANGE = '#f59e0b';
const YELLOW = '#facc15';
const GREEN = '#22c55e';
const BLUE = '#3b82f6';
const SKY = '#93c5fd';
const PURPLE = '#a855f7';
const PINK = '#f472b6';
const BROWN = '#a16207';
const GREY = '#9ca3af';
const WHITE = '#ffffff';
const DARK = '#4b5563';
const CREAM = '#fde68a';

const c = (cx: number, cy: number, r: number, fill: string) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const e = (cx: number, cy: number, rx: number, ry: number, fill: string) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const r = (x: number, y: number, w: number, h: number, rx: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const p = (d: string, fill = 'none') => `<path d="${d}" fill="${fill}"/>`;
const l = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none"/>`;
/** Two small eyes and a smile on a face centred at (cx, cy). */
const face = (cx: number, cy: number, mood: 'smile' | 'sad' | 'cross' | 'flat' | 'open' | 'sleep' = 'smile') => {
  const eyes =
    mood === 'sleep'
      ? `<path d="M${cx - 9} ${cy - 3}q3 3 6 0M${cx + 3} ${cy - 3}q3 3 6 0" fill="none"/>`
      : `${c(cx - 6, cy - 3, 1.8, INK)}${c(cx + 6, cy - 3, 1.8, INK)}`;
  const mouth =
    mood === 'smile'
      ? `<path d="M${cx - 6} ${cy + 4}q6 7 12 0" fill="none"/>`
      : mood === 'sad'
        ? `<path d="M${cx - 6} ${cy + 9}q6 -7 12 0" fill="none"/>`
        : mood === 'cross'
          ? `<path d="M${cx - 6} ${cy + 8}l12 0M${cx - 9} ${cy - 8}l5 3M${cx + 9} ${cy - 8}l-5 3" fill="none"/>`
          : mood === 'open'
            ? e(cx, cy + 7, 4, 5, INK)
            : mood === 'sleep'
              ? `<path d="M${cx - 4} ${cy + 7}q4 3 8 0" fill="none"/>`
              : `<path d="M${cx - 5} ${cy + 7}l10 0" fill="none"/>`;
  return eyes + mouth;
};
const hand = (cx: number, cy: number) => e(cx, cy, 5, 5.5, SKIN);

/** A little person: head, hair, and a body in a colour. */
const person = (shirt: string, hair: string, opts: { arms?: 'down' | 'up' | 'out'; skirt?: boolean; small?: boolean } = {}) => {
  const k = opts.small ? 0.7 : 1;
  const y0 = opts.small ? 12 : 0;
  const body = opts.skirt
    ? p(`M${32 - 9 * k} ${30 + y0} h${18 * k} l${6 * k} ${20 * k} h${-30 * k} z`, shirt)
    : r(32 - 9 * k, 30 + y0, 18 * k, 22 * k, 6 * k, shirt);
  const legs = opts.skirt ? '' : `${r(32 - 8 * k, 48 + y0, 6 * k, 12 * k, 2, DARK)}${r(32 + 2 * k, 48 + y0, 6 * k, 12 * k, 2, DARK)}`;
  const arms =
    opts.arms === 'up'
      ? `${l(23, 34 + y0, 14, 20 + y0)}${l(41, 34 + y0, 50, 20 + y0)}${hand(13, 18 + y0)}${hand(51, 18 + y0)}`
      : opts.arms === 'out'
        ? `${l(23, 34 + y0, 10, 40 + y0)}${l(41, 34 + y0, 54, 40 + y0)}${hand(9, 41 + y0)}${hand(55, 41 + y0)}`
        : `${l(23, 34 + y0, 18, 46 + y0)}${l(41, 34 + y0, 46, 46 + y0)}`;
  return (
    legs +
    body +
    arms +
    circle(32, 20 + y0 * 0.6, 10 * k + (opts.small ? 2 : 0), SKIN) +
    p(`M${32 - 10 * k - 1} ${19 + y0 * 0.6} q${10 * k + 1} ${-14} ${20 * k + 2} 0 l-2 -2 h${-16 * k} z`, hair)
  );
};
const circle = c;

const SYMBOL_BODIES: Record<string, string> = {
  // ---- people and words about me and you
  'person-me': person(BLUE, BROWN, { arms: 'up' }),
  'person-you': person(GREEN, BROWN, { arms: 'out' }) + `<path d="M6 30 h12 m-4 -5 l5 5 l-5 5" fill="none" stroke-width="3"/>`,
  mum: person(PINK, '#7c2d12', { skirt: true }),
  dad: person(BLUE, '#374151'),
  baby: person('#fbcfe8', '#fde68a', { small: true }),
  grandma: person(PURPLE, '#e5e7eb', { skirt: true }),
  friend: person(ORANGE, BROWN) + `<g transform="translate(22 6) scale(.7)">${person(GREEN, '#374151')}</g>`,
  teacher: person(RED, '#374151') + r(42, 36, 16, 12, 2, WHITE) + l(45, 40, 55, 40) + l(45, 44, 53, 44),
  family: `<g transform="translate(-9 6) scale(.8)">${person(BLUE, '#374151')}</g><g transform="translate(15 6) scale(.8)">${person(PINK, '#7c2d12', { skirt: true })}</g><g transform="translate(5 22) scale(.7)">${person(GREEN, '#fde68a', { small: true })}</g>`,
  // ---- core little words
  'want': p('M6 52 q4 -8 14 -8 h14 q4 0 4 4 t-4 4 h-12 M34 48 h8 q6 0 10 -6 l4 -6', SKIN) + p('M44 26 l3 6 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1 z', YELLOW),
  like: r(10, 28, 12, 26, 3, BLUE) + p('M26 54 h20 q8 0 8 -8 l-2 -14 q-1 -6 -8 -6 h-8 l2 -10 q1 -8 -6 -8 l-6 18 v28 z', YELLOW),
  more: c(32, 32, 24, GREEN) + `<path d="M32 18 v28 M18 32 h28" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  no: c(32, 32, 24, RED) + `<path d="M18 18 L46 46" stroke="${WHITE}" stroke-width="7" fill="none"/>` + `<path d="M46 18 L18 46" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  yes: c(32, 32, 24, GREEN) + `<path d="M19 33 l9 9 l18 -20" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  help: c(32, 32, 25, RED) + c(32, 32, 11, WHITE) + p('M15 15 L24 24 M49 15 L40 24 M15 49 L24 40 M49 49 L40 40', 'none') + `<path d="M14 14 l10 10 M50 14 l-10 10 M14 50 l10 -10 M50 50 l-10 -10" stroke="${WHITE}" stroke-width="6" fill="none"/>` + c(32, 32, 11, '#fee2e2'),
  go: person(GREEN, BROWN) + `<path d="M46 52 h12 m-4 -4 l4 4 l-4 4" fill="none" stroke-width="3"/>`,
  my: person(BLUE, BROWN, { arms: 'down' }) + p('M44 28 l8 0 l0 10', 'none') + c(53, 24, 4, YELLOW),
  feel: p('M32 54 C10 40 6 24 18 16 C26 11 32 18 32 22 C32 18 38 11 46 16 C58 24 54 40 32 54 z', RED),
  stop: p('M22 6 h20 l16 16 v20 l-16 16 h-20 l-16 -16 v-20 z', RED) + `<path d="M19 32 h26" stroke="${WHITE}" stroke-width="7" fill="none"/>`,
  look: e(32, 32, 26, 16, WHITE) + c(32, 32, 11, BLUE) + c(32, 32, 5, INK) + c(35, 29, 2, WHITE),
  'all-done': r(12, 8, 6, 50, 3, GREY) + p('M18 10 h30 l-8 10 l8 10 h-30 z', GREEN) + p('M24 20 l5 5 l9 -9', 'none'),
  again: p('M48 22 A18 18 0 1 0 50 38', 'none') + p('M50 12 v14 h-14', 'none'),
  open: r(10, 30, 44, 24, 4, BROWN) + p('M10 30 l-4 -14 h40 l8 14', CREAM),
  that: p('M10 52 L36 26', 'none') + p('M36 26 l-12 2 M36 26 l-2 12', 'none') + c(46, 18, 9, YELLOW),
  not: c(32, 32, 24, WHITE) + `<path d="M15 49 L49 15" stroke="${RED}" stroke-width="7" fill="none"/>` + p('M24 32 h16', 'none'),
  what: c(32, 32, 24, PURPLE) + `<path d="M24 24 q0 -9 9 -9 q9 0 9 8 q0 6 -7 9 q-3 2 -3 6" stroke="${WHITE}" stroke-width="5" fill="none"/>` + c(32, 48, 3.2, WHITE),
  // ---- food and drink
  'food': c(32, 34, 20, WHITE) + c(32, 34, 12, '#e5e7eb') + l(6, 14, 6, 54) + l(2, 14, 2, 26) + l(10, 14, 10, 26) + p('M58 14 q-6 8 0 20 v20', 'none'),
  apple: p('M32 20 C22 12 8 20 10 36 C12 52 24 58 32 54 C40 58 52 52 54 36 C56 20 42 12 32 20 z', RED) + p('M32 20 q0 -8 6 -12', 'none') + p('M36 12 q8 -4 10 2 q-8 4 -10 -2 z', GREEN),
  banana: p('M12 18 C14 44 34 58 56 46 C44 50 32 42 26 12 z', YELLOW) + p('M12 18 l4 -6 l10 0 l0 6', 'none'),
  biscuit: c(32, 32, 24, '#d9a066') + c(24, 24, 3, BROWN) + c(40, 28, 3, BROWN) + c(30, 42, 3, BROWN) + c(42, 42, 2.5, BROWN),
  bread: p('M10 28 q-4 -18 22 -18 q26 0 22 18 v24 q0 4 -4 4 h-36 q-4 0 -4 -4 z', '#e8b86d') + p('M22 22 q10 -6 20 0', 'none'),
  cheese: p('M6 40 L58 24 V50 H6 z', YELLOW) + c(20, 42, 3.5, '#eab308') + c(38, 40, 3, '#eab308') + c(50, 44, 3, '#eab308'),
  'egg': e(32, 36, 24, 20, WHITE) + c(32, 36, 10, YELLOW),
  drink: p('M14 14 h36 l-5 42 h-26 z', SKY) + l(34, 4, 38, 14) + p('M16 26 h32', 'none'),
  juice: r(16, 14, 32, 42, 4, ORANGE) + r(16, 14, 32, 10, 3, WHITE) + c(32, 40, 8, YELLOW),
  water: p('M32 6 C20 24 14 32 14 40 a18 18 0 0 0 36 0 C50 32 44 24 32 6 z', SKY) + p('M24 42 q2 8 10 8', 'none'),
  milk: p('M20 8 h24 l6 12 v34 q0 4 -4 4 h-28 q-4 0 -4 -4 v-34 z', WHITE) + r(18, 28, 28, 14, 2, SKY),
  // ---- feelings
  happy: c(32, 32, 25, YELLOW) + face(32, 33, 'smile'),
  sad: c(32, 32, 25, SKY) + face(32, 33, 'sad') + p('M22 38 q-2 6 0 8', 'none'),
  angry: c(32, 32, 25, '#fb923c') + face(32, 33, 'cross'),
  'tired': c(32, 32, 25, '#ddd6fe') + face(32, 33, 'sleep') + p('M44 14 h8 l-8 9 h8', 'none') + p('M52 6 h6 l-6 7 h6', 'none'),
  hungry: c(32, 32, 25, YELLOW) + face(32, 31, 'open') + p('M30 46 q2 6 6 2', 'none'),
  scared: c(32, 32, 25, '#e5e7eb') + c(26, 29, 4.5, WHITE) + c(38, 29, 4.5, WHITE) + c(26, 29, 1.8, INK) + c(38, 29, 1.8, INK) + e(32, 44, 5, 6, INK),
  hurts: c(32, 32, 25, '#fecaca') + face(32, 34, 'sad') + r(36, 8, 18, 8, 2, WHITE) + l(41, 8, 41, 16) + l(48, 8, 48, 16),
  'body-face': c(32, 32, 25, SKIN) + face(32, 33, 'smile'),
  // ---- play
  play: p('M20 14 q-6 -8 -12 0 q0 8 8 8 M44 14 q6 -8 12 0 q0 8 -8 8', BROWN) + c(32, 26, 15, BROWN) + c(32, 28, 8, CREAM) + c(27, 23, 2, INK) + c(37, 23, 2, INK) + e(32, 29, 3, 2.2, INK) + r(18, 40, 28, 18, 8, BROWN),
  ball: c(32, 32, 25, WHITE) + p('M32 21 l8 6 l-3 9 h-10 l-3 -9 z', INK) + p('M32 21 v-9 M40 27 l9 -4 M37 36 l5 9 M27 36 l-5 9 M24 27 l-9 -4', 'none'),
  blocks: r(8, 36, 22, 20, 2, RED) + r(34, 36, 22, 20, 2, BLUE) + r(21, 14, 22, 20, 2, YELLOW) + `<text x="25" y="49" font-size="13" font-weight="800" fill="${WHITE}" stroke="none">A</text>`,
  book: p('M8 12 h22 q2 0 2 2 v38 q-2 -2 -6 -2 h-18 z', RED) + p('M56 12 h-22 q-2 0 -2 2 v38 q2 -2 6 -2 h18 z', BLUE),
  car: p('M6 40 h52 v8 h-52 z', RED) + p('M14 40 l6 -14 h24 l8 14 z', RED) + p('M22 28 h9 v10 h-13 z M34 28 h9 l4 10 h-13 z', SKY) + c(18, 50, 7, INK) + c(46, 50, 7, INK) + c(18, 50, 3, GREY) + c(46, 50, 3, GREY),
  teddy: c(20, 16, 8, BROWN) + c(44, 16, 8, BROWN) + c(32, 28, 16, BROWN) + c(32, 32, 7, CREAM) + c(27, 25, 2, INK) + c(37, 25, 2, INK) + e(32, 31, 3, 2.2, INK) + e(32, 50, 14, 10, BROWN) + c(14, 46, 5, BROWN) + c(50, 46, 5, BROWN),
  music: p('M22 46 V14 L50 8 V40', 'none') + e(18, 46, 8, 6, PURPLE) + e(46, 40, 8, 6, PURPLE),
  tv: r(6, 14, 52, 34, 5, DARK) + r(11, 19, 42, 24, 3, SKY) + l(20, 54, 44, 54) + l(24, 6, 32, 14) + l(40, 6, 32, 14),
  animals: c(32, 34, 18, '#d9a066') + p('M16 24 q-10 -6 -6 -18 q10 4 14 14 z M48 24 q10 -6 6 -18 q-10 4 -14 14 z', BROWN) + c(26, 31, 2.4, INK) + c(38, 31, 2.4, INK) + e(32, 40, 5, 4, INK) + p('M32 44 v4 M27 48 q5 4 10 0', 'none'),
  // ---- places
  places: p('M32 60 C14 40 10 30 10 24 a22 22 0 0 1 44 0 c0 6 -4 16 -22 36 z', RED) + c(32, 24, 8, WHITE),
  home: p('M6 30 L32 8 L58 30 z', RED) + r(12, 30, 40, 26, 2, CREAM) + r(26, 38, 12, 18, 2, BROWN) + r(16, 34, 8, 8, 1, SKY) + r(42, 34, 6, 8, 1, SKY),
  park: r(28, 34, 8, 22, 2, BROWN) + c(32, 24, 18, GREEN) + c(20, 32, 11, GREEN) + c(44, 32, 11, GREEN),
  shop: r(8, 22, 48, 34, 2, CREAM) + p('M6 22 l4 -12 h44 l4 12 z', RED) + r(26, 36, 12, 20, 2, BROWN) + r(12, 30, 10, 10, 1, SKY) + r(42, 30, 10, 10, 1, SKY),
  bedroom: r(6, 34, 52, 14, 3, BLUE) + r(6, 48, 6, 8, 1, BROWN) + r(52, 48, 6, 8, 1, BROWN) + r(6, 20, 8, 28, 2, BROWN) + r(14, 26, 16, 8, 4, WHITE),
  kitchen: r(14, 28, 36, 26, 4, GREY) + r(10, 22, 44, 8, 3, DARK) + c(32, 18, 3, DARK) + c(24, 40, 5, DARK) + c(40, 40, 5, DARK),
  school: p('M6 28 L32 8 L58 28 z', RED) + r(10, 28, 44, 28, 2, CREAM) + r(26, 38, 12, 18, 2, BROWN) + r(14, 34, 8, 8, 1, SKY) + r(42, 34, 8, 8, 1, SKY) + l(32, 8, 32, 2) + p('M32 2 h8 v5 h-8', RED),
  // ---- doing
  doing: person(GREEN, BROWN) + p('M44 54 l6 -8 M10 46 l8 8', 'none'),
  eat: e(32, 38, 22, 6, WHITE) + p('M16 38 q16 -22 32 0', '#d9a066') + l(12, 52, 52, 52),
  sleep: r(8, 38, 48, 14, 4, BLUE) + c(18, 34, 9, SKIN) + p('M10 34 q8 -14 16 0', BROWN) + `<text x="40" y="26" font-size="14" font-weight="800" fill="${INK}" stroke="none">z</text><text x="48" y="16" font-size="10" font-weight="800" fill="${INK}" stroke="none">z</text>`,
  wash: p('M10 34 h44 q0 20 -22 20 q-22 0 -22 -20 z', SKY) + c(20, 22, 5, WHITE) + c(34, 16, 6, WHITE) + c(44, 24, 4, WHITE) + c(28, 28, 3, WHITE),
  toilet: r(24, 10, 18, 20, 3, WHITE) + p('M16 32 h34 q0 14 -17 14 q-17 0 -17 -14 z', WHITE) + r(26, 46, 14, 10, 2, WHITE),
  sit: r(18, 32, 28, 6, 2, BROWN) + r(18, 12, 6, 26, 2, BROWN) + l(20, 38, 18, 56) + l(44, 38, 46, 56),
  // ---- body
  head: c(32, 32, 24, SKIN) + p('M10 28 q22 -34 44 0 q-22 -12 -44 0 z', BROWN) + face(32, 36, 'smile'),
  eyes: e(32, 32, 26, 16, WHITE) + c(32, 32, 10, BLUE) + c(32, 32, 5, INK),
  ears: p('M22 12 q22 -4 22 22 q0 14 -10 18 q-6 4 -6 10 q-2 6 -8 2', SKIN) + p('M28 22 q10 0 10 12', 'none'),
  nose: p('M32 8 q-4 22 -8 30 q-4 8 8 8 q12 0 8 -8 q-4 -8 -8 -30 z', SKIN) + c(26, 44, 2, INK) + c(38, 44, 2, INK),
  mouth: p('M6 32 q26 -18 52 0 q-26 24 -52 0 z', RED) + p('M12 32 q20 6 40 0', WHITE),
  hand: p('M16 56 V30 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V22 a4 4 0 0 1 8 0 V44 q0 12 -12 12 z', SKIN),
  tummy: p('M18 6 h28 q8 0 8 8 v22 q0 10 -6 18 l-2 6 h-28 l-2 -6 q-6 -8 -6 -18 v-22 q0 -8 8 -8 z', SKIN) + c(32, 38, 12, '#fecaca') + `<circle cx="32" cy="38" r="12" fill="none" stroke="${RED}" stroke-width="3"/>` + c(32, 38, 2, INK) + p('M24 6 q8 8 16 0', 'none'),
  leg: p('M24 4 h16 v32 l4 6 v12 h-22 v-12 l2 -6 z', SKIN) + l(24, 52, 44, 52),
  foot: p('M22 6 h14 v30 q0 8 14 12 q8 4 8 10 h-36 z', SKIN) + c(46, 52, 2, INK) + c(40, 52, 2, INK) + c(34, 52, 2, INK),
  // ---- animals
  dog: p('M10 16 q-6 14 4 24 M54 16 q6 14 -4 24', BROWN) + c(32, 30, 18, '#d9a066') + e(32, 40, 9, 7, WHITE) + c(26, 26, 2.4, INK) + c(38, 26, 2.4, INK) + e(32, 36, 3.5, 2.5, INK) + p('M32 38 v4 q-4 4 -8 0 M32 42 q4 4 8 0', 'none') + e(32, 50, 6, 3, PINK),
  cat: p('M14 24 L12 4 L28 14 M50 24 L52 4 L36 14', ORANGE) + c(32, 34, 20, ORANGE) + c(25, 30, 2.4, INK) + c(39, 30, 2.4, INK) + p('M30 37 h4 l-2 3 z', PINK) + p('M32 40 q-5 4 -9 1 M32 40 q5 4 9 1 M6 36 l10 2 M6 44 l10 -2 M58 36 l-10 2 M58 44 l-10 -2', 'none'),
  bird: e(30, 36, 20, 16, BLUE) + c(46, 26, 10, BLUE) + p('M54 26 l8 3 l-8 3 z', ORANGE) + c(48, 24, 2, INK) + p('M10 34 q-6 6 -6 14 q10 0 16 -8', SKY) + l(28, 52, 28, 60) + l(36, 52, 36, 60),
  fish: e(28, 32, 22, 15, ORANGE) + p('M48 32 L62 18 V46 z', ORANGE) + c(18, 28, 2.6, INK) + p('M24 20 q8 12 0 24', 'none'),
  'horse': p('M18 56 V34 q0 -22 18 -26 l8 8 l6 -6 l2 14 q-2 14 -10 16 v16 z', BROWN) + c(40, 20, 2.2, INK) + p('M16 20 q-4 16 4 30', DARK) + p('M42 24 q4 4 8 2', 'none'),
  cow: r(8, 28, 48, 20, 8, WHITE) + c(20, 20, 12, WHITE) + p('M12 12 l-4 -6 M28 12 l4 -6', 'none') + c(16, 18, 2, INK) + c(24, 18, 2, INK) + e(20, 26, 6, 4, PINK) + c(38, 34, 6, INK) + c(48, 38, 4, INK) + l(14, 48, 14, 58) + l(50, 48, 50, 58),
  pig: c(32, 34, 22, PINK) + p('M14 20 L10 8 L24 14 M50 20 L54 8 L40 14', PINK) + e(32, 40, 9, 7, '#f9a8d4') + c(29, 40, 1.6, INK) + c(35, 40, 1.6, INK) + c(25, 28, 2.4, INK) + c(39, 28, 2.4, INK),
  duck: e(30, 40, 22, 14, YELLOW) + c(44, 22, 12, YELLOW) + p('M54 22 l9 4 l-9 4 z', ORANGE) + c(47, 20, 2, INK) + p('M20 40 q10 -10 20 0', '#eab308'),
  sheep: c(20, 32, 10, WHITE) + c(32, 26, 12, WHITE) + c(44, 32, 10, WHITE) + c(26, 42, 10, WHITE) + c(40, 42, 10, WHITE) + e(32, 36, 10, 11, '#374151') + c(28, 33, 1.8, WHITE) + c(36, 33, 1.8, WHITE) + l(26, 52, 26, 60) + l(40, 52, 40, 60),
  // ---- greetings and manners
  hello: p('M18 58 V30 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V14 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V46 q0 12 -12 12 z', SKIN) + p('M8 18 q-4 8 0 16 M2 14 q-6 12 0 24', 'none'),
  goodbye: p('M18 58 V30 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V14 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V46 q0 12 -12 12 z', SKIN) + p('M56 20 q6 10 0 20 M62 14 q8 16 0 30', 'none'),
  please: p('M32 56 C22 48 14 42 14 32 L22 14 L32 26 L42 14 L50 32 C50 42 42 48 32 56 z', SKIN) + l(32, 26, 32, 50),
  'thank-you': c(32, 32, 25, YELLOW) + face(32, 33, 'smile') + c(20, 40, 4, '#fda4af') + c(44, 40, 4, '#fda4af'),
  sorry: c(32, 32, 25, SKY) + face(32, 34, 'sad') + p('M20 24 l8 -3 M44 24 l-8 -3', 'none'),
  wait: p('M18 58 V30 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V14 a4 4 0 0 1 8 0 V20 a4 4 0 0 1 8 0 V46 q0 12 -12 12 z', SKIN),
  goodnight: p('M42 8 A24 24 0 1 0 56 40 A20 20 0 0 1 42 8 z', YELLOW) + `<text x="14" y="26" font-size="12" font-weight="800" fill="${INK}" stroke="none">z</text>` + c(50, 14, 2.5, YELLOW) + c(56, 26, 2, YELLOW),
  // ---- school
  pencil: p('M12 52 L8 60 L16 56 L52 16 L44 8 z', YELLOW) + p('M44 8 l8 8 l4 -4 l-8 -8 z', PINK) + p('M12 52 L8 60 L16 56 z', CREAM),
  'school-book': p('M12 6 h38 q4 0 4 4 v44 h-38 q-4 0 -4 -4 z', BLUE) + p('M12 50 h42', 'none') + r(20, 14, 24, 10, 2, WHITE),
  break: c(32, 32, 24, WHITE) + p('M32 14 v18 l12 8', 'none'),
  lunch: r(8, 22, 48, 32, 5, ORANGE) + r(8, 22, 48, 8, 3, '#fb923c') + r(26, 10, 12, 8, 3, DARK) + c(32, 42, 6, YELLOW),
  'my-turn': person(BLUE, BROWN, { arms: 'up' }) + p('M52 10 l4 -4 M56 14 l5 0', 'none'),
  'your-turn': person(GREEN, BROWN, { arms: 'out' }) + `<path d="M6 30 h12 m-4 -5 l5 5 l-5 5" fill="none" stroke-width="3"/>`,
  // ---- the home screen and the top bar
  talk: p('M8 10 h48 q4 0 4 4 v24 q0 4 -4 4 h-24 l-12 12 v-12 h-12 q-4 0 -4 -4 v-24 q0 -4 4 -4 z', BLUE) + c(22, 26, 3, WHITE) + c(32, 26, 3, WHITE) + c(42, 26, 3, WHITE),
  keyboard: r(4, 16, 56, 32, 5, GREY) + [0, 1, 2, 3, 4, 5].map((i) => r(9 + i * 8, 21, 6, 6, 1, WHITE)).join('') + [0, 1, 2, 3, 4].map((i) => r(13 + i * 8, 30, 6, 6, 1, WHITE)).join('') + r(18, 39, 28, 5, 1, WHITE),
  'my-day': r(8, 12, 48, 44, 4, WHITE) + r(8, 12, 48, 12, 3, RED) + l(20, 8, 20, 16) + l(44, 8, 44, 16) + [0, 1, 2].map((i) => c(20 + i * 12, 34, 3, BLUE)).join('') + [0, 1, 2].map((i) => c(20 + i * 12, 46, 3, BLUE)).join(''),
  favourites: p('M32 6 L39 24 L58 25 L43 37 L48 56 L32 45 L16 56 L21 37 L6 25 L25 24 z', YELLOW),
  'my-pages': p('M14 6 h26 l12 12 v40 h-38 z', WHITE) + p('M40 6 v12 h12', GREY) + l(20, 28, 46, 28) + l(20, 36, 46, 36) + l(20, 44, 38, 44),
  'home-bar': p('M6 30 L32 8 L58 30 z', RED) + r(12, 30, 40, 26, 2, CREAM) + r(26, 38, 12, 18, 2, BROWN),
  firstthen: p('M6 20 h22 v24 h-22 z', SKY) + p('M36 20 h22 v24 h-22 z', GREEN) + `<path d="M28 32 h8 m-3 -4 l4 4 l-4 4" fill="none" stroke-width="3"/>`,
  games: r(6, 20, 52, 28, 12, PURPLE) + l(18, 28, 18, 40) + l(12, 34, 24, 34) + c(42, 30, 3.2, YELLOW) + c(48, 38, 3.2, GREEN),
  draw: p('M12 52 L8 60 L16 56 L52 16 L44 8 z', RED) + p('M44 8 l8 8 l4 -4 l-8 -8 z', GREY) + c(44, 50, 7, BLUE) + c(54, 44, 5, YELLOW),
  'my-body': person(BLUE, BROWN),
  'music-note': p('M22 46 V14 L50 8 V40', 'none') + e(18, 46, 8, 6, PURPLE) + e(46, 40, 8, 6, PURPLE),
  traffic: r(18, 4, 28, 56, 8, DARK) + c(32, 16, 6.5, RED) + c(32, 32, 6.5, ORANGE) + c(32, 48, 6.5, GREEN),
  question: c(32, 32, 24, PURPLE) + `<path d="M24 24 q0 -9 9 -9 q9 0 9 8 q0 6 -7 9 q-3 2 -3 6" stroke="${WHITE}" stroke-width="5" fill="none"/>` + c(32, 48, 3.2, WHITE),
  finished: r(12, 8, 6, 50, 3, GREY) + p('M18 10 h30 l-8 10 l8 10 h-30 z', GREEN),
  'say-again': p('M48 22 A18 18 0 1 0 50 38', 'none') + p('M50 12 v14 h-14', 'none'),
  'break-bar': c(32, 32, 24, WHITE) + p('M32 14 v18 l12 8', 'none'),
  'weather-sun': c(32, 32, 12, YELLOW) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => l(32 + Math.cos((i * Math.PI) / 4) * 18, 32 + Math.sin((i * Math.PI) / 4) * 18, 32 + Math.cos((i * Math.PI) / 4) * 26, 32 + Math.sin((i * Math.PI) / 4) * 26)).join(''),
};

export const SYMBOLS: Record<string, string> = SYMBOL_BODIES;

/**
 * Which drawing stands for which emoji. One emoji, one drawing, wherever it
 * is used, so a child sees the same picture for the same thing.
 */
export const EMOJI_TO_SYMBOL: Record<string, string> = {
  '🙋': 'person-me',
  '👉': 'person-you',
  '👩': 'mum',
  '👨': 'dad',
  '👶': 'baby',
  '👵': 'grandma',
  '🧑‍🤝‍🧑': 'friend',
  '🧑‍🏫': 'teacher',
  '👨‍👩‍👧': 'family',
  '🤲': 'want',
  '👍': 'like',
  '➕': 'more',
  '🚫': 'no',
  '✅': 'yes',
  '🆘': 'help',
  '🚶': 'go',
  '☝️': 'my',
  '❤️': 'feel',
  '🛑': 'stop',
  '👀': 'look',
  '🏁': 'all-done',
  '🔁': 'again',
  '📂': 'open',
  '👆': 'that',
  '⛔': 'not',
  '❓': 'what',
  '🍽️': 'food',
  '🍎': 'apple',
  '🍌': 'banana',
  '🍪': 'biscuit',
  '🍞': 'bread',
  '🧀': 'cheese',
  '🥚': 'egg',
  '🥤': 'drink',
  '🧃': 'juice',
  '💧': 'water',
  '🥛': 'milk',
  '😊': 'happy',
  '😢': 'sad',
  '😠': 'angry',
  '😴': 'tired',
  '😋': 'hungry',
  '😨': 'scared',
  '🤕': 'hurts',
  '🙂': 'body-face',
  '🧸': 'teddy',
  '⚽': 'ball',
  '🧱': 'blocks',
  '📖': 'book',
  '🚗': 'car',
  '🎵': 'music',
  '📺': 'tv',
  '🐶': 'dog',
  '🐱': 'cat',
  '🐦': 'bird',
  '🐟': 'fish',
  '🐴': 'horse',
  '🐮': 'cow',
  '🐷': 'pig',
  '🦆': 'duck',
  '🐑': 'sheep',
  '📍': 'places',
  '🏠': 'home',
  '🌳': 'park',
  '🏪': 'shop',
  '🛏️': 'bedroom',
  '🍳': 'kitchen',
  '🏫': 'school',
  '🏃': 'doing',
  '🧼': 'wash',
  '🚽': 'toilet',
  '🪑': 'sit',
  '👁️': 'eyes',
  '👂': 'ears',
  '👃': 'nose',
  '👄': 'mouth',
  '✋': 'hand',
  '🎽': 'tummy',
  '🦵': 'leg',
  '🦶': 'foot',
  '👋': 'hello',
  '🖐️': 'goodbye',
  '🙏': 'please',
  '😔': 'sorry',
  '🌙': 'goodnight',
  '✏️': 'pencil',
  '📚': 'school-book',
  '🕑': 'break',
  '🍱': 'lunch',
  '💬': 'talk',
  '⌨️': 'keyboard',
  '📅': 'my-day',
  '⭐': 'favourites',
  '📄': 'my-pages',
  '➡️': 'firstthen',
  '🎮': 'games',
  '🎨': 'draw',
  '🧍': 'my-body',
  '🚦': 'traffic',
  '⏸️': 'break',
  '☀️': 'weather-sun',
};

export const hasSymbolFor = (char: string): boolean => char in EMOJI_TO_SYMBOL && EMOJI_TO_SYMBOL[char]! in SYMBOLS;

/** The whole drawing, ready to use as a picture. */
export function symbolSvg(name: string): string | undefined {
  const body = SYMBOLS[name];
  if (!body) return undefined;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">` +
    `<g stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`
  );
}

/** As an address for an image, so it can be drawn without any markup going into the page. */
export function symbolDataUri(name: string): string | undefined {
  const svg = symbolSvg(name);
  return svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : undefined;
}

/** The drawing for an emoji, if there is one. */
export function drawnFor(char: string): string | undefined {
  const name = EMOJI_TO_SYMBOL[char];
  return name ? symbolDataUri(name) : undefined;
}
