import { symbolDataUri } from './library';

// The pictures on the Home screen and the top bar are drawn by the style
// sheet, so the words stay just as they were. When drawn symbols are chosen,
// each one is handed to the style sheet as a variable.

/** The symbol drawn for each Home tile and top-bar button, by name. */
export const ICON_SYMBOLS: Record<string, string> = {
  talk: 'talk',
  keyboard: 'keyboard',
  myday: 'my-day',
  favourites: 'favourites',
  mypages: 'my-pages',
  feelings: 'happy',
  home: 'home',
  help: 'help',
  yes: 'yes',
  no: 'no',
  firstthen: 'firstthen',
  game: 'games',
  draw: 'draw',
  body: 'my-body',
  music: 'music',
  traffic: 'traffic',
  break: 'break',
  question: 'what',
  toilet: 'toilet',
  finished: 'all-done',
  again: 'again',
};

export function applySymbolStyle(style: 'emoji' | 'drawn'): void {
  const root = document.documentElement;
  root.dataset['symbols'] = style;
  for (const [id, name] of Object.entries(ICON_SYMBOLS)) {
    const uri = symbolDataUri(name);
    if (style === 'drawn' && uri) root.style.setProperty(`--icon-${id}`, `url("${uri}")`);
    else root.style.removeProperty(`--icon-${id}`);
  }
}

export function applyLabelStyle(style: 'both' | 'pictures' | 'words'): void {
  document.documentElement.dataset['labels'] = style;
}
