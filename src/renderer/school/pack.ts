import { WEEKDAYS, type DayActivity, type MyPage, type WeeklyRoutine } from '../store/types';
import { EMPTY_SCHOOL_INFO, type SchoolInfo } from '../store/staff';
import { isRoutine } from '../store/db';

// A school pack: what a school wants on every pupil's device, written once and handed to many. It holds lesson pages, a
// timetable and the school's details, and NOTHING about any child: no notes, no targets, no activity, no photos of
// pupils, no key adult. It only travels one way, from the school's device to the pupils', as a file or over the
// school's own wifi with a code. A pupil's device never sends anything back, and never applies a pack by itself: an
// adult looks at what is in it and chooses to add it, and it only ever adds (it never replaces or removes anything).

export const PACK_TYPE = 'rugged-speech-school-pack';
export const PACK_VERSION = 1;
export const MAX_PACK_PAGES = 40;
export const MAX_PACK_CHARS = 25_000_000;

/** The school's details that belong to a whole class or school. The key adult belongs to one pupil, so is never in a pack. */
export type PackInfo = Omit<SchoolInfo, 'keyAdult'>;

export type PackPage = { name: string; obf: string };

export type SchoolPack = {
  type: typeof PACK_TYPE;
  v: typeof PACK_VERSION;
  name: string;
  made: string;
  pages: PackPage[];
  /** The timetable, with each activity's page named rather than numbered, since the numbers belong to one device. */
  routine?: WeeklyRoutine;
  /** The page each timetable activity opens, by the page's name: `${day}:${activity id}`. */
  routinePages?: Record<string, string>;
  info?: Partial<PackInfo>;
};

const INFO_KEYS: Array<keyof PackInfo> = ['school', 'className', 'teacher', 'senco', 'slt', 'phone', 'dsl', 'dslPhone'];

export type PackChoices = {
  name: string;
  pages: PackPage[];
  routine?: WeeklyRoutine;
  /** Resolves a page id used in the timetable to the page's name. */
  pageNames?: Map<string, string>;
  info?: SchoolInfo;
};

/** A pack as the text of a file. */
export function buildPack(choices: PackChoices): string {
  const pack: SchoolPack = {
    type: PACK_TYPE,
    v: PACK_VERSION,
    name: choices.name.trim().slice(0, 80) || 'School pack',
    made: new Date().toISOString().slice(0, 10),
    pages: choices.pages.slice(0, MAX_PACK_PAGES),
  };
  if (choices.routine) {
    const routinePages: Record<string, string> = {};
    const routine = {} as WeeklyRoutine;
    for (const day of WEEKDAYS) {
      routine[day] = choices.routine[day].map((activity) => {
        const pageName = activity.pageId ? choices.pageNames?.get(activity.pageId) : undefined;
        if (pageName && choices.pages.some((page) => page.name === pageName)) routinePages[`${day}:${activity.id}`] = pageName;
        // What belongs to one device or one day (the page's number, finished, a change of plan) is left out.
        const clean: DayActivity = { ...activity };
        delete clean.pageId;
        delete clean.finished;
        delete clean.changedFrom;
        return clean;
      });
    }
    pack.routine = routine;
    if (Object.keys(routinePages).length > 0) pack.routinePages = routinePages;
  }
  if (choices.info) {
    const info: Partial<PackInfo> = {};
    for (const key of INFO_KEYS) if (choices.info[key].trim()) info[key] = choices.info[key].trim();
    if (Object.keys(info).length > 0) pack.info = info;
  }
  return JSON.stringify(pack);
}

export type ParsedPack = { ok: true; pack: SchoolPack } | { ok: false; error: string };

