// OBF-shaped data model (CLAUDE.md §4). Field names follow Open Board
// Format where OBF has one, so a board can move to and from other open AAC
// tooling without translation.

export type ImageRef =
  | { kind: 'emoji'; char: string }
  | { kind: 'symbol'; set: 'mulberry' | 'arasaac' | 'openmoji'; name: string }
  | { kind: 'photo'; blobId: string };

export type Item = {
  id: string;
  label: string;
  vocalization?: string;
  image?: ImageRef;
  background_color?: string;
  load_board?: { id: string };
  hidden?: boolean;
  // A familiar person's recorded voice, played instead of the synthesiser
  // when set (PLAN.md Phase 4). Additive to OBF's own shape, in the same
  // spirit as OBF's real-world sound_id extension.
  voiceClipBlobId?: string;
};

export const VALID_GRID_SIZES = [2, 3, 4, 5] as const;
export type GridSize = (typeof VALID_GRID_SIZES)[number];

export type Board = {
  id: string;
  name: string;
  grid: {
    rows: GridSize;
    columns: GridSize;
    order: (string | null)[][];
  };
  buttons: Item[];
};

// Communication history (CLAUDE.md §2, I2) — off by default, capped
// retention, cleared by an explicit press. Every spoken utterance is
// recorded the same way regardless of source; the Help section must never
// be logged any differently (CLAUDE.md §6).
export type RecentEntry = {
  id?: number;
  text: string;
  timestamp: number;
};

// Personal phrase bank (PLAN.md Phase 3): saved phrases the user finds
// hard to say. Four fixed slots, not a freeform list.
export type PhraseBankSlotId = 'name' | 'address' | 'usualOrder' | 'registerAnswer';
export type PhraseBank = Record<PhraseBankSlotId, string>;

// Parent Mode (PLAN.md Phase 4). The PIN protects settings and editing —
// it is not device security (CLAUDE.md §3) — so this is stored as plain
// text, same as everything else in this local, unencrypted database.
export type ParentPinState = {
  pin: string;
  recoveryCode: string;
};

// People and Places as first-class records (PLAN.md Phase 4), not just
// board buttons — a person's relationship and associated phrases are data
// worth keeping even if the button representing them gets edited or moved.
// Feeds Phase 5's My Day too.
export type PersonRecord = {
  id: string;
  name: string;
  relationship?: string;
  photoBlobId?: string;
  voiceClipBlobId?: string;
  phrases: string[];
};

export type PlaceRecord = {
  id: string;
  name: string;
  photoBlobId?: string;
  voiceClipBlobId?: string;
  phrases: string[];
};

// My Day (PLAN.md Phase 5). One plan per calendar date ("YYYY-MM-DD"),
// built by an adult, read by the child. Ordered by array position — the
// order the adult put them in is the order of the day.
export type DayActivity = {
  id: string;
  name: string;
  image?: ImageRef;
  time?: string; // "HH:MM", 24hr — untimed activities just have none
  countdownMinutes?: 5 | 30 | 60; // how far ahead the countdown window starts
  location?: string;
  person?: string;
  description?: string;
  spokenMessage?: string;
  finished?: boolean;
  // Set by an edit to an already-built activity; cleared once the child's
  // My Day screen has shown and spoken the change once (PLAN.md: "the app
  // can show the old struck through and the new one, and speak...").
  changedFrom?: string;
};

export type DayViewMode = 'today' | 'nowNextLater';

export type DayPlan = {
  date: string; // "YYYY-MM-DD"
  activities: DayActivity[];
};

// Off by default — a visible countdown raises anxiety for some children
// rather than lowering it (PLAN.md Phase 5). Applies across days, not
// per-plan, since it's a property of the child, not the day.
export type DaySettings = {
  view: DayViewMode;
  countdownEnabled: boolean;
};

// Profiles (PLAN.md Phase 6): "Home / School / Grandparents / Hospital",
// same core vocabulary, different pages prioritised. Deliberately does NOT
// touch the Home screen's own tile layout — those positions are load-bearing
// motor memory (CLAUDE.md I3) and must never move. What a profile changes is
// only which board Talk opens to by default, an adult/PIN-gated choice, the
// same category of deliberate settings change I3 already allows for grid
// size.
export type Profile = {
  id: string;
  name: string;
  rootBoardId: string;
};

// My Pages (PLAN.md Phase 1 Home tile; built out later): fully custom pages
// an adult builds from scratch in Parent Mode, separate from the built-in
// Talk board tree. A page is a thin, ordered reference to its own Board
// (CLAUDE.md I3 precedent, same shape as Profile.rootBoardId) rather than
// embedding board data here, so a page's board can be edited with the same
// pure boardEditing.ts transforms every other board uses.
export type MyPage = {
  id: string;
  name: string;
  boardId: string;
};

// Access (PLAN.md Phase 7): switch/dwell/keyboard-only operation and visual
// adjustments. Everything defaults off/neutral — nothing here changes
// ordinary touch or mouse behaviour unless an adult turns it on in Parent
// Mode.
export type ScanningMode = 'off' | 'oneSwitchTimed' | 'twoSwitchStepped';
export type ContrastMode = 'off' | 'light' | 'dark';

export type AccessSettings = {
  dwellMs: number; // 0 = off (tap/click activates immediately); else 0-1500
  repeatSuppressMs: number; // 0-2000 — minimum gap before the same button can fire again
  scanningMode: ScanningMode;
  scanIntervalMs: number; // auto-advance interval for one-switch timed scanning
  highContrast: ContrastMode;
  textScale: number; // multiplier on base text size, e.g. 1, 1.25, 1.5, 2
  reduceMotion: boolean;
  lowArousalPalette: boolean; // muted variant of the Fitzgerald key colours
};

// Medical info (feature review, Aug 2026): "for children who wander off or
// get lost — a first responder could scan a code to access key
// medical/contact information." Edited in Parent Mode; shown to anyone
// with an explicit press of the always-available Medical Info button, not
// gated behind the PIN — the whole point is a stranger who's found the
// child needs it fast (CLAUDE.md §6: "shown only on an explicit press,
// never on an idle screen a stranger could read" is about idle visibility,
// not authentication).
export type MedicalContact = {
  name: string;
  phone: string;
};

export type MedicalInfo = {
  childName: string;
  allergies: string;
  conditions: string;
  contacts: MedicalContact[];
};
