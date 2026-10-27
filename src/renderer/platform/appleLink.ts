import type { AccessSettings, Board, DayActivity, Item, LabelStyle, PressMode } from '../store/types';
import type { TrafficStatus } from '../signals/traffic';
import { isItemShown } from '../board/visibility';

// The link to the family's own Apple Watch and Apple TV. An adult turns it on in Parent Mode, Access. Nothing here
// goes to the internet: the watch is reached over Bluetooth, and the television over the home network, and only if it
// gives the code the adult typed in. What is sent is what a person across the room could be shown anyway: the
// Favourites, today's plan, the traffic light, which page is open, and (to the television only) the words on the
// boards and how the app is set up, so the television says the same words in the same places. What the child is saying
// or has said is sent only if an adult separately turned that on.

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

/** What the television asks the iPad to show while a game is on: a prompt and a few big buttons, always in this order. */
export type ControllerSpec = {
  game: string;
  prompt: string;
  buttons: Array<{ id: string; label: string; emoji: string; colour: number }>;
  /** Whether the iPad's person has the turn, so the buttons are for them. */
  yourTurn: boolean;
};

export type LinkCommand =
  | { kind: 'open'; screen: OpenableScreen }
  | { kind: 'controller'; spec: ControllerSpec | null }
  | { kind: 'traffic'; status: TrafficStatus }
  | { kind: 'sync' };

const TRAFFIC_VALUES: readonly string[] = ['off', 'red', 'amber', 'green'];

/** What another device has asked for, or nothing if the message is not one this app understands. */
const text = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.length <= max ? value : null;

/** The buttons the television wants shown, or null if the message is not a sensible one. An empty set means "the game is over". */
function parseController(message: LinkMessage): ControllerSpec | null | undefined {
  const raw = message['buttons'];
  if (!Array.isArray(raw)) return undefined;
  if (raw.length === 0) return null;
  if (raw.length > 8) return undefined;
  const buttons: ControllerSpec['buttons'] = [];
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) return undefined;
    const button = entry as Record<string, unknown>;
    const id = text(button['id'], 24);
    const label = text(button['label'], 40);
    if (!id || label === null) return undefined;
    buttons.push({
      id,
      label,
      emoji: text(button['emoji'], 8) ?? '',
      colour: typeof button['colour'] === 'number' ? button['colour'] : 0xe5e7eb,
    });
  }
  const game = text(message['game'], 24);
  const prompt = text(message['prompt'], 160);
  if (!game || prompt === null) return undefined;
  return { game, prompt, buttons, yourTurn: message['yourTurn'] !== false };
}

export function parseCommand(message: LinkMessage): LinkCommand | null {
  if (message.type === 'controller') {
    const spec = parseController(message);
    return spec === undefined ? null : { kind: 'controller', spec };
  }
  if (message.type === 'open' && typeof message['screen'] === 'string') {
    const screen = (OPENABLE_SCREENS as readonly string[]).includes(message['screen'])
      ? (message['screen'] as OpenableScreen)
      : null;
    return screen ? { kind: 'open', screen } : null;
  }
  if (message.type === 'sync-request') return { kind: 'sync' };
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

export type SyncInput = {
  deviceName: string;
  rootBoardId: string;
  boards: Board[];
  wordStage: number;
  speech: { rate: number; pitch: number; volume: number };
  pronunciations: Array<{ written: string; spoken: string }>;
  labelStyle: LabelStyle;
  pressMode: PressMode;
  clearAfterSpeak: boolean;
  access: Pick<AccessSettings, 'textScale' | 'highContrast' | 'lowArousalPalette'>;
};

const MAX_BOARDS = 24;
const MAX_ITEMS_PER_BOARD = 40;

/**
 * The words on the boards, and how the app is set up, for the television. A word an adult has hidden (or that is not
 * yet in this word stage) is an empty place, so every other word is still where it was. A photo button is sent as its
 * label alone, because a photo stays on the device.
 */
export function buildSyncMessage(input: SyncInput): LinkMessage {
  return {
    type: 'sync',
    device: input.deviceName.slice(0, 60),
    root: input.rootBoardId,
    boards: input.boards.slice(0, MAX_BOARDS).map((board) => {
      const shown = board.buttons.filter((item) => isItemShown(item, input.wordStage)).slice(0, MAX_ITEMS_PER_BOARD);
      const ids = new Set(shown.map((item) => item.id));
      return {
        id: board.id,
        name: board.name,
        rows: board.grid.rows,
        columns: board.grid.columns,
        order: board.grid.order.map((row) => row.map((cell) => (cell && ids.has(cell) ? cell : null))),
        items: shown.map((item) => ({
          id: item.id,
          label: item.label,
          spoken: item.vocalization ?? item.label,
          emoji: item.image?.kind === 'emoji' ? item.image.char : '',
          colour: hexNumber(item.background_color),
          opens: item.load_board?.id ?? null,
        })),
      };
    }),
    speech: {
      rate: input.speech.rate,
      pitch: input.speech.pitch,
      volume: input.speech.volume,
    },
    pronunciations: input.pronunciations
      .filter((entry) => entry.written.trim() && entry.spoken.trim())
      .slice(0, 100)
      .map((entry) => ({ written: entry.written.slice(0, 60), spoken: entry.spoken.slice(0, 60) })),
    look: {
      labels: input.labelStyle,
      lowArousal: input.access.lowArousalPalette,
      textScale: input.access.textScale,
      contrast: input.access.highContrast,
    },
    press: input.pressMode,
    clearAfterSpeak: input.clearAfterSpeak,
  };
}

/** The sentence being built and the last thing said, for the television, only if an adult turned that on. */
export function buildSentenceMessage(words: string[], said: string | null): LinkMessage {
  return { type: 'sentence', words: words.slice(0, 40).map((word) => word.slice(0, 60)), said: said ? said.slice(0, 400) : null };
}

const POLL_MS = 500;
const SEND_QUIET_MS = 400;

export type LinkSession = {
  /** Tells the other devices the latest of this kind of message. Several in quick succession are sent as one. */
  publish: (message: LinkMessage) => void;
  /** Sends everything last published again, for a device that has asked. */
  resend: () => void;
  /** Sends one message straight away, such as a press on the controller. */
  sendNow: (message: LinkMessage) => void;
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
  const pending = new Map<string, LinkMessage>();
  const timers = new Map<string, number>();

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
          if (peers > 0) for (const message of pending.values()) void link.send(message).catch(() => undefined);
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
    publish: (message) => {
      // Each kind of message is kept and sent on its own, so a change to one does not hold up another.
      pending.set(message.type, message);
      window.clearTimeout(timers.get(message.type));
      timers.set(
        message.type,
        window.setTimeout(() => {
          const latest = pending.get(message.type);
          if (!stopped && latest) void link.send(latest).catch(() => undefined);
        }, SEND_QUIET_MS),
      );
    },
    sendNow: (message) => {
      if (!stopped) void link.send(message).catch(() => undefined);
    },
    resend: () => {
      for (const message of pending.values()) void link.send(message).catch(() => undefined);
    },
    stop: () => {
      stopped = true;
      window.clearInterval(pollTimer);
      for (const timer of timers.values()) window.clearTimeout(timer);
      void link.stop().catch(() => undefined);
    },
  };
}
