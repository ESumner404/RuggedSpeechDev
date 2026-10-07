import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  ensureSeeded,
  getActiveProfile,
  getBoard,
  getSessionState,
  pressMode,
  setSessionState,
} from '../store/db';
import { ROOT_BOARD_ID } from '../vocab/starter';
import type { Board, Item } from '../store/types';
import { announceItem, announceText } from '../speech/announce';
import { Grid } from './Grid';
import { SentenceStrip, type SentenceChip } from './SentenceStrip';

type Props = {
  onExit: () => void;
};

export function TalkScreen({ onExit }: Props) {
  // Starts at the app's own root and is corrected once the active profile
  // loads — a profile (PLAN.md Phase 6) changes which board Talk opens to
  // by default without ever moving a Home screen button (CLAUDE.md I3).
  const rootBoardId = useSignal<string>(ROOT_BOARD_ID);
  const boardStack = useSignal<string[]>([ROOT_BOARD_ID]);
  const currentBoard = useSignal<Board | null>(null);
  const sentence = useSignal<SentenceChip[]>([]);
  const seeded = useSignal(false);
  // Set the instant a deliberate exit begins (Home/Back-out-of-Talk) so the
  // persistence effect below clears rather than re-saves the state that
  // exit is also producing (PLAN.md Phase 8: crash recovery restores the
  // sentence and page only after an unclean shutdown, never after the
  // child simply pressed Home).
  const exiting = useSignal(false);

  useEffect(() => {
    void ensureSeeded()
      .then(() => Promise.all([getActiveProfile(), getSessionState()]))
      .then(([profile, session]) => {
        rootBoardId.value = profile.rootBoardId;
        if (session) {
          boardStack.value = session.boardStack;
          sentence.value = session.sentence.map((item) => ({ chipId: crypto.randomUUID(), item }));
        } else {
          boardStack.value = [profile.rootBoardId];
        }
        seeded.value = true;
      });
  }, []);

  useEffect(() => {
    if (!seeded.value) return;
    const boardId = boardStack.value[boardStack.value.length - 1] ?? ROOT_BOARD_ID;
    void getBoard(boardId).then((board) => {
      currentBoard.value = board ?? null;
    });
  }, [seeded.value, boardStack.value]);

  useEffect(() => {
    // Once a deliberate exit has started, the clear already happened
    // imperatively in handleHome/handleBack — this effect racing an
    // unmount (both triggered from the same click) is not reliable enough
    // to be the only thing clearing crash-recovery state, so it just stops
    // persisting rather than trying to also clear.
    if (!seeded.value || exiting.value) return;
    void setSessionState({ boardStack: boardStack.value, sentence: sentence.value.map((chip) => chip.item) });
  }, [seeded.value, boardStack.value, sentence.value, exiting.value]);

  function handlePress(item: Item): void {
    if (item.load_board) {
      boardStack.value = [...boardStack.value, item.load_board.id];
      return;
    }
    // What a press does is an adult's choice (PLAN.md Phase 1 press mode).
    // By default it only adds to the sentence — nothing speaks until Speak
    // is pressed. Either way, speech only ever follows a person's press
    // (invariant I5).
    const mode = pressMode.value;
    if (mode !== 'speak') {
      sentence.value = [...sentence.value, { chipId: crypto.randomUUID(), item }];
    }
    if (mode !== 'sentence') void announceItem(item);
  }

  function handleBack(): void {
    if (boardStack.value.length > 1) {
      boardStack.value = boardStack.value.slice(0, -1);
    } else {
      // Already at Talk's own root — there's nowhere shallower within Talk,
      // so Back falls through to the app Home screen rather than doing
      // nothing. Cleared imperatively, right here, rather than left to the
      // persistence effect: that effect and the unmount this triggers are
      // both scheduled from this same click, and unmount can beat the
      // effect to the punch, leaving stale recovery state behind.
      exiting.value = true;
      void setSessionState(null);
      onExit();
    }
  }

  function handleHome(): void {
    exiting.value = true;
    void setSessionState(null);
    boardStack.value = [rootBoardId.value];
    onExit();
  }

  function handleRemoveChip(chipId: string): void {
    sentence.value = sentence.value.filter((chip) => chip.chipId !== chipId);
  }

  function handleClearSentence(): void {
    sentence.value = [];
  }

  function handleSpeak(): void {
    const text = sentence.value.map((chip) => chip.item.vocalization ?? chip.item.label).join(' ');
    if (!text) return;
    announceText(text);
  }

  return (
    <div class="talk-screen">
      <SentenceStrip
        chips={sentence.value}
        onRemove={handleRemoveChip}
        onClear={handleClearSentence}
        onSpeak={handleSpeak}
      />
      <div class="talk-screen__grid">
        {currentBoard.value ? (
          <Grid
            board={currentBoard.value}
            onPress={handlePress}
            auxiliaryControls={[
              { label: 'Clear all', onActivate: handleClearSentence },
              { label: 'Speak', onActivate: handleSpeak },
            ]}
          />
        ) : (
          <p class="talk-screen__loading">Loading…</p>
        )}
      </div>
      <nav class="talk-screen__nav">
        <button type="button" class="talk-screen__nav-button" onClick={handleHome}>
          Home
        </button>
        <button type="button" class="talk-screen__nav-button" onClick={handleBack}>
          Back
        </button>
      </nav>
    </div>
  );
}
