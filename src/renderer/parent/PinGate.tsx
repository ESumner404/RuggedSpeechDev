import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getParentPinState, setParentPinState } from '../store/db';
import { generateRecoveryCode } from './recoveryCode';

const PIN_LENGTH = 4;

type Step =
  | { kind: 'loading' }
  | { kind: 'setup-enter'; error?: string }
  | { kind: 'setup-confirm'; firstPin: string }
  | { kind: 'setup-recovery-shown'; recoveryCode: string }
  | { kind: 'enter-pin'; error?: string }
  | { kind: 'enter-recovery'; error?: string }
  | { kind: 'set-new-pin-enter'; error?: string }
  | { kind: 'set-new-pin-confirm'; firstPin: string };

type Props = {
  onUnlock: () => void;
  onCancel: () => void;
  // The first-run wizard's PIN step has nowhere for Cancel to go — PIN
  // setup there is mandatory, so its onCancel is a no-op. A button that
  // visibly does nothing when pressed reads as broken, so that caller
  // hides it entirely instead: a control either does something a parent
  // can feel, or isn't shown.
  showCancel?: boolean;
};

export function PinGate({ onUnlock, onCancel, showCancel = true }: Props) {
  const step = useSignal<Step>({ kind: 'loading' });
  const entry = useSignal('');
  const recoveryEntry = useSignal('');
  const existingPin = useSignal<string | null>(null);
  const existingRecoveryCode = useSignal<string | null>(null);

  useEffect(() => {
    void getParentPinState().then((state) => {
      if (state) {
        existingPin.value = state.pin;
        existingRecoveryCode.value = state.recoveryCode;
        step.value = { kind: 'enter-pin' };
      } else {
        step.value = { kind: 'setup-enter' };
      }
    });
  }, []);

  function pressDigit(digit: string): void {
    if (entry.value.length < PIN_LENGTH) entry.value += digit;
  }

  function pressBackspace(): void {
    entry.value = entry.value.slice(0, -1);
  }

  async function completeSetupWithRecovery(pin: string): Promise<void> {
    const recoveryCode = generateRecoveryCode();
    await setParentPinState({ pin, recoveryCode });
    entry.value = '';
    step.value = { kind: 'setup-recovery-shown', recoveryCode };
  }

  function submitPin(): void {
    const value = entry.value;
    if (value.length !== PIN_LENGTH) return;

    switch (step.value.kind) {
      case 'setup-enter':
        entry.value = '';
        step.value = { kind: 'setup-confirm', firstPin: value };
        return;
      case 'setup-confirm':
        if (value !== step.value.firstPin) {
          // Bounces all the way back to re-entering the first PIN, not
          // just the confirmation — otherwise a single typo on the very
          // first entry becomes a dead end with no way to correct it (a
          // real lockout during the mandatory first-run wizard, where
          // Cancel is deliberately a no-op).
          entry.value = '';
          step.value = { kind: 'setup-enter', error: "Those didn't match — let's try again." };
          return;
        }
        void completeSetupWithRecovery(value);
        return;
      case 'enter-pin':
        if (value === existingPin.value) {
          onUnlock();
          return;
        }
        entry.value = '';
        step.value = { kind: 'enter-pin', error: 'Wrong PIN.' };
        return;
      case 'set-new-pin-enter':
        entry.value = '';
        step.value = { kind: 'set-new-pin-confirm', firstPin: value };
        return;
      case 'set-new-pin-confirm':
        if (value !== step.value.firstPin) {
          entry.value = '';
          step.value = { kind: 'set-new-pin-enter', error: "Those didn't match — let's try again." };
          return;
        }
        void completeSetupWithRecovery(value);
        return;
      default:
        return;
    }
  }

  function submitRecovery(): void {
    if (recoveryEntry.value.trim().toLowerCase() === existingRecoveryCode.value?.toLowerCase()) {
      recoveryEntry.value = '';
      entry.value = '';
      step.value = { kind: 'set-new-pin-enter' };
    } else {
      step.value = { kind: 'enter-recovery', error: "That code doesn't match." };
    }
  }

  const prompts: Record<string, string> = {
    'setup-enter': 'Set up Parent Mode: choose a 4-digit PIN',
    'setup-confirm': 'Enter the same PIN again',
    'enter-pin': 'Enter the Parent Mode PIN',
    'set-new-pin-enter': 'Choose a new 4-digit PIN',
    'set-new-pin-confirm': 'Enter the same PIN again',
  };

  return (
    <div class="pin-gate">
      {step.value.kind === 'loading' && <p>Loading…</p>}

      {step.value.kind === 'setup-recovery-shown' && (
        <div class="pin-gate__recovery-shown">
          <p class="pin-gate__prompt">Parent Mode is set up. Write this recovery code down:</p>
          <p class="pin-gate__recovery-code">{step.value.recoveryCode}</p>
          <p class="pin-gate__note">
            This is the only way back in if the PIN is forgotten — it isn't sent anywhere and
            can't be recovered otherwise.
          </p>
          <button type="button" class="pin-gate__button" onClick={onUnlock}>
            I've written it down
          </button>
        </div>
      )}

      {(step.value.kind === 'setup-enter' ||
        step.value.kind === 'setup-confirm' ||
        step.value.kind === 'enter-pin' ||
        step.value.kind === 'set-new-pin-enter' ||
        step.value.kind === 'set-new-pin-confirm') && (
        <div class="pin-gate__entry">
          <p class="pin-gate__prompt">{prompts[step.value.kind]}</p>
          {'error' in step.value && step.value.error && (
            <p class="pin-gate__error">{step.value.error}</p>
          )}
          <div class="pin-gate__dots" aria-label={`${entry.value.length} of ${PIN_LENGTH} digits entered`}>
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <span class={`pin-gate__dot${i < entry.value.length ? ' pin-gate__dot--filled' : ''}`} key={i} />
            ))}
          </div>
          <div class="pin-gate__keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button type="button" class="pin-gate__key" key={digit} onClick={() => pressDigit(digit)}>
                {digit}
              </button>
            ))}
            <button type="button" class="pin-gate__key" onClick={pressBackspace} aria-label="Backspace">
              ⌫
            </button>
            <button type="button" class="pin-gate__key" onClick={() => pressDigit('0')}>
              0
            </button>
            <button
              type="button"
              class="pin-gate__key pin-gate__key--submit"
              disabled={entry.value.length !== PIN_LENGTH}
              onClick={submitPin}
            >
              OK
            </button>
          </div>
          {step.value.kind === 'enter-pin' && (
            <button type="button" class="pin-gate__link" onClick={() => (step.value = { kind: 'enter-recovery' })}>
              Forgotten your PIN?
            </button>
          )}
        </div>
      )}

      {step.value.kind === 'enter-recovery' && (
        <div class="pin-gate__entry">
          <p class="pin-gate__prompt">Enter your recovery code</p>
          {step.value.error && <p class="pin-gate__error">{step.value.error}</p>}
          <input
            class="pin-gate__recovery-input"
            type="text"
            value={recoveryEntry.value}
            onInput={(event) => {
              recoveryEntry.value = (event.target as HTMLInputElement).value;
            }}
            aria-label="Recovery code"
          />
          <button type="button" class="pin-gate__button" onClick={submitRecovery}>
            Continue
          </button>
        </div>
      )}

      {showCancel && (
        <button type="button" class="pin-gate__cancel" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}
