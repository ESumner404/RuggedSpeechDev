import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { announceText } from '../speech/announce';
import { getAllBoards } from '../store/db';
import type { Item } from '../store/types';
import { Pic } from '../symbols/Pic';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { makeFinishRound, sentenceFor, type FinishRound } from './finish';

// Finish the sentence. No right answer, no score, no clock, and nothing speaks until Hear it is pressed.
export function FinishScreen() {
  const boards = useSignal<Awaited<ReturnType<typeof getAllBoards>> | null>(null);
  const round = useSignal<FinishRound | undefined>(undefined);
  const chosen = useSignal<Item | null>(null);

  useEffect(() => {
    void getAllBoards().then((found) => {
      boards.value = found;
      round.value = makeFinishRound(found);
    });
  }, []);

  if (boards.value === null) return null;
  if (!round.value) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">Not enough words yet</p>
        <p class="game-screen__empty-note">This game needs a few pictured words on the boards.</p>
      </div>
    );
  }

  const current = round.value;
  const sentence = chosen.value ? sentenceFor(current.frame, chosen.value) : `${current.frame.start} …`;

  return (
    <div class="game-screen finish-screen">
      <p class="finish-screen__sentence" role="status">
        {sentence}
      </p>
      <div class="finish-screen__options">
        {current.options.map((word) => (
          <button type="button" class={`finish-screen__option${chosen.value?.id === word.id ? ' finish-screen__option--chosen' : ''}`} key={word.id} onClick={() => (chosen.value = word)}>
            {word.image?.kind === 'emoji' && <Pic class="finish-screen__emoji" char={word.image.char} />}
            {word.image?.kind === 'photo' && <PhotoThumbnail class="finish-screen__photo" blobId={word.image.blobId} alt="" />}
            <span>{word.label}</span>
          </button>
        ))}
      </div>
      <div class="finish-screen__controls">
        <button type="button" class="game-screen__button" disabled={!chosen.value} onClick={() => announceText(sentence, { keepInHistory: false })}>
          Hear it
        </button>
        <button
          type="button"
          class="game-screen__button game-screen__button--next"
          onClick={() => {
            round.value = makeFinishRound(boards.value ?? [], current.frame.id);
            chosen.value = null;
          }}
        >
          Next sentence
        </button>
      </div>
    </div>
  );
}
