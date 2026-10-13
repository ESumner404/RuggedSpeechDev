import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Where the saved data should be after the app was renamed. If there is a folder under the old
 * name and none under the new one, it is moved across (a rename on the same disk, so nothing is
 * copied and nothing can be half done). If it cannot be moved, the old folder is used where it is.
 * Returns the folder to use instead of the usual one, or undefined to use the usual one.
 */
export function keepOldDataFolder(
  appData: string,
  oldName: string,
  newName: string,
  fs: { exists: (path: string) => boolean; rename: (from: string, to: string) => void } = { exists: existsSync, rename: renameSync },
): string | undefined {
  const oldFolder = join(appData, oldName);
  const newFolder = join(appData, newName);
  if (!fs.exists(oldFolder) || fs.exists(newFolder)) return undefined;
  try {
    fs.rename(oldFolder, newFolder);
    return undefined;
  } catch {
    return oldFolder;
  }
}
