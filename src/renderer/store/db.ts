import { signal, type Signal } from '@preact/signals';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import {
  FEELINGS_BOARD_ID,
  PEOPLE_BOARD_ID,
  ROOT_BOARD_ID,
  SCHOOL_BOARD_ID,
  STARTER_BOARDS,
} from '../vocab/starter';
import { EMPTY_LOST_MODE, isLostMode, type LostMode } from '../safety/lostMode';
import { DEFAULT_TRAFFIC, isTrafficSetting, type TrafficSetting } from '../signals/traffic';
import { hashSecret, isHashedSecret, verifySecret } from './pinSecurity';
import { DEFAULT_RETENTION_DAYS, MAX_ENTRIES, MAX_LABEL, isRetention, type ActivityEntry, type ActivityKind } from './activity';
import {
  EMPTY_SCHOOL_INFO,
  isNoteList,
  isSchoolInfo,
  isTargetList,
  type SchoolInfo,
  type StaffNote,
  type Target,
} from './staff';
import { isTreeDesign, type TreeDesign } from '../game/tree';
import { DEFAULT_SEASONS_CONFIG, isSeasonsConfig, type SeasonsConfig } from '../vocab/seasons';
import { isPlaylistList, isSongList, type Playlist, type Song } from '../music/songs';
import { isJokeList, type Joke } from '../vocab/jokes';
import { DEFAULT_BODY_LOOK, isBodyLook, type BodyLook } from '../body/look';
import { isDrawingList } from '../draw/palette';
import { DEFAULT_THEME, isTheme, type Theme } from '../ui/theme';
import type {
  AboutMe,
  AccessSettings,
  Board,
  DayPlan,
  DaySettings,
  GridSize,
  Item,
  MedicalInfo,
  MyPage,
  ParentPinState,
  SchoolPinState,
  PersonRecord,
  PhraseBank,
  PhraseBankSlotId,
  PlaceRecord,
  PressMode,
  Profile,
  QuickAccessId,
  RecentEntry,
  UsageCounts,
  WeeklyRoutine,
  FirstThen,
  KeyboardLayout,
  SpeakStyle,
  SymbolStyle,
  LabelStyle,
  UserProfile,
  Pronunciation,
} from './types';
import { DEFAULT_QUICK_ACCESS, isValidQuickAccess } from './quickAccess';
import { routineForDate } from '../day/routine';

// Bumped on every write to the recent-history store. A page displaying
// that history (FavouritesScreen) reads this in its render body to
// subscribe, so it refreshes even when an utterance is recorded elsewhere
// (e.g. Quick Access's Yes/No) while it's already on screen, a tab-change
// effect alone wouldn't catch that.
export const recentVersion = signal(0);

// Bumped on every write to a day plan, lets the child's My Day screen
// react immediately to an adult's edit made in Parent Mode's Day Builder
// while that screen is already open, which is what "change of plan"
// (docs/build-plan.md Phase 5) actually needs: the announcement has to happen as soon
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
  activity: {
    key: number;
    value: ActivityEntry;
  };
}

