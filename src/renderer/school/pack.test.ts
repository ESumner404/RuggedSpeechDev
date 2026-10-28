import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import { PACK_TYPE, buildPack, parsePack, planPack } from './pack';
import { applyPackHere } from './applyPack';
import { EMPTY_ROUTINE, createMyPage, getMyPages, resetDBConnectionForTests, schoolInfoSetting, weeklyRoutineSetting } from '../store/db';
import { EMPTY_SCHOOL_INFO } from '../store/staff';
import { exportMyPageText } from '../store/pages';

const obf = JSON.stringify({ format: 'open-board-0.1', id: 'x', name: 'Maths lesson', grid: { rows: 1, columns: 1, order: [['b']] }, buttons: [{ id: 'b', label: 'add' }] });

describe('making a school pack', () => {
  it('holds pages, the timetable and the school’s details, and nothing about a pupil', () => {
    const text = buildPack({
      name: 'Class 3',
      pages: [{ name: 'Maths lesson', obf }],
      routine: { ...EMPTY_ROUTINE, mon: [{ id: 'a', name: 'Maths', pageId: 'page-1', finished: true, changedFrom: 'Art' }] },
      pageNames: new Map([['page-1', 'Maths lesson']]),
      info: { ...EMPTY_SCHOOL_INFO, school: 'Oakfield', teacher: 'Ms Khan', keyAdult: 'Sam (a pupil’s key adult)', dsl: 'Mr Lee' },
    });
    const pack = JSON.parse(text);
    expect(pack.type).toBe(PACK_TYPE);
    expect(pack.routine.mon[0]).toEqual({ id: 'a', name: 'Maths' });
    expect(pack.routinePages).toEqual({ 'mon:a': 'Maths lesson' });
    expect(pack.info).toEqual({ school: 'Oakfield', teacher: 'Ms Khan', dsl: 'Mr Lee' });
    expect(text).not.toContain('Sam');
  });

  it('can leave the timetable and details out', () => {
    const pack = JSON.parse(buildPack({ name: '', pages: [] }));
    expect(pack.name).toBe('School pack');
    expect(pack.routine).toBeUndefined();
    expect(pack.info).toBeUndefined();
  });
});

describe('reading a school pack', () => {
  const good = buildPack({ name: 'Class 3', pages: [{ name: 'Maths lesson', obf }] });

  it('accepts a pack it made', () => {
    const parsed = parsePack(good);
    expect(parsed.ok && parsed.pack.pages[0]!.name).toBe('Maths lesson');
  });

  it('refuses anything else: not JSON, another kind of file, a newer version, damaged parts', () => {
    for (const text of ['', 'not json', '[]', '{"type":"other"}', JSON.stringify({ type: PACK_TYPE, v: 2, name: 'x', made: 'y', pages: [] }), JSON.stringify({ type: PACK_TYPE, v: 1, name: 'x', made: 'y', pages: [{ name: '' , obf: 'x'}] }), JSON.stringify({ type: PACK_TYPE, v: 1, name: 'x', made: 'y', pages: [], routine: { mon: 'no' } })]) {
      expect(parsePack(text).ok, text).toBe(false);
    }
  });
});

describe('what a pack would do here', () => {
  const pack = (() => {
    const parsed = parsePack(buildPack({
      name: 'p',
      pages: [{ name: 'Maths lesson', obf }, { name: 'Story time', obf }],
      routine: { ...EMPTY_ROUTINE, mon: [{ id: 'a', name: 'Maths' }] },
      info: { ...EMPTY_SCHOOL_INFO, school: 'Oakfield', phone: '0123' },
    }));
    if (!parsed.ok) throw new Error('bad');
    return parsed.pack;
  })();

  it('adds what is not here, and leaves what is', () => {
    const plan = planPack(pack, { pageNames: ['maths LESSON'], routineEmpty: true, info: { ...EMPTY_SCHOOL_INFO, phone: '999' } });
    expect(plan).toEqual({ addPages: ['Story time'], skipPages: ['Maths lesson'], addRoutine: true, skipRoutine: false, fillInfo: ['school'] });
  });

  it('never replaces a timetable that is there', () => {
    expect(planPack(pack, { pageNames: [], routineEmpty: false, info: EMPTY_SCHOOL_INFO })).toMatchObject({ addRoutine: false, skipRoutine: true });
  });
});

describe('adding a pack to a device', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    weeklyRoutineSetting.reset();
    schoolInfoSetting.reset();
  });

  it('adds the pages, the timetable pointed at them, and blank details, and a second time adds nothing', async () => {
    const source = await createMyPage('Maths lesson');
    const text = await exportMyPageText(source);
    expect(text).not.toBeNull();
    const built = buildPack({
      name: 'Class 3',
      pages: [{ name: 'Maths lesson', obf: text! }],
      routine: { ...EMPTY_ROUTINE, mon: [{ id: 'a', name: 'Maths', pageId: source.id }] },
      pageNames: new Map([[source.id, 'Maths lesson']]),
      info: { ...EMPTY_SCHOOL_INFO, school: 'Oakfield' },
    });
    const parsed = parsePack(built);
    if (!parsed.ok) throw new Error('bad');

    // A fresh device.
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    const first = await applyPackHere(parsed.pack);
    expect(first).toMatchObject({ addedPages: 1, addedRoutine: true, filledInfo: 1 });
    const pages = await getMyPages();
    expect(pages.map((p) => p.name)).toEqual(['Maths lesson']);
    expect(weeklyRoutineSetting.signal.value.mon[0]!.pageId).toBe(pages[0]!.id);
    expect(schoolInfoSetting.signal.value.school).toBe('Oakfield');

    const second = await applyPackHere(parsed.pack);
    expect(second).toMatchObject({ addedPages: 0, addedRoutine: false, filledInfo: 0 });
    expect(await getMyPages()).toHaveLength(1);
  });
});
