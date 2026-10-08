// Colours for drawing: plain, bright and easy to name. Names are for people
// using a screen reader and for the adult talking about the picture.
export const DRAWING_COLOURS: { name: string; value: string }[] = [
  { name: 'black', value: '#1a1a1a' },
  { name: 'grey', value: '#8a8a8a' },
  { name: 'red', value: '#e11d48' },
  { name: 'orange', value: '#f97316' },
  { name: 'yellow', value: '#facc15' },
  { name: 'green', value: '#22a559' },
  { name: 'light blue', value: '#38bdf8' },
  { name: 'blue', value: '#2563eb' },
  { name: 'purple', value: '#9333ea' },
  { name: 'pink', value: '#f472b6' },
  { name: 'brown', value: '#92400e' },
  { name: 'white', value: '#ffffff' },
];

export const BRUSH_SIZES = [
  { name: 'thin', width: 6 },
  { name: 'medium', width: 16 },
  { name: 'thick', width: 36 },
] as const;

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 576;
/** How many strokes can be undone. */
export const UNDO_LIMIT = 15;
/** How many pictures can be kept. Never silently dropped to make room. */
export const MAX_KEPT_DRAWINGS = 12;

export const isDrawingList = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length <= MAX_KEPT_DRAWINGS &&
  value.every((entry) => typeof entry === 'string' && entry.startsWith('data:image/png;base64,'));