export const DB_VERSION = 6;

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
        if (oldVersion < 6) {
          db.createObjectStore('activity', { keyPath: 'id', autoIncrement: true });
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

/** Seeds the four named profiles on first run only, separate from
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
 * deleted. Talk must always have somewhere to open. */
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
// did this. Parent Mode or Favourites reached directly from Home would
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

const NEW_BOARD_GRID_SIZE: GridSize = 3;

/** A new, empty board, used for My Pages and for folders (categories) an
 * adult adds to the Talk tree. Starts 3×3; resizing is the adult's own
 * deliberate action afterwards (invariant I3). */
export async function createBoard(name: string, id: string = `board-${randomId()}`): Promise<Board> {
  const db = await openMyWordsDB();
  const board: Board = {
    id,
    name,
    grid: {
      rows: NEW_BOARD_GRID_SIZE,
      columns: NEW_BOARD_GRID_SIZE,
      order: emptyGridOrder(NEW_BOARD_GRID_SIZE, NEW_BOARD_GRID_SIZE),
    },
    buttons: [],
  };
  await db.put('boards', board);
  return board;
}

/** My Pages (fully custom pages, built from scratch in Parent Mode, feature
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
  const id = randomId();
  const boardId = `mypage-${id}`;
  await createBoard(name, boardId);
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

/** Removes the page's own board too, nothing else ever references it, so
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
 *, `put` rather than `add` means favouriting an already-favourited item
 * is harmlessly idempotent. */
export async function removeFavourite(id: string): Promise<void> {
  const db = await openMyWordsDB();
  await db.delete('favourites', id);
}

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
 * Records a spoken utterance if, and only if, an adult has switched
 * communication history on (invariant I2, off by default). Every caller
 * goes through this one function so nothing, including the Help section,
 * is ever logged differently from anything else (PRINCIPLES.md §6).
 */
export async function recordUtteranceIfEnabled(text: string): Promise<void> {
  // The activity log is its own opt-in; Recent is another. Either, both or neither.
  void recordActivity('speech', text);
  if (!(await isRecentEnabled())) return;
  const db = await openMyWordsDB();
  await db.add('recent', { text, timestamp: Date.now() });
  await pruneRecent(db);
  recentVersion.value += 1;
}

export async function getRecentEntries(): Promise<RecentEntry[]> {
  const db = await openMyWordsDB();
  const all = await db.getAll('recent');
  // Tie-break on id (insertion order), two presses inside the same
  // millisecond would otherwise sort arbitrarily on timestamp alone.
  return all.sort((a, b) => b.timestamp - a.timestamp || (b.id ?? 0) - (a.id ?? 0));
}

export async function clearRecent(): Promise<void> {
  const db = await openMyWordsDB();
  await db.clear('recent');
  recentVersion.value += 1;
}

/**
 * Prediction ranking data (docs/build-plan.md Phase 3: "frequency of actual use").
 * Bumped only when a person taps a suggestion, never for ordinary typing,
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
 * null means Parent Mode has never been set up on this device, the PIN
 * gate shows setup instead of entry.
 */
export async function getParentPinState(): Promise<ParentPinState | null> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'parentPin');
  return (stored as ParentPinState | undefined) ?? null;
}

/** Saves a new PIN and recovery code. Only hashes are kept. */
export async function setParentPinState(secrets: { pin: string; recoveryCode: string }): Promise<void> {
  const db = await openMyWordsDB();
  const state: ParentPinState = {
    pinHash: await hashSecret(secrets.pin),
    recoveryHash: await hashSecret(secrets.recoveryCode.trim().toLowerCase()),
  };
  await db.put('meta', state, 'parentPin');
}

/** Whether a PIN has been set on this device. */
export async function hasParentPin(): Promise<boolean> {
  return (await getParentPinState()) !== null;
}

/**
 * Whether this is the PIN. A PIN saved as plain text by an older version is
 * accepted once and then kept as a hash from then on.
 */
export async function verifyParentPin(candidate: string): Promise<boolean> {
  const state = await getParentPinState();
  if (!state) return false;
  if (state.pinHash && isHashedSecret(state.pinHash)) return verifySecret(candidate, state.pinHash);
  if (typeof state.pin === 'string' && candidate === state.pin) {
    const db = await openMyWordsDB();
    const { recoveryCode, ...rest } = state;
    delete rest.pin;
    const upgraded: ParentPinState = { ...rest, pinHash: await hashSecret(candidate) };
    if (typeof recoveryCode === 'string' && !rest.recoveryHash) upgraded.recoveryHash = await hashSecret(recoveryCode.trim().toLowerCase());
    await db.put('meta', upgraded, 'parentPin');
    return true;
  }
  return false;
}

