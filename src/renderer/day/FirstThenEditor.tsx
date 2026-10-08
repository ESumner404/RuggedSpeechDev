import { useSignal } from '@preact/signals';
import { firstThenSetting, savePhoto } from '../store/db';
import { PhotoCapture } from '../parent/PhotoCapture';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import type { FirstThenCard } from '../store/types';

type CardProps = {
  heading: string;
  card: FirstThenCard;
  onChange: (card: FirstThenCard) => void;
};

function CardEditor({ heading, card, onChange }: CardProps) {
  async function handlePhoto(blob: Blob): Promise<void> {
    onChange({ ...card, photoBlobId: await savePhoto(blob) });
  }

  return (
    <fieldset class="first-then-editor__card">
      <legend>{heading}</legend>
      <label class="first-then-editor__field">
        What it is
        <input
          class="first-then-editor__input"
          type="text"
          value={card.label}
          onInput={(event) => onChange({ ...card, label: (event.target as HTMLInputElement).value })}
        />
      </label>
      <label class="first-then-editor__field">
        Emoji
        <input
          class="parent-mode-screen__emoji-input"
          type="text"
          aria-label={`${heading} emoji`}
          value={card.emoji}
          onInput={(event) => onChange({ ...card, emoji: (event.target as HTMLInputElement).value })}
        />
      </label>
      {card.photoBlobId ? (
        <div class="first-then-editor__photo">
          <PhotoThumbnail class="first-then-editor__thumb" blobId={card.photoBlobId} alt="" />
          <button
            type="button"
            class="parent-mode-screen__button"
            onClick={() => onChange({ label: card.label, emoji: card.emoji })}
          >
            Use the emoji instead
          </button>
        </div>
      ) : null}
      <PhotoCapture onCapture={(blob) => void handlePhoto(blob)} />
    </fieldset>
  );
}

// Sets up the First and Then board. It appears on the child's screen once
// First / Then is on the Quick Access bar (Parent Mode, Quick Access).
export function FirstThenEditor() {
  const data = firstThenSetting.signal.value;
  const message = useSignal<string | null>(null);

  // Always built on the latest saved state, so two quick changes (typing,
  // then a photo finishing) cannot undo each other.
  const save = (change: Partial<typeof data>) =>
    void firstThenSetting.set({ ...firstThenSetting.signal.value, ...change });

  return (
    <section class="first-then-editor">
      <h2 class="first-then-editor__heading">First and Then</h2>
      <p class="first-then-editor__hint">
        A two-step picture support: <strong>First</strong> something, <strong>then</strong> something else. To
        show it, put <strong>First / Then</strong> on the top bar (Quick Access). The child can press each card
        to hear it, and press "First is finished" to move on.
      </p>
      <div class="first-then-editor__cards">
        <CardEditor heading="First" card={data.first} onChange={(first) => save({ first, firstDone: false })} />
        <CardEditor heading="Then" card={data.then} onChange={(then) => save({ then })} />
      </div>
      <button
        type="button"
        class="parent-mode-screen__button"
        disabled={!data.firstDone}
        onClick={() => {
          save({ firstDone: false });
          message.value = 'Ready to start again.';
        }}
      >
        Start again
      </button>
      {message.value && <span class="first-then-editor__hint"> {message.value}</span>}
    </section>
  );
}
