import type { DayActivity, Item } from '../store/types';
import type { TrafficStatus } from '../signals/traffic';

// The link to the family's own Apple Watch and Apple TV. An adult turns it on in Parent Mode, Access. Nothing here
// goes to the internet: the watch is reached over Bluetooth, and the television over the home network, and only if it
// gives the code the adult typed in. What is sent is what a person across the room could be shown anyway: the
// Favourites, today's plan, the traffic light and which page is open. Never what the child has said or typed.

export type LinkMessage = { type: string; [key: string]: unknown };

/** The pages another device may ask this one to open. Never Parent Mode or School Mode, and nothing that speaks. */
export const OPENABLE_SCREENS = [
  'talk',
  'keyboard',
  'myday',
  'mypages',
  'firstthen',
  'game',
  'draw',
  'body',
  'music',
  'traffic',
  'feelings',
  'favourites',
] as const;
export type OpenableScreen = (typeof OPENABLE_SCREENS)[number];

export type LinkCommand = { kind: 'open'; screen: OpenableScreen } | { kind: 'traffic'; status: TrafficStatus };

const TRAFFIC_VALUES: readonly string[] = ['off', 'red', 'amber', 'green'];

/** What another device has asked for, or nothing if the message is not one this app understands. */
export function parseCommand(message: LinkMessage): LinkCommand | null {
  if (message.type === 'open' && typeof message['screen'] === 'string') {
    const screen = (OPENABLE_SCREENS as readonly string[]).includes(message['screen'])
      ? (message['screen'] as OpenableScreen)
      : null;
    return screen ? { kind: 'open', screen } : null;
  }
  if (message.type === 'traffic' && typeof message['status'] === 'string' && TRAFFIC_VALUES.includes(message['status'])) {
    return { kind: 'traffic', status: message['status'] as TrafficStatus };
  }
  return null;
}

const MAX_FAVOURITES = 30;
const MAX_ACTIVITIES = 12;

export type LinkStateInput = {
  screen: string;
  traffic: TrafficStatus;
  plan: DayActivity[];
  favourites: Item[];
};

const hexNumber = (colour: string | undefined): number => {
  const value = Number.parseInt((colour ?? '').replace('#', ''), 16);
  return Number.isFinite(value) ? value : 0xfef08a;
};

/** What this device tells the others, built from what is already on its own screen. */
export function buildLinkState(input: LinkStateInput): LinkMessage {
  const unfinished = input.plan.filter((activity) => !activity.finished);
  return {
    type: 'state',
    screen: input.screen,
    traffic: input.traffic,
    now: unfinished[0]?.name ?? null,
    next: unfinished[1]?.name ?? null,
    today: input.plan.slice(0, MAX_ACTIVITIES).map((activity) => ({
      name: activity.name,
      time: activity.time ?? null,
      done: activity.finished === true,
    })),
    favourites: input.favourites.slice(0, MAX_FAVOURITES).map((item) => ({
      id: item.id,
      label: item.label,
      spoken: item.vocalization ?? item.label,
      emoji: item.image?.kind === 'emoji' ? item.image.char : '',
      colour: hexNumber(item.background_color),
    })),
  };
}

const POLL_MS = 500;
const SEND_QUIET_MS = 400;

export type LinkSession = {
  /** Tells the other devices the latest. Several in quick succession are sent as one. */
  publish: (state: LinkMessage) => void;
  stop: () => void;
};

/**
 * Starts the link with a code, hands each valid request from another device to `onCommand`, and reports how many
 * devices are connected. Returns undefined where the device has no link.
 */
export function startLink(
  code: string,
  onCommand: (command: LinkCommand) => void,
  onPeers: (count: number) => void,
): LinkSession | undefined {
  const link = window.myWords?.link;
  if (!link) return undefined;

  let stopped = false;
  let lastPeers = -1;
  let pending: LinkMessage | undefined;
  let sendTimer: number | undefined;

  void link.start(code).catch(() => undefined);

  const poll = (): void => {
    void link
      .inbox()
      .then(({ messages, peers }) => {
        if (stopped) return;
        if (peers !== lastPeers) {
          lastPeers = peers;
          onPeers(peers);
          // Someone has just connected: tell them how things stand.
          if (peers > 0 && pending) void link.send(pending).catch(() => undefined);
        }
        for (const message of messages) {
          const command = parseCommand(message);
          if (command) onCommand(command);
        }
      })
      .catch(() => undefined);
  };
  const pollTimer = window.setInterval(poll, POLL_MS);

  return {
    publish: (state) => {
      pending = state;
      window.clearTimeout(sendTimer);
      sendTimer = window.setTimeout(() => {
        if (!stopped && pending) void link.send(pending).catch(() => undefined);
      }, SEND_QUIET_MS);
    },
    stop: () => {
      stopped = true;
      window.clearInterval(pollTimer);
      window.clearTimeout(sendTimer);
      void link.stop().catch(() => undefined);
    },
  };
}
