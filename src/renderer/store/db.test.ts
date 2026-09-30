import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DB_VERSION,
  clearRecent,
  ensureSeeded,
  exportBackupPayload,
  getAccessSettings,
  getActiveProfile,
  getActiveProfileId,
  getBoard,
  getDayPlan,
  getDaySettings,
  getFavourites,
  getMyPages,
  getPeople,
  getPhoto,
  getPlaces,
  getProfiles,
  getRecentEntries,
  getRootBoard,
  getVoiceClip,
  createMyPage,
  deleteMyPage,
  renameMyPage,
  importBackupPayload,
  isRecentEnabled,
  recordUtteranceIfEnabled,
  resetDBConnectionForTests,
  saveDayPlan,
  savePerson,
  savePhoto,
  savePlace,
  getSessionState,
  hasCompletedFirstRun,
  getMedicalInfo,
  getPreferredSpeechRate,
  getPreferredVoiceURI,
  saveFavourite,
  saveProfile,
  saveVoiceClip,
  setAccessSettings,
  setActiveProfileId,
  setDaySettings,
  setFirstRunCompleted,
  setMedicalInfo,
  setPreferredSpeechRate,
  setPreferredVoiceURI,
  setRecentEnabled,
  setSessionState,
  updateBoard,
} from './db';
import { FEELINGS_BOARD_ID, ROOT_BOARD_ID, SCHOOL_BOARD_ID } from '../vocab/starter';

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
});

describe('ensureSeeded', () => {
  it('seeds the starter boards on first run', async () => {
    await ensureSeeded();
    const root = await getRootBoard();
    expect(root?.id).toBe(ROOT_BOARD_ID);
    expect(root?.buttons.length).toBeGreaterThan(0);
  });

  it('seeds a default set of favourites on first run', async () => {
    await ensureSeeded();
    const favourites = await getFavourites();
    expect(favourites.length).toBeGreaterThan(0);
    expect(favourites.map((item) => item.id)).toContain('help');
  });

  it('saveFavourite adds a new item, idempotently on repeat (long-press-to-favourite)', async () => {
    await ensureSeeded();
    const before = (await getFavourites()).length;

    await saveFavourite({ id: 'go', label: 'go' });
    const afterOnce = await getFavourites();
    expect(afterOnce).toHaveLength(before + 1);
    expect(afterOnce.map((item) => item.id)).toContain('go');

    await saveFavourite({ id: 'go', label: 'go' });
    expect(await getFavourites()).toHaveLength(before + 1);
  });

  it('does not overwrite a board an adult has since edited', async () => {
    await ensureSeeded();
    const root = await getRootBoard();
    expect(root).toBeDefined();

    const db = await import('idb');
    const handle = await db.openDB('my-words', DB_VERSION);
    const edited = { ...root!, name: 'Edited by parent' };
    await handle.put('boards', edited);
    handle.close();
    resetDBConnectionForTests();

    await ensureSeeded();
    const after = await getBoard(ROOT_BOARD_ID);
    expect(after?.name).toBe('Edited by parent');
  });
});

describe('communication history (invariant I2)', () => {
  it('is off by default', async () => {
    expect(await isRecentEnabled()).toBe(false);
  });

  it('records nothing while disabled', async () => {
    await recordUtteranceIfEnabled('I want a drink');
    expect(await getRecentEntries()).toEqual([]);
  });

  it('records utterances once switched on, most recent first', async () => {
    await setRecentEnabled(true);
    await recordUtteranceIfEnabled('I feel worried, a lot');
    await recordUtteranceIfEnabled("I'm lost");
    const entries = await getRecentEntries();
    expect(entries.map((e) => e.text)).toEqual(["I'm lost", 'I feel worried, a lot']);
  });

  it('records Help utterances the same way as anything else (CLAUDE.md §6)', async () => {
    await setRecentEnabled(true);
    await recordUtteranceIfEnabled('Someone hurt me');
    const [entry] = await getRecentEntries();
    // No special field, no flag — an entry from Help looks identical to
    // any other entry: just text and a timestamp.
    expect(Object.keys(entry!).sort()).toEqual(['id', 'text', 'timestamp']);
  });

  it('clear actually empties the store', async () => {
    await setRecentEnabled(true);
    await recordUtteranceIfEnabled('I want a drink');
    expect(await getRecentEntries()).toHaveLength(1);

    await clearRecent();
    expect(await getRecentEntries()).toEqual([]);
  });

  it('survives a fresh connection to the same database (restart)', async () => {
    await setRecentEnabled(true);
    await recordUtteranceIfEnabled('I want a drink');
    resetDBConnectionForTests();

    expect(await getRecentEntries()).toHaveLength(1);
    expect(await isRecentEnabled()).toBe(true);
  });
});

