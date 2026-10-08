import { sentencePicturesSetting } from '../store/db';
import type { Item } from '../store/types';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { Pic } from '../symbols/Pic';

export type SentenceChip = { chipId: string; item: Item };

type Props = {
  chips: SentenceChip[];
  onRemove: (chipId: string) => void;
  onClear: () => void;
  onSpeak: () => void;
  /** The word being said right now when a sentence is read one word at a time. */
  speakingChipId?: string | null;
};

export function SentenceStrip({ chips, onRemove, onClear, onSpeak, speakingChipId = null }: Props) {
  // An adult's choice (Access): a picture beside each word, for people who
  // do not yet read the labels.
  const showPictures = sentencePicturesSetting.signal.value;
  return (
    <div class="sentence-strip">
      <div class="sentence-strip__chips">
        {chips.map((chip) => (
          <button
            type="button"
            class={`sentence-strip__chip${chip.chipId === speakingChipId ? ' sentence-strip__chip--speaking' : ''}`}
            key={chip.chipId}
            onClick={() => onRemove(chip.chipId)}
            aria-label={`Remove "${chip.item.label}"`}
          >
            {showPictures && chip.item.image?.kind === 'emoji' && (
              <Pic class="sentence-strip__picture" char={chip.item.image.char} />
            )}
            {showPictures && chip.item.image?.kind === 'photo' && (
              <PhotoThumbnail class="sentence-strip__photo" blobId={chip.item.image.blobId} alt="" />
            )}
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
