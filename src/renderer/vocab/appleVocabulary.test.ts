import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { STARTER_BOARDS } from './starter';
import { FEELINGS_ITEMS, HELP_ITEMS } from './feelingsHelp';

// The Apple Watch and Apple TV apps must say the same words in the same places as the app. If this fails, run
// `npm run apple:vocabulary` and commit the result.
describe('the Apple Watch and Apple TV vocabulary', () => {
  const swift = readFileSync(join(__dirname, '../../../apple/Shared/Vocabulary.swift'), 'utf8');

  it('has every starter page, with its words in the same places', () => {
    for (const board of STARTER_BOARDS) {
      expect(swift, board.id).toContain(`id: ${JSON.stringify(board.id)}, name: ${JSON.stringify(board.name)}, rows: ${board.grid.rows}, columns: ${board.grid.columns}`);
      const order = board.grid.order.map((row) => `[${row.map((cell) => (cell ? JSON.stringify(cell) : 'nil')).join(', ')}]`).join(', ');
      expect(swift, `${board.id} order`).toContain(`order: [${order}]`);
      for (const item of board.buttons) expect(swift, `${board.id}/${item.id}`).toContain(`VocabItem(id: ${JSON.stringify(item.id)}, label: ${JSON.stringify(item.label)}`);
    }
  });

  it('has every feeling and help phrase', () => {
    for (const item of [...FEELINGS_ITEMS, ...HELP_ITEMS]) {
      expect(swift, item.id).toContain(`VocabItem(id: ${JSON.stringify(item.id)}, label: ${JSON.stringify(item.label)}`);
    }
  });
});
