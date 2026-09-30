import { signal } from '@preact/signals';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import {
  FEELINGS_BOARD_ID,
  PEOPLE_BOARD_ID,
  ROOT_BOARD_ID,
  SCHOOL_BOARD_ID,
  STARTER_BOARDS,
} from '../vocab/starter';
import type {
  AccessSettings,
  Board,
  DayPlan,
  DaySettings,
  GridSize,
  Item,
  MedicalInfo,
  MyPage,
  ParentPinState,
  PersonRecord,
  PhraseBank,
  PhraseBankSlotId,
  PlaceRecord,
  Profile,
  RecentEntry,
} from './types';

// Bumped on every write to the recent-history store. A page displaying
// that history (FavouritesScreen) reads this in its render body to
// subscribe, so it refreshes even when an utterance is recorded elsewhere
// (e.g. Quick Access's Yes/No) while it's already on screen — a tab-change
// effect alone wouldn't catch that.
export const recentVersion = signal(0);

// Bumped on every write to a day plan — lets the child's My Day screen
// react immediately to an adult's edit made in Parent Mode's Day Builder
// while that screen is already open, which is what "change of plan"
// (PLAN.md Phase 5) actually needs: the announcement has to happen as soon
// as the edit is saved, not the next time the screen happens to remount.
export const dayPlanVersion = signal(0);

// Bumped when the active profile changes, so any screen showing "which
// profile is this" can react without a remount.
export const activeProfileVersion = signal(0);

// Bumped when Access settings change, so a Grid already on screen picks up
// a new dwell time, scanning mode, or palette immediately rather than only
// on its next mount.
export const accessSettingsVersion = signal(0);

// Bumped whenever a My Page is created, renamed, or deleted, so the child
// screen's page list stays in step with an edit made in Parent Mode while
// it's already open.
export const myPagesVersion = signal(0);

interface MyWordsDB extends DBSchema {
  boards: {
    key: string;
    value: Board;
  };
  meta: {
    key: string;
    value: unknown;
  };
  favourites: {
    key: string;
    value: Item;
  };
  recent: {
    key: number;
    value: RecentEntry;
  };
  photos: {
    key: string;
    value: Blob;
  };
  voiceClips: {
    key: string;
    value: Blob;
  };
  people: {
    key: string;
    value: PersonRecord;
  };
  places: {
    key: string;
    value: PlaceRecord;
  };
  dayPlans: {
    key: string; // the plan's own "YYYY-MM-DD" date string
    value: DayPlan;
  };
  profiles: {
    key: string;
    value: Profile;
  };
}

export const DB_VERSION = 5;

let dbPromise: Promise<IDBPDatabase<MyWordsDB>> | null = null;

