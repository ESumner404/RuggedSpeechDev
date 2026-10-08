import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TrafficChip, TrafficScreen } from './TrafficScreen';
import { DEFAULT_TRAFFIC, isTrafficSetting } from './traffic';
import { LostModeScreen } from '../safety/LostModeScreen';
import { LostModeTab } from '../parent/LostModeTab';
import { EMPTY_LOST_MODE, canTurnOn, lostMessage } from '../safety/lostMode';
import { lostModeSetting, resetDBConnectionForTests, trafficSetting } from '../store/db';

async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function stubSpeech(): string[] {
  const spoken: string[] = [];
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => [],
    cancel: () => {},
    speak: (u: { text: string }) => spoken.push(u.text),
  };
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
    constructor(public text: string) {}
  };
  return spoken;
}

describe('traffic light', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = stubSpeech();
    container = document.createElement('div');
    render(
      <>
        <TrafficChip />
        <TrafficScreen />
      </>,
      container,
    );
  });

  afterEach(() => {
    render(null, container);
  });

  const light = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('.traffic-light')).find((b) => b.textContent === label)!;
  const action = (label: string) => Array.from(container.querySelectorAll<HTMLButtonElement>('.traffic-screen__actions button')).find((b) => b.textContent === label)!;

  it('starts off, shows nothing along the top, and says nothing', () => {
    expect(trafficSetting.signal.value.status).toBe('off');
    expect(container.querySelector('.traffic-chip')).toBeNull();
    expect(action('Say it').disabled).toBe(true);
    expect(spoken).toEqual([]);
  });

  it('shows a colour along the top without a word being said, and turns it off again', async () => {
    act(() => light('Please leave me').click());
    await waitFor(() => container.querySelector('.traffic-chip') !== null);
    expect(container.querySelector('.traffic-chip')!.textContent).toBe('Please leave me');
    expect(spoken).toEqual([]);
    act(() => light('Please leave me').click()); // pressing it again turns it off
    await waitFor(() => container.querySelector('.traffic-chip') === null);
  });

  it('says its words only when asked, and they can be changed', async () => {
    act(() => light('Happy to talk').click());
    await waitFor(() => trafficSetting.signal.value.status === 'green');
    act(() => action('Say it').click());
    expect(spoken).toEqual(["I'm happy to talk to you."]);
    await trafficSetting.set({ ...trafficSetting.signal.value, phrases: { ...DEFAULT_TRAFFIC.phrases, green: 'Come and chat!' } });
    await waitFor(() => container.querySelector('.traffic-screen__phrase')!.textContent === 'Come and chat!');
  });

  it('can fill the whole screen for other people to read, and goes back when pressed', async () => {
    act(() => light('Talk gently, wait for me').click());
    await waitFor(() => trafficSetting.signal.value.status === 'amber');
    act(() => action('Show everyone').click());
    await waitFor(() => container.querySelector('.traffic-full') !== null);
    expect(container.querySelector('.traffic-full')!.textContent).toContain('be gentle');
    act(() => container.querySelector<HTMLButtonElement>('.traffic-full')!.click());
    await waitFor(() => container.querySelector('.traffic-screen') !== null);
  });

  it('refuses a half-made saved setting', () => {
    expect(isTrafficSetting(DEFAULT_TRAFFIC)).toBe(true);
    expect(isTrafficSetting({ status: 'purple', phrases: DEFAULT_TRAFFIC.phrases })).toBe(false);
    expect(isTrafficSetting({ status: 'red', phrases: { red: 'x' } })).toBe(false);
  });
});

describe('lost mode', () => {
  let container: HTMLElement;
  let spoken: string[];

  beforeEach(() => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    spoken = stubSpeech();
    container = document.createElement('div');
  });

  afterEach(() => {
    render(null, container);
  });

  it('needs something to return the device to before it can be turned on', () => {
    expect(canTurnOn(EMPTY_LOST_MODE)).toBe(false);
    expect(canTurnOn({ ...EMPTY_LOST_MODE, phone: '07700 900123' })).toBe(true);
    render(<LostModeTab />, container);
    const turnOn = Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === 'Turn Lost mode on')!;
    expect(turnOn.disabled).toBe(true);
  });

  it('writes the message from what was typed', () => {
    const lost = { ...EMPTY_LOST_MODE, returnTo: 'Oakfield School', phone: '01234 567890', address: '1 High Street' };
    expect(lostMessage(lost, "Lucy's device")).toBe(
      "This is a critical communication device: Lucy's device. Please return it to Oakfield School, 1 High Street, or phone 01234 567890.",
    );
    expect(lostMessage({ ...EMPTY_LOST_MODE, phone: '01234 567890' }, '')).toBe(
      'This is a critical communication device. Please phone 01234 567890 to arrange its return.',
    );
  });

  it('is turned on from Parent Mode and the screen then shows who to return it to', async () => {
    render(<LostModeTab />, container);
    const type = (label: string, value: string) =>
      act(() => {
        const field = Array.from(container.querySelectorAll<HTMLLabelElement>('label')).find((l) => l.textContent?.startsWith(label))!;
        const input = field.querySelector<HTMLInputElement>('input')!;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    type('Return it to', 'Mrs Patel, Oakfield School');
    type('Phone', '01234 567890');
    await waitFor(() => lostModeSetting.signal.value.phone === '01234 567890');
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent === 'Turn Lost mode on')!.click());
    await waitFor(() => lostModeSetting.signal.value.on);

    render(null, container);
    render(<LostModeScreen />, container);
    expect(container.textContent).toContain('This is a critical communication device.');
    expect(container.textContent).toContain('Mrs Patel, Oakfield School');
    expect(container.textContent).toContain('Phone: 01234 567890');
    expect(spoken).toEqual([]); // not read out until someone asks
  });

  it('reads it out when asked, and only the PIN turns it off', async () => {
    await lostModeSetting.set({ ...EMPTY_LOST_MODE, on: true, returnTo: 'Mum' });
    render(<LostModeScreen />, container);
    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.lost-mode__button')).find((b) => b.textContent === 'Read this out')!.click());
    expect(spoken[0]).toContain('Please return it to Mum.');

    act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('.lost-mode__button')).find((b) => b.textContent === 'Owner: turn off')!.click());
    await waitFor(() => container.querySelector('.pin-gate') !== null);
    expect(lostModeSetting.signal.value.on).toBe(true); // asking is not enough
  });
});
