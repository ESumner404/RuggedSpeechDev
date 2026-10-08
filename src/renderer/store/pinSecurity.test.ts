import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  FREE_ATTEMPTS,
  hashSecret,
  recordRightPin,
  recordWrongPin,
  resetPinLockoutForTests,
  verifySecret,
  waitRemaining,
} from './pinSecurity';
import {
  getParentPinState,
  hasParentPin,
  resetDBConnectionForTests,
  setParentPinState,
  verifyParentPin,
  verifyRecoveryCode,
} from './db';

describe('hashing a secret', () => {
  it('checks the right secret, and not a wrong one', async () => {
    const record = await hashSecret('1234');
    expect(await verifySecret('1234', record)).toBe(true);
    expect(await verifySecret('1235', record)).toBe(false);
    expect(await verifySecret('', record)).toBe(false);
  });

  it('gives a different result each time, so equal PINs do not look equal', async () => {
    const a = await hashSecret('1234');
    const b = await hashSecret('1234');
    expect(a.salt).not.toBe(b.salt);
    expect(a.hash).not.toBe(b.hash);
    expect(JSON.stringify(a)).not.toContain('1234');
  });
});

describe('the PIN is kept as a hash', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    resetPinLockoutForTests();
  });

  it('never stores the PIN or the recovery code as typed', async () => {
    await setParentPinState({ pin: '4821', recoveryCode: 'Anchor-Meadow-Violet-Cobalt' });
    const stored = await getParentPinState();
    // Nothing kept is the PIN or the code as typed. (Compared value by value: the hashes are random hex, which could contain four digits by chance.)
    const values = (value: unknown): unknown[] => (typeof value === 'object' && value !== null ? Object.values(value).flatMap(values) : [value]);
    expect(values(stored)).not.toContain('4821');
    expect(values(stored).map((v) => String(v).toLowerCase())).not.toContain('anchor-meadow-violet-cobalt');
    expect(stored?.pin).toBeUndefined();
    expect(stored?.recoveryCode).toBeUndefined();
    expect(await hasParentPin()).toBe(true);
  });

  it('accepts the right PIN and the recovery code (in any case, with spaces round it), and nothing else', async () => {
    await setParentPinState({ pin: '4821', recoveryCode: 'anchor-meadow-violet-cobalt' });
    expect(await verifyParentPin('4821')).toBe(true);
    expect(await verifyParentPin('4822')).toBe(false);
    expect(await verifyRecoveryCode('  Anchor-Meadow-Violet-Cobalt ')).toBe(true);
    expect(await verifyRecoveryCode('anchor-meadow-violet')).toBe(false);
  });

  it('says there is no PIN until one is set, and accepts nothing before', async () => {
    expect(await hasParentPin()).toBe(false);
    expect(await verifyParentPin('0000')).toBe(false);
  });

  it('a PIN saved as plain text by an older version still works, and is turned into a hash when used', async () => {
    const { openDB } = await import('idb');
    const db = await openDB('my-words', 6, {
      upgrade(upgradeDb) {
        for (const name of ['boards', 'meta', 'favourites', 'recent', 'photos', 'voiceClips', 'people', 'places', 'dayPlans', 'profiles', 'activity']) {
          if (!upgradeDb.objectStoreNames.contains(name)) upgradeDb.createObjectStore(name);
        }
      },
    });
    await db.put('meta', { pin: '9090', recoveryCode: 'willow-granite-copper' }, 'parentPin');
    db.close();
    resetDBConnectionForTests();

    expect(await verifyParentPin('0000')).toBe(false);
    expect((await getParentPinState())?.pin).toBe('9090'); // a wrong try changes nothing
    expect(await verifyParentPin('9090')).toBe(true);
    const upgraded = await getParentPinState();
    expect(upgraded?.pin).toBeUndefined();
    expect(upgraded?.pinHash).toBeDefined();
    expect(upgraded?.recoveryHash).toBeDefined();
    expect(Object.values(upgraded ?? {}).flatMap((v) => (typeof v === 'object' && v ? Object.values(v) : [v]))).not.toContain('9090');
    expect(await verifyParentPin('9090')).toBe(true);
    expect(await verifyRecoveryCode('willow-granite-copper')).toBe(true);
  });
});

describe('waiting after wrong PINs', () => {
  beforeEach(() => resetPinLockoutForTests());

  it('allows a few wrong tries, then makes the keypad wait, longer each time', () => {
    const now = 1_000_000;
    for (let i = 0; i < FREE_ATTEMPTS - 1; i += 1) {
      recordWrongPin(now);
      expect(waitRemaining(now)).toBe(0);
    }
    recordWrongPin(now);
    expect(waitRemaining(now)).toBe(30_000);
    expect(waitRemaining(now + 31_000)).toBe(0);
    recordWrongPin(now + 31_000);
    expect(waitRemaining(now + 31_000)).toBe(60_000);
  });

  it('never waits longer than ten minutes, and the right PIN clears it', () => {
    const now = 5_000;
    for (let i = 0; i < 40; i += 1) recordWrongPin(now);
    expect(waitRemaining(now)).toBe(10 * 60_000);
    recordRightPin();
    expect(waitRemaining(now)).toBe(0);
  });
});

describe('the Parent PIN and the School PIN wait separately', () => {
  beforeEach(() => resetPinLockoutForTests());

  it('wrong tries at one keypad do not lock the other', () => {
    const now = 1_000;
    for (let i = 0; i < FREE_ATTEMPTS; i += 1) recordWrongPin(now, 'parent');
    expect(waitRemaining(now, 'parent')).toBeGreaterThan(0);
    expect(waitRemaining(now, 'school')).toBe(0);
    for (let i = 0; i < FREE_ATTEMPTS; i += 1) recordWrongPin(now, 'school');
    expect(waitRemaining(now, 'school')).toBeGreaterThan(0);
    recordRightPin('parent');
    expect(waitRemaining(now, 'parent')).toBe(0);
    expect(waitRemaining(now, 'school')).toBeGreaterThan(0);
  });
});

describe('the School PIN is kept as a hash, separately from the Parent PIN', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
  });

  it('is not the Parent PIN, is not kept as typed, and can be forgotten', async () => {
    const { hasSchoolPin, setSchoolPin, verifySchoolPin, clearSchoolPin } = await import('./db');
    await setParentPinState({ pin: '1111', recoveryCode: 'anchor-meadow-violet-cobalt' });
    expect(await hasSchoolPin()).toBe(false);
    expect(await verifySchoolPin('1111')).toBe(false);
    await setSchoolPin('2222');
    expect(await verifySchoolPin('2222')).toBe(true);
    expect(await verifySchoolPin('1111')).toBe(false);
    expect(await verifyParentPin('2222')).toBe(false);
    expect(await verifyParentPin('1111')).toBe(true);
    const { openDB } = await import('idb');
    const db = await openDB('my-words');
    const stored = (await db.get('meta', 'schoolPin')) as Record<string, unknown>;
    db.close();
    expect(Object.keys(stored)).toEqual(['pinHash']);
    expect(Object.values(stored.pinHash as object)).not.toContain('2222');
    await clearSchoolPin();
    expect(await hasSchoolPin()).toBe(false);
  });
});