function openMyWordsDB(): Promise<IDBPDatabase<MyWordsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MyWordsDB>('my-words', DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('boards', { keyPath: 'id' });
          db.createObjectStore('meta');
        }
        if (oldVersion < 2) {
          db.createObjectStore('favourites', { keyPath: 'id' });
          db.createObjectStore('recent', { keyPath: 'id', autoIncrement: true });
        }
        if (oldVersion < 3) {
          db.createObjectStore('photos');
          db.createObjectStore('voiceClips');
          db.createObjectStore('people', { keyPath: 'id' });
          db.createObjectStore('places', { keyPath: 'id' });
        }
        if (oldVersion < 4) {
          db.createObjectStore('dayPlans', { keyPath: 'date' });
        }
        if (oldVersion < 5) {
          db.createObjectStore('profiles', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

const DEFAULT_FAVOURITE_IDS = ['i', 'want', 'like', 'more', 'help', 'yes', 'no'];

/** Seeds the starter vocabulary and default favourites on first run only. */
export async function ensureSeeded(): Promise<void> {
  const db = await openMyWordsDB();
  const alreadySeeded = await db.get('meta', 'seeded');
  if (alreadySeeded) return;

  const boardsTx = db.transaction('boards', 'readwrite');
  await Promise.all(STARTER_BOARDS.map((board) => boardsTx.store.put(board)));
  await boardsTx.done;

  const rootBoard = STARTER_BOARDS.find((board) => board.id === ROOT_BOARD_ID);
  const favouriteItems = DEFAULT_FAVOURITE_IDS.map((id) =>
    rootBoard?.buttons.find((button) => button.id === id),
  ).filter((item): item is Item => Boolean(item));
  const favTx = db.transaction('favourites', 'readwrite');
  await Promise.all(favouriteItems.map((item) => favTx.store.put(item)));
  await favTx.done;

  await db.put('meta', true, 'seeded');
}

const DEFAULT_PROFILES: Profile[] = [
  { id: 'home', name: 'Home', rootBoardId: ROOT_BOARD_ID },
  { id: 'school', name: 'School', rootBoardId: SCHOOL_BOARD_ID },
  { id: 'grandparents', name: 'Grandparents', rootBoardId: PEOPLE_BOARD_ID },
  { id: 'hospital', name: 'Hospital', rootBoardId: FEELINGS_BOARD_ID },
];
const DEFAULT_PROFILE_ID = 'home';

/** Seeds the four named profiles on first run only — separate from
 * ensureSeeded's own gate so it also backfills correctly on a database that
 * was seeded before profiles existed. */
async function ensureProfilesSeeded(): Promise<void> {
  const db = await openMyWordsDB();
  const count = await db.count('profiles');
  if (count > 0) return;
  const tx = db.transaction('profiles', 'readwrite');
  await Promise.all(DEFAULT_PROFILES.map((profile) => tx.store.put(profile)));
  await tx.done;
}

export async function getProfiles(): Promise<Profile[]> {
  await ensureProfilesSeeded();
  const db = await openMyWordsDB();
  return db.getAll('profiles');
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('profiles', profile);
}

export async function getActiveProfileId(): Promise<string> {
  const db = await openMyWordsDB();
  return ((await db.get('meta', 'activeProfileId')) as string | undefined) ?? DEFAULT_PROFILE_ID;
}

export async function setActiveProfileId(id: string): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', id, 'activeProfileId');
  activeProfileVersion.value += 1;
}

/** Falls back to the Home default if the stored active profile was since
 * deleted — Talk must always have somewhere to open. */
export async function getActiveProfile(): Promise<Profile> {
  await ensureProfilesSeeded();
  const [profiles, activeId] = await Promise.all([getProfiles(), getActiveProfileId()]);
  return (
    profiles.find((profile) => profile.id === activeId) ??
    profiles.find((profile) => profile.id === DEFAULT_PROFILE_ID) ?? {
      id: DEFAULT_PROFILE_ID,
      name: 'Home',
      rootBoardId: ROOT_BOARD_ID,
    }
  );
}

// Every read below ensures seeding itself, rather than relying on
// whichever screen happens to mount first (originally only TalkScreen
// did this — Parent Mode or Favourites reached directly from Home would
// otherwise see an empty board list on a brand new install).

export async function getBoard(id: string): Promise<Board | undefined> {
  await ensureSeeded();
  const db = await openMyWordsDB();
  return db.get('boards', id);
}

export async function getRootBoard(): Promise<Board | undefined> {
  return getBoard(ROOT_BOARD_ID);
}

export async function getAllBoards(): Promise<Board[]> {
  await ensureSeeded();
  const db = await openMyWordsDB();
  return db.getAll('boards');
}

export async function updateBoard(board: Board): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('boards', board);
}

function emptyGridOrder(rows: GridSize, columns: GridSize): (string | null)[][] {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => null));
}

const MY_PAGES_GRID_SIZE: GridSize = 3;

/** My Pages (fully custom pages, built from scratch in Parent Mode — feature
 * review follow-up, Sep 2026). Stored as a small ordered list in `meta`,
 * the same pattern as other adult-facing settings that are a list of
 * records rather than a single value; each page's actual content lives in
 * its own row in the `boards` store, referenced by id, so it can be edited
 * with the same pure boardEditing.ts transforms as any other board. */
export async function getMyPages(): Promise<MyPage[]> {
  const db = await openMyWordsDB();
  return ((await db.get('meta', 'myPages')) as MyPage[] | undefined) ?? [];
}

async function saveMyPages(pages: MyPage[]): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', pages, 'myPages');
  myPagesVersion.value += 1;
}

export async function createMyPage(name: string): Promise<MyPage> {
  const db = await openMyWordsDB();
  const id = randomId();
  const boardId = `mypage-${id}`;
  const board: Board = {
    id: boardId,
    name,
    grid: { rows: MY_PAGES_GRID_SIZE, columns: MY_PAGES_GRID_SIZE, order: emptyGridOrder(MY_PAGES_GRID_SIZE, MY_PAGES_GRID_SIZE) },
    buttons: [],
  };
  await db.put('boards', board);
  const page: MyPage = { id, name, boardId };
  await saveMyPages([...(await getMyPages()), page]);
  return page;
}

