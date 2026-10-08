import { useSignal } from '@preact/signals';
import { targetsSetting } from '../store/db';
import { getDateString } from '../day/dayLogic';
import {
  MAX_TARGETS,
  TARGET_AREAS,
  TARGET_STATUS_LABELS,
  reviewDue,
  sortedTargets,
  type Target,
  type TargetArea,
  type TargetStatus,
} from '../store/staff';

// Communication targets: what an adult and, often, a speech and language
// therapist are working towards, in plain words. For the adults only; none
// of it is shown to the child.
export function TargetsTab() {
  const text = useSignal('');
  const area = useSignal<TargetArea>('express');
  const review = useSignal('');
  const targets = sortedTargets(targetsSetting.signal.value);
  const today = getDateString(new Date());
  const example = TARGET_AREAS.find((a) => a.id === area.value)!.example;

  function add(event: Event): void {
    event.preventDefault();
    const trimmed = text.value.trim();
    if (!trimmed || targetsSetting.signal.value.length >= MAX_TARGETS) return;
    const target: Target = {
      id: `target-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      area: area.value,
      status: 'working',
      set: today,
      review: review.value,
      notes: '',
    };
    void targetsSetting.set([...targetsSetting.signal.value, target]);
    text.value = '';
    review.value = '';
  }

  function update(id: string, changes: Partial<Target>): void {
    void targetsSetting.set(targetsSetting.signal.value.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }

  return (
    <div class="parent-mode-screen__body targets-tab">
      <p class="about-tab__hint">
        What is being worked on, in plain words. Write them as the child would hope to hear them, for example “Uses
        <em> I want</em> and a word to ask for what they need.” They are for adults only and never shown on the
        child's screen. They appear on the Reports sheets.
      </p>

      <form class="targets-tab__form" onSubmit={add}>
        <label class="about-tab__field">
          New target
          <input
            class="about-tab__input"
            type="text"
            placeholder={example}
            value={text.value}
            onInput={(event) => (text.value = (event.target as HTMLInputElement).value)}
          />
        </label>
        <label class="access-tab__select-row">
          About
          <select value={area.value} onChange={(event) => (area.value = (event.target as HTMLSelectElement).value as TargetArea)}>
            {TARGET_AREAS.map((a) => (
              <option value={a.id} key={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label class="access-tab__select-row">
          Look at it again on
          <input type="date" value={review.value} onInput={(event) => (review.value = (event.target as HTMLInputElement).value)} />
        </label>
        <button type="submit" class="parent-mode-screen__button" disabled={!text.value.trim()}>
          Add target
        </button>
      </form>

      {targets.length === 0 ? (
        <p>No targets yet.</p>
      ) : (
        <ul class="targets-tab__list">
          {targets.map((target) => (
            <li class={`targets-tab__target targets-tab__target--${target.status}`} key={target.id}>
              <div class="targets-tab__head">
                <strong>{target.text}</strong>
                <span class="targets-tab__area">{TARGET_AREAS.find((a) => a.id === target.area)!.label}</span>
                {reviewDue(target, today) && <span class="targets-tab__due">Time to look at this again</span>}
              </div>
              <div class="targets-tab__row">
                <label>
                  <span class="targets-tab__small">Status</span>
                  <select
                    aria-label={`Status of ${target.text}`}
                    value={target.status}
                    onChange={(event) => update(target.id, { status: (event.target as HTMLSelectElement).value as TargetStatus })}
                  >
                    {(Object.keys(TARGET_STATUS_LABELS) as TargetStatus[]).map((status) => (
                      <option value={status} key={status}>
                        {TARGET_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span class="targets-tab__small">Look again on</span>
                  <input
                    type="date"
                    aria-label={`Review date for ${target.text}`}
                    value={target.review}
                    onInput={(event) => update(target.id, { review: (event.target as HTMLInputElement).value })}
                  />
                </label>
                <button
                  type="button"
                  class="parent-mode-screen__button"
                  aria-label={`Remove target: ${target.text}`}
                  onClick={() => void targetsSetting.set(targetsSetting.signal.value.filter((t) => t.id !== target.id))}
                >
                  Remove
                </button>
              </div>
              <label class="about-tab__field">
                How it is going
                <textarea
                  class="about-tab__input about-tab__textarea targets-tab__notes"
                  aria-label={`Notes on ${target.text}`}
                  value={target.notes}
                  onInput={(event) => update(target.id, { notes: (event.target as HTMLTextAreaElement).value })}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
