// How the Parent PIN and its recovery code are kept. They are not stored as
// typed: each is kept as a salted hash, so reading the database, or a backup
// file, does not show them. Be clear about what this is. A four-digit PIN
// cannot be made safe against someone who can copy the files on the
// computer, because there are only ten thousand of them. The PIN keeps a
// child, or a curious person using the app, out of the settings. It is not
// encryption, and it is not a lock on the device (PRINCIPLES.md section 3).
// The backup passphrase is what protects a backup file.

export type HashedSecret = { salt: string; hash: string; iterations: number };

const HASH_ITERATIONS = 100_000;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derive(secret: string, salt: Uint8Array, iterations: number): Promise<string> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' }, material, 256);
  return toHex(new Uint8Array(bits));
}

export async function hashSecret(secret: string): Promise<HashedSecret> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: toHex(salt), hash: await derive(secret, salt, HASH_ITERATIONS), iterations: HASH_ITERATIONS };
}

/** Compared without stopping at the first different character. */
function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

export async function verifySecret(secret: string, record: HashedSecret): Promise<boolean> {
  return sameText(await derive(secret, fromHex(record.salt), record.iterations), record.hash);
}

export const isHashedSecret = (value: unknown): value is HashedSecret =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as HashedSecret).salt === 'string' &&
  typeof (value as HashedSecret).hash === 'string' &&
  Number.isInteger((value as HashedSecret).iterations) &&
  (value as HashedSecret).iterations > 0;

// After a few wrong PINs in a row the keypad waits, longer each time. It
// stops a child pressing numbers at random for ever, and it makes guessing
// slow for anyone else. It lives in memory, so it also covers closing and
// reopening the PIN screen.
export const FREE_ATTEMPTS = 5;
const FIRST_WAIT_MS = 30_000;
const LONGEST_WAIT_MS = 10 * 60_000;

export type PinScope = 'parent' | 'school';

// Each PIN has its own count, so a child pressing numbers at the Parent Mode
// keypad does not lock a teacher out of School Mode, and the other way round.
const failures: Record<PinScope, number> = { parent: 0, school: 0 };
const lockedUntil: Record<PinScope, number> = { parent: 0, school: 0 };

/** Milliseconds left to wait, or 0. */
export function waitRemaining(now: number = Date.now(), scope: PinScope = 'parent'): number {
  return Math.max(0, lockedUntil[scope] - now);
}

export function recordWrongPin(now: number = Date.now(), scope: PinScope = 'parent'): void {
  failures[scope] += 1;
  if (failures[scope] >= FREE_ATTEMPTS) {
    const step = failures[scope] - FREE_ATTEMPTS;
    lockedUntil[scope] = now + Math.min(LONGEST_WAIT_MS, FIRST_WAIT_MS * 2 ** step);
  }
}

export function recordRightPin(scope: PinScope = 'parent'): void {
  failures[scope] = 0;
  lockedUntil[scope] = 0;
}

export function resetPinLockoutForTests(): void {
  recordRightPin('parent');
  recordRightPin('school');
}