export async function renameMyPage(id: string, name: string): Promise<void> {
  const pages = await getMyPages();
  const page = pages.find((candidate) => candidate.id === id);
  if (!page) return;
  await saveMyPages(pages.map((candidate) => (candidate.id === id ? { ...candidate, name } : candidate)));
  const board = await getBoard(page.boardId);
  if (board) await updateBoard({ ...board, name });
}

/** Removes the page's own board too — nothing else ever references it, so
 * leaving it behind would just be an orphaned row a backup file carries
 * forever for no reason. */
export async function deleteMyPage(id: string): Promise<void> {
  const db = await openMyWordsDB();
  const pages = await getMyPages();
  const page = pages.find((candidate) => candidate.id === id);
  if (!page) return;
  await db.delete('boards', page.boardId);
  await saveMyPages(pages.filter((candidate) => candidate.id !== id));
}

export async function getFavourites(): Promise<Item[]> {
  await ensureSeeded();
  const db = await openMyWordsDB();
  return db.getAll('favourites');
}

/** Long-press-to-favourite (feature review, Aug 2026): the same store the
 * seeded defaults live in, so a favourited item just becomes one more row
 * — `put` rather than `add` means favouriting an already-favourited item
 * is harmlessly idempotent. */
export async function saveFavourite(item: Item): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('favourites', item);
}

const RECENT_MAX_ENTRIES = 50;
const RECENT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

export async function isRecentEnabled(): Promise<boolean> {
  const db = await openMyWordsDB();
  return (await db.get('meta', 'recentEnabled')) === true;
}

export async function setRecentEnabled(enabled: boolean): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', enabled, 'recentEnabled');
}

async function pruneRecent(db: IDBPDatabase<MyWordsDB>): Promise<void> {
  const all = await db.getAll('recent');
  const cutoff = Date.now() - RECENT_RETENTION_MS;
  const expired = all.filter((entry) => entry.timestamp < cutoff);
  const fresh = all.filter((entry) => entry.timestamp >= cutoff);
  const overflowCount = fresh.length - RECENT_MAX_ENTRIES;
  const oldestOverflow =
    overflowCount > 0
      ? [...fresh].sort((a, b) => a.timestamp - b.timestamp).slice(0, overflowCount)
      : [];

  const toDelete = [...expired, ...oldestOverflow];
  if (toDelete.length === 0) return;

  const tx = db.transaction('recent', 'readwrite');
  await Promise.all(toDelete.map((entry) => tx.store.delete(entry.id!)));
  await tx.done;
}

/**
 * Records a spoken utterance if — and only if — an adult has switched
 * communication history on (invariant I2, off by default). Every caller
 * goes through this one function so nothing, including the Help section,
 * is ever logged differently from anything else (CLAUDE.md §6).
 */
export async function recordUtteranceIfEnabled(text: string): Promise<void> {
  if (!(await isRecentEnabled())) return;
  const db = await openMyWordsDB();
  await db.add('recent', { text, timestamp: Date.now() });
  await pruneRecent(db);
  recentVersion.value += 1;
}

export async function getRecentEntries(): Promise<RecentEntry[]> {
  const db = await openMyWordsDB();
  const all = await db.getAll('recent');
  // Tie-break on id (insertion order) — two presses inside the same
  // millisecond would otherwise sort arbitrarily on timestamp alone.
  return all.sort((a, b) => b.timestamp - a.timestamp || (b.id ?? 0) - (a.id ?? 0));
}

export async function clearRecent(): Promise<void> {
  const db = await openMyWordsDB();
  await db.clear('recent');
  recentVersion.value += 1;
}

/**
 * Prediction ranking data (PLAN.md Phase 3: "frequency of actual use").
 * Bumped only when a person taps a suggestion — never for ordinary typing,
 * so it can't silently reshape what gets suggested from typing alone.
 */
export async function getWordFrequencies(): Promise<Record<string, number>> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'wordFrequency');
  return (stored as Record<string, number> | undefined) ?? {};
}

export async function incrementWordFrequency(word: string): Promise<void> {
  const db = await openMyWordsDB();
  const key = word.toLowerCase();
  const current = ((await db.get('meta', 'wordFrequency')) as Record<string, number> | undefined) ?? {};
  current[key] = (current[key] ?? 0) + 1;
  await db.put('meta', current, 'wordFrequency');
}