// School Mode has its own PIN, separate from the Parent PIN, chosen afterwards
// in Parent Mode and never during first-run set-up. It has no recovery code:
// whoever holds the Parent PIN can always choose a new School PIN, so nobody
// is locked out. It is kept as a salted hash, like the Parent PIN.
export async function hasSchoolPin(): Promise<boolean> {
  const db = await openMyWordsDB();
  return (await db.get('meta', 'schoolPin')) !== undefined;
}

export async function setSchoolPin(pin: string): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', { pinHash: await hashSecret(pin) } satisfies SchoolPinState, 'schoolPin');
}

export async function verifySchoolPin(candidate: string): Promise<boolean> {
  const db = await openMyWordsDB();
  const state = (await db.get('meta', 'schoolPin')) as SchoolPinState | undefined;
  return Boolean(state && isHashedSecret(state.pinHash) && (await verifySecret(candidate, state.pinHash)));
}

export async function clearSchoolPin(): Promise<void> {
  const db = await openMyWordsDB();
  await db.delete('meta', 'schoolPin');
}

/** Whether this is the recovery code (any capital letters and spaces round it are ignored). */
export async function verifyRecoveryCode(candidate: string): Promise<boolean> {
  const state = await getParentPinState();
  if (!state) return false;
  const cleaned = candidate.trim().toLowerCase();
  if (state.recoveryHash && isHashedSecret(state.recoveryHash)) return verifySecret(cleaned, state.recoveryHash);
  return typeof state.recoveryCode === 'string' && cleaned === state.recoveryCode.trim().toLowerCase();
}

function randomId(): string {
  return crypto.randomUUID();
}

/**
 * Stores a photo blob and returns its id, never a filesystem path, so a
 * backup file stays self-contained and survives the source file moving or
 * disappearing (PRINCIPLES.md §4).
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

export async function deleteVoiceClip(blobId: string): Promise<void> {
  const db = await openMyWordsDB();
  await db.delete('voiceClips', blobId);
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

export async function deletePerson(id: string): Promise<void> {
  const db = await openMyWordsDB();
  await db.delete('people', id);
}

export async function deletePlace(id: string): Promise<void> {
  const db = await openMyWordsDB();
  await db.delete('places', id);
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

/**
 * The plan to show for a date: its own if one has been saved, otherwise that
 * weekday's part of the weekly routine. `fromRoutine` says which, so the
 * builder can explain why a day that nobody has planned already has things on it.
 */
export async function getEffectiveDayPlan(date: string): Promise<{ plan: DayPlan; fromRoutine: boolean }> {
  const db = await openMyWordsDB();
  const saved = await db.get('dayPlans', date);
  if (saved) return { plan: saved, fromRoutine: false };
  const routine = await weeklyRoutineSetting.get();
  return { plan: { date, activities: routineForDate(routine, date) }, fromRoutine: true };
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

// First run (docs/build-plan.md Phase 8): a three-screen wizard shown once, before
// the ordinary child-facing app appears.
export async function hasCompletedFirstRun(): Promise<boolean> {
  const db = await openMyWordsDB();
  return (await db.get('meta', 'firstRunCompleted')) === true;
}

export async function setFirstRunCompleted(): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', true, 'firstRunCompleted');
}

// A cached signal, not just a getter, speech must never wait on an
// IndexedDB round trip before it can start (PRINCIPLES.md I1/I5 spirit: no
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
// preferred voice, for the same reason, speech must never wait on a
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

// Voice pitch (docs/build-plan.md Phase 1: "rate and pitch"), same cached-signal shape
// as rate, for the same reason.
export const DEFAULT_SPEECH_PITCH = 1;
export const preferredSpeechPitch = signal<number>(DEFAULT_SPEECH_PITCH);

export async function getPreferredSpeechPitch(): Promise<number> {
  const db = await openMyWordsDB();
  return ((await db.get('meta', 'preferredSpeechPitch')) as number | undefined) ?? DEFAULT_SPEECH_PITCH;
}

export async function setPreferredSpeechPitch(pitch: number): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', pitch, 'preferredSpeechPitch');
  preferredSpeechPitch.value = pitch;
}

