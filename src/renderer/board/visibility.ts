import type { Item } from '../store/types';

/**
 * Whether a button appears on the child's board right now. A hidden button
 * never does. A button with a word stage only does once the active stage has
 * reached it (stage 0 means every word is showing). Either way the slot
 * stays where it was and stays empty, so no other button moves (invariant
 * I3).
 */
export function isItemShown(item: Item, activeStage: number): boolean {
  if (item.hidden) return false;
  return activeStage === 0 || item.stage === undefined || item.stage <= activeStage;
}
