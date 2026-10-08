import { useSignal } from '@preact/signals';
import { announceText } from '../speech/announce';
import { myBodySetting } from '../store/db';
import { BodyFigure } from './BodyFigure';
import { withDefaults } from './look';
import {
  AMOUNTS,
  FEELINGS,
  PART_LABELS,
  bodySentence,
  groupsFor,
  type Amount,
  type Feeling,
  type PartId,
  type View,
} from './parts';

// My body: point to where it hurts, say how it feels, and say it. The figure
// is clothed, the private area is only ever "under my pants", and nothing is
// saved: when the child leaves, what was pointed to is gone. Nothing speaks
// until something is pressed, and what is said is kept like anything else
// that is said, and not marked out in any way (PRINCIPLES.md section 6).
export function MyBodyScreen() {
  const view = useSignal<View>('front');
  const selected = useSignal<ReadonlySet<PartId>>(new Set());
  const feeling = useSignal<Feeling | null>(null);
  const amount = useSignal<Amount | null>(null);
  const look = withDefaults(myBodySetting.signal.value);

  function toggle(id: PartId): void {
    const next = new Set(selected.value);
    if (next.has(id)) next.delete(id);
    else {
      next.add(id);
      const spoken = bodySentence([id]);
      announceText(spoken);
    }
    selected.value = next;
  }

  function toggleGroup(parts: PartId[]): void {
    const next = new Set(selected.value);
    const allOn = parts.every((part) => next.has(part));
    for (const part of parts) {
      if (allOn) next.delete(part);
      else next.add(part);
    }
    if (!allOn) announceText(bodySentence(parts));
    selected.value = next;
  }

  function sayIt(): void {
    const sentence = bodySentence([...selected.value], feeling.value ?? undefined, amount.value ?? undefined);
    if (sentence) announceText(sentence);
  }

  function startAgain(): void {
    selected.value = new Set();
    feeling.value = null;
    amount.value = null;
  }

  const groups = groupsFor(view.value, look);
  const anySelected = selected.value.size > 0;
  const preview = bodySentence([...selected.value], feeling.value ?? undefined, amount.value ?? undefined);

  return (
    <div class="my-body">
      <div class="my-body__figure">
        <BodyFigure look={look} view={view.value} selected={selected.value} onToggle={toggle} />
        <button
          type="button"
          class="my-body__turn"
          onClick={() => (view.value = view.value === 'front' ? 'back' : 'front')}
          aria-label={view.value === 'front' ? 'Turn round to see the back' : 'Turn round to see the front'}
        >
          {view.value === 'front' ? 'See my back' : 'See my front'}
        </button>
      </div>

      <div class="my-body__panel">
        <div class="my-body__parts" role="group" aria-label="Parts of the body">
          {groups.map((group) => {
            const on = group.parts.some((part) => selected.value.has(part));
            return (
              <button
                type="button"
                key={group.id}
                class={`my-body__part${on ? ' my-body__part--on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleGroup(group.parts)}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        <div class="my-body__feelings" role="group" aria-label="How it feels">
          {FEELINGS.map((entry) => (
            <button
              type="button"
              key={entry.id}
              class={`my-body__feeling${feeling.value === entry.id ? ' my-body__feeling--on' : ''}`}
              aria-pressed={feeling.value === entry.id}
              onClick={() => (feeling.value = feeling.value === entry.id ? null : entry.id)}
            >
              <span aria-hidden="true">{entry.icon}</span> {entry.label}
            </button>
          ))}
        </div>

        <div class="my-body__amounts" role="group" aria-label="How much">
          {AMOUNTS.map((entry) => (
            <button
              type="button"
              key={entry}
              class={`my-body__amount${amount.value === entry ? ' my-body__amount--on' : ''}`}
              aria-pressed={amount.value === entry}
              onClick={() => (amount.value = amount.value === entry ? null : entry)}
            >
              {entry}
            </button>
          ))}
        </div>

        <p class="my-body__sentence" aria-live="polite">
          {preview || 'Point to the part of your body.'}
        </p>

        <div class="my-body__actions">
          <button type="button" class="my-body__say" disabled={!anySelected} onClick={sayIt}>
            Say it
          </button>
          <button type="button" class="my-body__again" disabled={!anySelected && !feeling.value && !amount.value} onClick={startAgain}>
            Start again
          </button>
        </div>
        <p class="my-body__note">{PART_LABELS.pants} means the parts a swimsuit covers. They are private.</p>
      </div>
    </div>
  );
}
