import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  activityEnabledSetting,
  activityRetentionSetting,
  activityVersion,
  clearActivity,
  getActivity,
} from '../store/db';
import {
  KIND_LABELS,
  RETENTION_CHOICES,
  buckets,
  entriesToCsv,
  formatTime,
  topSpoken,
  totals,
  type ActivityEntry,
  type ActivityKind,
  type Period,
} from '../store/activity';

const PERIODS: { id: Period; label: string; heading: string }[] = [
  { id: 'hour', label: 'Hours', heading: 'Each hour, over the last day' },
  { id: 'day', label: 'Days', heading: 'Each day, over the last two weeks' },
  { id: 'week', label: 'Weeks', heading: 'Each week, over the last two months' },
  { id: 'month', label: 'Months', heading: 'Each month, over the last six months' },
];

const WHAT: { id: 'all' | ActivityKind; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'speech', label: 'What was said' },
  { id: 'screen', label: 'What was opened' },
  { id: 'adult', label: 'Adult actions' },
];

// Activity: what was said and which parts of the app were used, and when.
// Off until an adult turns it on, kept only for the days chosen, and cleared
// with one button. It stays on this computer; the only way it leaves is the
// spreadsheet an adult chooses to save.
export function ActivityTab() {
  const entries = useSignal<ActivityEntry[]>([]);
  const period = useSignal<Period>('day');
  const what = useSignal<'all' | ActivityKind>('all');
  const confirmClear = useSignal(false);
  const message = useSignal('');
  const enabled = activityEnabledSetting.signal.value;
  const version = activityVersion.value;

  useEffect(() => {
    void getActivity().then((loaded) => (entries.value = loaded));
  }, [version, enabled, activityRetentionSetting.signal.value]);

  const now = Date.now();
  const kinds = what.value === 'all' ? undefined : [what.value];
  const bars = buckets(entries.value, period.value, now, kinds);
  const tallest = Math.max(1, ...bars.map((bar) => bar.count));
  const sums = totals(entries.value, now, kinds);
  const top = topSpoken(entries.value, now, 30);
  const recent = [...entries.value]
    .filter((e) => !kinds || kinds.includes(e.kind))
    .sort((a, b) => b.at - a.at)
    .slice(0, 100);

  async function exportCsv(): Promise<void> {
    const result = await window.myWords.files.save(entriesToCsv(entries.value), {
      suggestedName: 'rugged-speech-activity.csv',
      filterName: 'Spreadsheet (CSV)',
      extensions: ['csv'],
    });
    message.value = result.ok ? 'Saved.' : 'Not saved.';
  }

  async function clearAll(): Promise<void> {
    confirmClear.value = false;
    await clearActivity();
    entries.value = [];
    message.value = 'The activity log is empty.';
  }

  return (
    <div class="parent-mode-screen__body activity-tab">
      <section class="access-tab__section">
        <h2 class="access-tab__heading">Activity log</h2>
        <p class="access-tab__hint">
          Keeps a note of what is said and which parts of the app are opened, with the time, so you can see how the
          device is used through the day and over the weeks. It is <strong>off</strong> until you turn it on. It
          stays on this computer and is kept only for the days you choose. Every phrase is noted the same way,
          including the Help phrases: nothing is flagged and nobody is told. If someone says something that worries
          you, follow your safeguarding procedure.
        </p>
        <label class="access-tab__checkbox">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => void activityEnabledSetting.set((event.target as HTMLInputElement).checked)}
          />
          Keep an activity log
        </label>
        <label class="access-tab__select-row">
          Keep it for
          <select
            value={String(activityRetentionSetting.signal.value)}
            onChange={(event) => void activityRetentionSetting.set(Number((event.target as HTMLSelectElement).value))}
          >
            {RETENTION_CHOICES.map((days) => (
              <option value={String(days)} key={days}>
                {days === 365 ? 'a year' : `${days} days`}
              </option>
            ))}
          </select>
        </label>
        {!enabled && <p class="access-tab__hint">Nothing is being kept.</p>}
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">How much it is used</h2>
        <div class="activity-tab__what" role="group" aria-label="Show">
          {WHAT.map((choice) => (
            <button
              type="button"
              key={choice.id}
              class={`activity-tab__chip${what.value === choice.id ? ' activity-tab__chip--on' : ''}`}
              aria-pressed={what.value === choice.id}
              onClick={() => (what.value = choice.id)}
            >
              {choice.label}
            </button>
          ))}
        </div>

        <dl class="activity-tab__totals">
          <div><dt>Last hour</dt><dd>{sums.lastHour}</dd></div>
          <div><dt>Today</dt><dd>{sums.today}</dd></div>
          <div><dt>Last 7 days</dt><dd>{sums.week}</dd></div>
          <div><dt>Last 30 days</dt><dd>{sums.month}</dd></div>
        </dl>

        <div class="activity-tab__what" role="group" aria-label="Group by">
          {PERIODS.map((choice) => (
            <button
              type="button"
              key={choice.id}
              class={`activity-tab__chip${period.value === choice.id ? ' activity-tab__chip--on' : ''}`}
              aria-pressed={period.value === choice.id}
              onClick={() => (period.value = choice.id)}
            >
              {choice.label}
            </button>
          ))}
        </div>
        <p class="activity-tab__chart-title">{PERIODS.find((p) => p.id === period.value)!.heading}</p>
        <ol class="activity-tab__chart" aria-label="Counts">
          {bars.map((bar) => (
            <li class="activity-tab__bar" key={bar.start}>
              <span class="activity-tab__count">{bar.count}</span>
              <span class="activity-tab__fill" style={{ height: `${Math.round((bar.count / tallest) * 100)}%` }} />
              <span class="activity-tab__label">{bar.label}</span>
            </li>
          ))}
        </ol>
      </section>

      {top.length > 0 && (
        <section class="access-tab__section">
          <h2 class="access-tab__heading">Said most, last 30 days</h2>
          <ol class="activity-tab__top">
            {top.map((row) => (
              <li key={row.label}>
                {row.label} <strong>{row.count}</strong>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section class="access-tab__section">
        <h2 class="access-tab__heading">The log</h2>
        {recent.length === 0 ? (
          <p>{enabled ? 'Nothing noted yet.' : 'Nothing is being kept.'}</p>
        ) : (
          <table class="activity-tab__table">
            <thead>
              <tr>
                <th>When</th>
                <th>What</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatTime(entry.at)}</td>
                  <td>{KIND_LABELS[entry.kind]}</td>
                  <td>{entry.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p class="access-tab__hint">Showing the latest {recent.length}. The spreadsheet has all of it.</p>
        <div class="activity-tab__buttons">
          <button type="button" class="parent-mode-screen__button" disabled={entries.value.length === 0} onClick={() => void exportCsv()}>
            Save as a spreadsheet
          </button>
          {confirmClear.value ? (
            <>
              <span>Empty the whole log?</span>
              <button type="button" class="parent-mode-screen__button" onClick={() => void clearAll()}>
                Yes, empty it
              </button>
              <button type="button" class="parent-mode-screen__button" onClick={() => (confirmClear.value = false)}>
                Keep it
              </button>
            </>
          ) : (
            <button type="button" class="parent-mode-screen__button" disabled={entries.value.length === 0} onClick={() => (confirmClear.value = true)}>
              Clear the log
            </button>
          )}
        </div>
        <p role="status">{message.value}</p>
      </section>
    </div>
  );
}
