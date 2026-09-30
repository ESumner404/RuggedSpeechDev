import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  getBoard,
  getPeople,
  getPlaces,
  savePerson,
  savePhoto,
  savePlace,
  saveVoiceClip,
  updateBoard,
} from '../store/db';
import { addButton, slugify } from './boardEditing';
import { PhotoCapture } from './PhotoCapture';
import { VoiceClipRecorder } from './VoiceClipRecorder';
import { FITZGERALD_COLORS } from '../ui/fitzgerald';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { announceItem } from '../speech/announce';
import type { Item, PersonRecord, PlaceRecord } from '../store/types';

type Kind = 'people' | 'places';
type Record_ = PersonRecord | PlaceRecord;

type Props = {
  kind: Kind;
};

export function PeoplePlacesTab({ kind }: Props) {
  const records = useSignal<Record_[]>([]);
  const name = useSignal('');
  const relationship = useSignal('');
  const phrasesInput = useSignal('');
  const photoBlob = useSignal<Blob | null>(null);
  const voiceClipBlob = useSignal<Blob | null>(null);
  const error = useSignal<string | null>(null);
  const saving = useSignal(false);

  async function refresh(): Promise<void> {
    records.value = kind === 'people' ? await getPeople() : await getPlaces();
  }

  // ParentModeScreen renders a separate <PeoplePlacesTab kind="people"> /
  // kind="places"> element per tab rather than reusing one instance with a
  // changing prop, so switching tabs unmounts and remounts this component
  // — fields already start blank on a fresh mount. (An earlier version of
  // this effect also reset fields keyed on [kind], on the mistaken
  // assumption that kind could change under a live instance; since it
  // can't, that reset only ever fired once, right after mount — and since
  // Preact defers useEffect to after paint, that "once" could land late
  // enough to wipe out a fast fill-then-submit sequence already in
  // flight.)
  useEffect(() => {
    void refresh();
  }, [kind]);

  async function handleSave(event: Event): Promise<void> {
    event.preventDefault();
    if (!name.value.trim() || saving.value) return;
    saving.value = true;
    error.value = null;

    try {
      const id = slugify(name.value);
      const photoBlobId = photoBlob.value ? await savePhoto(photoBlob.value) : undefined;
      const voiceClipBlobId = voiceClipBlob.value ? await saveVoiceClip(voiceClipBlob.value) : undefined;
      const phrases = phrasesInput.value
        .split(',')
        .map((phrase) => phrase.trim())
        .filter(Boolean);

      if (kind === 'people') {
        const record: PersonRecord = {
          id,
          name: name.value.trim(),
          phrases,
          ...(relationship.value.trim() ? { relationship: relationship.value.trim() } : {}),
          ...(photoBlobId ? { photoBlobId } : {}),
          ...(voiceClipBlobId ? { voiceClipBlobId } : {}),
        };
        await savePerson(record);
      } else {
        const record: PlaceRecord = {
          id,
          name: name.value.trim(),
          phrases,
          ...(photoBlobId ? { photoBlobId } : {}),
          ...(voiceClipBlobId ? { voiceClipBlobId } : {}),
        };
        await savePlace(record);
      }

      const board = await getBoard(kind);
      if (board) {
        const item: Item = {
          id,
          label: name.value.trim(),
          background_color: FITZGERALD_COLORS[kind === 'people' ? 'people' : 'places'],
          image: photoBlobId ? { kind: 'photo', blobId: photoBlobId } : { kind: 'emoji', char: '⭐' },
          ...(voiceClipBlobId ? { voiceClipBlobId } : {}),
        };
        await updateBoard(addButton(board, item));
      }

      name.value = '';
      relationship.value = '';
      phrasesInput.value = '';
      photoBlob.value = null;
      voiceClipBlob.value = null;
      await refresh();
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      saving.value = false;
    }
  }

  const title = kind === 'people' ? 'Person' : 'Place';

  return (
    <div class="people-places-tab">
      <ul class="people-places-tab__list">
        {records.value.map((record) => (
          <li class="people-places-tab__record" key={record.id}>
            {record.photoBlobId && (
              <PhotoThumbnail class="people-places-tab__thumb" blobId={record.photoBlobId} alt="" />
            )}
            <div class="people-places-tab__record-info">
              <span class="people-places-tab__record-name">{record.name}</span>
              {'relationship' in record && record.relationship && (
                <span class="people-places-tab__record-relationship">{record.relationship}</span>
              )}
            </div>
            <button
              type="button"
              class="people-places-tab__preview"
              onClick={() =>
                void announceItem({
                  id: record.id,
                  label: record.name,
                  ...(record.voiceClipBlobId ? { voiceClipBlobId: record.voiceClipBlobId } : {}),
                })
              }
            >
              Hear name
            </button>
          </li>
        ))}
        {records.value.length === 0 && (
          <li class="people-places-tab__empty">No {kind} added yet.</li>
        )}
      </ul>

      {error.value && <p class="people-places-tab__error">{error.value}</p>}

      <form class="people-places-tab__form" onSubmit={(event) => void handleSave(event)}>
        <h2 class="people-places-tab__form-title">Add a {title.toLowerCase()}</h2>
        <input
          class="parent-mode-screen__label-input"
          type="text"
          placeholder={`${title} name`}
          value={name.value}
          onInput={(event) => (name.value = (event.target as HTMLInputElement).value)}
        />
        {kind === 'people' && (
          <input
            class="parent-mode-screen__label-input"
            type="text"
            placeholder="Relationship (e.g. Mum, teacher)"
            value={relationship.value}
            onInput={(event) => (relationship.value = (event.target as HTMLInputElement).value)}
          />
        )}
        <input
          class="parent-mode-screen__label-input"
          type="text"
          placeholder="Phrases (comma separated)"
          value={phrasesInput.value}
          onInput={(event) => (phrasesInput.value = (event.target as HTMLInputElement).value)}
        />

        <PhotoCapture onCapture={(blob) => (photoBlob.value = blob)} />
        {photoBlob.value && <p class="people-places-tab__ready">Photo ready.</p>}

        <VoiceClipRecorder onRecorded={(blob) => (voiceClipBlob.value = blob)} />
        {voiceClipBlob.value && <p class="people-places-tab__ready">Voice clip ready.</p>}

        <button
          type="submit"
          class="parent-mode-screen__button"
          disabled={!name.value.trim() || saving.value}
        >
          Save {title.toLowerCase()}
        </button>
      </form>
    </div>
  );
}
