import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pic } from './Pic';
import { PictureChoices } from './PictureChoices';
import { EMOJI_TO_SYMBOL, SYMBOLS, drawnFor, hasSymbolFor, symbolSvg } from './library';
import { ICON_SYMBOLS, applyLabelStyle, applySymbolStyle } from './icons';
import { labelStyleSetting, resetDBConnectionForTests, symbolStyleSetting } from '../store/db';
import { STARTER_BOARDS } from '../vocab/starter';
import { FEELINGS_ITEMS, HELP_ITEMS } from '../vocab/feelingsHelp';

describe('the drawn symbols', () => {
  it('every emoji that has a drawing points at one that exists', () => {
    for (const [emoji, name] of Object.entries(EMOJI_TO_SYMBOL)) expect(SYMBOLS[name], `${emoji} -> ${name}`).toBeDefined();
  });

  it('draws every starter word: nothing on the first pages is left as an emoji', () => {
    const missing = STARTER_BOARDS.flatMap((board) =>
      board.buttons.filter((b) => b.image?.kind === 'emoji' && !hasSymbolFor(b.image.char)).map((b) => `${board.name}: ${b.label}`),
    );
    expect(missing).toEqual([]);
  });

  it('draws every picture on the Home screen and the top bar', () => {
    for (const [id, name] of Object.entries(ICON_SYMBOLS)) expect(SYMBOLS[name], id).toBeDefined();
  });

  it('is well-formed, on the same grid, and has no script, link or outside address in it', () => {
    for (const name of Object.keys(SYMBOLS)) {
      const svg = symbolSvg(name)!;
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      expect(doc.querySelector('parsererror'), name).toBeNull();
      expect(doc.documentElement.getAttribute('viewBox'), name).toBe('0 0 64 64');
      expect(svg, name).not.toMatch(/<script|onload|onerror|href=|xlink|javascript:|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
    }
  });

  it('gives back a picture to use for an emoji, and nothing for one it has not drawn', () => {
    expect(drawnFor('🍎')).toMatch(/^data:image\/svg\+xml;utf8,/);
    expect(drawnFor('🦖')).toBeUndefined();
    expect(hasSymbolFor('🦖')).toBe(false);
  });

  it('is a small number of colours, so the pictures look like one set', () => {
    const colours = new Set<string>();
    for (const name of Object.keys(SYMBOLS)) for (const m of symbolSvg(name)!.matchAll(/fill="(#[0-9a-f]{6})"/gi)) colours.add(m[1]!.toLowerCase());
    expect(colours.size).toBeLessThan(40);
  });

  it('covers most of what the feelings and help screens show, and shows the rest as emoji', () => {
    const items = [...FEELINGS_ITEMS, ...HELP_ITEMS].filter((i) => i.image?.kind === 'emoji');
    const drawn = items.filter((i) => i.image?.kind === 'emoji' && hasSymbolFor(i.image.char));
    expect(drawn.length).toBeGreaterThan(items.length / 4);
  });
});

describe('Pic', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('shows the emoji by default', () => {
    render(<Pic char="🍎" class="x" />, container);
    expect(container.querySelector('span.x')!.textContent).toBe('🍎');
    expect(container.querySelector('img')).toBeNull();
  });

  it('shows the drawing when drawn symbols are chosen, hidden from a screen reader, and the emoji where there is no drawing', async () => {
    await symbolStyleSetting.set('drawn');
    render(
      <>
        <Pic char="🍎" class="x" />
        <Pic char="🦖" class="y" />
      </>,
      container,
    );
    const img = container.querySelector('img.x')!;
    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(img.getAttribute('aria-hidden')).toBe('true');
    expect(img.getAttribute('alt')).toBe('');
    expect(container.querySelector('span.y')!.textContent).toBe('🦖');
  });

  it('changes when the choice changes', async () => {
    render(<Pic char="🍎" />, container);
    expect(container.querySelector('img')).toBeNull();
    await symbolStyleSetting.set('drawn');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(container.querySelector('img')).not.toBeNull();
  });
});

describe('PictureChoices', () => {
  let container: HTMLElement;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    container = document.createElement('div');
    render(<PictureChoices />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const choice = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('.picture-choices__option')).find((b) => b.textContent!.startsWith(label))!;

  it('chooses drawn symbols or emoji, and remembers it', async () => {
    expect(choice('Emoji').getAttribute('aria-pressed')).toBe('true');
    act(() => choice('Drawn symbols').click());
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(symbolStyleSetting.signal.value).toBe('drawn');
    expect(await symbolStyleSetting.get()).toBe('drawn');
    expect(choice('Drawn symbols').getAttribute('aria-pressed')).toBe('true');
  });

  it('chooses a picture and a word, a picture only or a word only, and the preview follows', async () => {
    expect(container.querySelectorAll('.picture-preview__label')).toHaveLength(4);
    act(() => choice('Pictures only').click());
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(labelStyleSetting.signal.value).toBe('pictures');
    expect(container.querySelectorAll('.picture-preview__label')).toHaveLength(0);
    expect(container.querySelectorAll('.picture-preview__pic')).toHaveLength(4);
    act(() => choice('Words only').click());
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(container.querySelectorAll('.picture-preview__pic')).toHaveLength(0);
    expect(container.querySelectorAll('.picture-preview__label')).toHaveLength(4);
  });
});

describe('putting the style on the page', () => {
  afterEach(() => {
    applySymbolStyle('emoji');
    applyLabelStyle('both');
  });

  it('hands the style sheet each drawing, and takes them away again', () => {
    applySymbolStyle('drawn');
    const root = document.documentElement;
    expect(root.dataset['symbols']).toBe('drawn');
    expect(root.style.getPropertyValue('--icon-talk')).toMatch(/^url\("data:image\/svg\+xml/);
    applySymbolStyle('emoji');
    expect(root.dataset['symbols']).toBe('emoji');
    expect(root.style.getPropertyValue('--icon-talk')).toBe('');
  });

  it('sets what each button shows', () => {
    applyLabelStyle('words');
    expect(document.documentElement.dataset['labels']).toBe('words');
  });
});
