// The activity log: an opt-in record of what was said and which parts of the
// app were used, with the time. It is for an adult or a therapist who wants
// to see how the device is being used, hour by hour, day by day. It follows
// the same rules as every other record of use (PRINCIPLES.md section 2, I2): it
// is off until an adult turns it on, it keeps only as long as the retention
// period, it has a visible Clear button and a hard off switch, and it stays
// on this computer unless an adult exports it. Every phrase is logged the
// same way. The Help phrases are not singled out or flagged (section 6).

export type ActivityKind = 'speech' | 'screen' | 'adult';

export type ActivityEntry = {
  id?: number;
  /** Milliseconds since 1970. */
  at: number;
  kind: ActivityKind;
  label: string;
};

export const RETENTION_CHOICES = [7, 30, 90, 365] as const;
export const DEFAULT_RETENTION_DAYS = 30;
/** However long they are kept, never more than this many; the oldest go first. */
export const MAX_ENTRIES = 20000;
/** Long phrases are cut, so the log cannot grow without limit from a long sentence. */
export const MAX_LABEL = 200;

export const KIND_LABELS: Record<ActivityKind, string> = {
  speech: 'Said',
  screen: 'Opened',
  adult: 'Adult',
};

export type Period = 'hour' | 'day' | 'week' | 'month';

export type Bucket = { label: string; start: number; count: number };

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function startOfHour(at: number): number {
  const d = new Date(at);
  d.setMinutes(0, 0, 0);
  return d.getTime();
}

function startOfDay(at: number): number {
  const d = new Date(at);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Weeks start on Monday. */
function startOfWeek(at: number): number {
  const d = new Date(startOfDay(at));
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

function startOfMonth(at: number): number {
  const d = new Date(at);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** How many bars to show for each period, ending with the one that contains `now`. */
export const PERIOD_BARS: Record<Period, number> = { hour: 24, day: 14, week: 8, month: 6 };

/** Counts in each hour, day, week or month, oldest first, ending now. Empty ones are zero, not missing. */
export function buckets(entries: ActivityEntry[], period: Period, now: number, kinds?: ActivityKind[]): Bucket[] {
  const starts: number[] = [];
  const n = PERIOD_BARS[period];
  let cursor = period === 'hour' ? startOfHour(now) : period === 'day' ? startOfDay(now) : period === 'week' ? startOfWeek(now) : startOfMonth(now);
  for (let i = 0; i < n; i += 1) {
    starts.unshift(cursor);
    const d = new Date(cursor);
    if (period === 'hour') d.setHours(d.getHours() - 1);
    else if (period === 'day') d.setDate(d.getDate() - 1);
    else if (period === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    cursor = d.getTime();
  }
  const counts = new Map<number, number>(starts.map((s) => [s, 0]));
  const keyOf = (at: number) =>
    period === 'hour' ? startOfHour(at) : period === 'day' ? startOfDay(at) : period === 'week' ? startOfWeek(at) : startOfMonth(at);
  for (const entry of entries) {
    if (kinds && !kinds.includes(entry.kind)) continue;
    const key = keyOf(entry.at);
    if (counts.has(key)) counts.set(key, counts.get(key)! + 1);
  }
  return starts.map((start) => {
    const d = new Date(start);
    const label =
      period === 'hour'
        ? `${String(d.getHours()).padStart(2, '0')}:00`
        : period === 'day'
          ? `${WEEKDAYS[d.getDay()]} ${d.getDate()}`
          : period === 'week'
            ? `${d.getDate()} ${MONTHS[d.getMonth()]}`
            : `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    return { label, start, count: counts.get(start)! };
  });
}

export type Totals = { lastHour: number; today: number; week: number; month: number; all: number };

/** How many times the device was used in the last hour, today, the last 7 days and the last 30. */
export function totals(entries: ActivityEntry[], now: number, kinds?: ActivityKind[]): Totals {
  const mine = kinds ? entries.filter((e) => kinds.includes(e.kind)) : entries;
  const count = (since: number) => mine.filter((e) => e.at >= since && e.at <= now).length;
  return {
    lastHour: count(now - HOUR),
    today: count(startOfDay(now)),
    week: count(startOfDay(now) - 6 * DAY),
    month: count(startOfDay(now) - 29 * DAY),
    all: mine.length,
  };
}

/** The things said most often in the last `days` days. */
export function topSpoken(entries: ActivityEntry[], now: number, days: number, limit = 10): { label: string; count: number }[] {
  const since = startOfDay(now) - (days - 1) * DAY;
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (e.kind !== 'speech' || e.at < since) continue;
    const key = e.label.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-10-07 14:05", in the computer's own time. */
export function formatTime(at: number): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function csvCell(text: string): string {
  // A cell that starts like a formula must not be run as one when opened in a spreadsheet.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** For a spreadsheet, newest first. */
export function entriesToCsv(entries: ActivityEntry[]): string {
  const rows = [...entries].sort((a, b) => b.at - a.at).map((e) => [formatTime(e.at), KIND_LABELS[e.kind], e.label].map(csvCell).join(','));
  return ['"When","What","Detail"', ...rows].join('\r\n') + '\r\n';
}

export const isRetention = (value: unknown): value is number =>
  typeof value === 'number' && (RETENTION_CHOICES as readonly number[]).includes(value);
