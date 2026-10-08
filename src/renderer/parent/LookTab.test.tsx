import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'preact/test-utils';
import { render } from 'preact';
import { LookTab } from './LookTab';
import { resetDBConnectionForTests, themeSetting } from '../store/db';
import { DEFAULT_THEME } from '../ui/theme';
import { IDBFactory } from 'fake-indexeddb';
import 'fake-indexeddb/auto';

let container: HTMLDivElement;

beforeEach(() => {
  indexedDB = new IDBFactory();
  resetDBConnectionForTests();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  render(null, container);
  container.remove();
});

describe('Look: favourite colour', () => {
  it('lists the favourite colours, including pink and orange, and chooses one with a press', async () => {
    await act(async () => {
      render(<LookTab />, container);
    });
    const group = container.querySelector('[aria-label="Favourite colour"]')!;
    const names = Array.from(group.querySelectorAll('button')).map((b) => b.textContent);
    expect(names).toEqual(expect.arrayContaining(['Pink', 'Orange', 'Green', 'Blue', 'Purple']));

    const orange = Array.from(group.querySelectorAll('button')).find((b) => b.textContent === 'Orange')!;
    expect(orange.getAttribute('aria-pressed')).toBe('false');
    await act(async () => {
      orange.click();
    });
    expect(themeSetting.signal.value.preset).toBe('orange');
    expect(orange.getAttribute('aria-pressed')).toBe('true');
  });

  it('keeps the plain, dark and strong contrast looks in a section of their own', async () => {
    themeSetting.signal.value = { ...DEFAULT_THEME };
    await act(async () => {
      render(<LookTab />, container);
    });
    const others = container.querySelector('[aria-label="Colour scheme"]')!;
    const names = Array.from(others.querySelectorAll('.access-tab__preset-name')).map((n) => n.textContent);
    expect(names).toContain('Night');
    expect(names).toContain('Yellow on black');
    expect(names).not.toContain('Pink');
  });
});
