import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const RELEASE_DIR = join(__dirname, '../../release');

/**
 * Locates the `electron-builder --dir` (unpacked) build produced by
 * `npm run pack`, so e2e tests exercise a packaged build rather than
 * `npm run dev` (CLAUDE.md §8) — path handling, the app:// scheme and the
 * preload bridge all behave differently once packed.
 */
export function resolveExecutablePath(): string {
  if (!existsSync(RELEASE_DIR)) {
    throw new Error('release/ not found. Run `npm run pack` first.');
  }

  if (process.platform === 'darwin') {
    const macDir = readdirSync(RELEASE_DIR).find((d) => d.startsWith('mac'));
    if (macDir) {
      const appBundle = readdirSync(join(RELEASE_DIR, macDir)).find((f) =>
        f.endsWith('.app'),
      );
      if (appBundle) {
        return join(RELEASE_DIR, macDir, appBundle, 'Contents/MacOS/My Words');
      }
    }
  } else if (process.platform === 'win32') {
    const candidate = join(RELEASE_DIR, 'win-unpacked', 'My Words.exe');
    if (existsSync(candidate)) return candidate;
  } else {
    const candidate = join(RELEASE_DIR, 'linux-unpacked', 'my-words');
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `Packaged build not found under ${RELEASE_DIR} for platform ${process.platform}. Run \`npm run pack\` first.`,
  );
}
