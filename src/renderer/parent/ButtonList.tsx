import { useSignal } from '@preact/signals';
import { savePhoto, saveVoiceClip, wordStageSetting } from '../store/db';
import { WORD_STAGES, type Board, type Item, type WordStage } from '../store/types';
import {
  FITZGERALD_CLASSES,
  FITZGERALD_COLORS,
  FITZGERALD_LABELS,
  classOfColor,
  type FitzgeraldClass,
} from '../ui/fitzgerald';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { announceItem } from '../speech/announce';
import { PhotoCapture } from './PhotoCapture';
import { VoiceClipRecorder } from './VoiceClipRecorder';
import {
  moveButton,
  removeButton,
  swapButtons,
  toggleButtonHidden,
  updateButton,
  updateButtonLabel,
  type ButtonChanges,
} from './boardEditing';
import { useRowDragDrop } from './useRowDragDrop';

type Props = {
  board: Board;
  /** Called with the edited board; the caller saves it. */
  onChange: (next: Board) => void;
};

// The editable list of a board's buttons, shared by Boards and My Pages so
// both get every editing feature. Each row has the everyday controls (label,
// hide, reorder); "Details" opens the rest, what the button says, its
// picture, colour, voice, word stage and focus-word mark, and removing it.
export function ButtonList({ board, onChange }: Props) {
  const openId = useSignal<string | null>(null);
  const confirmRemoveId = useSignal<string | null>(null);
  const drag = useRowDragDrop((draggedId, targetId) => onChange(swapButtons(board, draggedId, targetId)));

  const change = (id: string, changes: ButtonChanges) => onChange(updateButton(board, id, changes));

  async function handlePhoto(item: Item, blob: Blob): Promise<void> {
    const blobId = await savePhoto(blob);
    change(item.id, { image: { kind: 'photo', blobId } });
  }

  async function handleVoiceClip(item: Item, blob: Blob): Promise<void> {
    const blobId = await saveVoiceClip(blob);
    change(item.id, { voiceClipBlobId: blobId });
  }

  return (
    <ul class="parent-mode-screen__button-list">
      {board.buttons.map((button) => {
        const open = openId.value === button.id;
        const emoji = button.image?.kind === 'emoji' ? button.image.char : '';
        return (
          <li
            class={`parent-mode-screen__button-row${drag.overId.value === button.id ? ' parent-mode-screen__button-row--drop-target' : ''}${open ? ' parent-mode-screen__button-row--open' : ''}`}
            key={button.id}
            onDragOver={(event) => drag.over(event, button.id)}
            onDrop={(event) => drag.drop(event, button.id)}
          >
            <span
              class="parent-mode-screen__drag-handle"
              draggable
              role="img"
              aria-label={`Drag ${button.label} to swap places with another button`}
              onDragStart={(event) => drag.start(event, button.id)}
              onDragEnd={() => drag.end()}
            >
              ⠿
            </span>
            <input
              class="parent-mode-screen__label-input"
              type="text"
              value={button.label}
              onInput={(event) => onChange(updateButtonLabel(board, button.id, (event.target as HTMLInputElement).value))}
            />
            <label class="parent-mode-screen__hidden-toggle">
              <input
                type="checkbox"
                checked={Boolean(button.hidden)}
                onChange={() => onChange(toggleButtonHidden(board, button.id))}
              />
              Hidden
            </label>
            <button
              type="button"
              class="parent-mode-screen__move-button"
              onClick={() => onChange(moveButton(board, button.id, 'up'))}
              aria-label={`Move ${button.label} earlier`}
            >
              ▲
            </button>
            <button
              type="button"
              class="parent-mode-screen__move-button"
              onClick={() => onChange(moveButton(board, button.id, 'down'))}
              aria-label={`Move ${button.label} later`}
            >
              ▼
            </button>
            <button
              type="button"
              class="parent-mode-screen__details-toggle"
              aria-expanded={open}
              aria-label={`Details for ${button.label}`}
              onClick={() => {
                openId.value = open ? null : button.id;
                confirmRemoveId.value = null;
              }}
            >
              Details
            </button>

            {open && (
              <div class="button-details">
                <label class="button-details__field">
                  What it says, if different from the label
                  <input
                    class="button-details__input"
                    type="text"
                    placeholder={button.label}
                    value={button.vocalization ?? ''}
                    onInput={(event) =>
                      change(button.id, { vocalization: (event.target as HTMLInputElement).value || null })
                    }
                  />
                </label>

                <label class="button-details__field">
                  Colour (the kind of word)
                  <select
                    class="button-details__input"
                    value={classOfColor(button.background_color) ?? ''}
                    onChange={(event) => {
                      const cls = (event.target as HTMLSelectElement).value as FitzgeraldClass;
                      if (cls) change(button.id, { background_color: FITZGERALD_COLORS[cls] });
                    }}
                  >
                    {!classOfColor(button.background_color) && <option value="">Not set</option>}
                    {FITZGERALD_CLASSES.map((cls) => (
                      <option value={cls} key={cls}>
                        {FITZGERALD_LABELS[cls]}
                      </option>
                    ))}
                  </select>
                </label>

                <div class="button-details__field">
                  Picture
                  {button.image?.kind === 'photo' ? (
                    <div class="button-details__picture">
                      <PhotoThumbnail class="button-details__thumb" blobId={button.image.blobId} alt="" />
                      <button
                        type="button"
                        class="parent-mode-screen__button"
                        onClick={() => change(button.id, { image: { kind: 'emoji', char: '⭐' } })}
                      >
                        Use an emoji instead
                      </button>
                    </div>
                  ) : (
                    <label class="button-details__inline">
                      Emoji
                      <input
                        class="parent-mode-screen__emoji-input"
                        type="text"
                        value={emoji}
                        aria-label={`Emoji for ${button.label}`}
                        onInput={(event) =>
                          change(button.id, {
                            image: { kind: 'emoji', char: (event.target as HTMLInputElement).value },
                          })
                        }
                      />
                    </label>
                  )}
                  <PhotoCapture onCapture={(blob) => void handlePhoto(button, blob)} />
                </div>

                <div class="button-details__field">
                  Recorded voice
                  {button.voiceClipBlobId ? (
                    <div class="button-details__inline">
                      <span>A recorded voice is set.</span>
                      <button type="button" class="parent-mode-screen__button" onClick={() => void announceItem(button)}>
                        Hear it
                      </button>
                      <button
                        type="button"
                        class="parent-mode-screen__button"
                        onClick={() => change(button.id, { voiceClipBlobId: null })}
                      >
                        Remove the recording
                      </button>
                    </div>
                  ) : (
                    <VoiceClipRecorder onRecorded={(blob) => void handleVoiceClip(button, blob)} />
                  )}
                </div>

                <label class="button-details__field">
                  Word stage
                  <select
                    class="button-details__input"
                    value={button.stage ?? ''}
                    onChange={(event) => {
                      const value = (event.target as HTMLSelectElement).value;
                      change(button.id, { stage: value ? (Number(value) as WordStage) : null });
                    }}
                  >
                    <option value="">Always shown</option>
                    {WORD_STAGES.map((stage) => (
                      <option value={stage} key={stage}>
                        Stage {stage}
                        {wordStageSetting.signal.value !== 0 && stage > wordStageSetting.signal.value
                          ? ' (not shown yet)'
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label class="button-details__check">
                  <input
                    type="checkbox"
                    checked={Boolean(button.target)}
                    onChange={() => change(button.id, { target: button.target ? null : true })}
                  />
                  Focus word (shown with a blue outline)
                </label>

                {confirmRemoveId.value === button.id ? (
                  <div class="button-details__inline">
                    <span>Remove “{button.label}” from this board?</span>
                    <button
                      type="button"
                      class="parent-mode-screen__button button-details__danger"
                      onClick={() => {
                        confirmRemoveId.value = null;
                        openId.value = null;
                        onChange(removeButton(board, button.id));
                      }}
                    >
                      Yes, remove it
                    </button>
                    <button
                      type="button"
                      class="parent-mode-screen__button"
                      onClick={() => (confirmRemoveId.value = null)}
                    >
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    class="parent-mode-screen__button button-details__danger"
                    onClick={() => (confirmRemoveId.value = button.id)}
                  >
                    Remove this button
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
