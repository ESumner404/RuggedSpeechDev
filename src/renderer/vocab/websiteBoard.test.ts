import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { STARTER_BOARDS } from './starter';
import { HELP_ITEMS } from './feelingsHelp';

type Page = { n: string; g: [number, number]; o: (string | null)[][]; i: Record<string, { l: string; f?: string }> };
type Data = { root: string; boards: Record<string, Page>; symbols: Record<string, string> };

function load(): Data {
  const code = readFileSync(join(__dirname, '../../../website/board-data.js'), 'utf8');
  const holder: { RS_BOARD?: Data } = {};
  new Function('window', code)(holder);
  return holder.RS_BOARD!;
}

// The "Have a go" board on the website must be the app's real vocabulary. If
// this fails, run `npm run website:board` and commit the result.
describe('the website board', () => {
  const data = load();

  it('has every page of the starter vocabulary, with the same words in the same places', () => {
    for (const board of STARTER_BOARDS) {
      const page = data.boards[board.id];
      expect(page, `page ${board.id}`).toBeDefined();
      expect(page!.g).toEqual([board.grid.rows, board.grid.columns]);
      expect(page!.o).toEqual(board.grid.order);
      for (const item of board.buttons) {
        expect(page!.i[item.id]?.l, `${board.id}/${item.id}`).toBe(item.label);
        expect(page!.i[item.id]?.f).toBe(item.load_board?.id);
      }
    }
  });

  it('has the Help page, and every folder leads somewhere that exists', () => {
    expect(Object.values(data.boards['help']!.i).map((i) => i.l)).toEqual(HELP_ITEMS.map((i) => i.label));
    for (const page of Object.values(data.boards)) {
      for (const item of Object.values(page.i)) if (item.f) expect(data.boards[item.f], item.l).toBeDefined();
    }
    expect(data.boards[data.root]).toBeDefined();
  });

  it('carries drawn symbols as images and nothing that runs', () => {
    expect(Object.keys(data.symbols).length).toBeGreaterThan(50);
    for (const uri of Object.values(data.symbols)) {
      expect(uri.startsWith('data:image/svg+xml')).toBe(true);
      expect(decodeURIComponent(uri.slice(uri.indexOf(',') + 1))).not.toMatch(/<script|onload=|javascript:/i);
    }
  });
});