// Press mode (docs/build-plan.md Phase 1: speak immediately / add to sentence / both).
// Defaults to building a sentence, nothing speaks until Speak is pressed.
export const DEFAULT_PRESS_MODE: PressMode = 'sentence';
export const pressMode = signal<PressMode>(DEFAULT_PRESS_MODE);

export async function getPressMode(): Promise<PressMode> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'pressMode');
  return stored === 'speak' || stored === 'both' || stored === 'sentence' ? stored : DEFAULT_PRESS_MODE;
}

export async function setPressMode(mode: PressMode): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', mode, 'pressMode');
  pressMode.value = mode;
}

// Quick Access bar configuration (docs/build-plan.md Phase 2). A stored value that
// isn't a valid six-button layout containing Help falls back to the default
// rather than leaving the child without a bar.
export const quickAccessButtons = signal<QuickAccessId[]>(DEFAULT_QUICK_ACCESS);

export async function getQuickAccess(): Promise<QuickAccessId[]> {
  const db = await openMyWordsDB();
  const stored = await db.get('meta', 'quickAccess');
  return isValidQuickAccess(stored) ? stored : [...DEFAULT_QUICK_ACCESS];
}

export async function setQuickAccess(buttons: QuickAccessId[]): Promise<void> {
  const db = await openMyWordsDB();
  await db.put('meta', buttons, 'quickAccess');
  quickAccessButtons.value = buttons;
}


// ---------------------------------------------------------------------------
// Simple stored settings. Each one lives under its own key in `meta`, keeps a
// cached signal so screens can react without a database round trip, and is
// registered in SETTINGS below, which is all it takes for it to load at
// start-up, travel in a backup, and reset between tests. A stored value that
// fails its check is ignored in favour of the default rather than trusted.
// ---------------------------------------------------------------------------

type StoredSetting<T> = {
  key: string;
  signal: Signal<T>;
  fallback: T;
  /** Whether this belongs in a backup (anything about this device itself, such as when it was last backed up, does not). */
  portable: boolean;
  get(): Promise<T>;
  set(value: T): Promise<void>;
  /** Puts a value from a backup file in place, if it is a valid one. */
  restore(value: unknown): Promise<boolean>;
  load(): Promise<void>;
  reset(): void;
};

function storedSetting<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
  portable = true,
): StoredSetting<T> {
  const state = signal<T>(fallback);
  const setting: StoredSetting<T> = {
    key,
    signal: state,
    fallback,
    portable,
    async get() {
      const db = await openMyWordsDB();
      const stored = await db.get('meta', key);
      return isValid(stored) ? stored : fallback;
    },
    async set(value) {
      // The cached value moves first, so a second change made before the
      // first has finished saving builds on it instead of overwriting it.
      state.value = value;
      const db = await openMyWordsDB();
      await db.put('meta', value, key);
    },
    async restore(value) {
      if (!isValid(value)) return false;
      await setting.set(value);
      return true;
    },
    async load() {
      state.value = await setting.get();
    },
    reset() {
      state.value = fallback;
    },
  };
  return setting;
}

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isStageChoice = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 4;
const isMinutes = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 240;
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === 'string');
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isNullableNumber = (value: unknown): value is number | null =>
  value === null || (typeof value === 'number' && Number.isFinite(value));

export const EMPTY_ABOUT_ME: AboutMe = {
  preferredName: '',
  howIcommunicate: '',
  whatHelps: '',
  whatIFindHard: '',
  likes: '',
  dislikes: '',
};
const isAboutMe = (value: unknown): value is AboutMe =>
  isPlainObject(value) && Object.keys(EMPTY_ABOUT_ME).every((field) => typeof value[field] === 'string');

export const EMPTY_ROUTINE: WeeklyRoutine = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
const isRoutine = (value: unknown): value is WeeklyRoutine =>
  isPlainObject(value) && Object.keys(EMPTY_ROUTINE).every((day) => Array.isArray(value[day]));

