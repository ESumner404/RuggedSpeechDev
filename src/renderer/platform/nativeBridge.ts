// The phone and tablet shells (iOS now; Android and Fire OS next) run this same
// page inside a native app. The page only ever talks to `window.myWords`, the
// same narrow bridge the desktop app's preload script provides, so the shell
// has to provide it too. This file builds it from a small native plugin that
// shows the share sheet, the document picker and the print sheet, reports the
// app's version, tells the page which of the device's accessibility settings
// are on, and gives a short buzz. Nothing else crosses over.

type Bridge = Window['myWords'];

/** What the native plugin offers. Matches `RuggedNativePlugin.swift`. */
export interface NativeShell {
  info: () => Promise<{ version: string }>;
  saveFile: (options: { data: string; name: string }) => Promise<{ ok: boolean }>;
  openFile: (options: { extensions: string[] }) => Promise<{ ok: boolean; data?: string }>;
  printPage: () => Promise<void>;
  accessibility: () => Promise<DeviceAccessibility>;
  haptic: () => Promise<void>;
}

export type DeviceAccessibility = Awaited<ReturnType<NonNullable<Window['myWords']['deviceAccessibility']>>>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Builds the page's bridge from the native plugin. Plain and synchronous so it can be tested without a phone. */
export function buildNativeBridge(shell: NativeShell, platform: 'ios', version: string): Bridge {
  const saved = (ok: boolean): { ok: true } | { ok: false } => (ok ? { ok: true } : { ok: false });
  const opened = (result: { ok: boolean; data?: string }): { ok: true; data: string } | { ok: false } =>
    result.ok && typeof result.data === 'string' ? { ok: true, data: result.data } : { ok: false };

  return {
    versions: { app: version },
    platform,
    // A phone or tablet app is always full screen, and starts only when it is opened.
    capabilities: { fullscreen: false, startup: false, deviceAccessibility: true, haptics: true },
    parentMode: {
      setFullscreen: async () => undefined,
      isFullscreen: async () => true,
    },
    backup: {
      save: async (data) => {
        try {
          return saved((await shell.saveFile({ data, name: `rugged-speech-backup-${today()}.mwbackup` })).ok);
        } catch {
          return { ok: false };
        }
      },
      restore: async () => {
        try {
          return opened(await shell.openFile({ extensions: ['mwbackup'] }));
        } catch {
          return { ok: false };
        }
      },
    },
    files: {
      save: async (data, options) => {
        try {
          return saved((await shell.saveFile({ data, name: options.suggestedName })).ok);
        } catch {
          return { ok: false };
        }
      },
      open: async (options) => {
        try {
          return opened(await shell.openFile({ extensions: options.extensions }));
        } catch {
          return { ok: false };
        }
      },
    },
    startup: {
      getOpenAtLogin: async () => false,
      setOpenAtLogin: async () => undefined,
    },
    print: () => shell.printPage(),
    deviceAccessibility: () => shell.accessibility(),
    haptic: () => shell.haptic(),
  };
}

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
}

/** Whether the page is running inside a Capacitor shell, and which one. Undefined on the desktop and in a browser. */
export function nativePlatform(): 'ios' | undefined {
  const capacitor = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  if (!capacitor?.isNativePlatform?.()) return undefined;
  return capacitor.getPlatform?.() === 'ios' ? 'ios' : undefined;
}

/**
 * Makes `window.myWords` when the page is running in a native shell. Does
 * nothing on the desktop, where the preload script already provided it.
 */
export async function installNativeBridge(): Promise<void> {
  if (window.myWords) return;
  const platform = nativePlatform();
  if (!platform) return;
  const { registerPlugin } = await import('@capacitor/core');
  const shell = registerPlugin<NativeShell>('RuggedNative');
  let version = '0.0.0';
  try {
    version = (await shell.info()).version;
  } catch {
    // The version is only a label; the page works without it.
  }
  window.myWords = buildNativeBridge(shell, platform, version);
  document.documentElement.dataset['platform'] = platform;
}
