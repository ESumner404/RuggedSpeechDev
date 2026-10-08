import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { resetPinLockoutForTests } from '../store/pinSecurity';
import {
  EMPTY_USER_PROFILE,
  resetDBConnectionForTests,
  schoolModeSetting,
  setFirstRunCompleted,
  setParentPinState,
  setQuickAccess,
  setSchoolPin,
  userProfileSetting,
} from '../store/db';

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
    resetPinLockoutForTests();
    // First run (docs/build-plan.md Phase 8) is a separate, dedicated flow, its own
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

  it('reaches Help in exactly one press from every screen (docs/build-plan.md: ≤ 2)', () => {
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

  it('the spoken Quick Access buttons say their phrase and stay on the current screen', async () => {
    const spoken: string[] = [];
    (window as unknown as { speechSynthesis: SpeechSynthesisSurrogate }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: { text: string }) => spoken.push(utterance.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      text: string;
      rate = 1;
      pitch = 1;
      voice = null;
      constructor(text: string) {
        this.text = text;
      }
    };
    await setQuickAccess(['help', 'break', 'question', 'toilet', 'finished', 'again']);
    render(null, container);
    container = document.createElement('div');
    render(<App />, container);
    await waitFor(
      () => Array.from(container.querySelectorAll('.quick-access-bar__button')).map((b) => b.textContent)[1] === 'Break',
    );

    act(() => tileLabelled(container, 'Talk').click());
    for (const label of ['Break', 'Question', 'Toilet', 'Finished', 'Say again']) {
      act(() => quickAccessButton(container, label).click());
    }
    expect(spoken).toEqual([
      'I need a break',
      'I have a question',
      'I need the toilet',
      "I've finished",
      'Can you say that again, please?',
    ]);
    expect(container.querySelector('.talk-screen')).not.toBeNull();
  });

  it('First / Then can sit on the Quick Access bar and opens its screen from anywhere', async () => {
    await setQuickAccess(['help', 'firstthen', 'yes', 'no', 'home', 'talk']);
    render(null, container);
    container = document.createElement('div');
    render(<App />, container);
    await waitFor(
      () => Array.from(container.querySelectorAll('.quick-access-bar__button')).map((b) => b.textContent)[1] === 'First / Then',
    );

    act(() => tileLabelled(container, 'Keyboard').click());
    act(() => quickAccessButton(container, 'First / Then').click());
    expect(container.querySelector('.first-then-screen')).not.toBeNull();
    expect(container.querySelector('.keyboard-screen')).toBeNull();
  });

  it('the game can sit on the Quick Access bar, and the Home screen keeps its six tiles', async () => {
    await setQuickAccess(['help', 'game', 'yes', 'no', 'home', 'talk']);
    render(null, container);
    container = document.createElement('div');
    render(<App />, container);
    await waitFor(
      () => Array.from(container.querySelectorAll('.quick-access-bar__button')).map((b) => b.textContent)[1] === 'Games',
    );
    expect(container.querySelectorAll('.home-screen__tile')).toHaveLength(6);

    act(() => quickAccessButton(container, 'Games').click());
    await waitFor(() => container.querySelector('.games-menu') !== null);
  });

  it('shows whose device it is along the top, names the window after them, and can be hidden', async () => {
    expect(container.querySelector('.app-shell__device-name')).toBeNull();
    expect(document.title).toBe('Rugged Speech Test');

    await userProfileSetting.set({ ...EMPTY_USER_PROFILE, name: 'Lucy', emoji: '🦁' });
    await waitFor(() => container.querySelector('.app-shell__device-name') !== null);
    expect(container.querySelector('.app-shell__device-name')!.textContent).toContain("Lucy's device");
    await waitFor(() => document.title === "Lucy's device");

    await userProfileSetting.set({ ...userProfileSetting.signal.value, showOnScreen: false });
    await waitFor(() => container.querySelector('.app-shell__device-name') === null);
    expect(document.title).toBe("Lucy's device");
  });

  it('has a Home button on every screen but Home, in the same place, that always goes back', () => {
    const homeButton = () => container.querySelector<HTMLButtonElement>('.home-button');
    expect(homeButton()).toBeNull();
    for (const tile of ['Talk', 'Keyboard', 'My Day', 'Favourites', 'My Pages', 'Feelings & Help']) {
      act(() => tileLabelled(container, tile).click());
      expect(homeButton(), tile).not.toBeNull();
      expect(container.querySelector('.app-shell__toolbar')!.firstElementChild).toBe(homeButton());
      act(() => homeButton()!.click());
      expect(container.querySelector('.home-screen'), tile).not.toBeNull();
      expect(homeButton()).toBeNull();
    }
  });

  describe('School Mode', () => {
    const toolbarButtons = () => Array.from(container.querySelectorAll('.app-shell__toolbar button')).map((b) => b.textContent);
    const enter = (pin: string) => {
      for (const digit of pin) act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.pin-gate__key')).find((k) => k.textContent === digit)!.click());
      act(() => container.querySelector<HTMLButtonElement>('.pin-gate__key--submit')!.click());
    };

    it('has no button until an adult turns it on in Parent Mode', () => {
      expect(container.querySelector('.school-mode-button')).toBeNull();
      expect(toolbarButtons()).not.toContain('School Mode');
    });

    it('once on, has its own button right next to Parent Mode', async () => {
      await setSchoolPin('2468');
      await schoolModeSetting.set(true);
      await waitFor(() => container.querySelector('.school-mode-button') !== null);
      const names = toolbarButtons();
      expect(names[names.indexOf('Parent Mode') + 1]).toBe('School Mode');
    });

    it('asks for the School PIN, not the Parent PIN, and opens School Mode with the right one', async () => {
      await setParentPinState({ pin: '1357', recoveryCode: 'anchor-meadow-violet-cobalt' });
      await setSchoolPin('2468');
      await schoolModeSetting.set(true);
      await waitFor(() => container.querySelector('.school-mode-button') !== null);

      act(() => container.querySelector<HTMLButtonElement>('.school-mode-button')!.click());
      await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the School Mode PIN');

      enter('1357'); // the Parent PIN does not open it
      await waitFor(() => container.querySelector('.pin-gate__error') !== null);
      expect(container.querySelector('.school-mode-screen')).toBeNull();

      await new Promise((resolve) => setTimeout(resolve, 100));
      enter('2468');
      await waitFor(() => container.querySelector('.school-mode-screen') !== null);
      expect(container.querySelector('.parent-mode-screen__title')!.textContent).toBe('School Mode');

      act(() => container.querySelector<HTMLButtonElement>('.parent-mode-screen__exit')!.click());
      await waitFor(() => container.querySelector('.app-shell') !== null);
    });

    it('Parent Mode takes the Parent PIN and School Mode does not open it', async () => {
      await setParentPinState({ pin: '1357', recoveryCode: 'anchor-meadow-violet-cobalt' });
      await setSchoolPin('2468');
      act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === 'Parent Mode')!.click());
      await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the Parent Mode PIN');
      enter('2468');
      await waitFor(() => container.querySelector('.pin-gate__error') !== null);
      expect(container.querySelector('.parent-mode-screen')).toBeNull();
    });
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
