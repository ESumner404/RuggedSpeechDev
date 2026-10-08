import { useSignal } from '@preact/signals';
import { noteAuthorSetting, staffNotesSetting } from '../store/db';
import { formatTime, } from '../store/activity';
import { MAX_NOTES, NOTE_KINDS, type NoteKind } from '../store/staff';

// Notes after a session: what was tried and what was noticed. For the adults
// only, kept on this computer, newest first.
export function NotesTab() {
  const text = useSignal('');
  const confirmRemove = useSignal<string | null>(null);
  const kind = useSignal<NoteKind>('observation');
  const filter = useSignal<'all' | NoteKind>('all');
  const notes = [...staffNotesSetting.signal.value]
    .filter((note) => filter.value === 'all' || (note.kind ?? 'observation') === filter.value)
    .sort((a, b) => b.at - a.at);

  function add(event: Event): void {
    event.preventDefault();
    const trimmed = text.value.trim();
    if (!trimmed || staffNotesSetting.signal.value.length >= MAX_NOTES) return;
    void staffNotesSetting.set([
      ...staffNotesSetting.signal.value,
      { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), by: noteAuthorSetting.signal.value.trim(), text: trimmed, kind: kind.value },
    ]);
    text.value = '';
  }

  return (
    <div class="parent-mode-screen__body notes-tab">
      <p class="about-tab__hint">
        A short note after a session or a day: what was tried, what the child did, what to try next. Notes are for
        adults only, stay on this computer, and appear on the Reports sheets. Please write about communication, and
        keep it kind and factual.
      </p>
      <form class="notes-tab__form" onSubmit={add}>
        <label class="about-tab__field">
          Written by
          <input
            class="about-tab__input"
            type="text"
            autocomplete="off"
            value={noteAuthorSetting.signal.value}
            onInput={(event) => void noteAuthorSetting.set((event.target as HTMLInputElement).value)}
          />
        </label>
        <label class="access-tab__select-row">
          What kind of note
          <select value={kind.value} onChange={(event) => (kind.value = (event.target as HTMLSelectElement).value as NoteKind)}>
            {NOTE_KINDS.map((k) => (
              <option value={k.id} key={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <label class="about-tab__field">
          Note
          <textarea
            class="about-tab__input about-tab__textarea"
            value={text.value}
            onInput={(event) => (text.value = (event.target as HTMLTextAreaElement).value)}
          />
        </label>
        <button type="submit" class="parent-mode-screen__button" disabled={!text.value.trim()}>
          Add note
        </button>
      </form>

      <div class="activity-tab__what" role="group" aria-label="Show notes">
        {[{ id: 'all' as const, label: 'All' }, ...NOTE_KINDS].map((choice) => (
          <button
            type="button"
            key={choice.id}
            class={`activity-tab__chip${filter.value === choice.id ? ' activity-tab__chip--on' : ''}`}
            aria-pressed={filter.value === choice.id}
            onClick={() => (filter.value = choice.id)}
          >
            {choice.label}
          </button>
        ))}
      </div>

      {notes.length === 0 ? (
        <p>{staffNotesSetting.signal.value.length === 0 ? 'No notes yet.' : 'No notes of this kind.'}</p>
      ) : (
        <ul class="notes-tab__list">
          {notes.map((note) => (
            <li class="notes-tab__note" key={note.id}>
              <p class="notes-tab__meta">
                {formatTime(note.at)}
                {note.by.trim() ? `, ${note.by.trim()}` : ''}
                {' · '}
                {NOTE_KINDS.find((k) => k.id === (note.kind ?? 'observation'))!.label}
              </p>
              <p class="notes-tab__text">{note.text}</p>
              {confirmRemove.value === note.id ? (
                <>
                  <span>Remove this note?</span>{' '}
                  <button
                    type="button"
                    class="parent-mode-screen__button"
                    onClick={() => {
                      void staffNotesSetting.set(staffNotesSetting.signal.value.filter((n) => n.id !== note.id));
                      confirmRemove.value = null;
                    }}
                  >
                    Yes, remove it
                  </button>{' '}
                  <button type="button" class="parent-mode-screen__button" onClick={() => (confirmRemove.value = null)}>
                    Keep it
                  </button>
                </>
              ) : (
                <button type="button" class="parent-mode-screen__button" aria-label={`Remove the note from ${formatTime(note.at)}`} onClick={() => (confirmRemove.value = note.id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
