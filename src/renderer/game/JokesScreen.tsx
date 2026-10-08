import { useSignal } from '@preact/signals';
import { announceText } from '../speech/announce';
import { customJokesSetting } from '../store/db';
import { BASIC_JOKES, nextJokeIndex, sillyMix, type Joke } from '../vocab/jokes';

// Jokes: a question, then the answer when asked for. Each is said only when
// its button is pressed. There is nothing to get right, so there is nothing
// to get wrong, and it goes through every joke before telling one again.
export function JokesScreen() {
  const all = (): Joke[] => [...BASIC_JOKES, ...customJokesSetting.signal.value];
  // The first joke counts as told, so "Next joke" never repeats it straight away.
  const first = nextJokeIndex(all().length, []);
  const told = useSignal<number[]>([first]);
  const current = useSignal<Joke>(all()[first]!);
  const silly = useSignal(false);
  const showAnswer = useSignal(false);

  function next(): void {
    const jokes = all();
    const index = nextJokeIndex(jokes.length, told.value);
    told.value = [...told.value, index];
    current.value = jokes[index]!;
    silly.value = false;
    showAnswer.value = false;
  }

  function makeSilly(): void {
    const mixed = sillyMix(all());
    if (!mixed) return;
    current.value = mixed;
    silly.value = true;
    showAnswer.value = false;
  }

  const say = (text: string) => announceText(text, { keepInHistory: false });

  return (
    <div class="game-screen jokes-screen">
      <p class="jokes-screen__label">{silly.value ? 'A silly one' : 'Joke'}</p>
      <div class="jokes-screen__card">
        <p class="jokes-screen__question">{current.value.q}</p>
        {showAnswer.value ? (
          <p class="jokes-screen__answer">{current.value.a}</p>
        ) : (
          <p class="jokes-screen__answer jokes-screen__answer--hidden" aria-hidden="true">
            …
          </p>
        )}
      </div>
      <div class="jokes-screen__controls">
        <button type="button" class="game-screen__button" onClick={() => say(current.value.q)}>
          Say the question
        </button>
        <button type="button" class="game-screen__button" onClick={() => (showAnswer.value = true)} disabled={showAnswer.value}>
          Show the answer
        </button>
        <button type="button" class="game-screen__button" onClick={() => say(current.value.a)} disabled={!showAnswer.value}>
          Say the answer
        </button>
        <button type="button" class="game-screen__button game-screen__button--next" onClick={next}>
          Next joke
        </button>
        <button type="button" class="game-screen__button" onClick={makeSilly}>
          Make a silly one
        </button>
      </div>
    </div>
  );
}
