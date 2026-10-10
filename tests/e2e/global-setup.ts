import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchElectron, removeDir } from './cleanup';
import { resolveExecutablePath } from './resolve-executable';

/**
 * Starts the app once, and closes it, before the first test. The first start of a
 * freshly built app on a new computer can take a minute (the system checks the
 * program over), and that should not count against whichever test happens to
 * run first.
 */
export default async function globalSetup(): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), 'mywords-e2e-warmup-'));
  const started = Date.now();
  try {
    const app = await launchElectron({
      executablePath: resolveExecutablePath(),
      args: [`--user-data-dir=${dir}`],
      timeout: 120_000,
    });
    await app.firstWindow({ timeout: 120_000 });
    console.log(`[warm-up] the app showed its first window after ${((Date.now() - started) / 1000).toFixed(1)} s`);
    await app.close();
  } catch (error) {
    console.log(`[warm-up] the app did not start after ${((Date.now() - started) / 1000).toFixed(1)} s: ${String(error).slice(0, 400)}`);
    throw error;
  } finally {
    removeDir(dir);
  }
}
