import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { getDateString } from './dayLogic';
import { addActivity, moveActivity, removeActivity, updateActivity } from './dayEditing';
import {
  getDaySettings,
  getEffectiveDayPlan,
  savePhoto,
  saveDayPlan,
  setDaySettings,
  weeklyRoutineSetting,
} from '../store/db';
import { PhotoCapture } from '../parent/PhotoCapture';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { WeeklyRoutineEditor } from './WeeklyRoutineEditor';
import { FirstThenEditor } from './FirstThenEditor';
import type { DayActivity, DayPlan, DaySettings, DayViewMode } from '../store/types';

const DEFAULT_SETTINGS: DaySettings = { view: 'today', countdownEnabled: false };

function newActivityId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DayBuilderTab() {
  const dateString = useSignal(getDateString(new Date()));
  const plan = useSignal<DayPlan>({ date: dateString.value, activities: [] });
  const settings = useSignal<DaySettings>(DEFAULT_SETTINGS);
  const newName = useSignal('');
  // True while this date has no plan of its own and is showing the weekly
  // routine; the first change saves it as the day's own.
  const usesRoutine = useSignal(false);

  // A load that finishes after something newer has happened (another load,
  // or an edit) is stale and must not overwrite it.
  const latestLoad = useRef(0);

  async function load(): Promise<void> {
    const thisLoad = ++latestLoad.current;
    const [{ plan: loadedPlan, fromRoutine }, loadedSettings] = await Promise.all([
      getEffectiveDayPlan(dateString.value),
      getDaySettings(),
    ]);
    if (thisLoad !== latestLoad.current) return;
    plan.value = loadedPlan;
    usesRoutine.value = fromRoutine;
    settings.value = loadedSettings;
  }

  // A day showing the weekly routine follows it as it is edited below, so
  // what the builder shows is always what the child will see. A day with its
  // own saved plan is left alone.
  const routine = weeklyRoutineSetting.signal.value;
  useEffect(() => {
    if (usesRoutine.value && routine !== undefined) void load();
  }, [routine]);

  useEffect(() => {
    void load();
  }, [dateString.value]);

  async function persist(activities: DayActivity[]): Promise<void> {
    const next = { ...plan.value, activities };
    latestLoad.current++;
    plan.value = next;
    usesRoutine.value = false;
    await saveDayPlan(next);
  }

  function handleAdd(event: Event): void {
    event.preventDefault();
    if (!newName.value.trim()) return;
    const activity: DayActivity = { id: newActivityId(), name: newName.value.trim() };
    void persist(addActivity(plan.value.activities, activity));
    newName.value = '';
  }

  async function handleViewChange(view: DayViewMode): Promise<void> {
    const next = { ...settings.value, view };
    settings.value = next;
    await setDaySettings(next);
  }

  async function handleCountdownToggle(): Promise<void> {
    const next = { ...settings.value, countdownEnabled: !settings.value.countdownEnabled };
    settings.value = next;
    await setDaySettings(next);
  }

  async function setPhoto(id: string, blob: Blob): Promise<void> {
    const blobId = await savePhoto(blob);
    void persist(updateActivity(plan.value.activities, id, { image: { kind: 'photo', blobId } }));
  }

  function updateField<K extends keyof DayActivity>(id: string, field: K, value: DayActivity[K]): void {
    void persist(updateActivity(plan.value.activities, id, { [field]: value }));
  }

  return (
    <div class="day-builder-tab">
      <div class="day-builder-tab__controls">
        <label>
          Date
          <input
            type="date"
            value={dateString.value}
            onInput={(event) => (dateString.value = (event.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          View
          <select
            value={settings.value.view}
            onChange={(event) => void handleViewChange((event.target as HTMLSelectElement).value as DayViewMode)}
          >
            <option value="today">Today</option>
            <option value="nowNextLater">Now / Next / Later</option>
          </select>
        </label>
        <label class="day-builder-tab__countdown-toggle">
          <input
            type="checkbox"
            checked={settings.value.countdownEnabled}
            onChange={() => void handleCountdownToggle()}
          />
          Countdown warnings
        </label>
      </div>

      {usesRoutine.value && plan.value.activities.length > 0 && (
        <p class="day-builder-tab__routine-note">
          This day uses the weekly routine. Change anything here and it becomes this day's own plan.
        </p>
      )}

      <ul class="day-builder-tab__list">
        {plan.value.activities.map((activity, index) => (
          <li class="day-builder-tab__activity" key={activity.id}>
            <input
              class="parent-mode-screen__label-input"
              type="text"
              value={activity.name}
              onInput={(event) => updateField(activity.id, 'name', (event.target as HTMLInputElement).value)}
            />
            <details class="day-builder-tab__picture">
              <summary>
                {activity.image?.kind === 'emoji'
                  ? activity.image.char
                  : activity.image?.kind === 'photo'
                    ? 'Photo'
                    : 'Picture'}
              </summary>
              <div class="day-builder-tab__picture-body">
                <label>
                  Emoji
                  <input
                    class="parent-mode-screen__emoji-input"
                    type="text"
                    aria-label={`Emoji for ${activity.name}`}
                    value={activity.image?.kind === 'emoji' ? activity.image.char : ''}
                    onInput={(event) =>
                      updateField(activity.id, 'image', {
                        kind: 'emoji',
                        char: (event.target as HTMLInputElement).value,
                      })
                    }
                  />
                </label>
                {activity.image?.kind === 'photo' && (
                  <PhotoThumbnail class="day-builder-tab__thumb" blobId={activity.image.blobId} alt="" />
                )}
                <PhotoCapture onCapture={(blob) => void setPhoto(activity.id, blob)} />
                {activity.image && (
                  <button
                    type="button"
                    class="parent-mode-screen__button"
                    onClick={() => updateField(activity.id, 'image', undefined)}
                  >
                    Take the picture off
                  </button>
                )}
              </div>
            </details>
            <input
              type="time"
              value={activity.time ?? ''}
              onInput={(event) => updateField(activity.id, 'time', (event.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={activity.location ?? ''}
              onInput={(event) => updateField(activity.id, 'location', (event.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              placeholder="Who with"
              value={activity.person ?? ''}
              onInput={(event) => updateField(activity.id, 'person', (event.target as HTMLInputElement).value)}
            />
            <select
              value={activity.countdownMinutes ?? ''}
              onChange={(event) => {
                const value = (event.target as HTMLSelectElement).value;
                updateField(activity.id, 'countdownMinutes', value ? (Number(value) as 5 | 30 | 60) : undefined);
              }}
            >
              <option value="">No countdown</option>
              <option value="5">5 min</option>
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
            </select>
            <button
              type="button"
              class="parent-mode-screen__move-button"
              onClick={() => void persist(moveActivity(plan.value.activities, activity.id, 'up'))}
              aria-label={`Move ${activity.name} earlier`}
              disabled={index === 0}
            >
              ▲
            </button>
            <button
              type="button"
              class="parent-mode-screen__move-button"
              onClick={() => void persist(moveActivity(plan.value.activities, activity.id, 'down'))}
              aria-label={`Move ${activity.name} later`}
              disabled={index === plan.value.activities.length - 1}
            >
              ▼
            </button>
            <button
              type="button"
              class="day-builder-tab__remove"
              onClick={() => void persist(removeActivity(plan.value.activities, activity.id))}
              aria-label={`Remove ${activity.name}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form class="day-builder-tab__add-form" onSubmit={handleAdd}>
        <input
          class="parent-mode-screen__label-input"
          type="text"
          placeholder="New activity name"
          value={newName.value}
          onInput={(event) => (newName.value = (event.target as HTMLInputElement).value)}
        />
        <button type="submit" class="parent-mode-screen__button">
          Add activity
        </button>
      </form>
      <WeeklyRoutineEditor />
      <FirstThenEditor />
    </div>
  );
}
