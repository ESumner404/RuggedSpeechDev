import { VALID_GRID_SIZES, WORD_STAGES, type Board, type GridSize, type Item, type WordStage } from './types';
import { FITZGERALD_COLORS } from '../ui/fitzgerald';

// Open Board Format (https://www.openboardformat.org/) for sharing a single
// page: one `.obf` file that other AAC software can read, and that this app
// can read back. Pictures and recordings travel inside the file as data
// URIs, so it is self-contained like a backup (PRINCIPLES.md §4). Anything this
// app has that OBF has no field for is written as an `ext_my_speech_*` field,
// which the format allows and other software ignores.

export type ObfImage = { id: string; content_type: string; data: string };
export type ObfSound = { id: string; content_type: string; data: string };
export type ObfButton = {
  id: string;
  label: string;
  vocalization?: string;
  background_color?: string;
  image_id?: string;
  sound_id?: string;
  hidden?: boolean;
  ext_my_speech_emoji?: string;
  ext_my_speech_stage?: number;
  ext_my_speech_target?: boolean;
};
export type ObfBoard = {
  format: 'open-board-0.1';
  id: string;
  locale: string;
  name: string;
  grid: { rows: number; columns: number; order: (string | null)[][] };
  buttons: ObfButton[];
  images: ObfImage[];
  sounds: ObfSound[];
};

/** A file bigger than this is almost certainly not a page; refuse it rather than choke on it. */
export const MAX_OBF_CHARACTERS = 60_000_000;

