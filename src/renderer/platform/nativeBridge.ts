// The phone and tablet shells (iOS now; Android and Fire OS next) run this same
// page inside a native app. The page only ever talks to `window.myWords`, the
// same narrow bridge the desktop app's preload script provides, so the shell
// has to provide it too. This file builds it from a small native plugin that
// shows the share sheet, the document picker and the print sheet, reports the
// app's version, tells the page which of the device's accessibility settings
// are on, and gives a short buzz. Nothing else crosses over.

import { isAppLink } from '../../shared/appLink';

type Bridge = Window['myWords'];

/** What the native plugin offers. Matches `RuggedNativePlugin.swift`. */
export interface NativeShell {
  info: () => Promise<{ version: string }>;
  saveFile: (options: { data: string; name: string }) => Promise<{ ok: boolean }>;
  openFile: (options: { extensions: string[] }) => Promise<{ ok: boolean; data?: string }>;
  printPage: () => Promise<void>;
  accessibility: () => Promise<DeviceAccessibility>;
  haptic: () => Promise<void>;
  linkStart: (options: { code: string }) => Promise<void>;
  linkStop: () => Promise<void>;
  linkSend: (options: { json: string }) => Promise<void>;
  linkInbox: () => Promise<{ messages: string[]; peers: number }>;
  musicAccess: () => Promise<{ status: 'granted' | 'denied' | 'restricted' | 'notDetermined' }>;
  musicList: (options: { playlistId?: string; search?: string }) => Promise<{ songs: Array<{ id: string; title: string; artist: string }> }>;
  musicPlaylists: () => Promise<{ playlists: Array<{ id: string; name: string; count: number }> }>;
  musicPlay: (options: { id: string }) => Promise<{ ok: boolean }>;
  musicPause: () => Promise<void>;
  musicResume: () => Promise<void>;
  musicStop: () => Promise<void>;
  musicState: () => Promise<{ state: 'playing' | 'paused' | 'stopped' }>;
  schoolStart: (options: { role: 'sender' | 'listener'; code: string }) => Promise<void>;
  schoolStop: () => Promise<void>;
  schoolSend: (options: { json: string }) => Promise<{ sent: number }>;
  schoolInbox: () => Promise<{ messages: string[]; peers: number }>;
  moviePick: (options: { source: 'photos' | 'files' }) => Promise<{ movies: Array<{ id: string; title: string; bytes: number; seconds: number }> }>;
  moviePlay: (options: { id: string }) => Promise<{ ok: boolean }>;
  movieRemove: (options: { id: string }) => Promise<void>;
  appOpen: (options: { link: string }) => Promise<{ ok: boolean }>;
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
    capabilities: { fullscreen: false, startup: false, deviceAccessibility: true, haptics: true, link: true, music: true, movies: true, school: true, apps: true },
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
    school: {
      start: (role, code) => shell.schoolStart({ role, code }),
      stop: () => shell.schoolStop(),
      send: async (text) => (await shell.schoolSend({ json: text })).sent,
      inbox: () => shell.schoolInbox(),
    },
    apps: {
      open: async (link) => {
        if (!isAppLink(link)) return false;
        try {
          return (await shell.appOpen({ link: link.trim() })).ok;
        } catch {
          return false;
        }
      },
    },
    movies: {
      pick: async (source) => (await shell.moviePick({ source })).movies,
      play: async (id) => (await shell.moviePlay({ id })).ok,
      remove: (id) => shell.movieRemove({ id }),
    },
    music: {
      access: async () => (await shell.musicAccess()).status,
      list: async (options = {}) => (await shell.musicList(options)).songs,
      playlists: async () => (await shell.musicPlaylists()).playlists,
      play: async (id) => (await shell.musicPlay({ id })).ok,
      pause: () => shell.musicPause(),
      resume: () => shell.musicResume(),
      stop: () => shell.musicStop(),
      state: async () => (await shell.musicState()).state,
    },
    link: {
      start: (code) => shell.linkStart({ code }),
      stop: () => shell.linkStop(),
      send: (message) => shell.linkSend({ json: JSON.stringify(message) }),
      inbox: async () => {
        const { messages, peers } = await shell.linkInbox();
        const parsed: Array<{ type: string; [key: string]: unknown }> = [];
        for (const raw of messages) {
          try {
            const value: unknown = JSON.parse(raw);
            if (typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string') {
              parsed.push(value as { type: string });
            }
          } catch {
            // Not a message this app understands; ignore it.
          }
        }
        return { messages: parsed, peers };
      },
    },
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
