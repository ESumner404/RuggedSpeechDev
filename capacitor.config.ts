import type { CapacitorConfig } from '@capacitor/cli';

// The phone and tablet shells (iOS now; Android and Fire OS next) wrap the same
// built page the desktop app shows. Nothing here points at a server: the page
// is read from inside the app, as it is on the desktop (PRINCIPLES.md I1).
const config: CapacitorConfig = {
  appId: 'ruggedspeechaac',
  appName: 'Rugged Speech',
  webDir: 'dist/renderer',
  ios: {
    // The page draws its own edge-to-edge layout and handles the safe areas itself.
    contentInset: 'never',
    // The page scrolls inside itself where it needs to; the web view never bounces.
    scrollEnabled: false,
    allowsLinkPreview: false,
  },
};

export default config;
