const ROWS = ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

type Props = {
  onKey: (char: string) => void;
  onSpace: () => void;
  onBackspace: () => void;
};

export function OnScreenKeyboard({ onKey, onSpace, onBackspace }: Props) {
  return (
    <div class="on-screen-keyboard">
      {ROWS.map((row, rowIndex) => (
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
