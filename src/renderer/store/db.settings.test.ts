import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createBoard,
  ensureSeeded,
  exportBackupPayload,
  getBoard,
  getPreferredSpeechPitch,
  getPreferredSpeechRate,
  getPressMode,
  getQuickAccess,
  importBackupPayload,
  pressMode,
  preferredSpeechPitch,
  quickAccessButtons,
  resetDBConnectionForTests,
  setPreferredSpeechPitch,
  setPreferredSpeechRate,
  setPressMode,
  setQuickAccess,
} from './db';
import { DEFAULT_QUICK_ACCESS } from './quickAccess';

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
});

describe('voice pitch (docs/build-plan.md Phase 1)', () => {
  it('defaults to 1x, and persists a deliberate choice into the cached signal too', async () => {
    expect(await getPreferredSpeechPitch()).toBe(1);
    await setPreferredSpeechPitch(0.8);
    expect(preferredSpeechPitch.value).toBe(0.8);
    resetDBConnectionForTests();
    expect(await getPreferredSpeechPitch()).toBe(0.8);
  });
});

describe('press mode (docs/build-plan.md Phase 1)', () => {
  it('defaults to building a sentence, so nothing speaks until Speak is pressed', async () => {
    expect(await getPressMode()).toBe('sentence');
    expect(pressMode.value).toBe('sentence');
  });

  it('persists a deliberate choice', async () => {
    await setPressMode('both');
    expect(pressMode.value).toBe('both');
    resetDBConnectionForTests();
    expect(await getPressMode()).toBe('both');
  });
});

describe('Quick Access configuration (docs/build-plan.md Phase 2)', () => {
  it('defaults to Home · Help · Yes · No · Favourites · Keyboard', async () => {
    expect(await getQuickAccess()).toEqual(DEFAULT_QUICK_ACCESS);
  });

  it('persists a deliberate layout', async () => {
    const layout = ['help', 'talk', 'yes', 'no', 'myday', 'home'] as const;
    await setQuickAccess([...layout]);
    expect(quickAccessButtons.value).toEqual([...layout]);
    resetDBConnectionForTests();
    expect(await getQuickAccess()).toEqual([...layout]);
  });

  it('falls back to the default rather than leave the child without Help', async () => {
    await setQuickAccess(['home', 'talk', 'yes', 'no', 'myday', 'keyboard']);
    expect(await getQuickAccess()).toEqual(DEFAULT_QUICK_ACCESS);
  });
});

describe('createBoard', () => {
  it('makes an empty, resizable 3×3 board that can be fetched by id', async () => {
    await ensureSeeded();
    const board = await createBoard('Zoo trip');
    expect(board).toMatchObject({ name: 'Zoo trip', buttons: [], grid: { rows: 3, columns: 3 } });
    expect(await getBoard(board.id)).toEqual(board);
  });
});

describe('backup carries the newer settings', () => {
  it('restores layout, press mode, rate and pitch on a clean database', async () => {
    await ensureSeeded();
    await setQuickAccess(['help', 'talk', 'yes', 'no', 'myday', 'home']);
    await setPressMode('speak');
    await setPreferredSpeechRate(0.7);
    await setPreferredSpeechPitch(1.2);
    const payload = await exportBackupPayload();

    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    await importBackupPayload(payload);

    expect(await getQuickAccess()).toEqual(['help', 'talk', 'yes', 'no', 'myday', 'home']);
    expect(await getPressMode()).toBe('speak');
    expect(await getPreferredSpeechRate()).toBe(0.7);
    expect(await getPreferredSpeechPitch()).toBe(1.2);
  });

  it('an older backup without these fields still restores, leaving them as they are', async () => {
    await ensureSeeded();
    const payload = await exportBackupPayload();
    const oldMeta = { ...payload.meta };
    delete oldMeta.quickAccess;
    delete oldMeta.pressMode;
    delete oldMeta.speechRate;
    delete oldMeta.speechPitch;
    delete oldMeta.voiceURI;

    await setPressMode('both');
    await importBackupPayload({ ...payload, meta: oldMeta });
    expect(await getPressMode()).toBe('both');
  });
});
