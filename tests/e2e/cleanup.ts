import { rmSync } from 'node:fs';
import { _electron as electron, type ElectronApplication } from '@playwright/test';

/**
 * Removes a temporary folder. On Windows the app can still be letting go of its
 * files for a moment after it closes (EBUSY), so try a few times, and if it still
 * will not go, leave it for the system to clear: it is only a temporary folder.
 */
export function removeDir(path: string): void {
  try {
    rmSync(path, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    /* a temporary folder that is still in use; the system clears it later */
  }
}

type LaunchOptions = Parameters<typeof electron.launch>[0];

/**
 * Starts the app. Starting it again straight after it was closed can fail on
 * Windows while the old one is still letting go of its folder (the debug
 * connection is reset), so a failed start is tried again a couple of times.
 */
export async function launchElectron(options: LaunchOptions): Promise<ElectronApplication> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await electron.launch(options);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  throw lastError;
}