const EMPTY_PHRASE_BANK: PhraseBank = {
  name: '',
  address: '',
  usualOrder: '',
  registerAnswer: '',
};

export async function getPhraseBank(): Promise<PhraseBank> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'phraseBank');
  return { ...EMPTY_PHRASE_BANK, ...((stored as Partial<PhraseBank> | undefined) ?? {}) };
}

export async function setPhraseBankSlot(slot: PhraseBankSlotId, value: string): Promise<void> {
  const db = await openMyWordsDB();
  const current = await getPhraseBank();
  await db.put('meta', { ...current, [slot]: value }, 'phraseBank');
}

/**
 * null means Parent Mode has never been set up on this device — the PIN
 * gate shows setup instead of entry.
 */
export async function getParentPinState(): Promise<ParentPinState | null> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'parentPin');
  return (stored as ParentPinState | undefined) ?? null;
}

export async function setParentPinState(state: ParentPinState): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', state, 'parentPin');
}

function randomId(): string {
  return crypto.randomUUID();
}

/**
 * Stores a photo blob and returns its id — never a filesystem path, so a
 * backup file stays self-contained and survives the source file moving or
 * disappearing (CLAUDE.md §4).
 */
export async function savePhoto(blob: Blob): Promise<string> {
  const db = await openMyWordsDB();
  const id = randomId();
  await db.put('photos', blob, id);
  return id;
}

export async function getPhoto(blobId: string): Promise<Blob | undefined> {
  const db = await openMyWordsDB();
  return db.get('photos', blobId);
}

export async function saveVoiceClip(blob: Blob): Promise<string> {
  const db = await openMyWordsDB();
  const id = randomId();
  await db.put('voiceClips', blob, id);
  return id;
}

export async function getVoiceClip(blobId: string): Promise<Blob | undefined> {
  const db = await openMyWordsDB();
  return db.get('voiceClips', blobId);
}

export async function getPeople(): Promise<PersonRecord[]> {
  const db = await openMyWordsDB();
  return db.getAll('people');
}

export async function savePerson(person: PersonRecord): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('people', person);
}

export async function getPlaces(): Promise<PlaceRecord[]> {
  const db = await openMyWordsDB();
  return db.getAll('places');
}

export async function savePlace(place: PlaceRecord): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('places', place);
}

export async function getDayPlan(date: string): Promise<DayPlan> {
  const db = await openMyWordsDB();
  return (await db.get('dayPlans', date)) ?? { date, activities: [] };
}

export async function saveDayPlan(plan: DayPlan): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('dayPlans', plan);
  dayPlanVersion.value += 1;
}

const DEFAULT_DAY_SETTINGS: DaySettings = { view: 'today', countdownEnabled: false };

export async function getDaySettings(): Promise<DaySettings> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'daySettings');
  return { ...DEFAULT_DAY_SETTINGS, ...((stored as Partial<DaySettings> | undefined) ?? {}) };
}

export async function setDaySettings(settings: DaySettings): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', settings, 'daySettings');
}

// First run (PLAN.md Phase 8): a three-screen wizard shown once, before
// the ordinary child-facing app appears.
export async function hasCompletedFirstRun(): Promise<boolean> {
  const db = await openMyWordsDB();
  return (await db.get('meta', 'firstRunCompleted')) === true;
}

export async function setFirstRunCompleted(): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', true, 'firstRunCompleted');
}

// A cached signal, not just a getter — speech must never wait on an
// IndexedDB round trip before it can start (CLAUDE.md I1/I5 spirit: no
// added latency), so App.tsx loads this once and announce.ts reads the
// signal directly.
export const preferredVoiceURI = signal<string | undefined>(undefined);

export async function getPreferredVoiceURI(): Promise<string | undefined> {
  const db = await openMyWordsDB();
  return (await db.get('meta', 'preferredVoiceURI')) as string | undefined;
}

export async function setPreferredVoiceURI(uri: string | undefined): Promise<void> {
  const db = await openMyWordsDB();
  if (uri) {
    await db.put('meta', uri, 'preferredVoiceURI');
  } else {
    await db.delete('meta', 'preferredVoiceURI');
  }
  preferredVoiceURI.value = uri;
}

