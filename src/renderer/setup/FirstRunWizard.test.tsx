import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FirstRunWizard } from './FirstRunWizard';
import {
  EMPTY_USER_PROFILE,
  ensureSeeded,
  getAccessSettings,
  getPressMode,
  labelStyleSetting,
  symbolStyleSetting,
  getQuickAccess,
  getRootBoard,
  hasCompletedFirstRun,
  resetDBConnectionForTests,
  themeSetting,
  userProfileSetting,
} from '../store/db';
import { deviceTitle } from '../ui/deviceName';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function stubSpeech(): void {
  const voices: SpeechSynthesisVoice[] = [
    { voiceURI: 'Voice A', name: 'Voice A', localService: true } as SpeechSynthesisVoice,
    { voiceURI: 'Voice B', name: 'Voice B', localService: true } as SpeechSynthesisVoice,
  ];
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => voices,
    cancel: () => {},
    speak: () => {},
  };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    text: string;
    constructor(text: string) {
      this.text = text;
    }
  };
}

async function setUpPin(container: HTMLElement, pin: string): Promise<void> {
  for (const digit of pin) {
    const key = Array.from(container.querySelectorAll<HTMLButtonElement>('.pin-gate__key')).find(
      (el) => el.textContent === digit,
    )!;
    act(() => key.click());
  }
  act(() => container.querySelector<HTMLButtonElement>('.pin-gate__key--submit')!.click());
}

const primary = (container: HTMLElement) => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!;

/** Gets through the welcome and "whose device" screens to the voice choice. */
async function toVoiceScreen(container: HTMLElement): Promise<void> {
  await waitFor(() => container.querySelector('.first-run-wizard__promises') !== null);
  act(() => primary(container).click());
  await waitFor(() => container.textContent?.includes('Whose device is this?') ?? false);
  act(() => primary(container).click());
  await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
}

