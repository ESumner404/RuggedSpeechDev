import { useSignal } from '@preact/signals';
import { customJokesSetting } from '../store/db';
import { BASIC_JOKES } from '../vocab/jokes';

// Jokes of your own, added to the built-in ones. A question and an answer,
// as short as you like.
export function JokesTab() {
  const question = useSignal('');
  const answer = useSignal('');
  const jokes = customJokesSetting.signal.value;

  function add(event: Event): void {
    event.preventDefault();
    const q = question.value.trim();
    const a = answer.value.trim();
    if (!q || !a) return;
    void customJokesSetting.set([...customJokesSetting.signal.value, { q, a }]);
    question.value = '';
    answer.value = '';
  }

  return (
    <div class="parent-mode-screen__body jokes-tab">
      <p class="about-tab__hint">
        Jokes are in Games. There are {BASIC_JOKES.length} very simple ones already. Add your own here: a
        question, and its answer.
      </p>
      <form class="jokes-tab__form" onSubmit={add}>
        <label class="about-tab__field">
          Question
          <input class="about-tab__input" type="text" value={question.value} onInput={(e) => (question.value = (e.target as HTMLInputElement).value)} />
        </label>
        <label class="about-tab__field">
          Answer
          <input class="about-tab__input" type="text" value={answer.value} onInput={(e) => (answer.value = (e.target as HTMLInputElement).value)} />
        </label>
        <button type="submit" class="parent-mode-screen__button" disabled={!question.value.trim() || !answer.value.trim()}>
          Add joke
        </button>
      </form>
      {jokes.length === 0 ? (
        <p>No jokes of your own yet.</p>
      ) : (
        <ul class="jokes-tab__list">
          {jokes.map((joke, index) => (
            <li key={index} class="jokes-tab__joke">
              <span>
                <strong>{joke.q}</strong> {joke.a}
              </span>
              <button
                type="button"
                class="parent-mode-screen__button"
                aria-label={`Remove the joke: ${joke.q}`}
                onClick={() => void customJokesSetting.set(customJokesSetting.signal.value.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
