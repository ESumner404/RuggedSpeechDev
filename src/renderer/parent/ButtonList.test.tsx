import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { useSignal } from '@preact/signals';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ButtonList } from './ButtonList';
import { resetDBConnectionForTests } from '../store/db';
import type { Board } from '../store/types';

const START: Board = {
  id: 'test',
  name: 'Test',
  grid: {
    rows: 2,
    columns: 2,
    order: [
      ['a', 'b'],
      [null, null],
    ],
  },
  buttons: [
    { id: 'a', label: 'Apple', image: { kind: 'emoji', char: '🍎' }, background_color: '#fed7aa' },
    { id: 'b', label: 'Banana' },
  ],
};

// Holds the board the way a real tab does, so each edit feeds the next render.
let latest: Board = START;
function Harness() {
  const board = useSignal<Board>(START);
  return (
    <ButtonList
      board={board.value}
      onChange={(next) => {
        board.value = next;
        latest = next;
      }}
    />
  );
}

describe('ButtonList details', () => {
  let container: HTMLElement;

  const detailsButton = (label: string) =>
    container.querySelector<HTMLButtonElement>(`button[aria-label="Details for ${label}"]`)!;
  const openDetails = (label: string) => act(() => detailsButton(label).click());
  const field = (text: string) =>
    Array.from(container.querySelectorAll<HTMLElement>('.button-details__field, .button-details__check')).find(
      (el) => el.textContent?.includes(text),
    )!;
  const buttonNamed = (text: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('.button-details button')).find((b) =>
      b.textContent?.includes(text),
    )!;

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    latest = START;
    container = document.createElement('div');
    render(<Harness />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  it('keeps the extra controls out of the way until Details is opened', () => {
    expect(container.querySelector('.button-details')).toBeNull();
    openDetails('Apple');
    expect(container.querySelectorAll('.button-details')).toHaveLength(1);
    act(() => detailsButton('Apple').click());
    expect(container.querySelector('.button-details')).toBeNull();
  });

  it('sets what a button says when that differs from its label, and clears it again', () => {
    openDetails('Apple');
    const input = field('What it says').querySelector('input')!;
    act(() => {
      input.value = 'an apple please';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(latest.buttons[0]).toMatchObject({ label: 'Apple', vocalization: 'an apple please' });

    act(() => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(latest.buttons[0]?.vocalization).toBeUndefined();
  });

  it('changes the colour to another word class, and the emoji', () => {
    openDetails('Apple');
    const colour = field('Colour').querySelector('select')!;
    act(() => {
      colour.value = 'doing';
      colour.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(latest.buttons[0]?.background_color).toBe('#bbf7d0');

    const emoji = container.querySelector<HTMLInputElement>('input[aria-label="Emoji for Apple"]')!;
    act(() => {
      emoji.value = '🍏';
      emoji.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(latest.buttons[0]?.image).toEqual({ kind: 'emoji', char: '🍏' });
  });

  it('sets a word stage and a focus word, and takes them off again', () => {
    openDetails('Banana');
    const stage = field('Word stage').querySelector('select')!;
    act(() => {
      stage.value = '3';
      stage.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(latest.buttons[1]?.stage).toBe(3);

    const toggleFocus = () => {
      const focus = field('Focus word').querySelector('input')!;
      act(() => {
        focus.checked = !focus.checked;
        focus.dispatchEvent(new Event('change', { bubbles: true }));
      });
    };
    toggleFocus();
    expect(latest.buttons[1]?.target).toBe(true);
    toggleFocus();
    expect(latest.buttons[1]?.target).toBeUndefined();

    act(() => {
      stage.value = '';
      stage.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(latest.buttons[1]?.stage).toBeUndefined();
  });

  it('asks before removing a button, then leaves its slot empty so nothing else moves', () => {
    openDetails('Apple');
    act(() => buttonNamed('Remove this button').click());
    expect(latest.buttons).toHaveLength(2); // nothing yet: it asked first

    act(() => buttonNamed('Keep it').click());
    expect(latest.buttons).toHaveLength(2);

    act(() => buttonNamed('Remove this button').click());
    act(() => buttonNamed('Yes, remove it').click());
    expect(latest.buttons.map((b) => b.id)).toEqual(['b']);
    expect(latest.grid.order).toEqual([
      [null, 'b'],
      [null, null],
    ]);
  });
});
