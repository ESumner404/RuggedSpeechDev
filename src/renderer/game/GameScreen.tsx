import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { announceText } from '../speech/announce';
import { getAllBoards, wordStageSetting } from '../store/db';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import type { Item } from '../store/types';
import { HINT_AFTER } from './ride';
import { gameWords, makeRound, type Round } from './wordGame';
import { Pic } from '../symbols/Pic';

// Find the word: a picture, and four words to choose from. It is practice,
// not a test. There is no clock, no score to lose, no wrong-answer sound and
// no animation. A word that is not the right one is only marked as tried,
// and nothing is removed or moved, so the four places stay where they are.
// Nothing speaks unless a person presses something (invariant I5): not when
// a new picture appears, and not when the right word is found. What is said
// is not kept in Recent, because it is practice and not what the person said.
export function GameScreen() {
  const words = useSignal<Item[] | null>(null);
  const round = useSignal<Round | undefined>(undefined);
  const tried = useSignal<string[]>([]);
  const found = useSignal(false);
  const foundCount = useSignal(0);
  const picturesOnWords = useSignal(false);

  useEffect(() => {
    void getAllBoards().then((boards) => {
      const available = gameWords(boards, wordStageSetting.signal.value);
      words.value = available;
      round.value = makeRound(available);
    });
  }, []);

  if (words.value === null) return null;

  const current = round.value;
  if (!current) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">Not enough words yet</p>
        <p class="game-screen__empty-note">The game needs at least four words with pictures.</p>
      </div>
    );
  }

  function say(text: string): void {
    announceText(text, { keepInHistory: false });
  }

  function choose(option: Item): void {
    say(option.label);
    if (found.value) return;
    if (option.id === current!.target.id) {
      found.value = true;
      foundCount.value += 1;
    } else if (!tried.value.includes(option.id)) {
      tried.value = [...tried.value, option.id];
    }
  }

  function nextPicture(): void {
    round.value = makeRound(words.value!, current!.target.id);
    tried.value = [];
    found.value = false;
  }

  const image = current.target.image;
  const message = found.value
    ? `Yes! That is ${current.target.label}.`
    : tried.value.length >= HINT_AFTER
      ? 'Look at the word with the pointer.'
      : tried.value.length > 0
      ? 'Not that one. Try another.'
      : 'Which word is this?';

  return (
    <div class="game-screen">
      <div class="game-screen__picture" role="img" aria-label={found.value ? current.target.label : 'A picture to find the word for'}>
        {image?.kind === 'photo' ? (
          <PhotoThumbnail class="game-screen__photo" blobId={image.blobId} alt="" />
        ) : (
          <Pic class="game-screen__emoji" char={image?.kind === 'emoji' ? image.char : ''} />
        )}
      </div>
      <p class="game-screen__message" role="status">
        {message}
      </p>
      <div class="game-screen__options">
        {current.options.map((option) => {
          const isRight = found.value && option.id === current.target.id;
          const wasTried = tried.value.includes(option.id);
          // After two wrong tries the right word is pointed to, so nobody is left stuck.
          const pointed = !found.value && tried.value.length >= HINT_AFTER && option.id === current.target.id;
          return (
            <button
              type="button"
              key={option.id}
              class={`game-option${isRight ? ' game-option--right' : ''}${wasTried ? ' game-option--tried' : ''}${pointed ? ' game-option--hint' : ''}`}
              style={option.background_color ? { background: option.background_color } : undefined}
              onClick={() => choose(option)}
              aria-label={wasTried ? `${option.label}, tried` : option.label}
            >
              {picturesOnWords.value && option.image?.kind === 'emoji' && (
                <Pic class="game-option__emoji" char={option.image.char} />
              )}
              {pointed && (
                <span class="ride-screen__pointer" aria-hidden="true">
                  👉
                </span>
              )}
              <span class="game-option__label">{option.label}</span>
            </button>
          );
        })}
      </div>
      <div class="game-screen__controls">
        <button type="button" class="game-screen__button" onClick={() => say(current.target.label)}>
          Hear the word
        </button>
        <button
          type="button"
          class="game-screen__button"
          aria-pressed={picturesOnWords.value}
          onClick={() => (picturesOnWords.value = !picturesOnWords.value)}
        >
          {picturesOnWords.value ? 'Words only' : 'Pictures on the words'}
        </button>
        <button type="button" class="game-screen__button game-screen__button--next" onClick={nextPicture}>
          Next picture
        </button>
      </div>
      <p class="game-screen__count">{foundCount.value === 0 ? 'No pressure. Take your time.' : `Found ${foundCount.value}`}</p>
    </div>
  );
}
