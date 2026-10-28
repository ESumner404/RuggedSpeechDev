import { signal } from '@preact/signals';

/** What the screen says for a moment after a word is added to Favourites, so it can be seen as well as heard. */
export const favouriteNotice = signal('');

const SHOWN_FOR_MS = 3000;
let timer: ReturnType<typeof setTimeout> | undefined;

export function showFavouriteNotice(label: string): void {
  favouriteNotice.value = `${label} added to Favourites`;
  if (timer !== undefined) clearTimeout(timer);
  timer = setTimeout(() => {
    favouriteNotice.value = '';
    timer = undefined;
  }, SHOWN_FOR_MS);
}