// fake-indexeddb doesn't implement structured-clone for Blob values (a
// stored Blob comes back as {}), so these only check the id-based API
// shape — savePhoto never returns or accepts a filesystem path, ids are
// unique. The actual blob content round-trips correctly against real
// IndexedDB, verified in tests/e2e/parent-mode-photos.spec.ts.
describe('photos and voice clips (PLAN.md Phase 4)', () => {
  it('returns a string id, and getPhoto resolves something for it', async () => {
    const id = await savePhoto(new Blob(['fake-jpeg-bytes'], { type: 'image/jpeg' }));
    expect(typeof id).toBe('string');
    expect(await getPhoto(id)).toBeDefined();
  });

  it('gives every saved photo a distinct id', async () => {
    const a = await savePhoto(new Blob(['a']));
    const b = await savePhoto(new Blob(['b']));
    expect(a).not.toBe(b);
  });

  it('returns a string id, and getVoiceClip resolves something for it', async () => {
    const id = await saveVoiceClip(new Blob(['fake-audio-bytes'], { type: 'audio/webm' }));
    expect(typeof id).toBe('string');
    expect(await getVoiceClip(id)).toBeDefined();
  });
});

describe('People and Places as first-class records (PLAN.md Phase 4)', () => {
  it('saves and lists a person with a photo and phrases', async () => {
    const photoId = await savePhoto(new Blob(['photo']));
    await savePerson({
      id: 'mum',
      name: 'Mum',
      relationship: 'Mum',
      photoBlobId: photoId,
      phrases: ['I miss you', 'Can you help me?'],
    });

    const people = await getPeople();
    expect(people).toHaveLength(1);
    expect(people[0]).toMatchObject({ id: 'mum', name: 'Mum', relationship: 'Mum' });
  });

  it('saves and lists a place', async () => {
    await savePlace({ id: 'park', name: 'the park', phrases: ['Can we go to the park?'] });
    const places = await getPlaces();
    expect(places).toHaveLength(1);
    expect(places[0]?.name).toBe('the park');
  });
});

describe('My Day (PLAN.md Phase 5)', () => {
  it('returns an empty plan for a date nothing has been saved for', async () => {
    const plan = await getDayPlan('2026-03-05');
    expect(plan).toEqual({ date: '2026-03-05', activities: [] });
  });

  it('saves and retrieves a plan by date, and each date is independent', async () => {
    await saveDayPlan({ date: '2026-03-05', activities: [{ id: 'lunch', name: 'Lunch' }] });
    await saveDayPlan({ date: '2026-03-06', activities: [] });

    expect((await getDayPlan('2026-03-05')).activities).toHaveLength(1);
    expect((await getDayPlan('2026-03-06')).activities).toHaveLength(0);
  });

  it('survives a fresh connection to the same database (restart)', async () => {
    await saveDayPlan({ date: '2026-03-05', activities: [{ id: 'lunch', name: 'Lunch' }] });
    resetDBConnectionForTests();
    expect((await getDayPlan('2026-03-05')).activities.map((a) => a.id)).toEqual(['lunch']);
  });

  it('defaults countdowns off and the Today view', async () => {
    expect(await getDaySettings()).toEqual({ view: 'today', countdownEnabled: false });
  });

  it('persists a deliberate change to day settings', async () => {
    await setDaySettings({ view: 'nowNextLater', countdownEnabled: true });
    expect(await getDaySettings()).toEqual({ view: 'nowNextLater', countdownEnabled: true });
  });
});

