import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { diarySetting, diarySeenSetting } from '../store/db';
import { MAX_DIARY_TEXT, addEntry, makeEntry, type DiaryEntry } from './diary';

const WHEN = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

type Props = { side: 'home' | 'school' };

// A note each way between home and school. Whichever side is looking writes as itself, and what the other side wrote is
// marked until it has been seen. For adults only.
export function DiaryTab({ side }: Props) {
  const entries = diarySetting.signal.value;
  const text = useSignal('');
  const author = useSignal('');
  const other = side === 'home' ? 'school' : 'home';
  // What counts as new is what came in since the last visit, kept for this visit even though looking now marks it seen.
  const seenAtOpen = useRef(diarySeenSetting.signal.value[side] ?? 0);

  // Looking at the page counts as having seen what the other side wrote.
  useEffect(() => {
    void diarySeenSetting.set({ ...diarySeenSetting.signal.value, [side]: Date.now() });
  }, []);

  async function add(event: Event): Promise<void> {
    event.preventDefault();
    const entry = makeEntry(side, author.value, text.value, Date.now());
    if (!entry) return;
    await diarySetting.set(addEntry(diarySetting.signal.value, entry));
    text.value = '';
  }

  async function remove(entry: DiaryEntry): Promise<void> {
    await diarySetting.set(diarySetting.signal.value.filter((item) => item.id !== entry.id));
  }

  return (
    <div class="parent-mode-screen__body diary-tab">
      <p class="about-tab__hint">
        A short note each way between home and school: what went well, what to try, what to look out for. It is for adults only and
        is never shown on the child's screen. Please write about communication, and keep it kind and factual.
      </p>
      <form class="diary-tab__form" onSubmit={(event) => void add(event)}>
        <label>
          Your name
          <input type="text" value={author.value} placeholder={side === 'home' ? 'Mum' : 'Ms Khan'} onInput={(event) => (author.value = (event.target as HTMLInputElement).value)} />
        </label>
        <label>
          Write a note {side === 'home' ? 'for school' : 'for home'}
          <textarea
            rows={3}
            maxLength={MAX_DIARY_TEXT}
            value={text.value}
            onInput={(event) => (text.value = (event.target as HTMLTextAreaElement).value)}
          />
        </label>
        <button type="submit" class="parent-mode-screen__button" disabled={!text.value.trim()}>
          Add to the diary
        </button>
      </form>
      {entries.length === 0 && <p>No notes yet.</p>}
      <ul class="diary-tab__list">
        {entries.map((entry) => (
          <li class={`diary-tab__entry diary-tab__entry--${entry.from}`} key={entry.id}>
            <p class="diary-tab__meta">
              <strong>{entry.from === 'home' ? 'From home' : 'From school'}</strong>
              {entry.author ? `, ${entry.author}` : ''} · {WHEN.format(entry.at)}
              {entry.from === other && entry.at > seenAtOpen.current ? ' · new' : ''}
            </p>
            <p class="diary-tab__text">{entry.text}</p>
            <button type="button" class="parent-mode-screen__button" aria-label={`Delete the note from ${entry.author || entry.from}`} onClick={() => void remove(entry)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
