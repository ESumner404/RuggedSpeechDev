import 'fake-indexeddb/auto';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { familySetting } from '../store/db';
import { FamilyScreen } from './FamilyScreen';
import type { FamilyMember } from './family';

const person = (id: string, name: string, extra: Partial<FamilyMember> = {}): FamilyMember => ({
  id,
  name,
  relation: '',
  group: 'family',
  emoji: '🙂',
  parentIds: [],
  ...extra,
});

describe('My family', () => {
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
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: (utterance: { text: string }) => spoken.push(utterance.text),
    };
    container = document.createElement('div');
    familySetting.signal.value = [
      person('nan', 'Nan', { relation: 'Grandma' }),
      person('mum', 'Mum', { relation: 'Mum', parentIds: ['nan'] }),
      person('me', 'Lucy', { relation: 'Me', parentIds: ['mum'] }),
      person('jo', 'Jo', { relation: 'Best friend', group: 'friends' }),
    ];
  });

  afterEach(() => {
    render(null, container);
    familySetting.reset();
  });

  it('draws the family from the oldest down, and says who a person is when pressed', async () => {
    render(<FamilyScreen />, container);
    const names = Array.from(container.querySelectorAll('.family-card__name')).map((n) => n.textContent);
    expect(names).toEqual(['Nan', 'Mum', 'Lucy']);
    await act(() => container.querySelectorAll<HTMLButtonElement>('.family-card')[0]!.click());
    expect(spoken).toEqual(['This is Nan, my grandma.']);
  });

  it('shows the friends on their own tab, not in the tree', async () => {
    render(<FamilyScreen />, container);
    expect(container.textContent).not.toContain('Jo');
    await act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.family-screen__tab')).find((b) => b.textContent === 'My friends')!.click());
    expect(Array.from(container.querySelectorAll('.family-card__name')).map((n) => n.textContent)).toEqual(['Jo']);
  });

  it('says so, kindly, when no one has been added', async () => {
    familySetting.signal.value = [];
    render(<FamilyScreen />, container);
    expect(container.textContent).toContain('An adult can add people in Parent Mode');
  });
});
