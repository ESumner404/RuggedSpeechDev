import { labelStyleSetting, symbolStyleSetting } from '../store/db';
import type { LabelStyle, SymbolStyle } from '../store/types';
import { Pic } from './Pic';

const STYLES: { id: SymbolStyle; label: string; hint: string }[] = [
  { id: 'drawn', label: 'Drawn symbols', hint: 'Simple, bold pictures made for this app.' },
  { id: 'emoji', label: 'Emoji', hint: 'The pictures your computer already has.' },
];

const LABELS: { id: LabelStyle; label: string; hint: string }[] = [
  { id: 'both', label: 'Picture and word', hint: 'Both on every button.' },
  { id: 'pictures', label: 'Pictures only', hint: 'For someone who does not read yet.' },
  { id: 'words', label: 'Words only', hint: 'For someone who reads.' },
];

const SAMPLES: { char: string; label: string; colour: string }[] = [
  { char: '🍎', label: 'apple', colour: '#fed7aa' },
  { char: '🐶', label: 'dog', colour: '#fed7aa' },
  { char: '😊', label: 'happy', colour: '#bfdbfe' },
  { char: '🏠', label: 'home', colour: '#99f6e4' },
];

/** A few buttons, as they will look, so the choice can be seen before it is made. */
export function PicturePreview() {
  const labels = labelStyleSetting.signal.value;
  return (
    <div class="picture-preview" aria-label="How buttons will look">
      {SAMPLES.map((sample) => (
        <div class="picture-preview__button" key={sample.label} style={{ background: sample.colour }}>
          {labels !== 'words' && <Pic class="picture-preview__pic" char={sample.char} />}
          {labels !== 'pictures' && <span class="picture-preview__label">{sample.label}</span>}
        </div>
      ))}
    </div>
  );
}

// Which pictures the buttons use, and whether each shows a picture, a word
// or both. Used when setting up and in Look, so it can be changed at any time.
export function PictureChoices() {
  const style = symbolStyleSetting.signal.value;
  const labels = labelStyleSetting.signal.value;
  return (
    <>
      <div class="picture-choices" role="group" aria-label="Pictures">
        {STYLES.map((choice) => (
          <button
            type="button"
            key={choice.id}
            class={`picture-choices__option${style === choice.id ? ' picture-choices__option--on' : ''}`}
            aria-pressed={style === choice.id}
            onClick={() => void symbolStyleSetting.set(choice.id)}
          >
            <strong>{choice.label}</strong>
            <span>{choice.hint}</span>
          </button>
        ))}
      </div>
      <div class="picture-choices" role="group" aria-label="Pictures and words">
        {LABELS.map((choice) => (
          <button
            type="button"
            key={choice.id}
            class={`picture-choices__option${labels === choice.id ? ' picture-choices__option--on' : ''}`}
            aria-pressed={labels === choice.id}
            onClick={() => void labelStyleSetting.set(choice.id)}
          >
            <strong>{choice.label}</strong>
            <span>{choice.hint}</span>
          </button>
        ))}
      </div>
      <PicturePreview />
    </>
  );
}