/** 0 shows every word; 1 to 4 holds back words whose stage is higher. */
export const wordStageSetting = storedSetting<number>('wordStage', 0, isStageChoice);
/** Empties the sentence strip after Speak, for people who start each sentence afresh. */
export const clearAfterSpeakSetting = storedSetting<boolean>('clearAfterSpeak', false, isBoolean);
/** School (staff) wording and presets. */
export const schoolModeSetting = storedSetting<boolean>('schoolMode', false, isBoolean);
/** Minutes of inactivity before Parent Mode closes itself; 0 never. */
export const parentModeTimeoutSetting = storedSetting<number>('parentModeTimeoutMin', 0, isMinutes);
/** Extra phrases beyond the four fixed slots in the keyboard's Phrases tab. */
export const customPhrasesSetting = storedSetting<string[]>('customPhrases', [], isStringArray);
export const aboutMeSetting = storedSetting<AboutMe>('aboutMe', EMPTY_ABOUT_ME, isAboutMe);
export const weeklyRoutineSetting = storedSetting<WeeklyRoutine>('weeklyRoutine', EMPTY_ROUTINE, isRoutine);
/** Opt-in word counts (invariant I2: off by default, clearable, hard off switch). */
export const usageEnabledSetting = storedSetting<boolean>('usageEnabled', false, isBoolean);
export const usageCountsSetting = storedSetting<UsageCounts>(
  'usageCounts',
  {},
  (value): value is UsageCounts => isPlainObject(value),
);
/** How loud speech is, 0.1 to 1 (the system volume still applies on top). */
export const speechVolumeSetting = storedSetting<number>(
  'speechVolume',
  1,
  (value): value is number => typeof value === 'number' && value >= 0.1 && value <= 1,
);
export const pronunciationsSetting = storedSetting<Pronunciation[]>(
  'pronunciations',
  [],
  (value): value is Pronunciation[] =>
    Array.isArray(value) &&
    value.every((entry) => isPlainObject(entry) && typeof entry['written'] === 'string' && typeof entry['spoken'] === 'string'),
);
/** Alphabetical letters suit people who have not learned QWERTY. */
export const keyboardLayoutSetting = storedSetting<KeyboardLayout>(
  'keyboardLayout',
  'qwerty',
  (value): value is KeyboardLayout => value === 'qwerty' || value === 'alphabetical',
);
/** Shows each word's picture in the sentence strip, for people who do not yet read the labels. */
export const EMPTY_USER_PROFILE: UserProfile = { name: '', deviceName: '', emoji: '', age: '', showOnScreen: true };
const isUserProfile = (value: unknown): value is UserProfile =>
  isPlainObject(value) &&
  typeof value['name'] === 'string' &&
  typeof value['deviceName'] === 'string' &&
  typeof value['emoji'] === 'string' &&
  typeof value['age'] === 'string' &&
  typeof value['showOnScreen'] === 'boolean';