/** Reads a pack, refusing anything that is not exactly one. */
export function parsePack(text: string): ParsedPack {
  if (typeof text !== 'string' || text.length === 0 || text.length > MAX_PACK_CHARS) return { ok: false, error: 'That is not a school pack.' };
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That is not a school pack.' };
  }
  if (typeof value !== 'object' || value === null) return { ok: false, error: 'That is not a school pack.' };
  const pack = value as Record<string, unknown>;
  if (pack['type'] !== PACK_TYPE) return { ok: false, error: 'That is not a school pack.' };
  if (pack['v'] !== PACK_VERSION) return { ok: false, error: 'That pack was made by a different version of the app.' };
  if (typeof pack['name'] !== 'string' || typeof pack['made'] !== 'string') return { ok: false, error: 'That pack is damaged.' };
  const pages = pack['pages'];
  if (!Array.isArray(pages) || pages.length > MAX_PACK_PAGES) return { ok: false, error: 'That pack is damaged.' };
  const cleanPages: PackPage[] = [];
  for (const page of pages) {
    const entry = page as Record<string, unknown> | null;
    if (!entry || typeof entry['name'] !== 'string' || typeof entry['obf'] !== 'string' || !entry['name'].trim()) {
      return { ok: false, error: 'That pack is damaged.' };
    }
    cleanPages.push({ name: entry['name'].trim().slice(0, 80), obf: entry['obf'] });
  }
  const result: SchoolPack = {
    type: PACK_TYPE,
    v: PACK_VERSION,
    name: pack['name'].slice(0, 80),
    made: pack['made'].slice(0, 20),
    pages: cleanPages,
  };
  if (pack['routine'] !== undefined) {
    if (!isRoutine(pack['routine'])) return { ok: false, error: 'That pack is damaged.' };
    result.routine = pack['routine'];
  }
  const routinePages = pack['routinePages'];
  if (routinePages !== undefined) {
    if (typeof routinePages !== 'object' || routinePages === null) return { ok: false, error: 'That pack is damaged.' };
    const clean: Record<string, string> = {};
    for (const [key, name] of Object.entries(routinePages)) if (typeof name === 'string' && /^[a-z]{3}:/.test(key)) clean[key] = name;
    result.routinePages = clean;
  }
  const info = pack['info'];
  if (info !== undefined) {
    if (typeof info !== 'object' || info === null) return { ok: false, error: 'That pack is damaged.' };
    const clean: Partial<PackInfo> = {};
    for (const key of INFO_KEYS) {
      const field = (info as Record<string, unknown>)[key];
      if (typeof field === 'string') clean[key] = field.slice(0, 200);
    }
    result.info = clean;
  }
  return { ok: true, pack: result };
}

export type PackPlan = {
  /** Pages that are not here yet, and will be added. */
  addPages: string[];
  /** Pages with a name this device already has, which are left alone. */
  skipPages: string[];
  /** The timetable is added only to a device with no timetable. */
  addRoutine: boolean;
  skipRoutine: boolean;
  /** Details the device has not filled in, which the pack fills in. Details already there are never replaced. */
  fillInfo: Array<keyof PackInfo>;
};

export type PackDevice = { pageNames: string[]; routineEmpty: boolean; info: SchoolInfo };

/** What adding the pack to this device would do, to show before anyone chooses. */
export function planPack(pack: SchoolPack, device: PackDevice): PackPlan {
  const have = new Set(device.pageNames.map((name) => name.trim().toLowerCase()));
  const addPages: string[] = [];
  const skipPages: string[] = [];
  for (const page of pack.pages) (have.has(page.name.toLowerCase()) ? skipPages : addPages).push(page.name);
  const fillInfo = INFO_KEYS.filter((key) => (pack.info?.[key] ?? '').trim() && !device.info[key].trim());
  return {
    addPages,
    skipPages,
    addRoutine: pack.routine !== undefined && device.routineEmpty,
    skipRoutine: pack.routine !== undefined && !device.routineEmpty,
    fillInfo,
  };
}

/** The timetable from a pack, with each activity pointed at the page just made for it here. */
export function routineWithPages(pack: SchoolPack, pageIdsByName: Map<string, string>): WeeklyRoutine | undefined {
  if (!pack.routine) return undefined;
  const routine = {} as WeeklyRoutine;
  for (const day of WEEKDAYS) {
    routine[day] = pack.routine[day].map((activity) => {
      const name = pack.routinePages?.[`${day}:${activity.id}`];
      const pageId = name ? pageIdsByName.get(name.toLowerCase()) : undefined;
      return pageId ? { ...activity, pageId } : activity;
    });
  }
  return routine;
}

export function emptyInfo(): SchoolInfo {
  return { ...EMPTY_SCHOOL_INFO };
}

export type PackSummary = { pages: number; routine: boolean; info: number };

export type { MyPage };
