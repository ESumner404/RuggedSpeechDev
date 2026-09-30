import type { Item } from '../store/types';

export type SentenceChip = { chipId: string; item: Item };

type Props = {
  chips: SentenceChip[];
  onRemove: (chipId: string) => void;
  onClear: () => void;
  onSpeak: () => void;
};

export function SentenceStrip({ chips, onRemove, onClear, onSpeak }: Props) {
  return (
    <div class="sentence-strip">
      <div class="sentence-strip__chips">
        {chips.map((chip) => (
          <button
            type="button"
            class="sentence-strip__chip"
            key={chip.chipId}
            onClick={() => onRemove(chip.chipId)}
            aria-label={`Remove "${chip.item.label}"`}
          >
            {chip.item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        class="sentence-strip__clear"
        onClick={onClear}
        disabled={chips.length === 0}
        aria-label="Clear all"
      >
        Clear all
      </button>
      <button
        type="button"
        class="sentence-strip__speak"
        onClick={onSpeak}
        disabled={chips.length === 0}
      >
        Speak
      </button>
    </div>
  );
}