/** Whose device this is: a name, a device name, a picture and an age (Parent Mode, User). */
export const userProfileSetting = storedSetting<UserProfile>('userProfile', EMPTY_USER_PROFILE, isUserProfile);
/** What the figure in My body looks like (Parent Mode, My body). */
export const myBodySetting = storedSetting<BodyLook>('myBody', DEFAULT_BODY_LOOK, isBodyLook);
/** Jokes an adult has added to the built-in ones (Parent Mode, Jokes). */
export const customJokesSetting = storedSetting<Joke[]>('customJokes', [], isJokeList);
/** Songs an adult has added (Parent Mode, Music). The audio is kept with the voice clips. */
export const songsSetting = storedSetting<Song[]>('songs', [], isSongList);
/** Named lists of those songs (Parent Mode, Music), shown as choices on the child's Music screen. */
/** Which seasons and celebrations show, and their words (Parent Mode, Seasons). */
export const seasonsSetting = storedSetting<SeasonsConfig>('seasons', DEFAULT_SEASONS_CONFIG, isSeasonsConfig);
/** The Christmas tree a child has decorated (Games, Make a tree). */
export const treeDesignSetting = storedSetting<TreeDesign>('treeDesign', {}, isTreeDesign);
export const playlistsSetting = storedSetting<Playlist[]>('playlists', [], isPlaylistList);
const isVolume = (value: unknown): value is number => typeof value === 'number' && value >= 0.1 && value <= 1;
/** How loud the music plays. */
export const musicVolumeSetting = storedSetting<number>('musicVolume', 0.8, isVolume);
/** Lost mode and who to return the device to (Parent Mode, Lost). */
export const lostModeSetting = storedSetting<LostMode>('lostMode', EMPTY_LOST_MODE, isLostMode);
/** The traffic light and its words (Quick Access: Traffic light). */
export const trafficSetting = storedSetting<TrafficSetting>('traffic', DEFAULT_TRAFFIC, isTrafficSetting);
/** The activity log is off until an adult turns it on (Parent Mode, Activity). */
export const activityEnabledSetting = storedSetting<boolean>('activityEnabled', false, isBoolean, false);
/** How many days the activity log keeps. */
export const activityRetentionSetting = storedSetting<number>('activityRetentionDays', DEFAULT_RETENTION_DAYS, isRetention, false);
/** Bumped whenever the log changes, so an open report can refresh. */
export const activityVersion = signal(0);

/**
 * Adds to the activity log, if (and only if) an adult has turned it on.
 * Never throws and never makes anything wait: it is a record, not part of
 * speaking or moving around.
 */
export async function recordActivity(kind: ActivityKind, label: string, now: number = Date.now()): Promise<void> {
  if (!activityEnabledSetting.signal.value) return;
  const trimmed = label.trim().slice(0, MAX_LABEL);
  if (!trimmed) return;
  try {
    const db = await openMyWordsDB();
    await db.add('activity', { at: now, kind, label: trimmed });
    activityVersion.value += 1;
    // Keep only what the retention period and the cap allow.
    const cutoff = now - activityRetentionSetting.signal.value * 24 * 60 * 60 * 1000;
    const tx = db.transaction('activity', 'readwrite');
    let cursor = await tx.store.openCursor();
    while (cursor) {
      if (cursor.value.at < cutoff) await cursor.delete();
      cursor = await cursor.continue();
    }
    const left = await tx.store.getAllKeys();
    for (const key of left.slice(0, Math.max(0, left.length - MAX_ENTRIES))) await tx.store.delete(key);
    await tx.done;
  } catch {
    // A failed note must never get in the way of what the person is doing.
  }
}

export async function getActivity(): Promise<ActivityEntry[]> {
  const db = await openMyWordsDB();
  const cutoff = Date.now() - activityRetentionSetting.signal.value * 24 * 60 * 60 * 1000;
  return (await db.getAll('activity')).filter((entry) => entry.at >= cutoff);
}

export async function clearActivity(): Promise<void> {
  const db = await openMyWordsDB();
  await db.clear('activity');
  activityVersion.value += 1;
}

/** Where the child is in school, and who to go to (Parent Mode, School). */
export const schoolInfoSetting = storedSetting<SchoolInfo>('schoolInfo', EMPTY_SCHOOL_INFO, isSchoolInfo);
/** Communication targets (Parent Mode or School Mode, Targets). */
export const targetsSetting = storedSetting<Target[]>('targets', [], isTargetList);
/** Notes after a session (Parent Mode or School Mode, Notes). */
export const staffNotesSetting = storedSetting<StaffNote[]>('staffNotes', [], isNoteList);
/** The name last typed as the person writing notes, so it need not be typed each time. */
export const noteAuthorSetting = storedSetting<string>('noteAuthor', '', (value): value is string => typeof value === 'string', false);
/** Drawn symbols or emoji on the buttons (Look, and set-up). */
export const symbolStyleSetting = storedSetting<SymbolStyle>('symbolStyle', 'emoji', (value): value is SymbolStyle => value === 'emoji' || value === 'drawn');
/** Pictures and words, or just one of them (Look, and set-up). */
export const labelStyleSetting = storedSetting<LabelStyle>('labelStyle', 'both', (value): value is LabelStyle => value === 'both' || value === 'pictures' || value === 'words');
/** Minutes of inactivity before School Mode closes itself; 0 never. */
export const schoolTimeoutSetting = storedSetting<number>('schoolTimeoutMin', 10, isMinutes);
const isSpeakStyle = (value: unknown): value is SpeakStyle =>
  value === 'normal' || value === 'clear' || value === 'wordByWord';
