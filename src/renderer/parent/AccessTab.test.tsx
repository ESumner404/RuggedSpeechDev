import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AccessTab } from './AccessTab';
import {
  getAccessSettings,
  getPreferredSpeechPitch,
  getPreferredSpeechRate,
  getPressMode,
  keyboardLayoutSetting,
  pronunciationsSetting,
  resetDBConnectionForTests,
  preferredSpeechPitch,
  preferredSpeechRate,
  sentencePicturesSetting,
  speakStyleSetting,
  speechVolumeSetting,
} from '../store/db';

async function waitFor(check: () => boolean | Promise<boolean>, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!(await check())) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

describe('AccessTab', () => {
  let container: HTMLElement;

  // Controls are found by their section's heading, not by position, a new
  // section would otherwise silently shift every index-based lookup.
  function section(heading: string): HTMLElement {
    const found = Array.from(container.querySelectorAll<HTMLElement>('.access-tab__section')).find(
      (el) => el.querySelector('.access-tab__heading')?.textContent === heading,
    );
    if (!found) throw new Error(`No section "${heading}"`);
    return found;
  }
  const slider = (heading: string) => section(heading).querySelector<HTMLInputElement>('input[type="range"]')!;
  const select = (heading: string) => section(heading).querySelector<HTMLSelectElement>('select')!;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    // Choosing a voice setting plays a short sample, so there must be a voice engine.
    (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      getVoices: () => [],
      cancel: () => {},
      speak: () => {},
    };
    (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
      constructor(public text: string) {}
    };
    container = document.createElement('div');
    render(<AccessTab />, container);
    await waitFor(() => container.querySelector('.access-tab') !== null);
  });

  afterEach(() => {
    render(null, container);
  });

  it('defaults to everything off, speech rate and pitch to 1x, and a press to building the sentence', () => {
    expect(slider('Speech rate').value).toBe('1');
    expect(slider('Voice pitch').value).toBe('1');
    expect(select('When a button is pressed').value).toBe('sentence');
    expect(slider('Hold-to-select').value).toBe('0');
    expect(select('Switch scanning').value).toBe('off');
  });

  it('changing the speech rate slider persists to the store', async () => {
    act(() => {
      slider('Speech rate').value = '0.75';
      slider('Speech rate').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getPreferredSpeechRate()) === 0.75);
  });

  it('changing the voice pitch slider persists to the store', async () => {
    act(() => {
      slider('Voice pitch').value = '1.25';
      slider('Voice pitch').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getPreferredSpeechPitch()) === 1.25);
  });

  it('changing what a press does persists to the store', async () => {
    act(() => {
      select('When a button is pressed').value = 'both';
      select('When a button is pressed').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(async () => (await getPressMode()) === 'both');
  });

  it('changing the dwell slider persists to the store', async () => {
    act(() => {
      slider('Hold-to-select').value = '500';
      slider('Hold-to-select').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).dwellMs === 500);
  });

  it('switching scanning mode reveals the auto-advance interval only for one-switch timed', async () => {
    expect(container.textContent).not.toContain('Auto-advance');

    act(() => {
      select('Switch scanning').value = 'oneSwitchTimed';
      select('Switch scanning').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => container.textContent?.includes('Auto-advance') ?? false);

    expect(await getAccessSettings()).toMatchObject({ scanningMode: 'oneSwitchTimed' });
  });

  it('changing high contrast persists to the store', async () => {
    act(() => {
      select('Visual').value = 'dark';
      select('Visual').dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).highContrast === 'dark');
  });

  it('toggling low-arousal palette persists to the store', async () => {
    const checkbox = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).find(
      (input) => input.closest('label')?.textContent?.includes('Low-arousal'),
    )!;
    expect(checkbox).toBeDefined();
    act(() => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(async () => (await getAccessSettings()).lowArousalPalette === true);
  });

  it('changes the voice volume', async () => {
    expect(slider('Voice volume').value).toBe('1');
    act(() => {
      slider('Voice volume').value = '0.5';
      slider('Voice volume').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(async () => (await speechVolumeSetting.get()) === 0.5);
  });

  it('adds, edits and removes "say it like this" entries, and keeps them', async () => {
    const press = (text: string) =>
      act(() => {
        Array.from(section('Say it like this').querySelectorAll('button')).find((b) => b.textContent === text)!.click();
      });
    const type = (label: string, value: string) =>
      act(() => {
        const input = section('Say it like this').querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)!;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

    press('Add a word');
    await waitFor(() => pronunciationsSetting.signal.value.length === 1);
    type('Written as', 'Niamh');
    type('Say it as', 'Neev');
    await waitFor(async () => (await pronunciationsSetting.get()).some((e) => e.written === 'Niamh' && e.spoken === 'Neev'));

    act(() => {
      section('Say it like this').querySelector<HTMLButtonElement>('button[aria-label="Remove Niamh"]')!.click();
    });
    await waitFor(() => pronunciationsSetting.signal.value.length === 0);
  });

  it("only offers to 'Hear it' once both halves are filled in", async () => {
    act(() => {
      Array.from(section('Say it like this').querySelectorAll('button')).find((b) => b.textContent === 'Add a word')!.click();
    });
    await waitFor(() => pronunciationsSetting.signal.value.length === 1);
    const hear = () => Array.from(section('Say it like this').querySelectorAll('button')).find((b) => b.textContent === 'Hear it')!;
    expect(hear().disabled).toBe(true);
  });

  it('chooses the keyboard order and whether the sentence shows pictures', async () => {
    const layout = section('Keyboard and sentence').querySelector('select')!;
    expect(layout.value).toBe('qwerty');
    act(() => {
      layout.value = 'alphabetical';
      layout.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => keyboardLayoutSetting.signal.value === 'alphabetical');

    const pictures = section('Keyboard and sentence').querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    act(() => {
      pictures.checked = true;
      pictures.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => sentencePicturesSetting.signal.value === true);
  });

  it('sets speed and pitch together from a named starting point, and shows which one is in use', async () => {
    const presetButton = (name: string) =>
      Array.from(container.querySelectorAll<HTMLButtonElement>('.access-tab__preset')).find((b) =>
        b.textContent?.startsWith(name),
      )!;
    expect(presetButton('Usual').getAttribute('aria-pressed')).toBe('true');
    act(() => presetButton('Gentle').click());
    await waitFor(() => preferredSpeechRate.value === 0.85 && preferredSpeechPitch.value === 0.95);
    await waitFor(() => presetButton('Gentle').getAttribute('aria-pressed') === 'true');
    expect(presetButton('Usual').getAttribute('aria-pressed')).toBe('false');
    // Moving a slider afterwards leaves no preset claiming to match.
    act(() => {
      slider('Speech rate').value = '1.3';
      slider('Speech rate').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await waitFor(() => container.querySelector('.access-tab__preset--chosen') === null);
  });

  it('chooses how a sentence is read out', async () => {
    const choose = section('Reading a sentence out').querySelector('select')!;
    expect(choose.value).toBe('normal');
    act(() => {
      choose.value = 'wordByWord';
      choose.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => speakStyleSetting.signal.value === 'wordByWord');
  });

  it('says so, rather than showing an empty list, when no voice works without the internet', () => {
    expect(section('Voice').textContent).toContain('No voices that work without the internet');
  });
});
