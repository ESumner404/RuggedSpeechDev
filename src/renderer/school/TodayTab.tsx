import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getDateString } from '../day/dayLogic';
import {
  activityEnabledSetting,
  getActivity,
  getEffectiveDayPlan,
  noteAuthorSetting,
  staffNotesSetting,
  targetsSetting,
  trafficSetting,
  userProfileSetting,
  activityVersion,
} from '../store/db';
import { totals, type ActivityEntry } from '../store/activity';
import { reviewDue } from '../store/staff';
import { formatTime } from '../store/activity';
import { deviceTitle } from '../ui/deviceName';
import { TRAFFIC_LIGHTS } from '../signals/traffic';
import type { DayActivity } from '../store/types';
import type { SchoolSection } from './SchoolModeScreen';

const LONG_DATE = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

// Today: the page staff see first. What is planned, what is due, what was last
// written, and a quick way to add a note, with everything one press from here.
export function TodayTab({ go }: { go: (section: SchoolSection) => void }) {
  const today = getDateString(new Date());
  const plan = useSignal<DayActivity[]>([]);
  const activity = useSignal<ActivityEntry[]>([]);
  const quick = useSignal('');
  const added = useSignal(false);
  const profile = userProfileSetting.signal.value;
  const targets = targetsSetting.signal.value;
  const notes = [...staffNotesSetting.signal.value].sort((a, b) => b.at - a.at).slice(0, 3);
  const due = targets.filter((t) => reviewDue(t, today));
  const working = targets.filter((t) => t.status === 'working');
  const traffic = trafficSetting.signal.value.status;
  const logOn = activityEnabledSetting.signal.value;
  const version = activityVersion.value;

  useEffect(() => {
    void getEffectiveDayPlan(today).then(({ plan: p }) => (plan.value = p.activities));
  }, [today]);

  useEffect(() => {
    void getActivity().then((entries) => (activity.value = entries));
  }, [version, logOn]);

  function addQuickNote(event: Event): void {
    event.preventDefault();
    const text = quick.value.trim();
    if (!text) return;
    void staffNotesSetting.set([
      ...staffNotesSetting.signal.value,
      { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), by: noteAuthorSetting.signal.value.trim(), text, kind: 'observation' },
    ]);
    quick.value = '';
    added.value = true;
  }

  const now = Date.now();
  const sums = totals(activity.value, now, ['speech']);
  const light = traffic === 'off' ? undefined : TRAFFIC_LIGHTS.find((l) => l.id === traffic);

  return (
    <div class="parent-mode-screen__body today-tab">
      <header class="today-tab__head">
        <h2 class="today-tab__date">{LONG_DATE.format(new Date())}</h2>
        <p class="today-tab__who">{deviceTitle(profile)}</p>
      </header>

      <div class="today-tab__grid">
        <section class="today-tab__card" aria-labelledby="today-plan">
          <h3 id="today-plan">Today's plan</h3>
          {plan.value.length === 0 ? (
            <p class="today-tab__none">Nothing planned for today.</p>
          ) : (
            <ul class="today-tab__plan">
              {plan.value.map((a) => (
                <li key={a.id}>
                  <span class="today-tab__time">{a.time ?? ''}</span> {a.name}
                </li>
              ))}
            </ul>
          )}
          <button type="button" class="parent-mode-screen__button" onClick={() => go('timetable')}>
            Open the timetable
          </button>
        </section>

        <section class="today-tab__card" aria-labelledby="today-targets">
          <h3 id="today-targets">Targets</h3>
          <p class="today-tab__big">{working.length}</p>
          <p class="today-tab__none">being worked on</p>
          {due.length > 0 ? (
            <p class="targets-tab__due" role="status">
              {due.length === 1 ? '1 target is' : `${due.length} targets are`} due to be looked at again.
            </p>
          ) : (
            <p class="today-tab__none">None are due for review.</p>
          )}
          <button type="button" class="parent-mode-screen__button" onClick={() => go('targets')}>
            Open targets
          </button>
        </section>

        <section class="today-tab__card" aria-labelledby="today-use">
          <h3 id="today-use">Using the device today</h3>
          {logOn ? (
            <>
              <p class="today-tab__big">{sums.today}</p>
              <p class="today-tab__none">things said today</p>
            </>
          ) : (
            <p class="today-tab__none">The activity log is off, so there is nothing to show. It can be turned on in Activity.</p>
          )}
          {light && (
            <p class="today-tab__light" style={{ '--light': light.colour } as Record<string, string>}>
              <span class="traffic-chip__lamp" aria-hidden="true" /> The child is showing: {light.short}
            </p>
          )}
          <button type="button" class="parent-mode-screen__button" onClick={() => go('activity')}>
            Open activity
          </button>
        </section>

        <section class="today-tab__card" aria-labelledby="today-notes">
          <h3 id="today-notes">Latest notes</h3>
          {notes.length === 0 ? (
            <p class="today-tab__none">No notes yet.</p>
          ) : (
            <ul class="today-tab__notes">
              {notes.map((n) => (
                <li key={n.id}>
                  <span class="today-tab__time">{formatTime(n.at)}</span> {n.text}
                </li>
              ))}
            </ul>
          )}
          <form class="today-tab__quick" onSubmit={addQuickNote}>
            <label class="about-tab__field">
              A quick note
              <textarea
                class="about-tab__input about-tab__textarea"
                value={quick.value}
                onInput={(event) => {
                  quick.value = (event.target as HTMLTextAreaElement).value;
                  added.value = false;
                }}
              />
            </label>
            <button type="submit" class="parent-mode-screen__button" disabled={!quick.value.trim()}>
              Add note
            </button>
            {added.value && <span role="status"> Added.</span>}
          </form>
        </section>
      </div>

      <section class="today-tab__shortcuts">
        <h3>Jump to</h3>
        <div class="school-tab__buttons">
          <button type="button" class="parent-mode-screen__button" onClick={() => go('reports')}>
            Print a handover sheet
          </button>
          <button type="button" class="parent-mode-screen__button" onClick={() => go('lessons')}>
            Make a lesson page
          </button>
          <button type="button" class="parent-mode-screen__button" onClick={() => go('safeguarding')}>
            Safeguarding
          </button>
          <button type="button" class="parent-mode-screen__button" onClick={() => go('classroom')}>
            Classroom set-up
          </button>
        </div>
      </section>
    </div>
  );
}
