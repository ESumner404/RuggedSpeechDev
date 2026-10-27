import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getAllBoards } from '../store/db';
import { createPageWithButtons } from '../store/pages';
import type { Item } from '../store/types';
import { FITZGERALD_COLORS, type FitzgeraldClass } from '../ui/fitzgerald';
import type { PageButtonSpec } from '../vocab/pageTemplates';

const MAX_CHOICES = 6;

const classOf = (colour: string | undefined): FitzgeraldClass | undefined =>
  (Object.entries(FITZGERALD_COLORS) as Array<[FitzgeraldClass, string]>).find(([, hex]) => hex === colour)?.[0];

/** The words a choice board can be made from: pictured, not a folder, each said differently. */
export function choiceWords(boards: Array<{ buttons: Item[] }>): Item[] {
  const seen = new Set<string>();
  const words: Item[] = [];
  for (const board of boards) {
    for (const item of board.buttons) {
      const key = item.label.trim().toLowerCase();
      if (!key || item.load_board || item.hidden || item.image?.kind !== 'emoji' || seen.has(key)) continue;
      seen.add(key);
      words.push(item);
    }
  }
  return words.sort((a, b) => a.label.localeCompare(b.label));
}

// Choice board maker: choose two to six words and make a page of just those, for a real choice at snack, play or a lesson.
// It is an ordinary page once made, in Lesson pages, to change or share.
export function ChoicesTab() {
  const words = useSignal<Item[]>([]);
  const search = useSignal('');
  const picked = useSignal<string[]>([]);
  const name = useSignal('Choices');
  const message = useSignal('');

  useEffect(() => {
    void getAllBoards().then((boards) => (words.value = choiceWords(boards)));
  }, []);

  const shown = words.value.filter((word) => word.label.toLowerCase().includes(search.value.trim().toLowerCase()));

  function toggle(id: string): void {
    picked.value = picked.value.includes(id) ? picked.value.filter((other) => other !== id) : picked.value.length < MAX_CHOICES ? [...picked.value, id] : picked.value;
  }

  async function make(): Promise<void> {
    const specs: PageButtonSpec[] = picked.value
      .map((id) => words.value.find((word) => word.id === id))
      .filter((word): word is Item => Boolean(word))
      .map((word) => {
        const colour = classOf(word.background_color);
        return {
          label: word.label,
          ...(word.image?.kind === 'emoji' ? { emoji: word.image.char } : {}),
          ...(colour ? { colour } : {}),
          ...(word.vocalization ? { says: word.vocalization } : {}),
        };
      });
    const page = await createPageWithButtons(name.value.trim() || 'Choices', specs);
    picked.value = [];
    message.value = `Made the page “${page.name}”. Find it in Lesson pages, and change anything to suit.`;
  }

  return (
    <div class="parent-mode-screen__body choices-tab">
      <p class="school-tab__hint">
        Choose two to {MAX_CHOICES} words and make a page of just those, for a real choice at snack time, in play or in a lesson. It
        is an ordinary page once made, in <strong>Lesson pages</strong>.
      </p>
      <label>
        Name of the page
        <input type="text" value={name.value} onInput={(event) => (name.value = (event.target as HTMLInputElement).value)} />
      </label>
      <label>
        Find a word
        <input type="search" value={search.value} onInput={(event) => (search.value = (event.target as HTMLInputElement).value)} />
      </label>
      <p class="school-tab__hint" role="status">
        {picked.value.length} chosen of {MAX_CHOICES}.
      </p>
      <ul class="choices-tab__words">
        {shown.map((word) => (
          <li key={word.id}>
            <label class="access-tab__checkbox">
              <input type="checkbox" checked={picked.value.includes(word.id)} onChange={() => toggle(word.id)} />
              {word.image?.kind === 'emoji' ? `${word.image.char} ` : ''}
              {word.label}
            </label>
          </li>
        ))}
      </ul>
      <button type="button" class="parent-mode-screen__button" disabled={picked.value.length < 2} onClick={() => void make()}>
        Make the page
      </button>
      {message.value && (
        <p role="status" class="school-tab__hint">
          {message.value}
        </p>
      )}
    </div>
  );
}
