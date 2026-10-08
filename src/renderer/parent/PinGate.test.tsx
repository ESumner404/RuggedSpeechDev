import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PinGate } from './PinGate';
import { resetDBConnectionForTests } from '../store/db';
import { resetPinLockoutForTests } from '../store/pinSecurity';

// fake-indexeddb resolves via IDBRequest 'success' events, not plain
// microtasks, a bare `await Promise.resolve()` doesn't give it a turn.
// Poll instead, same approach as TalkScreen.test.tsx.
async function waitFor(check: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor timed out');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

function keypad(container: HTMLElement) {
  return {
    digit: (d: string) => {
      const btn = Array.from(container.querySelectorAll<HTMLButtonElement>('.pin-gate__key')).find(
        (el) => el.textContent === d,
      );
      if (!btn) throw new Error(`No key "${d}"`);
      return btn;
    },
    ok: () => container.querySelector<HTMLButtonElement>('.pin-gate__key--submit')!,
  };
}

function enterPin(container: HTMLElement, pin: string): void {
  const pad = keypad(container);
  for (const digit of pin) {
    act(() => {
      pad.digit(digit).click();
    });
  }
  act(() => {
    pad.ok().click();
  });
}

describe('PinGate', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    indexedDB = new IDBFactory();
    resetDBConnectionForTests();
    resetPinLockoutForTests();
    container = document.createElement('div');
  });

  it('walks a fresh setup: choose a PIN, confirm it, see a recovery code, then unlocks', async () => {
    const onUnlock = vi.fn();
    render(<PinGate onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);

    expect(container.querySelector('.pin-gate__prompt')?.textContent).toContain('Set up Parent Mode');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);

    expect(container.querySelector('.pin-gate__recovery-code')?.textContent).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[a-z]+$/);
    expect(onUnlock).not.toHaveBeenCalled();

    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });
    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it('rejects a mismatched confirmation during setup and lets the adult retry from scratch', async () => {
    const onUnlock = vi.fn();
    render(<PinGate onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);

    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '9999');
    await waitFor(() => container.querySelector('.pin-gate__error') !== null);

    expect(container.querySelector('.pin-gate__error')?.textContent).toContain("didn't match");
    expect(container.querySelector('.pin-gate__recovery-code')).toBeNull();
    // Bounced all the way back to re-entering the first PIN, not stuck on
    // a confirmation step that can never be satisfied, a mistyped first
    // entry must not be a dead end (PRINCIPLES.md: Cancel is a no-op during
    // the mandatory first-run wizard, so there'd be no way out at all).
    expect(container.querySelector('.pin-gate__prompt')?.textContent).toContain('Set up Parent Mode');

    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });
    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it('unlocks on the correct PIN once set up, and rejects a wrong one', async () => {
    const onUnlock = vi.fn();
    // First pass: set up.
    render(<PinGate onUnlock={() => {}} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });

    // Second pass, fresh mount: entry mode.
    container = document.createElement('div');
    render(<PinGate onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    expect(container.querySelector('.pin-gate__prompt')?.textContent).toBe('Enter the Parent Mode PIN');

    enterPin(container, '0000');
    await waitFor(() => container.querySelector('.pin-gate__error') !== null);
    expect(onUnlock).not.toHaveBeenCalled();
    expect(container.querySelector('.pin-gate__error')?.textContent).toContain('Wrong PIN');

    enterPin(container, '1234');
    await waitFor(() => onUnlock.mock.calls.length === 1);
  });

  it('makes the keypad wait after too many wrong PINs, even for the right one, and says how long', async () => {
    const onUnlock = vi.fn();
    render(<PinGate onUnlock={() => {}} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);

    container = document.createElement('div');
    render(<PinGate onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the Parent Mode PIN');
    for (let attempt = 0; attempt < 5; attempt += 1) {
      enterPin(container, '0000');
      // Each try is checked, which takes a moment; wait for it before the next.
      await waitFor(() => container.querySelector('.pin-gate__error') !== null);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    await waitFor(() => container.querySelector('.pin-gate__wait') !== null);
    expect(container.querySelector('.pin-gate__wait')!.textContent).toMatch(/Please wait \d+ seconds/);

    enterPin(container, '1234'); // the right PIN, but not yet
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('shows a working Cancel by default, and hides it entirely when showCancel is false', async () => {
    const onCancel = vi.fn();
    render(<PinGate onUnlock={() => {}} onCancel={onCancel} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__cancel')?.click();
    });
    expect(onCancel).toHaveBeenCalledOnce();

    container = document.createElement('div');
    render(<PinGate onUnlock={() => {}} onCancel={() => {}} showCancel={false} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    expect(container.querySelector('.pin-gate__cancel')).toBeNull();
  });

  it('lets an adult already inside choose a new PIN, with a fresh recovery code, and the old PIN stops working', async () => {
    // Set up PIN 1234 first.
    render(<PinGate onUnlock={() => {}} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    const oldCode = container.querySelector('.pin-gate__recovery-code')?.textContent;
    render(null, container);

    // Change it: goes straight to choosing one, with no old PIN asked for.
    container = document.createElement('div');
    const onUnlock = vi.fn();
    render(<PinGate changePin onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    expect(container.querySelector('.pin-gate__prompt')?.textContent).toContain('Choose a new');
    enterPin(container, '7788');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '7788');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    expect(container.querySelector('.pin-gate__recovery-code')?.textContent).not.toBe(oldCode);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });
    expect(onUnlock).toHaveBeenCalledOnce();
    render(null, container);

    // The new PIN works at the gate, and the old one does not.
    container = document.createElement('div');
    const onGateUnlock = vi.fn();
    render(<PinGate onUnlock={onGateUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the Parent Mode PIN');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__error') !== null);
    expect(onGateUnlock).not.toHaveBeenCalled();
    enterPin(container, '7788');
    await waitFor(() => onGateUnlock.mock.calls.length === 1);
  });

  it('recovers a forgotten PIN with the recovery code and lets the adult set a new one', async () => {
    render(<PinGate onUnlock={() => {}} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    const recoveryCode = container.querySelector('.pin-gate__recovery-code')?.textContent ?? '';
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });

    container = document.createElement('div');
    const onUnlock = vi.fn();
    render(<PinGate onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);

    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__link')?.click();
    });
    const input = container.querySelector<HTMLInputElement>('.pin-gate__recovery-input')!;
    act(() => {
      input.value = recoveryCode;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });

    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent?.includes('Choose a new') ?? false);

    enterPin(container, '5555');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '5555');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });
    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it('a mismatched confirmation while choosing a new PIN after recovery also bounces back cleanly', async () => {
    render(<PinGate onUnlock={() => {}} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '1234');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    const recoveryCode = container.querySelector('.pin-gate__recovery-code')?.textContent ?? '';
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });

    container = document.createElement('div');
    const onUnlock = vi.fn();
    render(<PinGate onUnlock={onUnlock} onCancel={() => {}} />, container);
    await waitFor(() => container.querySelector('.pin-gate__prompt') !== null);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__link')?.click();
    });
    const input = container.querySelector<HTMLInputElement>('.pin-gate__recovery-input')!;
    act(() => {
      input.value = recoveryCode;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent?.includes('Choose a new') ?? false);

    enterPin(container, '5555');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '0000');
    await waitFor(() => container.querySelector('.pin-gate__error') !== null);
    expect(container.querySelector('.pin-gate__prompt')?.textContent).toContain('Choose a new');

    enterPin(container, '5555');
    await waitFor(() => container.querySelector('.pin-gate__prompt')?.textContent === 'Enter the same PIN again');
    enterPin(container, '5555');
    await waitFor(() => container.querySelector('.pin-gate__recovery-code') !== null);
    act(() => {
      container.querySelector<HTMLButtonElement>('.pin-gate__button')?.click();
    });
    expect(onUnlock).toHaveBeenCalledOnce();
  });
});
