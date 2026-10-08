import { useSignal } from '@preact/signals';
import { weeklyRoutineSetting } from '../store/db';
import { WEEKDAYS, type DayActivity, type Weekday } from '../store/types';
import {
  WEEKDAY_LABELS,
  addRoutineActivity,
  copyToWeekdays,
  editRoutineActivity,
  moveRoutineActivity,
  removeRoutineActivity,
} from './routine';

function newActivityId(): string {
  return `routine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// A school timetable or home routine, entered once. Any day without a plan of
// its own shows that weekday's part of it, and the child's My Day screen
// picks it up with no further work. Days that already have their own plan are
// never touched.
export function WeeklyRoutineEditor() {
  const day = useSignal<Weekday>('mon');
  const newName = useSignal('');
  const routine = weeklyRoutineSetting.signal.value;
  const activities = routine[day.value];

  const save = (next: typeof routine) => void weeklyRoutineSetting.set(next);

  function add(event: Event): void {
    event.preventDefault();
    const name = newName.value.trim();
    if (!name) return;
    newName.value = '';
    save(addRoutineActivity(weeklyRoutineSetting.signal.value, day.value, { id: newActivityId(), name }));
  }

  const edit = (activity: DayActivity, updates: Parameters<typeof editRoutineActivity>[3]) =>
    save(editRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id, updates));

  return (
    <section class="weekly-routine">
      <h2 class="weekly-routine__heading">Weekly routine</h2>
      <p class="weekly-routine__hint">
        Enter a timetable once. Any day that has no plan of its own uses it, so the child's My Day is already
        filled in each week. Days you have planned yourself are left alone.
      </p>

      <div class="weekly-routine__days" role="group" aria-label="Day of the week">
        {WEEKDAYS.map((value) => (
          <button
            type="button"
            class="weekly-routine__day"
            key={value}
            aria-pressed={day.value === value}
            onClick={() => (day.value = value)}
          >
            {WEEKDAY_LABELS[value]}
          </button>
        ))}
      </div>

      <ul class="weekly-routine__list">
        {activities.length === 0 && <li class="weekly-routine__empty">Nothing planned on {WEEKDAY_LABELS[day.value]}s yet.</li>}
        {activities.map((activity, index) => (
          <li class="weekly-routine__activity" key={activity.id}>
            <input
              class="weekly-routine__input"
              type="text"
              aria-label="Activity name"
              value={activity.name}
              onInput={(event) => edit(activity, { name: (event.target as HTMLInputElement).value })}
            />
            <input
              class="parent-mode-screen__emoji-input"
              type="text"
              aria-label="Emoji"
              placeholder="🙂"
              value={activity.image?.kind === 'emoji' ? activity.image.char : ''}
              onInput={(event) => edit(activity, { image: { kind: 'emoji', char: (event.target as HTMLInputElement).value } })}
            />
            <input
              type="time"
              aria-label="Time"
              value={activity.time ?? ''}
              onInput={(event) => edit(activity, { time: (event.target as HTMLInputElement).value })}
            />
            <input
              class="weekly-routine__input"
              type="text"
              placeholder="Location"
              aria-label="Location"
              value={activity.location ?? ''}
              onInput={(event) => edit(activity, { location: (event.target as HTMLInputElement).value })}
            />
            <input
              class="weekly-routine__input"
              type="text"
              placeholder="Who with"
              aria-label="Who with"
              value={activity.person ?? ''}
              onInput={(event) => edit(activity, { person: (event.target as HTMLInputElement).value })}
            />
            <button
              type="button"
              class="parent-mode-screen__move-button"
              aria-label={`Move ${activity.name} earlier`}
              disabled={index === 0}
              onClick={() => save(moveRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id, 'up'))}
            >
              ▲
            </button>
            <button
              type="button"
              class="parent-mode-screen__move-button"
              aria-label={`Move ${activity.name} later`}
              disabled={index === activities.length - 1}
              onClick={() => save(moveRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id, 'down'))}
            >
              ▼
            </button>
            <button
              type="button"
              class="day-builder-tab__remove"
              aria-label={`Remove ${activity.name} from ${WEEKDAY_LABELS[day.value]}`}
              onClick={() => save(removeRoutineActivity(weeklyRoutineSetting.signal.value, day.value, activity.id))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form class="weekly-routine__add-form" onSubmit={add}>
        <input
          class="weekly-routine__input"
          type="text"
          placeholder={`New activity on ${WEEKDAY_LABELS[day.value]}`}
          aria-label="New routine activity"
          value={newName.value}
          onInput={(event) => (newName.value = (event.target as HTMLInputElement).value)}
        />
        <button type="submit" class="parent-mode-screen__button" disabled={!newName.value.trim()}>
          Add to {WEEKDAY_LABELS[day.value]}
        </button>
        <button
          type="button"
          class="parent-mode-screen__button"
          disabled={activities.length === 0}
          onClick={() => save(copyToWeekdays(weeklyRoutineSetting.signal.value, day.value))}
        >
          Copy {WEEKDAY_LABELS[day.value]} to every weekday
        </button>
      </form>
    </section>
  );
}
