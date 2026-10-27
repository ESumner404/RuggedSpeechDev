import { modellingFocus } from './modelling';

// The word to model this week: a partner presses it on the device while they talk, with no demand on the child to press
// anything back. For the adults only.
export function ModellingCard() {
  const focus = modellingFocus(new Date());
  return (
    <section class="modelling-card" aria-label="Word to model this week">
      <h2 class="modelling-card__title">
        Model this week: <span class="modelling-card__word">“{focus.word}”</span>
      </h2>
      <p class="modelling-card__why">{focus.why}</p>
      <p class="modelling-card__lead">Press it yourself, as you talk. The child only has to watch and listen. Some ways to try:</p>
      <ul class="modelling-card__list">
        {focus.try.map((idea) => (
          <li key={idea}>{idea}</li>
        ))}
      </ul>
    </section>
  );
}
