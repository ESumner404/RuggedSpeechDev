import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { keepOldDataFolder } from './dataFolder';

const make = (existing: string[], failRename = false) => {
  const present = new Set(existing);
  const moves: [string, string][] = [];
  return {
    moves,
    fs: {
      exists: (path: string) => present.has(path),
      rename: (from: string, to: string) => {
        if (failRename) throw new Error('in use');
        moves.push([from, to]);
        present.delete(from);
        present.add(to);
      },
    },
  };
};
const base = join('home', 'AppData');
const oldFolder = join(base, 'Rugged Speech Test');
const newFolder = join(base, 'Rugged Speech');

describe('keeping saved data when the app was renamed', () => {
  it('moves the old folder across, so the data is still there', () => {
    const { fs, moves } = make([oldFolder]);
    expect(keepOldDataFolder(base, 'Rugged Speech Test', 'Rugged Speech', fs)).toBeUndefined();
    expect(moves).toEqual([[oldFolder, newFolder]]);
  });

  it('does nothing on a computer that never had the old name', () => {
    const { fs, moves } = make([]);
    expect(keepOldDataFolder(base, 'Rugged Speech Test', 'Rugged Speech', fs)).toBeUndefined();
    expect(moves).toEqual([]);
  });

  it('never touches a folder that already exists under the new name', () => {
    const { fs, moves } = make([oldFolder, newFolder]);
    expect(keepOldDataFolder(base, 'Rugged Speech Test', 'Rugged Speech', fs)).toBeUndefined();
    expect(moves).toEqual([]);
  });

  it('uses the old folder where it is if it cannot be moved', () => {
    const { fs } = make([oldFolder], true);
    expect(keepOldDataFolder(base, 'Rugged Speech Test', 'Rugged Speech', fs)).toBe(oldFolder);
  });
});
