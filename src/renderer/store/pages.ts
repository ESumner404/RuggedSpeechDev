import { createMyPage, getBoard, getPhoto, getVoiceClip, savePhoto, saveVoiceClip, updateBoard } from './db';
import { FITZGERALD_COLORS } from '../ui/fitzgerald';
import type { PageButtonSpec } from '../vocab/pageTemplates';
import type { GridSize, Item } from './types';
import { boardToObf, obfToPage, obfToText } from './obf';
import type { MyPage } from './types';

/** A My Page as the text of an `.obf` file, or null if its board has gone. */
export async function exportMyPageText(page: MyPage): Promise<string | null> {
  const board = await getBoard(page.boardId);
  if (!board) return null;
  return obfToText(await boardToObf({ ...board, name: page.name }, { getPhoto, getClip: getVoiceClip }));
}

export type ImportedPage = { ok: true; page: MyPage; notes: string[] } | { ok: false; error: string };

/**
 * Adds the page in an `.obf` file as a new My Page. Always a new page: an
 * imported file never replaces or merges into anything already here.
 */
export async function importMyPageFromText(text: string): Promise<ImportedPage> {
  const result = await obfToPage(text, { savePhoto, saveClip: saveVoiceClip });
  if (!result.ok) return result;

  const page = await createMyPage(result.name);
  const board = await getBoard(page.boardId);
  if (board) await updateBoard({ ...board, grid: result.grid, buttons: result.buttons });
  return { ok: true, page, notes: result.notes };
}

export function suggestedPageFileName(page: MyPage): string {
  const slug = page.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'page'}.obf`;
}

/** The most buttons a page can hold: its largest grid, 5 by 5. */
export const MAX_PAGE_BUTTONS = 25;

/** The smallest square grid this app offers that fits that many buttons. */
export function gridSizeFor(count: number): GridSize {
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  return 5;
}

/**
 * Makes a new My Page already holding some buttons, in the order given,
 * starting at the top left. The page can be changed like any other.
 */
export async function createPageWithButtons(name: string, specs: PageButtonSpec[]): Promise<MyPage> {
  const chosen = specs.slice(0, MAX_PAGE_BUTTONS);
  const size = gridSizeFor(chosen.length);
  const page = await createMyPage(name);

  const buttons: Item[] = chosen.map((spec, index) => ({
    id: `button-${index + 1}`,
    label: spec.label,
    ...(spec.says && spec.says !== spec.label ? { vocalization: spec.says } : {}),
    ...(spec.emoji ? { image: { kind: 'emoji' as const, char: spec.emoji } } : {}),
    background_color: FITZGERALD_COLORS[spec.colour ?? 'things'],
  }));
  const order: (string | null)[][] = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => buttons[row * size + column]?.id ?? null),
  );

  const board = await getBoard(page.boardId);
  if (board) await updateBoard({ ...board, grid: { rows: size, columns: size, order }, buttons });
  return page;
}