// Adjustable speech rate (feature review, Aug 2026: "some users respond
// better to slower speech output"). Same cached-signal shape as the
// preferred voice, for the same reason — speech must never wait on a
// database round trip.
export const DEFAULT_SPEECH_RATE = 1;
export const preferredSpeechRate = signal<number>(DEFAULT_SPEECH_RATE);

export async function getPreferredSpeechRate(): Promise<number> {
  const db = await openMyWordsDB();
  return ((await db.get('meta', 'preferredSpeechRate')) as number | undefined) ?? DEFAULT_SPEECH_RATE;
}

export async function setPreferredSpeechRate(rate: number): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', rate, 'preferredSpeechRate');
  preferredSpeechRate.value = rate;
}

// Medical info (feature review, Aug 2026) — edited in Parent Mode, shown
// via the always-available Medical Info button without needing the PIN.
export const DEFAULT_MEDICAL_INFO: MedicalInfo = {
  childName: '',
  allergies: '',
  conditions: '',
  contacts: [],
};

export async function getMedicalInfo(): Promise<MedicalInfo> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'medicalInfo');
  return { ...DEFAULT_MEDICAL_INFO, ...((stored as Partial<MedicalInfo> | undefined) ?? {}) };
}

export async function setMedicalInfo(info: MedicalInfo): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', info, 'medicalInfo');
}

// Crash recovery (PLAN.md Phase 8): "if the app closes unexpectedly, the
// sentence in progress and the current page are restored." TalkScreen
// persists on every change and clears it on any deliberate exit (Home,
// Back-out-of-Talk) — so anything still here on the next launch can only
// have been left by an unclean shutdown.
export type SessionState = { boardStack: string[]; sentence: Item[] } | null;

export async function getSessionState(): Promise<SessionState> {
  const db = await openMyWordsDB();
  return ((await db.get('meta', 'sessionState')) as SessionState | undefined) ?? null;
}

export async function setSessionState(state: SessionState): Promise<void> {
  const db = await openMyWordsDB();
  if (state) {
    await db.put('meta', state, 'sessionState');
  } else {
    await db.delete('meta', 'sessionState');
  }
}

export const DEFAULT_ACCESS_SETTINGS: AccessSettings = {
  dwellMs: 0,
  repeatSuppressMs: 0,
  scanningMode: 'off',
  scanIntervalMs: 1500,
  highContrast: 'off',
  textScale: 1,
  reduceMotion: false,
  lowArousalPalette: false,
};

export async function getAccessSettings(): Promise<AccessSettings> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'accessSettings');
  return { ...DEFAULT_ACCESS_SETTINGS, ...((stored as Partial<AccessSettings> | undefined) ?? {}) };
}

export async function setAccessSettings(settings: AccessSettings): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', settings, 'accessSettings');
  accessSettingsVersion.value += 1;
}

// Backup and restore (PLAN.md Phase 6) — everything in the database, in one
// file the adult controls (CLAUDE.md I2: backup is an explicit user action,
// never an auto-sync). Blobs travel as base64 so the whole thing is a single
// JSON document; FileReader/fetch do the encoding so there's no manual
// chunking of large photo data.
export type BackupPayload = {
  formatVersion: 1;
  boards: Board[];
  favourites: Item[];
  recent: RecentEntry[];
  people: PersonRecord[];
  places: PlaceRecord[];
  dayPlans: DayPlan[];
  profiles: Profile[];
  photos: Record<string, { mime: string; base64: string }>;
  voiceClips: Record<string, { mime: string; base64: string }>;
  meta: {
    recentEnabled: boolean;
    wordFrequency: Record<string, number>;
    phraseBank: PhraseBank;
    parentPin: ParentPinState | null;
    daySettings: DaySettings;
    activeProfileId: string;
    accessSettings: AccessSettings;
    medicalInfo: MedicalInfo;
    myPages: MyPage[];
  };
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve((reader.result as string).split(',', 2)[1] ?? '');
    reader.readAsDataURL(blob);
  });
}

async function base64ToBlob(base64: string, mime: string): Promise<Blob> {
  const response = await fetch(`data:${mime};base64,${base64}`);
  return response.blob();
}

