export interface MyWordsBridge {
  versions: {
    app: string;
  };
  parentMode: {
    setFullscreen: (value: boolean) => Promise<void>;
    isFullscreen: () => Promise<boolean>;
  };
  backup: {
    save: (data: string) => Promise<{ ok: true } | { ok: false }>;
    restore: () => Promise<{ ok: true; data: string } | { ok: false }>;
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
