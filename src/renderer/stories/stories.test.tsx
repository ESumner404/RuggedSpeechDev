import 'fake-indexeddb/auto';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StoriesScreen } from './StoriesScreen';
import { STARTER_STORIES, isStoryList, moveStep, newStep, newStory, storyFromStarter } from './stories';
import { storiesSetting } from '../store/db';

describe('story steps', () => {
  it('moves a step one place and leaves the rest, and does nothing at the ends', () => {
    const steps = [newStep('a'), newStep('b'), newStep('c')];
    expect(moveStep(steps, 1, -1).map((s) => s.text)).toEqual(['b', 'a', 'c']);
    expect(moveStep(steps, 1, 1).map((s) => s.text)).toEqual(['a', 'c', 'b']);
    expect(moveStep(steps, 0, -1)).toBe(steps);
    expect(moveStep(steps, 2, 1)).toBe(steps);
  });

  it('makes a story with a name always', () => {
    expect(newStory('  Dentist ').title).toBe('Dentist');
    expect(newStory('  ').title).toBe('My story');
  });

  it('checks a saved list before using it', () => {
    expect(isStoryList([{ id: 'a', title: 'A', emoji: '📖', steps: [{ id: 's', text: 't', emoji: '🙂' }] }])).toBe(true);
    expect(isStoryList([{ id: 'a', title: 'A', emoji: '📖', steps: [{ id: 's' }] }])).toBe(false);
  });
});

describe('the starting stories', () => {
  it('each has a few plain steps in the first person, and is kind in tone', () => {
    for (let i = 0; i < STARTER_STORIES.length; i += 1) {
      const story = storyFromStarter(i)!;
      expect(story.steps.length).toBeGreaterThanOrEqual(5);
      for (const step of story.steps) expect(step.text.trim()).not.toBe('');
    }
    const text = JSON.stringify(STARTER_STORIES).toLowerCase();
    for (const word of ['must', 'naughty', 'bad', 'scary', 'hurt']) expect(text).not.toContain(word);
    expect(storyFromStarter(99)).toBeNull();
  });
});

describe('reading a story', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    spoken = [];
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      text: string;
      rate = 1;
      pitch = 1;
      volume = 1;
      voice = null;
      constructor(text: string) {
        this.text = text;
      }
    };
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = { getVoices: () => [], cancel: () => {}, speak: (u: { text: string }) => spoken.push(u.text) };
    storiesSetting.signal.value = [{ id: 's1', title: 'Haircut', emoji: '✂️', steps: [{ id: 'a', text: 'I sit down.', emoji: '💇' }, { id: 'b', text: 'It is done.', emoji: '🪞' }] }];
    container = document.createElement('div');
  });
  afterEach(() => {
    render(null, container);
    storiesSetting.reset();
  });

  const press = (text: string) => act(() => Array.from(container.querySelectorAll('button')).find((b) => b.textContent === text)!.click());

  it('shows a step at a time, reads it only when asked, and ends back at the list', async () => {
    render(<StoriesScreen />, container);
    await act(() => container.querySelector<HTMLButtonElement>('.stories-screen__tile')!.click());
    expect(container.textContent).toContain('I sit down.');
    expect(spoken).toEqual([]);
    await press('Read to me');
    expect(spoken).toEqual(['I sit down.']);
    await press('Next');
    expect(container.textContent).toContain('It is done.');
    expect(container.textContent).toContain('2 of 2');
    await press('All stories');
    expect(container.querySelector('.stories-screen__tile')).not.toBeNull();
  });

  it('says so when there are no stories', () => {
    storiesSetting.signal.value = [];
    render(<StoriesScreen />, container);
    expect(container.textContent).toContain('No stories yet');
  });
});
