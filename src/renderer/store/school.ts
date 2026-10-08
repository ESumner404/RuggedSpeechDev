import { schoolModeSetting, setActiveProfileId, setQuickAccess } from './db';
import { SCHOOL_QUICK_ACCESS } from './quickAccess';

/** How long School Mode stays open without use, to begin with, in minutes. */
export const SCHOOL_TIMEOUT_MINUTES = 10;

/** School Mode is switched on from Parent Mode, once a School PIN has been chosen. */
export async function enableSchoolMode(): Promise<void> {
  await schoolModeSetting.set(true);
}

/** Switching it off hides the School Mode button. Everything staff wrote, and the School PIN, are kept. */
export async function disableSchoolMode(): Promise<void> {
  await schoolModeSetting.set(false);
}

/**
 * A starting point for the child's screen in a classroom: the top bar becomes
 * Home, Help, Yes, No, Break and Question, and Talk opens to the School page.
 * Only ever done on purpose, from School Mode, because it moves buttons the
 * child may already know.
 */
export async function applySchoolTopBar(): Promise<void> {
  await setQuickAccess([...SCHOOL_QUICK_ACCESS]);
  await setActiveProfileId('school');
}
