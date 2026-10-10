import { defineConfig } from '@playwright/test';

// The packaged app runs hidden by default, so a test run never puts a window
// on screen, takes focus, or goes fullscreen on the machine it runs on. Set
// RUGGED_SPEECH_HIDDEN_FOR_TESTS=0 to watch a run when you want to.
process.env['RUGGED_SPEECH_HIDDEN_FOR_TESTS'] ??= '1';

export default defineConfig({
  globalSetup: './tests/e2e/global-setup.ts',
  testDir: 'tests/e2e',
  // A computer on a build server is slower than a desk one, and several tests start the app more than once.
  timeout: process.env['CI'] ? (process.platform === 'win32' ? 150_000 : 60_000) : 30_000,
  retries: 0,
  reporter: 'list',
  workers: 1,
});
