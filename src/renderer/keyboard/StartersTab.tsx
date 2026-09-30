import { CONVERSATION_STARTERS } from '../vocab/conversationStarters';
import { announceText } from '../speech/announce';

export function StartersTab() {
  return (
    <div class="starters-tab">
      {CONVERSATION_STARTERS.map((category) => (
        <section class="starters-tab__category" key={category.id}>
          <h2 class="starters-tab__category-title">{category.label}</h2>
          <div class="starters-tab__phrases">
            {category.phrases.map((phrase) => (
              <button
                type="button"
                class="starters-tab__phrase"
                key={phrase}
                onClick={() => announceText(phrase)}
              >
                {phrase}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
