import type { UserProfile } from '../store/types';

export const APP_NAME = 'Rugged Speech Test';

/** "Lucy's", "James's": the name with its possessive, as it is said in English. */
export function possessive(name: string): string {
  return `${name.trim()}'s`;
}

/** What to call this device: the name typed in, or made from the person's name, or the app's own. */
export function deviceTitle(profile: UserProfile): string {
  const device = profile.deviceName.trim();
  if (device) return device;
  const name = profile.name.trim();
  return name ? `${possessive(name)} device` : APP_NAME;
}

/** The whole years typed, or undefined if blank or not a sensible age. */
export function ageYears(profile: UserProfile): number | undefined {
  const text = profile.age.trim();
  if (!/^\d{1,2}$/.test(text)) return undefined;
  return Number(text);
}
