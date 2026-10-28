import { isAppLink } from '../../shared/appLink';

// Other apps on the same device (a phone call, photos, the settings, a favourite game), opened from a big tile. An adult adds
// each one in Parent Mode with a link such as "facetime:"; the child presses the tile, and the device opens that app. Only a
// link to an app is allowed, never a web address, so this cannot take the child onto the internet. The list is for this device,
// so it is not in a backup: a link that opens an app here may mean nothing on another device.

export type MyApp = {
  id: string;
  name: string;
  emoji: string;
  link: string;
};

export const MAX_APPS = 24;

export const isAppList = (value: unknown): value is MyApp[] =>
  Array.isArray(value) &&
  value.length <= MAX_APPS &&
  value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const a = entry as Record<string, unknown>;
    return typeof a['id'] === 'string' && typeof a['name'] === 'string' && typeof a['emoji'] === 'string' && isAppLink(a['link']);
  });

export type Preset = { name: string; emoji: string; link: string };

export type Device = 'ios' | 'windows' | 'mac' | 'other';

export function deviceKind(): Device {
  if (window.myWords?.platform === 'ios') return 'ios';
  const platform = typeof navigator === 'undefined' ? '' : navigator.platform || '';
  if (/^Win/i.test(platform)) return 'windows';
  if (/^Mac/i.test(platform)) return 'mac';
  return 'other';
}

/** Apps that come with each kind of device, one press to add. The link is shown to the adult, who can change it. */
export const PRESETS: Record<Device, Preset[]> = {
  ios: [
    { name: 'Messages', emoji: '💬', link: 'sms:' },
    { name: 'FaceTime', emoji: '📹', link: 'facetime://' },
    { name: 'Photos', emoji: '🖼️', link: 'photos-redirect://' },
    { name: 'Music', emoji: '🎵', link: 'music://' },
    { name: 'Maps', emoji: '🗺️', link: 'maps://' },
    { name: 'Calendar', emoji: '📅', link: 'calshow://' },
    { name: 'Notes', emoji: '📝', link: 'mobilenotes://' },
    { name: 'Settings', emoji: '⚙️', link: 'app-settings:' },
  ],
  windows: [
    { name: 'Photos', emoji: '🖼️', link: 'ms-photos:' },
    { name: 'Camera', emoji: '📷', link: 'microsoft.windows.camera:' },
    { name: 'Calculator', emoji: '🧮', link: 'calculator:' },
    { name: 'Clock', emoji: '⏰', link: 'ms-clock:' },
    { name: 'Settings', emoji: '⚙️', link: 'ms-settings:' },
  ],
  mac: [
    { name: 'FaceTime', emoji: '📹', link: 'facetime:' },
    { name: 'Messages', emoji: '💬', link: 'sms:' },
    { name: 'Music', emoji: '🎵', link: 'music:' },
    { name: 'Photos', emoji: '🖼️', link: 'photos:' },
    { name: 'Notes', emoji: '📝', link: 'notes://' },
    { name: 'Settings', emoji: '⚙️', link: 'x-apple.systempreferences:' },
  ],
  other: [],
};

export function appFromForm(name: string, emoji: string, link: string): MyApp | { problem: string } {
  const cleanLink = link.trim();
  if (!isAppLink(cleanLink)) {
    return {
      problem: /^https?:/i.test(cleanLink)
        ? 'That is a web address. Only links that open an app on this device can be added, so nothing here goes onto the internet.'
        : 'That is not a link that opens an app. It looks like "facetime:" or "mygame://start".',
    };
  }
  return {
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 60) || 'App',
    emoji: emoji.trim() || '📲',
    link: cleanLink,
  };
}