describe('Profiles (PLAN.md Phase 6)', () => {
  it('seeds the four named profiles on first read', async () => {
    const profiles = await getProfiles();
    expect(profiles.map((p) => p.name).sort()).toEqual(['Grandparents', 'Home', 'Hospital', 'School']);
  });

  it('defaults the active profile to Home, opening at the root board', async () => {
    const active = await getActiveProfile();
    expect(active.id).toBe('home');
    expect(active.rootBoardId).toBe(ROOT_BOARD_ID);
  });

  it('School and Hospital open somewhere other than the root board by default', async () => {
    const profiles = await getProfiles();
    expect(profiles.find((p) => p.id === 'school')?.rootBoardId).toBe(SCHOOL_BOARD_ID);
    expect(profiles.find((p) => p.id === 'hospital')?.rootBoardId).toBe(FEELINGS_BOARD_ID);
  });

  it('switching the active profile persists across a fresh connection', async () => {
    await setActiveProfileId('school');
    resetDBConnectionForTests();

    expect(await getActiveProfileId()).toBe('school');
    expect((await getActiveProfile()).id).toBe('school');
  });

  it('an adult can repoint a profile at a different board', async () => {
    const profiles = await getProfiles();
    const home = profiles.find((p) => p.id === 'home')!;
    await saveProfile({ ...home, rootBoardId: SCHOOL_BOARD_ID });

    const updated = (await getProfiles()).find((p) => p.id === 'home');
    expect(updated?.rootBoardId).toBe(SCHOOL_BOARD_ID);
  });
});

describe('Access settings (PLAN.md Phase 7)', () => {
  it('defaults to everything off — ordinary touch/mouse behaviour is unaffected', async () => {
    expect(await getAccessSettings()).toEqual({
      dwellMs: 0,
      repeatSuppressMs: 0,
      scanningMode: 'off',
      scanIntervalMs: 1500,
      highContrast: 'off',
      textScale: 1,
      reduceMotion: false,
      lowArousalPalette: false,
    });
  });

  it('persists a deliberate change across a fresh connection', async () => {
    await setAccessSettings({
      dwellMs: 800,
      repeatSuppressMs: 500,
      scanningMode: 'twoSwitchStepped',
      scanIntervalMs: 1500,
      highContrast: 'dark',
      textScale: 1.5,
      reduceMotion: true,
      lowArousalPalette: true,
    });
    resetDBConnectionForTests();

    expect(await getAccessSettings()).toMatchObject({ dwellMs: 800, scanningMode: 'twoSwitchStepped' });
  });
});

describe('Backup and restore (PLAN.md Phase 6)', () => {
  it('exports everything needed to reproduce the current state', async () => {
    await ensureSeeded();
    await setRecentEnabled(true);
    await recordUtteranceIfEnabled('I want a drink');
    await savePerson({ id: 'mum', name: 'Mum', phrases: ['hello'] });
    await saveDayPlan({ date: '2026-03-05', activities: [{ id: 'lunch', name: 'Lunch' }] });
    await setActiveProfileId('school');

    const payload = await exportBackupPayload();
    expect(payload.boards.length).toBeGreaterThan(0);
    expect(payload.recent).toHaveLength(1);
    expect(payload.people).toHaveLength(1);
    expect(payload.dayPlans).toHaveLength(1);
    expect(payload.meta.recentEnabled).toBe(true);
    expect(payload.meta.activeProfileId).toBe('school');
  });

  it('restoring a backup reproduces its content on a clean database', async () => {
    await ensureSeeded();
    await setRecentEnabled(true);
    await recordUtteranceIfEnabled('I want a drink');
    await savePerson({ id: 'mum', name: 'Mum', relationship: 'Mum', phrases: ['hello'] });
    await savePlace({ id: 'park', name: 'the park', phrases: [] });
    await saveDayPlan({ date: '2026-03-05', activities: [{ id: 'lunch', name: 'Lunch' }] });
    await setActiveProfileId('hospital');
    await setMedicalInfo({
      childName: 'Sam',
      allergies: 'Peanuts',
      conditions: '',
      contacts: [{ name: 'Mum', phone: '07700 900001' }],
    });
    const board = await getBoard(ROOT_BOARD_ID);
    const edited = { ...board!, name: 'Edited Talk' };
    await updateBoard(edited);
    const myPage = await createMyPage('Weekend words');

    const payload = await exportBackupPayload();

    // A genuinely clean database — a different machine, not just a reset
    // connection to the same one.
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();

    await importBackupPayload(payload);

    expect((await getBoard(ROOT_BOARD_ID))?.name).toBe('Edited Talk');
    expect(await getRecentEntries()).toHaveLength(1);
    expect((await getRecentEntries())[0]?.text).toBe('I want a drink');
    expect(await isRecentEnabled()).toBe(true);
    expect(await getPeople()).toHaveLength(1);
    expect(await getPlaces()).toHaveLength(1);
    expect((await getDayPlan('2026-03-05')).activities).toHaveLength(1);
    expect(await getActiveProfileId()).toBe('hospital');
    expect(await getMedicalInfo()).toEqual({
      childName: 'Sam',
      allergies: 'Peanuts',
      conditions: '',
      contacts: [{ name: 'Mum', phone: '07700 900001' }],
    });
    expect(await getMyPages()).toEqual([myPage]);
    expect((await getBoard(myPage.boardId))?.name).toBe('Weekend words');
  });

  it('restoring replaces rather than merges — stale data from before the restore is gone', async () => {
    await ensureSeeded();
    await savePerson({ id: 'stale', name: 'Stale Person', phrases: [] });

    const payload = await exportBackupPayload();
    payload.people = payload.people.filter((p) => p.id !== 'stale');

    await importBackupPayload(payload);

    expect(await getPeople()).toHaveLength(0);
  });
});

