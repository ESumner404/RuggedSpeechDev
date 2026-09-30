import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getPhraseBank, setPhraseBankSlot } from '../store/db';
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
    </div>
  );
}
