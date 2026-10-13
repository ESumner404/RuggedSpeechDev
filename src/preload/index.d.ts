/**
 * What this build of the app can do. Absent on the desktop app, where
 * everything is available. A phone or tablet shell says what it cannot do, so
 * the page hides the control instead of showing a switch that does nothing.
 */
export interface PlatformCapabilities {
  /** A window that can be taken in and out of fullscreen. */
  fullscreen: boolean;
  /** Opening by itself when the device starts. */
  startup: boolean;
}

export interface MyWordsBridge {
  versions: {
    app: string;
  };
  /** Which shell the page is running in. Absent on the desktop app. */
  platform?: 'ios';
  capabilities?: PlatformCapabilities;
  /** Prints the page. Absent where the page can simply call window.print(). */
  print?: () => Promise<void>;
  parentMode: {
    setFullscreen: (value: boolean) => Promise<void>;
    isFullscreen: () => Promise<boolean>;
  };
  backup: {
    save: (data: string) => Promise<{ ok: true } | { ok: false }>;
    restore: () => Promise<{ ok: true; data: string } | { ok: false }>;
  };
  files: {
    save: (
      data: string,
      options: { suggestedName: string; filterName: string; extensions: string[] },
    ) => Promise<{ ok: true } | { ok: false }>;
    open: (options: { filterName: string; extensions: string[] }) => Promise<{ ok: true; data: string } | { ok: false }>;
  };
  startup: {
    getOpenAtLogin: () => Promise<boolean>;
    setOpenAtLogin: (value: boolean) => Promise<void>;
  };
}

declare global {
  interface Window {
    myWords: MyWordsBridge;
  }
}
