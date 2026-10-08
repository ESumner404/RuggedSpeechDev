import { useSignal } from '@preact/signals';
import { savePhoto } from '../store/db';
import type { Board, Item } from '../store/types';
import { FITZGERALD_CLASSES, FITZGERALD_COLORS, FITZGERALD_LABELS, type FitzgeraldClass } from '../ui/fitzgerald';
import { addButton, slugify } from './boardEditing';
import { PhotoCapture } from './PhotoCapture';

type Props = {
  board: Board;
  /** Called with the board including the new button; the caller saves it. */
  onChange: (next: Board) => void;
  onError: (message: string) => void;
};

// Adds a word to the first empty slot, with an emoji, or with a real
// photograph of the real thing (the actual cup, the actual teacher).
export function AddButtonForm({ board, onChange, onError }: Props) {
  const label = useSignal('');
  const emoji = useSignal('⭐');
  const colour = useSignal<FitzgeraldClass>('things');
  const photo = useSignal<Blob | null>(null);
  const saving = useSignal(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const text = label.value.trim();
    if (!text || saving.value) return;
    saving.value = true;
    try {
      const photoId = photo.value ? await savePhoto(photo.value) : undefined;
      const item: Item = {
        id: slugify(text),
        label: text,
        image: photoId ? { kind: 'photo', blobId: photoId } : { kind: 'emoji', char: emoji.value || '⭐' },
        background_color: FITZGERALD_COLORS[colour.value],
      };
      onChange(addButton(board, item));
      label.value = '';
      photo.value = null;
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    } finally {
      saving.value = false;
    }
  }

  return (
    <form class="parent-mode-screen__add-form parent-mode-screen__add-button-form" onSubmit={(event) => void handleSubmit(event)}>
      <input
        class="parent-mode-screen__label-input"
        type="text"
        placeholder="New button label"
        value={label.value}
        onInput={(event) => (label.value = (event.target as HTMLInputElement).value)}
      />
      <input
        class="parent-mode-screen__emoji-input"
        type="text"
        value={emoji.value}
        onInput={(event) => (emoji.value = (event.target as HTMLInputElement).value)}
        aria-label="Emoji"
      />
      <select
        value={colour.value}
        aria-label="Colour"
        onChange={(event) => (colour.value = (event.target as HTMLSelectElement).value as FitzgeraldClass)}
      >
        {FITZGERALD_CLASSES.map((cls) => (
          <option value={cls} key={cls}>
            {FITZGERALD_LABELS[cls]}
          </option>
        ))}
      </select>
      <button type="submit" class="parent-mode-screen__button" disabled={saving.value}>
        Add button
      </button>
      <div class="parent-mode-screen__add-form-photo">
        <PhotoCapture onCapture={(blob) => (photo.value = blob)} />
        {photo.value && <p class="people-places-tab__ready">Photo ready: it will be used instead of the emoji.</p>}
      </div>
    </form>
  );
}
