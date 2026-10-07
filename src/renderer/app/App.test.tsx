import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { resetDBConnectionForTests, setFirstRunCompleted, setQuickAccess } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function tileLabelled(container: HTMLElement, label: string): HTMLButtonElement {
  const tile = Array.from(container.querySelectorAll<HTMLButtonElement>('.home-screen__tile')).find(
    (el) => el.textContent === label,
  );
  if (!tile) throw new Error(`No home tile labelled "${label}"`);
  return tile;
}

function quickAccessButton(container: HTMLElement, label: string): HTMLButtonElement {
  const button = Array.from(
    container.querySelectorAll<HTMLButtonElement>('.quick-access-bar__button'),
  ).find((el) => el.textContent === label);
  if (!button) throw new Error(`No Quick Access button labelled "${label}"`);
  return button;
}

describe('App', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    // First run (PLAN.md Phase 8) is a separate, dedicated flow — its own
    // wizard is covered in setup/FirstRunWizard.test.tsx. These tests are
    // about ordinary routing once that's already behind you.
    await setFirstRunCompleted();
    container = document.createElement('div');
    render(<App />, container);
    await waitFor(() => container.querySelector('.home-screen__tile') !== null);
  });

  it('shows the six home tiles in fixed order', () => {
    const labels = Array.from(container.querySelectorAll('.home-screen__tile')).map((el) => el.textContent);
    expect(labels).toEqual(['Talk', 'Keyboard', 'My Day', 'Favourites', 'My Pages', 'Feelings & Help']);
  });

  it('navigates to Talk when its tile is pressed', () => {
    act(() => tileLabelled(container, 'Talk').click());
    expect(container.querySelector('.talk-screen')).not.toBeNull();
  });

  it('shows an empty-state message for My Pages until an adult creates one', async () => {
    act(() => tileLabelled(container, 'My Pages').click());
    await waitFor(() => container.querySelector('.my-pages-screen__empty-title') !== null);
    expect(container.querySelector('.my-pages-screen__empty-title')?.textContent).toBe('No pages yet');
  });

  it('shows the Quick Access bar on every screen', () => {
    const routes = ['Talk', 'Keyboard', 'My Day', 'Favourites', 'My Pages', 'Feelings & Help'];
    for (const route of routes) {
      act(() => tileLabelled(container, route).click());
      expect(container.querySelectorAll('.quick-access-bar__button')).toHaveLength(6);
      act(() => quickAccessButton(container, 'Home').click());
    }
  });

  it('reaches Help in exactly one press from every screen (PLAN.md: ≤ 2)', () => {
    const routes = ['Talk', 'Keyboard', 'My Day', 'Favourites', 'My Pages', 'Feelings & Help'];
    for (const route of routes) {
      act(() => tileLabelled(container, route).click());
      act(() => quickAccessButton(container, 'Help').click());
      expect(container.querySelector('.page-tabs__tab[aria-pressed="true"]')?.textContent).toBe('Help');
      expect(container.querySelectorAll('.feelings-help-screen__grid--help .board-button')).toHaveLength(9);
      act(() => quickAccessButton(container, 'Home').click());
    }
  });

  it('Help is also one press away from the home screen itself', () => {
    act(() => quickAccessButton(container, 'Help').click());
    expect(container.querySelector('.page-tabs__tab[aria-pressed="true"]')?.textContent).toBe('Help');
  });

  it('Yes and No speak immediately without leaving the current screen', async () => {
    const spoken: string[] = [];
    (window as unknown as { speechSynthesis: SpeechSynthesisSurrogate }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: { text: string }) => spoken.push(utterance.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
      class {
        text: string;
        rate = 1;
        pitch = 1;
        voice = null;
        constructor(text: string) {
          this.text = text;
        }
      };

    act(() => tileLabelled(container, 'My Pages').click());
    await waitFor(() => container.querySelector('.my-pages-screen__empty-title') !== null);
    act(() => quickAccessButton(container, 'Yes').click());
    act(() => quickAccessButton(container, 'No').click());

    expect(spoken).toEqual(['yes', 'no']);
    expect(container.querySelector('.my-pages-screen__empty-title')?.textContent).toBe('No pages yet');
  });

  it('the Quick Access bar follows the adult-chosen layout, and each button goes where it says', async () => {
    await setQuickAccess(['help', 'talk', 'yes', 'no', 'myday', 'home']);
    render(null, container);
    container = document.createElement('div');
    render(<App />, container);
    await waitFor(() => container.querySelectorAll('.quick-access-bar__button').length === 6);
    await waitFor(
      () => Array.from(container.querySelectorAll('.quick-access-bar__button')).map((b) => b.textContent)[1] === 'Talk',
    );

    expect(Array.from(container.querySelectorAll('.quick-access-bar__button')).map((b) => b.textContent)).toEqual([
      'Help',
      'Talk',
      'Yes',
      'No',
      'My Day',
      'Home',
    ]);

    act(() => quickAccessButton(container, 'Talk').click());
    expect(container.querySelector('.talk-screen')).not.toBeNull();
    act(() => quickAccessButton(container, 'My Day').click());
    expect(container.querySelector('.talk-screen')).toBeNull();
    act(() => quickAccessButton(container, 'Help').click());
    expect(container.querySelector('.page-tabs__tab[aria-pressed="true"]')?.textContent).toBe('Help');
  });

  it('a single press of the Parent Mode button opens the PIN gate', () => {
    expect(container.querySelector('.pin-gate-overlay')).toBeNull();
    const button = Array.from(container.querySelectorAll('button')).find(
      (el) => el.textContent === 'Parent Mode',
    )!;
    act(() => button.click());
    expect(container.querySelector('.pin-gate-overlay')).not.toBeNull();
  });
});

type SpeechSynthesisSurrogate = {
  getVoices: () => SpeechSynthesisVoice[];
  cancel: () => void;
  speak: (utterance: { text: string }) => void;
};
