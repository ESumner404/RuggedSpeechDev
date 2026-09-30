import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getRootBoard, preferredVoiceURI, setFirstRunCompleted, setPreferredVoiceURI, updateBoard } from '../store/db';
import { getOfflineVoices, speak } from '../speech/speak';
import { resizeGrid } from '../parent/boardEditing';
import { VALID_GRID_SIZES, type Board, type GridSize } from '../store/types';
import { PinGate } from '../parent/PinGate';

type Screen = 'voice' | 'grid' | 'pin';

type Props = {
  onComplete: () => void;
};

// Three screens and no more (PLAN.md Phase 8): choose a voice, choose a
// grid size, set the Parent PIN. Everything else is discoverable later in
// Parent Mode.
export function FirstRunWizard({ onComplete }: Props) {
  const screen = useSignal<Screen>('voice');
  const voices = useSignal<SpeechSynthesisVoice[]>([]);
  const chosenVoiceURI = useSignal<string | undefined>(undefined);
  const rootBoard = useSignal<Board | null>(null);
  const chosenSize = useSignal<GridSize>(4);
  const minSize = useSignal<GridSize>(4);
  const gridError = useSignal<string | null>(null);

  useEffect(() => {
    voices.value = getOfflineVoices(window.speechSynthesis.getVoices());
    chosenVoiceURI.value = voices.value[0]?.voiceURI;

    void getRootBoard().then((board) => {
      if (!board) return;
      rootBoard.value = board;
      chosenSize.value = board.grid.rows;
      const needed = VALID_GRID_SIZES.find((size) => size * size >= board.buttons.length) ?? 5;
      minSize.value = needed as GridSize;
    });
  }, []);

  function tryVoice(): void {
    speak('This is what I sound like.', chosenVoiceURI.value ? { voiceURI: chosenVoiceURI.value } : {});
  }

  async function confirmVoice(): Promise<void> {
    await setPreferredVoiceURI(chosenVoiceURI.value);
    preferredVoiceURI.value = chosenVoiceURI.value;
    screen.value = 'grid';
  }

  async function confirmGrid(): Promise<void> {
    if (!rootBoard.value) {
      screen.value = 'pin';
      return;
    }
    gridError.value = null;
    try {
      await updateBoard(resizeGrid(rootBoard.value, chosenSize.value, chosenSize.value));
      screen.value = 'pin';
    } catch (err) {
      gridError.value = err instanceof Error ? err.message : String(err);
    }
  }

  async function finish(): Promise<void> {
    await setFirstRunCompleted();
    onComplete();
  }

  return (
    <div class="first-run-wizard">
      {screen.value === 'voice' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Choose a voice</h1>
          <p class="first-run-wizard__hint">This is the voice that speaks what's built on the board.</p>
          {voices.value.length === 0 && <p>No offline voices were found on this computer.</p>}
          <ul class="first-run-wizard__voice-list">
            {voices.value.map((voice) => (
              <li key={voice.voiceURI}>
                <label class="first-run-wizard__voice-option">
                  <input
                    type="radio"
                    name="voice"
                    checked={chosenVoiceURI.value === voice.voiceURI}
                    onChange={() => (chosenVoiceURI.value = voice.voiceURI)}
                  />
                  {voice.name}
                </label>
              </li>
            ))}
          </ul>
          <button type="button" class="first-run-wizard__button" onClick={tryVoice} disabled={!chosenVoiceURI.value}>
            Try it
          </button>
          <button
            type="button"
            class="first-run-wizard__button first-run-wizard__button--primary"
            onClick={() => void confirmVoice()}
          >
            Next
          </button>
        </div>
      )}

      {screen.value === 'grid' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Choose a grid size</h1>
          <p class="first-run-wizard__hint">
            Bigger buttons, fewer per page — or smaller buttons with more choices at once. This
            can be changed later in Parent Mode, but button positions stay put once set
            (CLAUDE.md I3), so it's worth getting right now.
          </p>
          {gridError.value && <p class="first-run-wizard__error">{gridError.value}</p>}
          <div class="first-run-wizard__grid-sizes">
            {VALID_GRID_SIZES.filter((size) => size >= minSize.value).map((size) => (
              <label class="first-run-wizard__grid-size-option" key={size}>
                <input
                  type="radio"
                  name="grid-size"
                  checked={chosenSize.value === size}
                  onChange={() => (chosenSize.value = size)}
                />
                {size} × {size}
              </label>
            ))}
          </div>
          <button
            type="button"
            class="first-run-wizard__button first-run-wizard__button--primary"
            onClick={() => void confirmGrid()}
          >
            Next
          </button>
        </div>
      )}

      {screen.value === 'pin' && (
        <div class="first-run-wizard__screen">
          <h1 class="first-run-wizard__title">Set a Parent PIN</h1>
          <p class="first-run-wizard__hint">
            This protects settings and editing — it does not lock the computer.
          </p>
          <PinGate onUnlock={() => void finish()} onCancel={() => {}} showCancel={false} />
        </div>
      )}
    </div>
  );
}
