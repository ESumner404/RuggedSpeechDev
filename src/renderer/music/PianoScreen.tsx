import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { musicVolumeSetting } from '../store/db';
import { NOTES, TUNES, noteForKey, playNote, type Tune } from './piano';

// Piano: eight big coloured keys. Press one and it plays. Pick a tune and the
// next key to press is outlined, with a pointer above it; pressing the wrong
// key just plays that note and nothing is lost, so there is nothing to get
// wrong. "Hear it" plays the tune, at a slow and steady pace. Nothing plays
// unless something is pressed.
const TUNE_STEP_MS = 650;

export function PianoScreen() {
  const tune = useSignal<Tune | null>(null);
  const step = useSignal(0);
  const sounding = useSignal<number | null>(null);
  const playing = useSignal(false);
  const message = useSignal('Press the keys to make music.');
  const timers = useRef<number[]>([]);
  const noSound = useSignal(false);

  function stopTune(): void {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
    playing.value = false;
    sounding.value = null;
  }

  useEffect(() => stopTune, []);

  function sound(position: number): void {
    const note = NOTES[position]!;
    if (!playNote(note.frequency, musicVolumeSetting.signal.value)) noSound.value = true;
    sounding.value = position;
    timers.current.push(window.setTimeout(() => (sounding.value === position ? (sounding.value = null) : undefined), 220));
  }

  function press(position: number): void {
    if (playing.value) stopTune();
    sound(position);
    const chosen = tune.value;
    if (!chosen) return;
    if (position === chosen.notes[step.value]) {
      const next = step.value + 1;
      step.value = next;
      message.value = next >= chosen.notes.length ? 'You played the whole tune!' : 'Yes. Now the next key.';
    } else if (step.value < chosen.notes.length) {
      message.value = 'Look for the key with the pointer.';
    }
  }

  // A real keyboard plays the keys too: A S D F G H J K.
  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const position = noteForKey(event.key);
      if (position === undefined) return;
      event.preventDefault();
      press(position);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  function choose(next: Tune | null): void {
    stopTune();
    tune.value = next;
    step.value = 0;
    message.value = next ? `${next.name}. Press the key with the pointer.` : 'Press the keys to make music.';
  }

  function hear(): void {
    const chosen = tune.value;
    if (!chosen) return;
    stopTune();
    playing.value = true;
    chosen.notes.forEach((position, index) => {
      timers.current.push(window.setTimeout(() => sound(position), index * TUNE_STEP_MS));
    });
    timers.current.push(window.setTimeout(() => (playing.value = false), chosen.notes.length * TUNE_STEP_MS));
  }

  const target = tune.value && step.value < tune.value.notes.length ? tune.value.notes[step.value]! : null;

  return (
    <div class="piano-screen">
      <div class="piano-screen__tunes" role="group" aria-label="Tunes">
        <button type="button" class={`piano-screen__tune${tune.value === null ? ' piano-screen__tune--on' : ''}`} aria-pressed={tune.value === null} onClick={() => choose(null)}>
          Play freely
        </button>
        {TUNES.map((entry) => (
          <button
            type="button"
            key={entry.id}
            class={`piano-screen__tune${tune.value?.id === entry.id ? ' piano-screen__tune--on' : ''}`}
            aria-pressed={tune.value?.id === entry.id}
            onClick={() => choose(entry)}
          >
            {entry.name}
          </button>
        ))}
      </div>

      <div class="piano-screen__keys" role="group" aria-label="Piano keys">
        {NOTES.map((note, position) => (
          <div class="piano-screen__slot" key={position}>
            <span class="piano-screen__pointer" aria-hidden="true">
              {target === position ? '👇' : ''}
            </span>
            <button
              type="button"
              class={`piano-key${target === position ? ' piano-key--next' : ''}${sounding.value === position ? ' piano-key--down' : ''}`}
              style={{ '--note': note.colour } as Record<string, string>}
              aria-label={`${note.name}${position === 7 ? ', high' : ''}`}
              onClick={() => press(position)}
            >
              <span class="piano-key__letter">{note.letter}</span>
            </button>
          </div>
        ))}
      </div>

      <p class="game-screen__message" role="status">
        {noSound.value ? 'This computer cannot make piano sounds.' : message.value}
      </p>
      <div class="piano-screen__controls">
        <button type="button" class="game-screen__button" disabled={!tune.value} onClick={hear}>
          Hear it
        </button>
        <button type="button" class="game-screen__button" disabled={!tune.value} onClick={() => choose(tune.value)}>
          Start the tune again
        </button>
        <button type="button" class="game-screen__button" disabled={!playing.value} onClick={stopTune}>
          Stop
        </button>
      </div>
    </div>
  );
}
