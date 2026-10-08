import { keyboardLayoutSetting } from '../store/db';
import type { KeyboardLayout } from '../store/types';

const ROWS: Record<KeyboardLayout, string[]> = {
  qwerty: ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
  // For people who have learned the alphabet in order rather than the
  // typewriter's: the same letters, in the order of the alphabet song.
  alphabetical: ['1234567890', 'abcdefghi', 'jklmnopqr', 'stuvwxyz'],
};

type Props = {
  onKey: (char: string) => void;
  onSpace: () => void;
  onBackspace: () => void;
};

export function OnScreenKeyboard({ onKey, onSpace, onBackspace }: Props) {
  return (
    <div class="on-screen-keyboard">
      {ROWS[keyboardLayoutSetting.signal.value].map((row, rowIndex) => (
        <div class="on-screen-keyboard__row" key={rowIndex}>
          {row.split('').map((char) => (
            <button
              type="button"
              class="on-screen-keyboard__key"
              key={char}
              onClick={() => onKey(char)}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
      <div class="on-screen-keyboard__row">
        <button
          type="button"
          class="on-screen-keyboard__key on-screen-keyboard__key--space"
          onClick={onSpace}
        >
          space
        </button>
        <button
          type="button"
          class="on-screen-keyboard__key on-screen-keyboard__key--backspace"
          onClick={onBackspace}
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
