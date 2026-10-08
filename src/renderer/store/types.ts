// OBF-shaped data model (PRINCIPLES.md §4). Field names follow Open Board
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
  // when set (docs/build-plan.md Phase 4). Additive to OBF's own shape, in the same
  // spirit as OBF's real-world sound_id extension.
  voiceClipBlobId?: string;
  // Word stage, 1 to 4 (see WORD_STAGES): a word only appears once the
  // active stage reaches it, so vocabulary can be introduced gradually. No
  // stage means "always shown". Its slot stays empty while it is held back,
  // so nothing else moves (invariant I3).
  stage?: WordStage;
  // A focus word an adult or therapist is currently working on. Shown with a
  // static outline, never by moving or animating anything.
  target?: boolean;
};

export const WORD_STAGES = [1, 2, 3, 4] as const;
export type WordStage = (typeof WORD_STAGES)[number];

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

// Communication history (PRINCIPLES.md §2, I2), off by default, capped
// retention, cleared by an explicit press. Every spoken utterance is
// recorded the same way regardless of source; the Help section must never
// be logged any differently (PRINCIPLES.md §6).
export type RecentEntry = {
  id?: number;
  text: string;
  timestamp: number;
};

// Personal phrase bank (docs/build-plan.md Phase 3): saved phrases the user finds
// hard to say. Four fixed slots, not a freeform list.
export type PhraseBankSlotId = 'name' | 'address' | 'usualOrder' | 'registerAnswer';
export type PhraseBank = Record<PhraseBankSlotId, string>;

// Parent Mode (docs/build-plan.md Phase 4). The PIN protects settings and editing,
// it is not device security (PRINCIPLES.md §3). It is kept as a salted hash, not
// as typed. A PIN or code saved by an older version, as plain text, still
// works and is turned into a hash the first time it is used.
export type ParentPinState = {
  pinHash?: { salt: string; hash: string; iterations: number };
  recoveryHash?: { salt: string; hash: string; iterations: number };
  /** Older versions only. */
  pin?: string;
  /** Older versions only. */
  recoveryCode?: string;
};

// School Mode has its own PIN, kept as a salted hash (see store/pinSecurity.ts).
export type SchoolPinState = {
  pinHash: { salt: string; hash: string; iterations: number };
};

// People and Places as first-class records (docs/build-plan.md Phase 4), not just
// board buttons, a person's relationship and associated phrases are data
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

// My Day (docs/build-plan.md Phase 5). One plan per calendar date ("YYYY-MM-DD"),
// built by an adult, read by the child. Ordered by array position, the
// order the adult put them in is the order of the day.
export type DayActivity = {
  id: string;
  name: string;
  image?: ImageRef;
  time?: string; // "HH:MM", 24hr, untimed activities just have none
  countdownMinutes?: 5 | 30 | 60; // how far ahead the countdown window starts
  location?: string;
  person?: string;
  description?: string;
  spokenMessage?: string;
  finished?: boolean;
  // Set by an edit to an already-built activity; cleared once the child's
  // My Day screen has shown and spoken the change once (docs/build-plan.md: "the app
  // can show the old struck through and the new one, and speak...").
  changedFrom?: string;
};

export type DayViewMode = 'today' | 'nowNextLater';

export type DayPlan = {
  date: string; // "YYYY-MM-DD"
  activities: DayActivity[];
};

// Off by default, a visible countdown raises anxiety for some children
// rather than lowering it (docs/build-plan.md Phase 5). Applies across days, not
// per-plan, since it's a property of the child, not the day.
export type DaySettings = {
  view: DayViewMode;
  countdownEnabled: boolean;
};

// Profiles (docs/build-plan.md Phase 6): "Home / School / Grandparents / Hospital",
// same core vocabulary, different pages prioritised. Deliberately does NOT
// touch the Home screen's own tile layout, those positions are load-bearing
// motor memory (PRINCIPLES.md I3) and must never move. What a profile changes is
// only which board Talk opens to by default, an adult/PIN-gated choice, the
// same category of deliberate settings change I3 already allows for grid
// size.
export type Profile = {
  id: string;
  name: string;
  rootBoardId: string;
};

// Press mode (docs/build-plan.md Phase 1): what pressing a board button does. Speaking
// on a press is still a person pressing something (invariant I5), what's
// ruled out is anything speaking without a press.
export type PressMode = 'sentence' | 'speak' | 'both';

// Quick Access (docs/build-plan.md Phase 2): six adult-configurable buttons that sit on
// every screen. Positions only change through an adult's deliberate choice
// in Parent Mode (invariant I3).
export const QUICK_ACCESS_IDS = [
  'home',
  'help',
  'yes',
  'no',
  'favourites',
  'keyboard',
  'talk',
  'myday',
  'mypages',
  'feelings',
  'firstthen',
  'game',
  'draw',
  'body',
  'music',
  'traffic',
  // Spoken straight away, like Yes and No: handy in a classroom.
  'break',
  'question',
  'toilet',
  'finished',
  'again',
] as const;
export type QuickAccessId = (typeof QUICK_ACCESS_IDS)[number];

