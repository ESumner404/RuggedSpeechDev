import { usageCountsSetting, usageEnabledSetting } from './db';
import { getDateString } from '../day/dayLogic';
import type { UsageCounts } from './types';

// Word counts for a speech and language therapist's review (invariant I2:
// off by default, a retention period, a visible clear button and a hard off
// switch). It keeps how many times each word was pressed on each day and
// nothing else: no sentences, no times of day, no order. Every vocabulary
// button is counted the same way, the Help phrases included, nothing is
// singled out or flagged (PRINCIPLES.md section 6).

export const USAGE_RETENTION_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

function normalise(word: string): string {
  return word.trim().toLowerCase();
}

function dropExpired(counts: UsageCounts, now: Date): UsageCounts {
  const cutoff = getDateString(new Date(now.getTime() - USAGE_RETENTION_DAYS * DAY_MS));
  return Object.fromEntries(Object.entries(counts).filter(([date]) => date >= cutoff));
}

/** Counts one press of a word, if (and only if) an adult has turned counting on. */
export async function recordPress(word: string, now: Date = new Date()): Promise<void> {
  if (!usageEnabledSetting.signal.value) return;
  const key = normalise(word);
  if (!key) return;

  const date = getDateString(now);
  const counts = dropExpired(usageCountsSetting.signal.value, now);
  const today = counts[date] ?? {};
  const next: UsageCounts = { ...counts, [date]: { ...today, [key]: (today[key] ?? 0) + 1 } };

  // The signal moves first so two quick presses can't both read the old
  // total and lose one.
  usageCountsSetting.signal.value = next;
  await usageCountsSetting.set(next);
}

export async function clearUsage(): Promise<void> {
  await usageCountsSetting.set({});
}

export type UsageRow = { word: string; count: number };
export type UsageSummary = { totalPresses: number; distinctWords: number; rows: UsageRow[] };

/** Totals over the last `days` days, today included, most-pressed first. */
export function summariseUsage(counts: UsageCounts, days: number, now: Date = new Date()): UsageSummary {
  const cutoff = getDateString(new Date(now.getTime() - (days - 1) * DAY_MS));
  const totals = new Map<string, number>();
  for (const [date, words] of Object.entries(counts)) {
    if (date < cutoff) continue;
    for (const [word, count] of Object.entries(words)) totals.set(word, (totals.get(word) ?? 0) + count);
  }
  const rows = [...totals.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  return {
    totalPresses: rows.reduce((sum, row) => sum + row.count, 0),
    distinctWords: rows.length,
    rows,
  };
}

/** Words available on the boards that were not pressed at all in the period. */
export function wordsNotUsed(availableWords: string[], summary: UsageSummary): string[] {
  const used = new Set(summary.rows.map((row) => row.word));
  return [...new Set(availableWords.map(normalise))].filter((word) => word && !used.has(word)).sort();
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** One row per word per day, ready for a spreadsheet. */
export function usageToCsv(counts: UsageCounts): string {
  const lines = ['date,word,count'];
  for (const date of Object.keys(counts).sort()) {
    for (const [word, count] of Object.entries(counts[date]!).sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`${date},${csvCell(word)},${count}`);
    }
  }
  return lines.join('\n') + '\n';
}