describe('FirstRunWizard', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    stubSpeech();
    await ensureSeeded();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('shows only offline voices, and moves to the grid screen on Next', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await toVoiceScreen(container);
    expect(container.querySelectorAll('.first-run-wizard__voice-option')).toHaveLength(2);

    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.textContent?.includes('Choose a grid size') ?? false);
  });

  it('only offers grid sizes that actually fit the current vocabulary', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await toVoiceScreen(container);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);

    // The root board ships with 16 buttons, 2×2 and 3×3 can't hold them.
    const options = Array.from(container.querySelectorAll('.first-run-wizard__grid-size-option')).map((el) =>
      el.textContent?.trim(),
    );
    expect(options).not.toContain('2 × 2');
    expect(options).not.toContain('3 × 3');
    expect(options).toContain('4 × 4');
  });

  it('resizing to a larger grid on Next actually updates the root board', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await toVoiceScreen(container);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);

    const fiveByFive = Array.from(
      container.querySelectorAll<HTMLInputElement>('.first-run-wizard__grid-size-option input'),
    ).find((input) => input.closest('label')?.textContent?.includes('5'))!;
    act(() => {
      fiveByFive.checked = true;
      fiveByFive.dispatchEvent(new Event('change', { bubbles: true }));
    });
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.textContent?.includes('Pictures and words') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('What should pressing a word do?') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Choose the colours') ?? false);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.textContent?.includes('Set a Parent PIN') ?? false);

    const board = await getRootBoard();
    expect(board?.grid.rows).toBe(5);
    expect(board?.grid.columns).toBe(5);
  });

  it('completing the PIN step marks first run done and calls onComplete', async () => {
    let completed = false;
    render(<FirstRunWizard onComplete={() => (completed = true)} />, container);
    await toVoiceScreen(container);
    act(() => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--primary')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Pictures and words') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('What should pressing a word do?') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Choose the colours') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);

    // PIN setup here is mandatory. Cancel would have nowhere to go, so a
    // button that visibly did nothing when pressed would just look broken.
    // It's hidden entirely rather than wired to a no-op.
    expect(container.querySelector('.pin-gate__cancel')).toBeNull();

    await setUpPin(container, '1234');
    await setUpPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => container.querySelector<HTMLButtonElement>('.pin-gate__button')!.click());

    // Setting up is finished once the PIN is in; the last screen is only a tour.
    await waitFor(() => container.textContent?.includes('You are ready') ?? false);
    expect(await hasCompletedFirstRun()).toBe(true);
    expect(completed).toBe(false);
    act(() => primary(container).click());
    await waitFor(() => completed);
  });

  it('can be skipped, and then leaves no name behind', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await waitFor(() => container.querySelector('.first-run-wizard__promises') !== null);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Whose device is this?') ?? false);
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.first-run-wizard__button')).find((b) => b.textContent === 'Skip')!.click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
    expect(userProfileSetting.signal.value).toEqual(EMPTY_USER_PROFILE);
  });

  it('saves whose device it is, and names it from the name', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await waitFor(() => container.querySelector('.first-run-wizard__promises') !== null);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Whose device is this?') ?? false);
    const [name, , age] = Array.from(container.querySelectorAll<HTMLInputElement>('.first-run-wizard__field input'));
    act(() => {
      name!.value = 'Lucy';
      name!.dispatchEvent(new Event('input', { bubbles: true }));
      age!.value = '6y';
      age!.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => primary(container).click());
    await waitFor(() => userProfileSetting.signal.value.name === 'Lucy');
    expect(userProfileSetting.signal.value.age).toBe('6');
    expect(deviceTitle(userProfileSetting.signal.value)).toBe("Lucy's device");
  });

  it('offers a few colour schemes and shows the choice at once', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await toVoiceScreen(container);
    act(() => primary(container).click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Pictures and words') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('What should pressing a word do?') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.querySelector('.first-run-wizard__looks') !== null);
    const looks = Array.from(container.querySelectorAll<HTMLButtonElement>('.first-run-wizard__look'));
    expect(looks.map((b) => b.textContent)).toEqual([
      'AaStandard',
      'AaPink',
      'AaOrange',
      'AaGreen',
      'AaTurquoise',
      'AaBlue',
      'AaPurple',
      'AaNight',
    ]);
    act(() => looks[1]!.click());
    await waitFor(() => themeSetting.signal.value.preset === 'pink');
  });

  it('can put Games on the top bar, taking the last place and never Help', async () => {
    let completed = false;
    render(<FirstRunWizard onComplete={() => (completed = true)} />, container);
    await toVoiceScreen(container);
    for (const next of ['.first-run-wizard__grid-size-option', '.picture-choices', '.first-run-wizard__press-option', '.first-run-wizard__looks']) {
      act(() => primary(container).click());
      await waitFor(() => container.querySelector(next) !== null);
    }
    act(() => primary(container).click());
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    await setUpPin(container, '1234');
    await setUpPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => container.querySelector<HTMLButtonElement>('.pin-gate__button')!.click());
    await waitFor(() => container.textContent?.includes('You are ready') ?? false);
    const games = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    act(() => {
      games.checked = true;
      games.dispatchEvent(new Event('change', { bubbles: true }));
    });
    act(() => primary(container).click());
    await waitFor(() => completed);
    const bar = await getQuickAccess();
    expect(bar[5]).toBe('game');
    expect(bar).toContain('help');
  });

  it('has a Back button on every step before the PIN, back to the step before', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await waitFor(() => container.querySelector('.first-run-wizard__promises') !== null);
    expect(container.querySelector('.first-run-wizard__button--back')).toBeNull(); // the welcome has nothing before it
    const back = () => container.querySelector<HTMLButtonElement>('.first-run-wizard__button--back')!;
    const title = () => container.querySelector('.first-run-wizard__title')!.textContent;

    act(() => primary(container).click());
    await waitFor(() => title() === 'Whose device is this?');
    act(() => primary(container).click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__voice-option').length > 0);
    act(() => primary(container).click());
    await waitFor(() => title() === 'Choose a grid size');
    act(() => primary(container).click());
    await waitFor(() => title() === 'Pictures and words');
    act(() => primary(container).click());
    await waitFor(() => title() === 'What should pressing a word do?');
    act(() => primary(container).click());
    await waitFor(() => title() === 'Choose the colours');

    for (const expected of ['What should pressing a word do?', 'Pictures and words', 'Choose a grid size', 'Choose a voice', 'Whose device is this?', 'Welcome to Rugged Speech Test']) {
      act(() => back().click());
      await waitFor(() => title() === expected);
      if (expected === 'Welcome to Rugged Speech Test') break;
    }
  });

  it('asks what pressing a word should do, with the one for someone just starting first, and keeps the answer', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await toVoiceScreen(container);
    act(() => primary(container).click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Pictures and words') ?? false);
    act(() => primary(container).click());
    await waitFor(() => container.querySelector('.first-run-wizard__press-option') !== null);
    const options = Array.from(container.querySelectorAll('.first-run-wizard__press-option strong')).map((el) => el.textContent);
    expect(options).toEqual(['Say the word straight away', 'Say it, and add it to the sentence', 'Only add it to the sentence']);
    // Nothing changes unless it is chosen: the usual behaviour is selected.
    expect((container.querySelectorAll<HTMLInputElement>('.first-run-wizard__press-option input')[2])!.checked).toBe(true);

    const speakNow = container.querySelectorAll<HTMLInputElement>('.first-run-wizard__press-option input')[0]!;
    act(() => {
      speakNow.checked = true;
      speakNow.dispatchEvent(new Event('change', { bubbles: true }));
    });
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Choose the colours') ?? false);
    expect(await getPressMode()).toBe('speak');
  });

  it('offers drawn symbols to begin with, with emoji one press away, and a size for the writing', async () => {
    render(<FirstRunWizard onComplete={() => {}} />, container);
    await toVoiceScreen(container);
    act(() => primary(container).click());
    await waitFor(() => container.querySelectorAll('.first-run-wizard__grid-size-option').length > 0);
    act(() => primary(container).click());
    await waitFor(() => container.textContent?.includes('Pictures and words') ?? false);
    expect(symbolStyleSetting.signal.value).toBe('drawn');
    expect(container.querySelectorAll('.picture-preview__button')).toHaveLength(4);
    expect(container.querySelector('.picture-preview__pic')!.tagName).toBe('IMG');

    const choice = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('.picture-choices__option')).find((b) => b.textContent!.startsWith(label))!;
    act(() => choice('Emoji').click());
    await waitFor(() => symbolStyleSetting.signal.value === 'emoji');
    await waitFor(() => container.querySelector('.picture-preview__pic')!.tagName === 'SPAN');

    act(() => choice('Pictures only').click());
    await waitFor(() => labelStyleSetting.signal.value === 'pictures');
    expect(container.querySelector('.picture-preview__label')).toBeNull();

    act(() => choice('Larger writing').click());
    for (let attempt = 0; attempt < 100 && (await getAccessSettings()).textScale !== 1.25; attempt += 1) await new Promise((resolve) => setTimeout(resolve, 10));
    expect((await getAccessSettings()).textScale).toBe(1.25);
  });
});