describe('Medical info (feature review, Aug 2026)', () => {
  it('is empty on a fresh database', async () => {
    expect(await getMedicalInfo()).toEqual({
      childName: '',
      allergies: '',
      conditions: '',
      contacts: [],
    });
  });

  it('persists a deliberate change across a fresh connection', async () => {
    await setMedicalInfo({
      childName: 'Sam',
      allergies: 'Peanuts, penicillin',
      conditions: 'Asthma',
      contacts: [{ name: 'Mum', phone: '07700 900001' }],
    });
    resetDBConnectionForTests();

    expect(await getMedicalInfo()).toEqual({
      childName: 'Sam',
      allergies: 'Peanuts, penicillin',
      conditions: 'Asthma',
      contacts: [{ name: 'Mum', phone: '07700 900001' }],
    });
  });
});

describe('First run and preferred voice (PLAN.md Phase 8)', () => {
  it('has not completed first run on a fresh database', async () => {
    expect(await hasCompletedFirstRun()).toBe(false);
  });

  it('persists completion across a fresh connection', async () => {
    await setFirstRunCompleted();
    resetDBConnectionForTests();
    expect(await hasCompletedFirstRun()).toBe(true);
  });

  it('has no preferred voice by default, and persists a deliberate choice', async () => {
    expect(await getPreferredVoiceURI()).toBeUndefined();
    await setPreferredVoiceURI('Voice A');
    resetDBConnectionForTests();
    expect(await getPreferredVoiceURI()).toBe('Voice A');
  });

  it('defaults speech rate to 1x, and persists a deliberate choice', async () => {
    expect(await getPreferredSpeechRate()).toBe(1);
    await setPreferredSpeechRate(0.75);
    resetDBConnectionForTests();
    expect(await getPreferredSpeechRate()).toBe(0.75);
  });
});

describe('Crash recovery session state (PLAN.md Phase 8)', () => {
  it('has no session state on a fresh database', async () => {
    expect(await getSessionState()).toBeNull();
  });

  it('persists and clears explicitly', async () => {
    await setSessionState({ boardStack: [ROOT_BOARD_ID, 'food'], sentence: [{ id: 'i', label: 'I' }] });
    resetDBConnectionForTests();
    expect(await getSessionState()).toEqual({
      boardStack: [ROOT_BOARD_ID, 'food'],
      sentence: [{ id: 'i', label: 'I' }],
    });

    await setSessionState(null);
    expect(await getSessionState()).toBeNull();
  });
});

describe('My Pages (feature review follow-up, Sep 2026)', () => {
  it('has no pages on a fresh database', async () => {
    expect(await getMyPages()).toEqual([]);
  });

  it('creates a page with its own empty board, and lists it', async () => {
    const page = await createMyPage('My words');
    expect(await getMyPages()).toEqual([page]);

    const board = await getBoard(page.boardId);
    expect(board).toEqual({
      id: page.boardId,
      name: 'My words',
      grid: { rows: 3, columns: 3, order: expect.any(Array) },
      buttons: [],
    });
  });

  it('renaming a page also renames its underlying board', async () => {
    const page = await createMyPage('Old name');
    await renameMyPage(page.id, 'New name');

    expect(await getMyPages()).toEqual([{ ...page, name: 'New name' }]);
    expect((await getBoard(page.boardId))?.name).toBe('New name');
  });

  it('deleting a page removes it from the list and deletes its board', async () => {
    const page = await createMyPage('Temporary');
    await deleteMyPage(page.id);

    expect(await getMyPages()).toEqual([]);
    expect(await getBoard(page.boardId)).toBeUndefined();
  });

  it('persists across a fresh connection', async () => {
    const page = await createMyPage('Persisted');
    resetDBConnectionForTests();
    expect(await getMyPages()).toEqual([page]);
  });
});
