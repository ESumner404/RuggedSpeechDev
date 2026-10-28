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
  /** The device can say which of its own accessibility settings are on. */
  deviceAccessibility: boolean;
  /** A short buzz from the device when a button is pressed. */
  haptics: boolean;
  /** Linking with the family's own Apple Watch and Apple TV, over the local link between them. */
  link: boolean;
  /** Songs already stored on the device, in its Music library. */
  music: boolean;
  /** Movies kept on the device, picked from Photos or Files, and played by the device. */
  movies: boolean;
  /** Handing a school pack to nearby devices over the school's wifi. */
  school: boolean;
  /** Opening another app on the same device, from a link an adult has added. */
  apps: boolean;
}

/** Opens another app on this device from a link such as "facetime:". Never a web page: those are refused. */
export interface AppLinksBridge {
  /** Whether an app opened. False when the link is not one that opens an app, or no app on the device handles it. */
  open: (link: string) => Promise<boolean>;
}

/** One-way hand-over of a school pack: a sender (the school's device) to listeners (pupils' devices), with a code. */
export interface SchoolLinkBridge {
  start: (role: 'sender' | 'listener', code: string) => Promise<void>;
  stop: () => Promise<void>;
  /** Sends to every listener that is connected, and says how many. Only a sender can. */
  send: (text: string) => Promise<number>;
  inbox: () => Promise<{ messages: string[]; peers: number }>;
}

/** Movies kept on the device. Copied into the app when chosen, so they play with no internet. Nothing is sent anywhere. */
export interface MovieLibraryBridge {
  pick: (source: 'photos' | 'files') => Promise<Array<{ id: string; title: string; bytes: number; seconds: number }>>;
  play: (id: string) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
}

/**
 * Songs already stored on the device, in its Music library. Only what is on the device is offered and played: a song
 * that is only in the cloud needs the internet, so it is left out. Nothing is copied or sent anywhere.
 */
export interface MusicLibraryBridge {
  access: () => Promise<'granted' | 'denied' | 'restricted' | 'notDetermined'>;
  /** The songs stored on the device: all of them, or of one of the device's playlists, or matching a search. */
  list: (options?: { playlistId?: string; search?: string }) => Promise<Array<{ id: string; title: string; artist: string }>>;
  /** The device's own playlists that have songs stored on the device. */
  playlists: () => Promise<Array<{ id: string; name: string; count: number }>>;
  play: (id: string) => Promise<boolean>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  state: () => Promise<'playing' | 'paused' | 'stopped'>;
}

/** A message passed over the link. Always a plain object with a `type`. */
export interface LinkMessage {
  type: string;
  [key: string]: unknown;
}

/**
 * The link to the family's own Apple Watch and Apple TV: Bluetooth to a paired watch, and the home network
 * (never the internet) to a television that knows the pairing code. Only an adult turns it on.
 */
export interface AppleLinkBridge {
  start: (code: string) => Promise<void>;
  stop: () => Promise<void>;
  send: (message: LinkMessage) => Promise<void>;
  /** What has arrived since the last call, and how many devices are connected. */
  inbox: () => Promise<{ messages: LinkMessage[]; peers: number }>;
}

/** What the device's own accessibility settings say right now. Everything off and a text scale of 1 when nothing is known. */
export interface DeviceAccessibility {
  reduceMotion: boolean;
  /** Increase Contrast. */
  increaseContrast: boolean;
  boldText: boolean;
  /** The device's text size as a multiplier, 1 being the usual size. */
  textScale: number;
  voiceOver: boolean;
  switchControl: boolean;
  /** Guided Access is holding the device in this app. */
  guidedAccess: boolean;
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
  /** The device's own accessibility settings. Absent where the page cannot ask. */
  deviceAccessibility?: () => Promise<DeviceAccessibility>;
  /** A short buzz. Absent on devices without one. */
  haptic?: () => Promise<void>;
  /** The link to a watch and a television. Absent where there is none. */
  link?: AppleLinkBridge;
  /** The device's own Music library. Absent where there is none. */
  music?: MusicLibraryBridge;
  /** Movies kept on the device. Absent where there are none. */
  movies?: MovieLibraryBridge;
  /** Opening other apps on this device. Absent where the page cannot. */
  apps?: AppLinksBridge;
  /** One-way school pack hand-over. Absent where there is none. */
  school?: SchoolLinkBridge;
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