async function blobToDataUri(blob: Blob): Promise<string> {
  if (typeof blob.arrayBuffer === 'function') {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    // In slices: spreading a whole photo into one call would overflow the stack.
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return `data:${blob.type || 'application/octet-stream'};base64,${btoa(binary)}`;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function dataUriToBlob(uri: string): Promise<Blob> {
  return (await fetch(uri)).blob();
}

export type ObfSources = {
  getPhoto: (blobId: string) => Promise<Blob | undefined>;
  getClip: (blobId: string) => Promise<Blob | undefined>;
};

/**
 * One board as an OBF file. Folders are not followed: the page is exported on
 * its own, so a button that opened another board is written as an ordinary
 * button (the other board would not be in the file to open).
 */
export async function boardToObf(board: Board, sources: ObfSources): Promise<ObfBoard> {
  const images: ObfImage[] = [];
  const sounds: ObfSound[] = [];
  const buttons: ObfButton[] = [];

  for (const item of board.buttons) {
    const button: ObfButton = { id: item.id, label: item.label };
    if (item.vocalization) button.vocalization = item.vocalization;
    if (item.background_color) button.background_color = item.background_color;
    if (item.hidden) button.hidden = true;
    if (item.stage) button.ext_my_speech_stage = item.stage;
    if (item.target) button.ext_my_speech_target = true;

    if (item.image?.kind === 'emoji') {
      button.ext_my_speech_emoji = item.image.char;
    } else if (item.image?.kind === 'photo') {
      const blob = await sources.getPhoto(item.image.blobId);
      if (blob) {
        const id = `image-${images.length + 1}`;
        images.push({ id, content_type: blob.type || 'image/jpeg', data: await blobToDataUri(blob) });
        button.image_id = id;
      }
    }
    if (item.voiceClipBlobId) {
      const blob = await sources.getClip(item.voiceClipBlobId);
      if (blob) {
        const id = `sound-${sounds.length + 1}`;
        sounds.push({ id, content_type: blob.type || 'audio/webm', data: await blobToDataUri(blob) });
        button.sound_id = id;
      }
    }
    buttons.push(button);
  }

  return {
    format: 'open-board-0.1',
    id: board.id,
    locale: 'en',
    name: board.name,
    grid: { rows: board.grid.rows, columns: board.grid.columns, order: board.grid.order },
    buttons,
    images,
    sounds,
  };
}

export type ObfImportStorage = {
  savePhoto: (blob: Blob) => Promise<string>;
  saveClip: (blob: Blob) => Promise<string>;
};

export type ObfImportResult =
  | { ok: true; name: string; grid: Board['grid']; buttons: Item[]; notes: string[] }
  | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const NOT_A_PAGE = "This file isn't a page this app can read.";
const COLOUR_VALUES = new Set(Object.values(FITZGERALD_COLORS));
const MAX_SIZE = VALID_GRID_SIZES[VALID_GRID_SIZES.length - 1]!;
const MIN_SIZE = VALID_GRID_SIZES[0]!;

/**
 * Reads an OBF file into a page. Works with files from this app and from
 * other software, taking what fits and saying what did not: a grid larger
 * than this app supports is refused (nothing is silently squashed), colours
 * that are not the word-class key are dropped (colour has meaning, PRINCIPLES.md
 * §5), and buttons that opened other boards become ordinary buttons.
 */
export async function obfToPage(text: string, storage: ObfImportStorage): Promise<ObfImportResult> {
  if (text.length > MAX_OBF_CHARACTERS) return { ok: false, error: 'That file is too big to be a page.' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: NOT_A_PAGE };
  }
  if (!isRecord(parsed) || typeof parsed['format'] !== 'string' || !parsed['format'].startsWith('open-board-')) {
    return { ok: false, error: NOT_A_PAGE };
  }
  const gridIn = parsed['grid'];
  if (!isRecord(gridIn) || !Array.isArray(parsed['buttons'])) return { ok: false, error: NOT_A_PAGE };

  const orderIn = Array.isArray(gridIn['order']) ? (gridIn['order'] as unknown[]) : [];
  const rowsIn = Number(gridIn['rows'] ?? orderIn.length);
  const columnsIn = Number(gridIn['columns'] ?? (Array.isArray(orderIn[0]) ? (orderIn[0] as unknown[]).length : 0));
  if (!Number.isInteger(rowsIn) || !Number.isInteger(columnsIn) || rowsIn < 1 || columnsIn < 1) {
    return { ok: false, error: NOT_A_PAGE };
  }
  if (rowsIn > MAX_SIZE || columnsIn > MAX_SIZE) {
    return {
      ok: false,
      error: `This page is ${columnsIn} by ${rowsIn}. This app's pages go up to ${MAX_SIZE} by ${MAX_SIZE}.`,
    };
  }
  const rows = Math.max(rowsIn, MIN_SIZE) as GridSize;
  const columns = Math.max(columnsIn, MIN_SIZE) as GridSize;

  const imagesById = new Map<string, { content_type: string; data: string }>();
  for (const image of Array.isArray(parsed['images']) ? (parsed['images'] as unknown[]) : []) {
    if (isRecord(image) && typeof image['id'] === 'string' && typeof image['data'] === 'string') {
      const type = String(image['content_type'] ?? '');
      if (type.startsWith('image/') && image['data'].startsWith('data:')) {
        imagesById.set(image['id'], { content_type: type, data: image['data'] });
      }
    }
  }
  const soundsById = new Map<string, { content_type: string; data: string }>();
  for (const sound of Array.isArray(parsed['sounds']) ? (parsed['sounds'] as unknown[]) : []) {
    if (isRecord(sound) && typeof sound['id'] === 'string' && typeof sound['data'] === 'string') {
      const type = String(sound['content_type'] ?? '');
      if (type.startsWith('audio/') && sound['data'].startsWith('data:')) {
        soundsById.set(sound['id'], { content_type: type, data: sound['data'] });
      }
    }
  }

  const notes: string[] = [];
  let foldersFlattened = 0;
  let coloursDropped = 0;
  const used = new Set<string>();
  const items = new Map<string, Item>();

  for (const [index, raw] of (parsed['buttons'] as unknown[]).entries()) {
    if (!isRecord(raw)) continue;
    const label = typeof raw['label'] === 'string' ? raw['label'] : '';
    let id = typeof raw['id'] === 'string' && raw['id'] ? raw['id'] : `button-${index + 1}`;
    while (used.has(id)) id = `${id}-${index + 1}`;
    used.add(id);

    const item: Item = { id, label };
    if (typeof raw['vocalization'] === 'string' && raw['vocalization']) item.vocalization = raw['vocalization'];
    if (raw['hidden'] === true) item.hidden = true;
    if (raw['load_board']) foldersFlattened += 1;

    const colour = typeof raw['background_color'] === 'string' ? raw['background_color'].toLowerCase() : undefined;
    if (colour && COLOUR_VALUES.has(colour)) item.background_color = colour;
    else if (colour) coloursDropped += 1;

    const stage = raw['ext_my_speech_stage'];
    if (typeof stage === 'number' && (WORD_STAGES as readonly number[]).includes(stage)) item.stage = stage as WordStage;
    if (raw['ext_my_speech_target'] === true) item.target = true;

    const emoji = raw['ext_my_speech_emoji'];
    const image = typeof raw['image_id'] === 'string' ? imagesById.get(raw['image_id']) : undefined;
    if (typeof emoji === 'string' && emoji) {
      item.image = { kind: 'emoji', char: emoji };
    } else if (image) {
      try {
        item.image = { kind: 'photo', blobId: await storage.savePhoto(await dataUriToBlob(image.data)) };
      } catch {
        // A damaged picture should not lose the button.
      }
    }
    const sound = typeof raw['sound_id'] === 'string' ? soundsById.get(raw['sound_id']) : undefined;
    if (sound) {
      try {
        item.voiceClipBlobId = await storage.saveClip(await dataUriToBlob(sound.data));
      } catch {
        // Likewise a damaged recording.
      }
    }
    items.set(id, item);
  }

  // Lay the buttons out where the file put them; any it did not place (or
  // placed on a cell that doesn't exist here) go into the next free cells.
  const order: (string | null)[][] = Array.from({ length: rows }, () => Array.from({ length: columns }, () => null));
  const placed = new Set<string>();
  orderIn.forEach((row, r) => {
    if (!Array.isArray(row) || r >= rows) return;
    (row as unknown[]).forEach((cell, c) => {
      if (c < columns && typeof cell === 'string' && items.has(cell) && !placed.has(cell)) {
        order[r]![c] = cell;
        placed.add(cell);
      }
    });
  });
  let skipped = 0;
  for (const id of items.keys()) {
    if (placed.has(id)) continue;
    const free = order.flatMap((row, r) => row.map((cell, c) => ({ r, c, cell }))).find((slot) => slot.cell === null);
    if (!free) {
      skipped += 1;
      items.delete(id);
      continue;
    }
    order[free.r]![free.c] = id;
    placed.add(id);
  }

  if (foldersFlattened > 0) {
    notes.push(
      `${foldersFlattened} button${foldersFlattened === 1 ? '' : 's'} opened other boards in the original. They are ordinary buttons here.`,
    );
  }
  if (coloursDropped > 0) {
    notes.push('Colours from the other app were not kept, because colour here shows the kind of word. Set them in Details.');
  }
  if (skipped > 0) notes.push(`${skipped} button${skipped === 1 ? '' : 's'} did not fit and were left out.`);

  const name = typeof parsed['name'] === 'string' && parsed['name'].trim() ? parsed['name'].trim() : 'Shared page';
  return { ok: true, name, grid: { rows, columns, order }, buttons: [...items.values()], notes };
}

export function obfToText(obf: ObfBoard): string {
  return JSON.stringify(obf, null, 2);
}
