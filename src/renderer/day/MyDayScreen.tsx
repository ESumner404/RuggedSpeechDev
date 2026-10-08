import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { classifyNowNextLater, formatTime, getDateString, markFinished } from './dayLogic';
import { acknowledgeChange } from './dayEditing';
import { getDueWarning, type CountdownWarningLevel } from './countdown';
import { dayPlanVersion, getDaySettings, getEffectiveDayPlan, saveDayPlan } from '../store/db';
import { announceText } from '../speech/announce';
import type { DayActivity, DaySettings } from '../store/types';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { Pic } from '../symbols/Pic';

const DEFAULT_SETTINGS: DaySettings = { view: 'today', countdownEnabled: false };

export function MyDayScreen() {
  const dateString = useSignal(getDateString(new Date()));
  const activities = useSignal<DayActivity[]>([]);
  const settings = useSignal<DaySettings>(DEFAULT_SETTINGS);
  const askingActivity = useSignal<DayActivity | null>(null);
  // Shown independently of activities.value.changedFrom: the acknowledging
  // save clears that field in storage almost immediately (needed so a
  // *future* load doesn't re-announce), which left the struck-through
  // display on screen for well under a second, not something a child
  // reliably has time to read. This keeps it visible for a fixed window
  // regardless of how fast the underlying write settles.
  const recentChange = useSignal<{ id: string; oldName: string } | null>(null);
  const warnedRef = useRef<Set<string>>(new Set());
  // acknowledgeChange's own save bumps dayPlanVersion, which re-triggers
  // the effect below before that write has necessarily settled, without
  // this guard, the same change could get re-detected and re-announced
  // several times in a row. Tracked per activity id, once per screen
  // lifetime, since "announce once" is the actual requirement regardless
  // of how many times load() happens to run.
  const announcedRef = useRef<Set<string>>(new Set());
  // Two or more load() calls can otherwise run concurrently (each version
  // bump re-triggers the effect before the previous load()'s own save has
  // resolved) and all read the same not-yet-acknowledged data before any
  // of them writes the acknowledgement, serializing closes that window.
  const loadingRef = useRef(false);
  const pendingDateRef = useRef<string | null>(null);

  // Reading .value here subscribes this component to Parent Mode's edits,
  // "change of plan" needs the announcement to fire the moment an edit is
  // saved, not the next time this screen happens to remount.
  const version = dayPlanVersion.value;

  async function load(forDate: string): Promise<void> {
    const [{ plan }, daySettings] = await Promise.all([getEffectiveDayPlan(forDate), getDaySettings()]);
    settings.value = daySettings;
    activities.value = plan.activities;

    const changed = plan.activities.find(
      (activity) => activity.changedFrom && !announcedRef.current.has(activity.id),
    );
    if (changed) {
      announcedRef.current.add(changed.id);
      recentChange.value = { id: changed.id, oldName: changed.changedFrom! };
      // The one intentional exception to "speech is never automatic"
      // (PRINCIPLES.md I5): docs/build-plan.md Phase 5 asks for this specifically, and the
      // root cause is still a person's press, an adult saving an edit in
      // Parent Mode, not the app deciding on its own to speak.
      announceText(`The plan has changed. We are going to ${changed.name} instead.`);
      void saveDayPlan({ date: forDate, activities: acknowledgeChange(plan.activities, changed.id) });
      setTimeout(() => {
        if (recentChange.value?.id === changed.id) recentChange.value = null;
      }, 8000);
    }
  }

  async function runLoad(forDate: string): Promise<void> {
    if (loadingRef.current) {
      pendingDateRef.current = forDate;
      return;
    }
    loadingRef.current = true;
    try {
      await load(forDate);
    } finally {
      loadingRef.current = false;
      if (pendingDateRef.current !== null) {
        const next = pendingDateRef.current;
        pendingDateRef.current = null;
        void runLoad(next);
      }
    }
  }

  useEffect(() => {
    void runLoad(dateString.value);
  }, [dateString.value, version]);

  // Rolls the displayed day over at local midnight without needing the
  // screen to be closed and reopened (docs/build-plan.md Phase 5 acceptance).
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getDateString(new Date());
      if (today !== dateString.value) dateString.value = today;
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Off by default (docs/build-plan.md Phase 5), only polls at all once an adult has
  // deliberately turned this on.
  useEffect(() => {
    if (!settings.value.countdownEnabled) return;
    const interval = setInterval(() => {
      const now = new Date();
      for (const activity of activities.value) {
        const level = getDueWarning(activity, now);
        if (!level) continue;
        const key = `${activity.id}:${level}`;
        if (warnedRef.current.has(key)) continue;
        warnedRef.current.add(key);
        announceCountdown(activity, level);
      }
    }, 15_000);
    return () => clearInterval(interval);
  }, [settings.value.countdownEnabled, activities.value]);

  function announceCountdown(activity: DayActivity, level: CountdownWarningLevel): void {
    const minutes = level === 'twoMinutes' ? '2 minutes' : '1 minute';
    announceText(`${minutes} until ${activity.name}`);
  }

  function finishActivity(activity: DayActivity): void {
    const updated = markFinished(activities.value, activity.id);
    activities.value = updated;
    void saveDayPlan({ date: dateString.value, activities: updated });
    askingActivity.value = null;
  }

  function askWhatsNext(): void {
    const { next } = classifyNowNextLater(activities.value);
    announceText(next ? `Next is ${next.name}` : "That's everything for today");
  }

  function askWhen(activity: DayActivity): void {
    announceText(activity.time ? `${activity.name} at ${formatTime(activity.time)}` : `No time set for ${activity.name}`);
  }

  function askWhere(activity: DayActivity): void {
    announceText(
      activity.location ? `${activity.name} is at ${activity.location}` : `No place set for ${activity.name}`,
    );
  }

  function askWhoWith(activity: DayActivity): void {
    announceText(
      activity.person ? `${activity.name} with ${activity.person}` : `No one set for ${activity.name}`,
    );
  }

  function renderActivityCard(activity: DayActivity, current: boolean) {
    const struckName =
      activity.changedFrom ??
      (recentChange.value?.id === activity.id ? recentChange.value.oldName : undefined);
    return (
      <button
        type="button"
        class={`day-activity${current ? ' day-activity--current' : ''}${activity.finished ? ' day-activity--finished' : ''}`}
        key={activity.id}
        onClick={() => (askingActivity.value = activity)}
      >
        {activity.image?.kind === 'emoji' && (
          <Pic class="day-activity__emoji" char={activity.image.char} />
        )}
        {activity.image?.kind === 'photo' && (
          <PhotoThumbnail class="day-activity__photo" blobId={activity.image.blobId} alt="" />
        )}
        <span class="day-activity__name">
          {struckName && <span class="day-activity__struck">{struckName}</span>}
          {activity.name}
        </span>
        {activity.time && <span class="day-activity__time">{formatTime(activity.time)}</span>}
      </button>
    );
  }

  const nowNextLater = classifyNowNextLater(activities.value);
  const finished = activities.value.filter((activity) => activity.finished);

  return (
    <div class="my-day-screen">
      {activities.value.length === 0 ? (
        <p class="my-day-screen__empty">No plan for today yet.</p>
      ) : settings.value.view === 'nowNextLater' ? (
        <div class="my-day-screen__now-next-later">
          <section class="day-section">
            <h2 class="day-section__title">Now</h2>
            {nowNextLater.now ? renderActivityCard(nowNextLater.now, true) : <p>Nothing right now.</p>}
          </section>
          <section class="day-section">
            <h2 class="day-section__title">Next</h2>
            {nowNextLater.next ? renderActivityCard(nowNextLater.next, false) : <p>Nothing next.</p>}
          </section>
          <section class="day-section">
            <h2 class="day-section__title">Later</h2>
            <div class="day-section__list">{nowNextLater.later.map((activity) => renderActivityCard(activity, false))}</div>
          </section>
        </div>
      ) : (
        <div class="my-day-screen__today">
          <div class="day-section__list">
            {activities.value
              .filter((activity) => !activity.finished)
              .map((activity, index) => renderActivityCard(activity, index === 0))}
          </div>
          {finished.length > 0 && (
            <section class="day-section day-section--finished">
              <h2 class="day-section__title">Finished</h2>
              <div class="day-section__list">{finished.map((activity) => renderActivityCard(activity, false))}</div>
            </section>
          )}
        </div>
      )}

      {askingActivity.value && (
        <div class="day-ask-overlay">
          <p class="day-ask-overlay__title">{askingActivity.value.name}</p>
          <div class="day-ask-overlay__questions">
            <button type="button" onClick={askWhatsNext}>
              What's next?
            </button>
            <button type="button" onClick={() => askWhen(askingActivity.value!)}>
              When?
            </button>
            <button type="button" onClick={() => askWhere(askingActivity.value!)}>
              Where?
            </button>
            <button type="button" onClick={() => askWhoWith(askingActivity.value!)}>
              Who with?
            </button>
            <button type="button" onClick={() => finishActivity(askingActivity.value!)}>
              Finished
            </button>
          </div>
          <button type="button" class="day-ask-overlay__close" onClick={() => (askingActivity.value = null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
