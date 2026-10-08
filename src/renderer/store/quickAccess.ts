import { QUICK_ACCESS_IDS, type QuickAccessId } from './types';

export const QUICK_ACCESS_SLOTS = 6;

export const DEFAULT_QUICK_ACCESS: QuickAccessId[] = ['home', 'help', 'yes', 'no', 'favourites', 'keyboard'];

export const QUICK_ACCESS_LABELS: Record<QuickAccessId, string> = {
  home: 'Home',
  help: 'Help',
  yes: 'Yes',
  no: 'No',
  favourites: 'Favourites',
  keyboard: 'Keyboard',
  talk: 'Talk',
  myday: 'My Day',
  mypages: 'My Pages',
  feelings: 'Feelings',
  firstthen: 'First / Then',
  game: 'Games',
  draw: 'Draw',
  body: 'My body',
  music: 'Music',
  traffic: 'Traffic light',
  break: 'Break',
  question: 'Question',
  toilet: 'Toilet',
  finished: 'Finished',
  again: 'Say again',
};

/** Buttons that speak when pressed, rather than going to a screen. */
export const QUICK_ACCESS_SPEECH: Partial<Record<QuickAccessId, string>> = {
  yes: 'yes',
  no: 'no',
  break: 'I need a break',
  question: 'I have a question',
  toilet: 'I need the toilet',
  finished: "I've finished",
  again: 'Can you say that again, please?',
};

/** What school mode puts along the top: the usual essentials, with a break
 * and a question in place of Favourites and Keyboard. */
export const SCHOOL_QUICK_ACCESS: QuickAccessId[] = ['home', 'help', 'yes', 'no', 'break', 'question'];

/** Help must stay reachable in one press from every screen (docs/build-plan.md Phase 2
 * acceptance), so a configuration without it is never valid. */
export function isValidQuickAccess(value: unknown): value is QuickAccessId[] {
  return (
    Array.isArray(value) &&
    value.length === QUICK_ACCESS_SLOTS &&
    value.every((id) => (QUICK_ACCESS_IDS as readonly unknown[]).includes(id)) &&
    new Set(value).size === value.length &&
    value.includes('help')
  );
}

export type SetSlotResult = { ok: true; buttons: QuickAccessId[] } | { ok: false; reason: string };

/**
 * Puts `id` in `slot`. Choosing a button that's already elsewhere on the bar
 * swaps the two, so every button appears at most once and nothing is lost;
 * choosing a new one replaces what was there, except Help, which can only
 * ever move, never leave.
 */
export function setQuickAccessSlot(current: QuickAccessId[], slot: number, id: QuickAccessId): SetSlotResult {
  const existingIndex = current.indexOf(id);
  if (existingIndex === slot) return { ok: true, buttons: current };

  const next = [...current];
  if (existingIndex !== -1) {
    next[existingIndex] = current[slot]!;
    next[slot] = id;
    return { ok: true, buttons: next };
  }

  if (current[slot] === 'help') {
    return { ok: false, reason: 'Help has to stay on the bar so it is always one press away.' };
  }
  next[slot] = id;
  return { ok: true, buttons: next };
}
