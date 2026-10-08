import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { customPhrasesSetting, getPhraseBank, setPhraseBankSlot } from '../store/db';
import { announceText } from '../speech/announce';
import type { PhraseBank, PhraseBankSlotId } from '../store/types';

const SLOTS: { id: PhraseBankSlotId; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'address', label: 'Address' },
  { id: 'usualOrder', label: 'Usual order' },
  { id: 'registerAnswer', label: 'Register answer' },
];

const EMPTY: PhraseBank = { name: '', address: '', usualOrder: '', registerAnswer: '' };

export function PhraseBankTab() {
  const bank = useSignal<PhraseBank>(EMPTY);

  useEffect(() => {
    void getPhraseBank().then((stored) => {
      bank.value = stored;
    });
  }, []);

  function handleInput(slot: PhraseBankSlotId, value: string): void {
    bank.value = { ...bank.value, [slot]: value };
    void setPhraseBankSlot(slot, value);
  }

  function handleSpeak(slot: PhraseBankSlotId): void {
    const text = bank.value[slot];
    if (!text) return;
    announceText(text);
  }

  // Phrases beyond the four fixed ones (docs/build-plan.md Phase 3 started with four
  // slots): whatever this person finds hard to say, as many as they need.
  const extra = customPhrasesSetting.signal.value;
  const draft = useSignal('');

  function addPhrase(event: Event): void {
    event.preventDefault();
    const text = draft.value.trim();
    if (!text) return;
    draft.value = '';
    void customPhrasesSetting.set([...customPhrasesSetting.signal.value, text]);
  }

  function removePhrase(index: number): void {
    void customPhrasesSetting.set(customPhrasesSetting.signal.value.filter((_, i) => i !== index));
  }

  return (
    <div class="phrase-bank-tab">
      {SLOTS.map((slot) => (
        <div class="phrase-bank-tab__row" key={slot.id}>
          <label class="phrase-bank-tab__label" htmlFor={`phrase-${slot.id}`}>
            {slot.label}
          </label>
          <input
            id={`phrase-${slot.id}`}
            class="phrase-bank-tab__input"
            type="text"
            value={bank.value[slot.id]}
            onInput={(event) => handleInput(slot.id, (event.target as HTMLInputElement).value)}
          />
          <button
            type="button"
            class="phrase-bank-tab__speak"
            disabled={!bank.value[slot.id]}
            onClick={() => handleSpeak(slot.id)}
          >
            Speak
          </button>
        </div>
      ))}

      <h2 class="phrase-bank-tab__heading">More phrases</h2>
      {extra.map((phrase, index) => (
        <div class="phrase-bank-tab__row phrase-bank-tab__row--custom" key={`${index}-${phrase}`}>
          <span class="phrase-bank-tab__phrase">{phrase}</span>
          <button type="button" class="phrase-bank-tab__speak" onClick={() => announceText(phrase)}>
            Speak
          </button>
          <button
            type="button"
            class="phrase-bank-tab__remove"
            aria-label={`Remove "${phrase}"`}
            onClick={() => removePhrase(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <form class="phrase-bank-tab__row" onSubmit={addPhrase}>
        <input
          class="phrase-bank-tab__input"
          type="text"
          placeholder="Add a phrase"
          aria-label="Add a phrase"
          value={draft.value}
          onInput={(event) => (draft.value = (event.target as HTMLInputElement).value)}
        />
        <button type="submit" class="phrase-bank-tab__speak" disabled={!draft.value.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}