// My Pages (docs/build-plan.md Phase 1 Home tile; built out later): fully custom pages
// an adult builds from scratch in Parent Mode, separate from the built-in
// Talk board tree. A page is a thin, ordered reference to its own Board
// (PRINCIPLES.md I3 precedent, same shape as Profile.rootBoardId) rather than
// embedding board data here, so a page's board can be edited with the same
// pure boardEditing.ts transforms every other board uses.
export type MyPage = {
  id: string;
  name: string;
  boardId: string;
};

// Access (docs/build-plan.md Phase 7): switch/dwell/keyboard-only operation and visual
// adjustments. Everything defaults off/neutral, nothing here changes
// ordinary touch or mouse behaviour unless an adult turns it on in Parent
// Mode.
export type ScanningMode = 'off' | 'oneSwitchTimed' | 'twoSwitchStepped';
export type ContrastMode = 'off' | 'light' | 'dark';

export type AccessSettings = {
  dwellMs: number; // 0 = off (tap/click activates immediately); else 0-1500
  repeatSuppressMs: number; // 0-2000, minimum gap before the same button can fire again
  scanningMode: ScanningMode;
  scanIntervalMs: number; // auto-advance interval for one-switch timed scanning
  highContrast: ContrastMode;
  textScale: number; // multiplier on base text size, e.g. 1, 1.25, 1.5, 2
  reduceMotion: boolean;
  lowArousalPalette: boolean; // muted variant of the Fitzgerald key colours
};

// Medical info (feature review, Aug 2026): "for children who wander off or
// get lost, a first responder could scan a code to access key
// medical/contact information." Edited in Parent Mode; shown to anyone
// with an explicit press of the always-available Medical Info button, not
// gated behind the PIN, the whole point is a stranger who's found the
// child needs it fast (PRINCIPLES.md §6: "shown only on an explicit press,
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
  // Added later, all optional: a record saved before them still opens.
  medicines?: string;
  equipment?: string;
  eating?: string;
  moving?: string;
  hearingSight?: string;
  communication?: string;
  pain?: string;
  emergencyPlan?: string;
  doctor?: string;
  hospital?: string;
  nhsNumber?: string;
};

// A one-page "About me" for anyone new to supporting this person, a supply
// teacher, a new carer, a relative (communication passport). Written by an
// adult in Parent Mode and read by anyone who presses the About me button;
// no PIN, like Medical Info, because the point is that a stranger can read
// it. Fields are plain sentences, never a diagnosis or a score.
export type AboutMe = {
  preferredName: string;
  howIcommunicate: string;
  whatHelps: string;
  whatIFindHard: string;
  likes: string;
  dislikes: string;
};

// Weekly routine (school timetable or home routine): the activities that
// repeat on a given weekday. Used for any day that has no plan of its own.
export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export type WeeklyRoutine = Record<Weekday, DayActivity[]>;

// Opt-in word counts for a therapist's review: how many times each word was
// pressed on each day, and nothing else. No sentences, no times of day.
// date ("YYYY-MM-DD") -> word -> presses.
export type UsageCounts = Record<string, Record<string, number>>;

// "Say it like this": voices read some names and words wrongly. An adult
// writes the word as it appears and as it should be pronounced, and every
// spoken sentence is adjusted to match. What is shown and what is recorded
// in Recent history stay as written.
export type Pronunciation = { written: string; spoken: string };

/** Whose device this is. All optional, and kept only on this computer. */
export type UserProfile = {
  /** What the person likes to be called. */
  name: string;
  /** What to call the device, such as "Lucy's device". Left blank, it is made from the name. */
  deviceName: string;
  /** A picture for the person, one emoji. */
  emoji: string;
  /** Whole years, or blank. Never used to decide anything on its own. */
  age: string;
  /** Show the device name along the top of the child's screen. */
  showOnScreen: boolean;
};

/** Pictures on the buttons: the drawn symbols that come with the app, or emoji. */
export type SymbolStyle = 'emoji' | 'drawn';
/** What each button shows: its picture and its word, or only one of them. */
export type LabelStyle = 'both' | 'pictures' | 'words';

/** How a built sentence is read out: all together, with clearer gaps, or one word at a time with each word lit as it is said. */
export type SpeakStyle = 'normal' | 'clear' | 'wordByWord';

export type KeyboardLayout = 'qwerty' | 'alphabetical';

// First and Then: a two-step visual support. The first card is what to do
// now, the then card is what comes after it.
export type FirstThenCard = { label: string; emoji: string; photoBlobId?: string };
export type FirstThen = { first: FirstThenCard; then: FirstThenCard; firstDone: boolean };