/** How the Speak button reads a sentence out (Access). */
export const speakStyleSetting = storedSetting<SpeakStyle>('speakStyle', 'normal', isSpeakStyle);
/** Screen colours and any word colours an adult has chosen (Look). */
export const themeSetting = storedSetting<Theme>('theme', DEFAULT_THEME, isTheme);
/** Pictures a child chose to keep in Draw (small PNGs, kept on this computer). */
export const drawingsSetting = storedSetting<string[]>('drawings', [], isDrawingList);
export const sentencePicturesSetting = storedSetting<boolean>('sentencePictures', false, isBoolean);

export const EMPTY_FIRST_THEN: FirstThen = {
  first: { label: '', emoji: '' },
  then: { label: '', emoji: '' },
  firstDone: false,
};
const isFirstThenCard = (value: unknown): boolean =>
  isPlainObject(value) && typeof value['label'] === 'string' && typeof value['emoji'] === 'string';
export const firstThenSetting = storedSetting<FirstThen>(
  'firstThen',
  EMPTY_FIRST_THEN,
  (value): value is FirstThen =>
    isPlainObject(value) && isFirstThenCard(value['first']) && isFirstThenCard(value['then']) && typeof value['firstDone'] === 'boolean',
);

export const lastBackupSetting = storedSetting<number | null>('lastBackupAt', null, isNullableNumber, false);

const SETTINGS = [
  wordStageSetting,
  clearAfterSpeakSetting,
  schoolModeSetting,
  schoolTimeoutSetting,
  parentModeTimeoutSetting,
  customPhrasesSetting,
  aboutMeSetting,
  weeklyRoutineSetting,
  usageEnabledSetting,
  usageCountsSetting,
  lastBackupSetting,
  speechVolumeSetting,
  pronunciationsSetting,
  keyboardLayoutSetting,
  sentencePicturesSetting,
  speakStyleSetting,
  symbolStyleSetting,
  labelStyleSetting,
  themeSetting,
  drawingsSetting,
  myBodySetting,
  customJokesSetting,
  songsSetting,
  playlistsSetting,
  treeDesignSetting,
  seasonsSetting,
  musicVolumeSetting,
  lostModeSetting,
  trafficSetting,
  schoolInfoSetting,
  targetsSetting,
  staffNotesSetting,
  noteAuthorSetting,
  activityEnabledSetting,
  activityRetentionSetting,
  userProfileSetting,
  firstThenSetting,
] as const;

/**
 * Whether there is anything on this device an adult would hate to lose: photos,
 * people, places, My Pages or day plans. Used to decide whether a reminder to
 * save a backup is worth showing (a fresh install has nothing to protect).
 */
export async function hasContentWorthBackingUp(): Promise<boolean> {
  const db = await openMyWordsDB();
  const counts = await Promise.all([
    db.count('photos'),
    db.count('voiceClips'),
    db.count('people'),
    db.count('places'),
    db.count('dayPlans'),
  ]);
  return counts.some((count) => count > 0) || (await getMyPages()).length > 0;
}

/** Loads every simple setting into its signal. Called once when the app starts. */
export async function loadStoredSettings(): Promise<void> {
  await Promise.all(SETTINGS.map((setting) => setting.load()));
}

