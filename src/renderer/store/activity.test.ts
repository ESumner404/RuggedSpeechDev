import { describe, expect, it } from 'vitest';
import {
  MAX_LABEL,
  PERIOD_BARS,
  buckets,
  entriesToCsv,
  formatTime,
  isRetention,
  topSpoken,
  totals,
  type ActivityEntry,
} from './activity';

const at = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min).getTime();
// Wednesday 7 October 2026, 14:30
const NOW = at(2026, 10, 7, 14, 30);

const e = (when: number, kind: ActivityEntry['kind'] = 'speech', label = 'hello'): ActivityEntry => ({ at: when, kind, label });

describe('buckets', () => {
  it('has the right number of bars for each period, oldest first, ending now', () => {
    for (const period of ['hour', 'day', 'week', 'month'] as const) {
      const bars = buckets([], period, NOW);
      expect(bars).toHaveLength(PERIOD_BARS[period]);
      expect(bars.every((b, i) => i === 0 || b.start > bars[i - 1]!.start)).toBe(true);
      expect(bars.every((b) => b.count === 0)).toBe(true);
    }
    expect(buckets([], 'hour', NOW).at(-1)!.label).toBe('14:00');
    expect(buckets([], 'day', NOW).at(-1)!.label).toBe('Wed 7');
    expect(buckets([], 'month', NOW).at(-1)!.label).toBe('Oct 26');
  });

  it('counts each entry in the hour it happened in', () => {
    const bars = buckets([e(at(2026, 10, 7, 14, 5)), e(at(2026, 10, 7, 14, 50)), e(at(2026, 10, 7, 13, 59)), e(at(2026, 10, 6, 14, 5))], 'hour', NOW);
    expect(bars.at(-1)!.count).toBe(2);
    expect(bars.at(-2)!.count).toBe(1);
    expect(bars.reduce((sum, b) => sum + b.count, 0)).toBe(3); // yesterday at 14:05 is more than 24 hours back, so it is left out
  });

  it('counts days, weeks starting on Monday, and months', () => {
    const entries = [e(at(2026, 10, 7)), e(at(2026, 10, 5)), e(at(2026, 10, 4)), e(at(2026, 9, 30)), e(at(2026, 8, 1))];
    const days = buckets(entries, 'day', NOW);
    expect(days.at(-1)!.count).toBe(1);
    const weeks = buckets(entries, 'week', NOW);
    expect(weeks.at(-1)!.label).toBe('5 Oct'); // Monday 5 October
    expect(weeks.at(-1)!.count).toBe(2); // the 7th and the 5th
    expect(weeks.at(-2)!.count).toBe(2); // Sunday the 4th and Wednesday 30 September
    const months = buckets(entries, 'month', NOW);
    expect(months.at(-1)!.count).toBe(3); // the 7th, 5th and 4th
    expect(months.at(-2)!.count).toBe(1);
    expect(months.at(-3)!.count).toBe(1);
  });

  it('can count only some kinds', () => {
    const entries = [e(NOW, 'speech'), e(NOW, 'screen'), e(NOW, 'adult')];
    expect(buckets(entries, 'hour', NOW, ['speech']).at(-1)!.count).toBe(1);
    expect(buckets(entries, 'hour', NOW).at(-1)!.count).toBe(3);
  });

  it('leaves out anything older than the bars cover', () => {
    expect(buckets([e(at(2025, 1, 1))], 'month', NOW).reduce((sum, b) => sum + b.count, 0)).toBe(0);
  });
});

describe('totals', () => {
  it('counts the last hour, today, 7 days and 30 days', () => {
    const entries = [e(NOW - 10 * 60 * 1000), e(at(2026, 10, 7, 9)), e(at(2026, 10, 3)), e(at(2026, 9, 20)), e(at(2026, 8, 1))];
    expect(totals(entries, NOW)).toEqual({ lastHour: 1, today: 2, week: 3, month: 4, all: 5 });
  });
});

describe('topSpoken', () => {
  it('lists what was said most, ignoring case, and only what was said', () => {
    const entries = [e(NOW, 'speech', 'Yes'), e(NOW, 'speech', 'yes'), e(NOW, 'speech', 'no'), e(NOW, 'screen', 'Talk'), e(at(2026, 5, 1), 'speech', 'old')];
    expect(topSpoken(entries, NOW, 30)).toEqual([
      { label: 'yes', count: 2 },
      { label: 'no', count: 1 },
    ]);
  });
});

describe('csv and time', () => {
  it('writes a spreadsheet, newest first, with every cell quoted', () => {
    const csv = entriesToCsv([e(at(2026, 10, 7, 9, 5), 'speech', 'I want "juice"'), e(at(2026, 10, 7, 10, 0), 'screen', 'Talk')]);
    expect(csv).toBe('"When","What","Detail"\r\n"2026-10-07 10:00","Opened","Talk"\r\n"2026-10-07 09:05","Said","I want ""juice"""\r\n');
  });

  it('does not let a spreadsheet run what was said as a formula', () => {
    expect(entriesToCsv([e(NOW, 'speech', '=1+1')])).toContain(`"'=1+1"`);
    expect(entriesToCsv([e(NOW, 'speech', '@SUM(A1)')])).toContain(`"'@SUM(A1)"`);
  });

  it('formats a time in 24 hours', () => {
    expect(formatTime(at(2026, 1, 2, 3, 4))).toBe('2026-01-02 03:04');
  });

  it('only keeps for the lengths on offer', () => {
    expect(isRetention(30)).toBe(true);
    expect(isRetention(31)).toBe(false);
    expect(MAX_LABEL).toBeGreaterThan(50);
  });
});
