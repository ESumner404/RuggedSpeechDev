import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { collectVocabularyWords } from '../vocab/starter';
import { applySuggestion, getSuggestions } from './prediction';
import {
  customPhrasesSetting,
  getAllBoards,
  getPeople,
  getPhraseBank,
  getPlaces,
  getWordFrequencies,
  incrementWordFrequency,
} from '../store/db';
import { collectPersonalWords, mergeVocabulary } from './personalWords';
import { announceText } from '../speech/announce';
import { OnScreenKeyboard } from './OnScreenKeyboard';
import { PhraseBankTab } from './PhraseBankTab';
import { StartersTab } from './StartersTab';

type KeyboardTab = 'keyboard' | 'phrases' | 'starters';

const VOCABULARY = collectVocabularyWords();

export function KeyboardScreen() {
  const tab = useSignal<KeyboardTab>('keyboard');
  const text = useSignal('');
  const frequency = useSignal<Record<string, number>>({});
  const noPressure = useSignal(false);
  const showing = useSignal(false);
  // The built-in words, plus this person's own: family names, the words on
  // pages an adult has built, and their saved phrases.
  const vocabulary = useSignal<string[]>(VOCABULARY);

  useEffect(() => {
    void Promise.all([getAllBoards(), getPeople(), getPlaces(), getPhraseBank()]).then(
      ([boards, people, places, phraseBank]) => {
        const personal = collectPersonalWords({
          boards,
          people,
          places,
          customPhrases: customPhrasesSetting.signal.value,
          phraseBank,
        });
        vocabulary.value = mergeVocabulary(VOCABULARY, personal);
      },
    );
  }, []);

  useEffect(() => {
    void getWordFrequencies().then((loaded) => {
      frequency.value = loaded;
    });
  }, []);

  function pressKey(char: string): void {
    text.value += char;
  }

  function pressSpace(): void {
    text.value += ' ';
  }

  function pressBackspace(): void {
    text.value = text.value.slice(0, -1);
  }

  // Suggestions only ever change the text through this handler, an
  // explicit press. Nothing else touches text.value on their behalf
  // (docs/build-plan.md Phase 3 acceptance).
  function pressSuggestion(word: string): void {
    text.value = applySuggestion(text.value, word);
    void incrementWordFrequency(word)
      .then(() => getWordFrequencies())
      .then((updated) => {
        frequency.value = updated;
      });
  }

  function pressSpeak(): void {
    const trimmed = text.value.trim();
    if (!trimmed) return;
    announceText(trimmed);
  }

  const suggestions = getSuggestions(text.value, vocabulary.value, frequency.value);
  const showBody = noPressure.value || tab.value === 'keyboard';

  return (
    <div class="keyboard-screen">
      {!noPressure.value && (
        <div class="page-tabs">
          <button
            type="button"
            class="page-tabs__tab"
            aria-pressed={tab.value === 'keyboard'}
            onClick={() => (tab.value = 'keyboard')}
          >
            Keyboard
          </button>
          <button
            type="button"
            class="page-tabs__tab"
            aria-pressed={tab.value === 'phrases'}
            onClick={() => (tab.value = 'phrases')}
          >
            Phrases
          </button>
          <button
            type="button"
            class="page-tabs__tab"
            aria-pressed={tab.value === 'starters'}
            onClick={() => (tab.value = 'starters')}
          >
            Starters
          </button>
        </div>
      )}

      {showBody && (
        <div class="keyboard-screen__body">
          <div class="keyboard-screen__toprow">
            <div class="keyboard-screen__textbox">{text.value || ' '}</div>
            <button
              type="button"
              class="keyboard-screen__no-pressure-toggle"
              onClick={() => (noPressure.value = !noPressure.value)}
            >
              {noPressure.value ? 'Exit no-pressure mode' : 'No-pressure mode'}
            </button>
          </div>

          {!noPressure.value && (
            <div class="prediction-bar">
              {suggestions.length === 0 && <span class="prediction-bar__empty">…</span>}
              {suggestions.map((word) => (
                <button
                  type="button"
                  class="prediction-bar__suggestion"
                  key={word}
                  onClick={() => pressSuggestion(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          )}

          <OnScreenKeyboard onKey={pressKey} onSpace={pressSpace} onBackspace={pressBackspace} />

          <div class="keyboard-screen__actions">
            <button
              type="button"
              class="sentence-strip__speak"
              disabled={!text.value.trim()}
              onClick={pressSpeak}
            >
              Speak
            </button>
            {!noPressure.value && (
              <button
                type="button"
                class="keyboard-screen__show"
                disabled={!text.value.trim()}
                onClick={() => (showing.value = true)}
              >
                Show
              </button>
            )}
          </div>
        </div>
      )}

      {!noPressure.value && tab.value === 'phrases' && <PhraseBankTab />}
      {!noPressure.value && tab.value === 'starters' && <StartersTab />}

      {showing.value && (
        <button type="button" class="show-overlay" onClick={() => (showing.value = false)}>
          <span class="show-overlay__text">{text.value.trim()}</span>
        </button>
      )}
    </div>
  );
}
