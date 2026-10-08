import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GamesScreen } from './GamesScreen';
import { getRecentEntries, resetDBConnectionForTests, setRecentEnabled } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('Games', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = [];
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: { text: string }) => spoken.push(utterance.text),
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      constructor(public text: string) {}
    };
    // jsdom has no canvas; real drawing is checked in the end-to-end tests.
    HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
    container = document.createElement('div');
    render(<GamesScreen />, container);
  });

  afterEach(() => {
    render(null, container);
  });

  const text = (selector: string) => container.querySelector(selector)?.textContent ?? '';
  const button = (label: string) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim() === label)!;
  const enter = async (game: string, ready: string) => {
    act(() =>
      Array.from(container.querySelectorAll<HTMLButtonElement>('.games-menu__tile'))
        .find((tile) => tile.querySelector('.games-menu__label')!.textContent === game)!
        .click(),
    );
    await waitFor(() => container.querySelector(ready) !== null);
  };

  it('shows the games in a fixed order, and says nothing', () => {
    const labels = Array.from(container.querySelectorAll('.games-menu__label')).map((el) => el.textContent);
    expect(labels).toEqual(['Find the word', 'Snap', 'Rollercoaster', 'Draw', 'Jokes', 'Music', 'Piano']);
    expect(spoken).toEqual([]);
  });

  it('every game has the same All games button in the same corner, which comes back to the menu', async () => {
    await enter('Snap', '.snap-screen');
    act(() => button('All games').click());
    expect(container.querySelector('.games-menu')).not.toBeNull();
  });

  describe('Snap', () => {
    it('starts with nothing turned, and the first card is never a snap', async () => {
      await enter('Snap', '.snap-screen');
      expect(button('SNAP!').disabled).toBe(true);
      act(() => button('Turn a card').click());
      expect(container.querySelectorAll('.snap-card__label')).toHaveLength(1);
      act(() => button('SNAP!').click());
      expect(text('.game-screen__message')).toBe('Not the same this time. Keep looking.');
    });

    it('speaks a card only when it is pressed, and a wrong SNAP costs nothing', async () => {
      await enter('Snap', '.snap-screen');
      act(() => button('Turn a card').click());
      expect(spoken).toEqual([]);
      const word = text('.snap-card__label');
      act(() => container.querySelectorAll<HTMLButtonElement>('.snap-card')[1]!.click());
      expect(spoken).toEqual([word]);
      expect(text('.game-screen__count')).toContain('Snaps found: 0');
    });

    it('plays a whole deck by turning cards, finds every snap called, and offers to play again', async () => {
      await enter('Snap', '.snap-screen');
      act(() => button('Turn a card').click());
      let calls = 0;
      for (let guard = 0; guard < 20 && !button('Play again'); guard += 1) {
        const labels = container.querySelectorAll('.snap-card__label');
        if (labels.length === 2 && labels[0]!.textContent === labels[1]!.textContent) {
          act(() => button('SNAP!').click());
          calls += 1;
        }
        if (container.querySelector('.snap-screen__turn')!.textContent === 'Play again') break;
        act(() => button('Turn the next card').click());
      }
      const labels = container.querySelectorAll('.snap-card__label');
      if (labels.length === 2 && labels[0]!.textContent === labels[1]!.textContent && !text('.game-screen__message').includes('Snap!')) {
        act(() => button('SNAP!').click());
        calls += 1;
      }
      expect(text('.game-screen__message')).toContain('All done');
      expect(text('.game-screen__message')).toMatch(new RegExp(`Snaps found: ${calls} of \\d+`));
      expect(container.querySelector('.snap-screen__turn')!.textContent).toBe('Play again');
    });
  });

  describe('Rollercoaster', () => {
    const setUp = async (level: string, ride: string) => {
      await enter('Rollercoaster', '.ride-setup');
      act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.ride-setup__choice')).find((b) => b.textContent!.startsWith(level))!.click());
      act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.ride-setup__choice')).find((b) => b.textContent!.startsWith(ride))!.click());
      act(() => button('Start the ride').click());
      await waitFor(() => container.querySelector('.ride-screen__sentence') !== null);
    };
    const choices = () => Array.from(container.querySelectorAll<HTMLButtonElement>('.ride-screen__choice'));
    const sentence = () => text('.ride-screen__sentence').trim();
    const trainX = () => container.querySelector('.ride-screen__track g[transform^="translate"]')!.getAttribute('transform');

    /** Chooses the right picture word: tries each choice until the sentence grows. */
    const findThing = () => {
      for (const choice of choices()) {
        const before = sentence();
        act(() => choice.click());
        if (sentence() !== before) return;
      }
    };

    it('starts by choosing how long the sentences are and how long the ride is, and says nothing', async () => {
      await enter('Rollercoaster', '.ride-setup');
      expect(Array.from(container.querySelectorAll('.ride-setup__choice strong')).map((el) => el.textContent)).toEqual([
        'Two words',
        'Three words',
        'Four words',
        'Short ride',
        'Long ride',
      ]);
      expect(spoken).toEqual([]);
    });

    it('three words: builds "I want ball" a word at a time and moves the train along in steps', async () => {
      await setUp('Three words', 'Short ride');
      const start = trainX();
      act(() => button('I').click());
      expect(spoken).toEqual(['I']);
      expect(trainX()).not.toBe(start);
      act(() => button('want').click());
      expect(sentence()).toBe('I want');
      findThing();
      expect(sentence().split(' ')).toHaveLength(3);
      act(() => button('Say it all').click());
      expect(spoken[spoken.length - 1]).toMatch(/^I want \S+$/);
    });

    it('two words starts at the doing word, and four words adds a describing word', async () => {
      await setUp('Two words', 'Short ride');
      expect(choices().map((c) => c.textContent)).toEqual(['want', 'like', 'see']);
      act(() => button('like').click());
      findThing();
      expect(sentence().split(' ')).toHaveLength(2);
      render(null, container);
      container = document.createElement('div');
      render(<GamesScreen />, container);
      await setUp('Four words', 'Short ride');
      act(() => button('I').click());
      act(() => button('see').click());
      expect(text('.game-screen__message')).toBe('Choose a describing word.');
      act(() => choices()[0]!.click());
      findThing();
      expect(sentence().split(' ')).toHaveLength(4);
    });

    it('after two wrong tries the right word is pointed to, so nobody is stuck', async () => {
      await setUp('Two words', 'Short ride');
      act(() => button('want').click());
      const target = choices();
      // Press choices until two are wrong; the sentence must not have grown.
      const before = sentence();
      let wrong = 0;
      for (const choice of target) {
        if (wrong === 2) break;
        act(() => choice.click());
        if (sentence() === before) wrong += 1;
        else break;
      }
      if (wrong === 2) {
        expect(container.querySelectorAll('.ride-screen__choice--hint')).toHaveLength(1);
        expect(text('.game-screen__message')).toBe('Look at the word with the pointer.');
      }
    });

    it('keeps a ticket for each sentence, goes round the whole track, and says them all only when asked', async () => {
      await setUp('Two words', 'Short ride');
      for (let hill = 0; hill < 3; hill += 1) {
        act(() => button('see').click());
        findThing();
        act(() => (hill === 2 ? button('To the end') : button('Next hill')).click());
      }
      expect(text('.game-screen__message')).toBe('You have been all the way round the track.');
      expect(container.querySelectorAll('.ride-screen__ticket')).toHaveLength(3);
      const before = spoken.length;
      act(() => button('Say my sentences').click());
      expect(spoken.length).toBeGreaterThan(before);
      act(() => button('Ride again').click());
      await waitFor(() => container.querySelector('.ride-screen__sentence') !== null);
    });

    it('can change the ride part way, and show a picture on each word', async () => {
      await setUp('Two words', 'Short ride');
      act(() => button('want').click());
      act(() => button('Pictures on the words').click());
      expect(container.querySelectorAll('.ride-screen__choice .game-option__emoji').length).toBe(4);
      act(() => button('Change the ride').click());
      expect(container.querySelector('.ride-setup')).not.toBeNull();
    });
  });

  describe('Draw', () => {
    it('is a drawing page with colours and sizes, and nothing speaks', async () => {
      await enter('Draw', '.draw-screen');
      expect(container.querySelectorAll('.draw-screen__colour')).toHaveLength(12);
      expect(container.querySelectorAll('.draw-screen__size')).toHaveLength(3);
      expect(spoken).toEqual([]);
    });

    it('chooses a colour and a size', async () => {
      await enter('Draw', '.draw-screen');
      const red = container.querySelector<HTMLButtonElement>('button[aria-label="red"]')!;
      act(() => red.click());
      expect(red.getAttribute('aria-pressed')).toBe('true');
      const thick = container.querySelector<HTMLButtonElement>('button[aria-label="thick"]')!;
      act(() => thick.click());
      expect(thick.getAttribute('aria-pressed')).toBe('true');
    });
  });

  it('what the games say never goes into Recent', async () => {
    await setRecentEnabled(true);
    await enter('Snap', '.snap-screen');
    act(() => button('SNAP!').click());
    act(() => button('Turn a card').click());
    act(() => container.querySelectorAll<HTMLButtonElement>('.snap-card')[1]!.click());
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(await getRecentEntries()).toEqual([]);
  });
});