// Medical info (feature review, Aug 2026), edited in Parent Mode, shown
// via the always-available Medical Info button without needing the PIN.
export const DEFAULT_MEDICAL_INFO: MedicalInfo = {
  childName: '',
  allergies: '',
  conditions: '',
  contacts: [],
  medicines: '',
  equipment: '',
  eating: '',
  moving: '',
  hearingSight: '',
  communication: '',
  pain: '',
  emergencyPlan: '',
  doctor: '',
  hospital: '',
  nhsNumber: '',
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

// Crash recovery (docs/build-plan.md Phase 8): "if the app closes unexpectedly, the
// sentence in progress and the current page are restored." TalkScreen
// persists on every change and clears it on any deliberate exit (Home,
// Back-out-of-Talk), so anything still here on the next launch can only
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

// Backup and restore (docs/build-plan.md Phase 6), everything in the database, in one
// file the adult controls (PRINCIPLES.md I2: backup is an explicit user action,
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
    schoolPin?: SchoolPinState | null;
    daySettings: DaySettings;
    activeProfileId: string;
    accessSettings: AccessSettings;
    medicalInfo: MedicalInfo;
    myPages: MyPage[];
    // Added after the first backups were made, so optional: an older backup
    // file still restores, leaving these as they are.
    quickAccess?: QuickAccessId[];
    pressMode?: PressMode;
    speechRate?: number;
    speechPitch?: number;
    voiceURI?: string | null;
    settings?: Record<string, unknown>;
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
    schoolPin,
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
    (async () => ((await (await openMyWordsDB()).get('meta', 'schoolPin')) as SchoolPinState | undefined) ?? null)(),
  ]);

  const [quickAccess, pressModeValue, speechRate, speechPitch, voiceURI] = await Promise.all([
    getQuickAccess(),
    getPressMode(),
    getPreferredSpeechRate(),
    getPreferredSpeechPitch(),
    getPreferredVoiceURI(),
  ]);

  const settings: Record<string, unknown> = {};
  for (const setting of SETTINGS) {
    if (setting.portable) settings[setting.key] = await setting.get();
  }

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
      schoolPin,
      daySettings,
      activeProfileId,
      accessSettings,
      medicalInfo,
      myPages,
      quickAccess,
      pressMode: pressModeValue,
      speechRate,
      speechPitch,
      voiceURI: voiceURI ?? null,
      settings,
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
  if (payload.meta.schoolPin) {
    await db.put('meta', payload.meta.schoolPin, 'schoolPin');
  } else {
    await db.delete('meta', 'schoolPin');
  }
  await db.put('meta', payload.meta.daySettings, 'daySettings');
  await db.put('meta', payload.meta.activeProfileId, 'activeProfileId');
  await db.put('meta', payload.meta.accessSettings, 'accessSettings');
  await db.put('meta', payload.meta.medicalInfo, 'medicalInfo');
  await db.put('meta', payload.meta.myPages, 'myPages');
  await db.put('meta', true, 'seeded');

  // Fields added after the first backups were made may be absent; those are
  // simply left as they are.
  if (isValidQuickAccess(payload.meta.quickAccess)) await setQuickAccess(payload.meta.quickAccess);
  if (payload.meta.pressMode) await setPressMode(payload.meta.pressMode);
  if (payload.meta.speechRate !== undefined) await setPreferredSpeechRate(payload.meta.speechRate);
  if (payload.meta.speechPitch !== undefined) await setPreferredSpeechPitch(payload.meta.speechPitch);
  if (payload.meta.voiceURI !== undefined) await setPreferredVoiceURI(payload.meta.voiceURI ?? undefined);
  for (const setting of SETTINGS) {
    const stored = payload.meta.settings?.[setting.key];
    if (setting.portable && stored !== undefined) await setting.restore(stored);
  }

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
  preferredSpeechPitch.value = DEFAULT_SPEECH_PITCH;
  pressMode.value = DEFAULT_PRESS_MODE;
  quickAccessButtons.value = DEFAULT_QUICK_ACCESS;
  for (const setting of SETTINGS) setting.reset();
}
