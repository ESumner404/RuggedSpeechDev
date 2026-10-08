import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it } from 'vitest';
import { resetDBConnectionForTests, usageCountsSetting, usageEnabledSetting } from './db';
import {
  USAGE_RETENTION_DAYS,
  clearUsage,
  recordPress,
  summariseUsage,
  usageToCsv,
  wordsNotUsed,
} from './usage';

const MONDAY = new Date(2026, 8, 7, 10, 0, 0); // 7 September 2026, local time
const daysAgo = (days: number) => new Date(MONDAY.getTime() - days * 24 * 60 * 60 * 1000);

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
});

describe('recording presses', () => {
  it('records nothing at all while counting is off (the default)', async () => {
    await recordPress('want', MONDAY);
    expect(usageCountsSetting.signal.value).toEqual({});
    expect(await usageCountsSetting.get()).toEqual({});
  });

  it('counts per word per day once an adult turns it on, ignoring case and spacing', async () => {
    await usageEnabledSetting.set(true);
    await recordPress('Want', MONDAY);
    await recordPress(' want ', MONDAY);
    await recordPress('help', MONDAY);
    await recordPress('want', daysAgo(1));
    expect(usageCountsSetting.signal.value).toEqual({
      '2026-09-07': { want: 2, help: 1 },
      '2026-09-06': { want: 1 },
    });
    expect(await usageCountsSetting.get()).toEqual(usageCountsSetting.signal.value);
  });

  it('does not lose a press when two arrive back to back', async () => {
    await usageEnabledSetting.set(true);
    await Promise.all([recordPress('go', MONDAY), recordPress('go', MONDAY), recordPress('go', MONDAY)]);
    expect(usageCountsSetting.signal.value['2026-09-07']).toEqual({ go: 3 });
  });

  it('forgets anything older than the retention period', async () => {
    await usageEnabledSetting.set(true);
    await recordPress('old', daysAgo(USAGE_RETENTION_DAYS + 5));
    await recordPress('new', MONDAY);
    expect(Object.keys(usageCountsSetting.signal.value)).toEqual(['2026-09-07']);
  });

  it('stops recording the moment it is switched off, and clears on request', async () => {
    await usageEnabledSetting.set(true);
    await recordPress('want', MONDAY);
    await usageEnabledSetting.set(false);
    await recordPress('want', MONDAY);
    expect(usageCountsSetting.signal.value['2026-09-07']).toEqual({ want: 1 });

    await clearUsage();
    expect(await usageCountsSetting.get()).toEqual({});
  });
});

describe('reporting', () => {
  const counts = {
    '2026-09-07': { want: 4, more: 1 },
    '2026-09-05': { want: 2, help: 3 },
    '2026-08-01': { want: 9 },
  };

  it('totals the last N days, most-pressed first', () => {
    const week = summariseUsage(counts, 7, MONDAY);
    expect(week.rows).toEqual([
      { word: 'want', count: 6 },
      { word: 'help', count: 3 },
      { word: 'more', count: 1 },
    ]);
    expect(week).toMatchObject({ totalPresses: 10, distinctWords: 3 });
  });

  it('reaches further back with a longer period', () => {
    expect(summariseUsage(counts, 90, MONDAY).rows[0]).toEqual({ word: 'want', count: 15 });
  });

  it('lists words on the boards that were never pressed in the period', () => {
    const week = summariseUsage(counts, 7, MONDAY);
    expect(wordsNotUsed(['Want', 'more', 'yes', 'No', 'yes'], week)).toEqual(['no', 'yes']);
  });

  it('writes a spreadsheet-ready CSV, quoting anything awkward', () => {
    const csv = usageToCsv({ '2026-09-07': { want: 2, 'a, "b"': 1 } });
    expect(csv).toBe('date,word,count\n2026-09-07,"a, ""b""",1\n2026-09-07,want,2\n');
  });
});
