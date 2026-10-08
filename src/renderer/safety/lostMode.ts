// Lost mode: for when this device has gone missing. An adult turns it on in
// Parent Mode and it covers the screen with a message asking whoever has it
// to return it. It needs the PIN to turn off. This is a label on the
// screen, not a tracker: the app has no network, so it cannot find or lock a
// device from afar. The details are typed in for this purpose and are only
// ever shown while Lost mode is on.

export type LostMode = {
  on: boolean;
  returnTo: string;
  phone: string;
  address: string;
  note: string;
};

export const EMPTY_LOST_MODE: LostMode = { on: false, returnTo: '', phone: '', address: '', note: '' };

export function isLostMode(value: unknown): value is LostMode {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['on'] === 'boolean' && ['returnTo', 'phone', 'address', 'note'].every((k) => typeof v[k] === 'string');
}

/** Something to return it to is needed before the screen can be turned on. */
export function canTurnOn(lost: LostMode): boolean {
  return Boolean(lost.returnTo.trim() || lost.phone.trim() || lost.address.trim());
}

/** What the screen says, and what is read out when asked. */
export function lostMessage(lost: LostMode, deviceName: string): string {
  const where = [lost.returnTo.trim(), lost.address.trim()].filter(Boolean).join(', ');
  const phone = lost.phone.trim();
  const parts = [`This is a critical communication device${deviceName ? `: ${deviceName}` : ''}.`];
  if (where && phone) parts.push(`Please return it to ${where}, or phone ${phone}.`);
  else if (where) parts.push(`Please return it to ${where}.`);
  else if (phone) parts.push(`Please phone ${phone} to arrange its return.`);
  else parts.push('Please return it to its owner.');
  if (lost.note.trim()) parts.push(lost.note.trim());
  return parts.join(' ');
}