export async function exportBackupPayload(): Promise<BackupPayload> {
  const db = await openMyWordsDB();
  const [boards, favourites, recent, people, places, dayPlans, profiles] = await Promise.all([
    db.getAll('boards'),
    db.getAll('favourites'),
    db.getAll('recent'),
    db.getAll('people'),
    db.getAll('places'),
    db.getAll('dayPlans'),
    getProfiles(),
  ]);

  const photos: BackupPayload['photos'] = {};
  for (const key of await db.getAllKeys('photos')) {
    const blob = await db.get('photos', key);
    if (blob) photos[key] = { mime: blob.type, base64: await blobToBase64(blob) };
  }

  const voiceClips: BackupPayload['voiceClips'] = {};
  for (const key of await db.getAllKeys('voiceClips')) {
    const blob = await db.get('voiceClips', key);
    if (blob) voiceClips[key] = { mime: blob.type, base64: await blobToBase64(blob) };
  }

  const [
    recentEnabled,
    wordFrequency,
    phraseBank,
    parentPin,
    daySettings,
    activeProfileId,
    accessSettings,
    medicalInfo,
    myPages,
  ] = await Promise.all([
    isRecentEnabled(),
    getWordFrequencies(),
    getPhraseBank(),
    getParentPinState(),
    getDaySettings(),
    getActiveProfileId(),
    getAccessSettings(),
    getMedicalInfo(),
    getMyPages(),
  ]);

  return {
    formatVersion: 1,
    boards,
    favourites,
    recent,
    people,
    places,
    dayPlans,
    profiles,
    photos,
    voiceClips,
    meta: {
      recentEnabled,
      wordFrequency,
      phraseBank,
      parentPin,
      daySettings,
      activeProfileId,
      accessSettings,
      medicalInfo,
      myPages,
    },
  };
}

/** Replaces everything in the database with the contents of a backup. */
export async function importBackupPayload(payload: BackupPayload): Promise<void> {
  const db = await openMyWordsDB();

  const stores = ['boards', 'favourites', 'recent', 'people', 'places', 'dayPlans', 'profiles', 'photos', 'voiceClips'] as const;
  for (const store of stores) {
    await db.clear(store);
  }

  async function putAll<Name extends 'boards' | 'favourites' | 'recent' | 'people' | 'places' | 'dayPlans' | 'profiles'>(
    store: Name,
    rows: MyWordsDB[Name]['value'][],
  ): Promise<void> {
    const tx = db.transaction(store, 'readwrite');
    await Promise.all(rows.map((row) => tx.store.put(row)));
    await tx.done;
  }

  await putAll('boards', payload.boards);
  await putAll('favourites', payload.favourites);
  await putAll('recent', payload.recent);
  await putAll('people', payload.people);
  await putAll('places', payload.places);
  await putAll('dayPlans', payload.dayPlans);
  await putAll('profiles', payload.profiles);

  for (const [id, { mime, base64 }] of Object.entries(payload.photos)) {
    await db.put('photos', await base64ToBlob(base64, mime), id);
  }
  for (const [id, { mime, base64 }] of Object.entries(payload.voiceClips)) {
    await db.put('voiceClips', await base64ToBlob(base64, mime), id);
  }

  await db.put('meta', payload.meta.recentEnabled, 'recentEnabled');
  await db.put('meta', payload.meta.wordFrequency, 'wordFrequency');
  await db.put('meta', payload.meta.phraseBank, 'phraseBank');
  if (payload.meta.parentPin) {
    await db.put('meta', payload.meta.parentPin, 'parentPin');
  } else {
    await db.delete('meta', 'parentPin');
  }
  await db.put('meta', payload.meta.daySettings, 'daySettings');
  await db.put('meta', payload.meta.activeProfileId, 'activeProfileId');
  await db.put('meta', payload.meta.accessSettings, 'accessSettings');
  await db.put('meta', payload.meta.medicalInfo, 'medicalInfo');
  await db.put('meta', payload.meta.myPages, 'myPages');
  await db.put('meta', true, 'seeded');

  recentVersion.value += 1;
  dayPlanVersion.value += 1;
  activeProfileVersion.value += 1;
  accessSettingsVersion.value += 1;
  myPagesVersion.value += 1;
}

/** Test-only: drops the cached connection handle so a fresh open re-reads state. */
export function resetDBConnectionForTests(): void {
  dbPromise = null;
  recentVersion.value = 0;
  dayPlanVersion.value = 0;
  activeProfileVersion.value = 0;
  accessSettingsVersion.value = 0;
  myPagesVersion.value = 0;
  preferredVoiceURI.value = undefined;
  preferredSpeechRate.value = DEFAULT_SPEECH_RATE;
}
