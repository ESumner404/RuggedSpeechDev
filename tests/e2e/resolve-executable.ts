import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const RELEASE_DIR = join(__dirname, '../../release');

/**
 * Locates the `electron-builder --dir` (unpacked) build produced by
 * `npm run pack`, so e2e tests exercise a packaged build rather than
 * `npm run dev` (PRINCIPLES.md §8), path handling, the app:// scheme and the
 * preload bridge all behave differently once packed.
 */
export function resolveExecutablePath(): string {
  if (!existsSync(RELEASE_DIR)) {
    throw new Error('release/ not found. Run `npm run pack` first.');
  }

  if (process.platform === 'darwin') {
    // electron-builder names the --dir output for the host arch: "mac-arm64"
    // on Apple Silicon, plain "mac" on x64. Match that exactly rather than
    // any "mac*" prefix, a stale build for the other arch (e.g. left over
    // from `npm run dist:mac`, which builds both) would otherwise be picked
    // by directory listing order and silently launch old code.
    const macDir = process.arch === 'arm64' ? 'mac-arm64' : 'mac';
    if (existsSync(join(RELEASE_DIR, macDir))) {
      const appBundle = readdirSync(join(RELEASE_DIR, macDir)).find((f) =>
        f.endsWith('.app'),
      );
      if (appBundle) {
        return join(RELEASE_DIR, macDir, appBundle, 'Contents/MacOS/Rugged Speech Test');
      }
    }
  } else if (process.platform === 'win32') {
    const candidate = join(RELEASE_DIR, 'win-unpacked', 'Rugged Speech Test.exe');
    if (existsSync(candidate)) return candidate;
  } else {
    const candidate = join(RELEASE_DIR, 'linux-unpacked', 'rugged-speech-test');
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `Packaged build not found under ${RELEASE_DIR} for platform ${process.platform}. Run \`npm run pack\` first.`,
  );
}
