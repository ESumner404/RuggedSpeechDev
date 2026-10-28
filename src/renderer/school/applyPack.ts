import { getMyPages, schoolInfoSetting, weeklyRoutineSetting } from '../store/db';
import { importMyPageFromText } from '../store/pages';
import { routineIsEmpty } from '../store/staff';
import { planPack, routineWithPages, type PackPlan, type SchoolPack } from './pack';

/** What adding a pack here would do, given what is on this device now. */
export async function planPackHere(pack: SchoolPack): Promise<PackPlan> {
  const pages = await getMyPages();
  return planPack(pack, {
    pageNames: pages.map((page) => page.name),
    routineEmpty: routineIsEmpty(weeklyRoutineSetting.signal.value),
    info: schoolInfoSetting.signal.value,
  });
}

export type PackResult = { addedPages: number; addedRoutine: boolean; filledInfo: number; notes: string[] };

/**
 * Adds a pack to this device. Only adds: a page whose name is already here is left alone, the timetable goes in only if
 * there is none, and school details fill in only what is blank. Nothing is replaced and nothing is removed.
 */
export async function applyPackHere(pack: SchoolPack): Promise<PackResult> {
  const plan = await planPackHere(pack);
  const notes: string[] = [];
  const pageIdsByName = new Map<string, string>();
  for (const page of await getMyPages()) pageIdsByName.set(page.name.toLowerCase(), page.id);

  let addedPages = 0;
  for (const entry of pack.pages) {
    if (!plan.addPages.includes(entry.name)) continue;
    const imported = await importMyPageFromText(entry.obf);
    if (!imported.ok) {
      notes.push(`“${entry.name}” could not be added.`);
      continue;
    }
    addedPages += 1;
    pageIdsByName.set(entry.name.toLowerCase(), imported.page.id);
  }

  let addedRoutine = false;
  if (plan.addRoutine) {
    const routine = routineWithPages(pack, pageIdsByName);
    if (routine) {
      await weeklyRoutineSetting.set(routine);
      addedRoutine = true;
    }
  }

  if (plan.fillInfo.length > 0 && pack.info) {
    const next = { ...schoolInfoSetting.signal.value };
    for (const key of plan.fillInfo) next[key] = pack.info[key] ?? '';
    await schoolInfoSetting.set(next);
  }
  return { addedPages, addedRoutine, filledInfo: plan.fillInfo.length, notes };
}
