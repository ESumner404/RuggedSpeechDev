import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  clearAfterSpeakSetting,
  getAllBoards,
  usageCountsSetting,
  usageEnabledSetting,
  wordStageSetting,
} from '../store/db';
import { clearUsage, summariseUsage, usageToCsv, wordsNotUsed, USAGE_RETENTION_DAYS } from '../store/usage';
import { isItemShown } from '../board/visibility';
import { WORD_STAGES, type Board, type Item } from '../store/types';

const PERIODS = [7, 30, USAGE_RETENTION_DAYS] as const;

type Located = { item: Item; boardName: string };

// Things a speech and language therapist (or a parent following one's
// advice) tends to ask for: bringing words in gradually, marking the words
// being worked on, and seeing which words are actually being used.
export function LearningTab() {
  const boards = useSignal<Board[]>([]);
  const period = useSignal<number>(30);
  const confirmClear = useSignal(false);
  const exportMessage = useSignal<string | null>(null);

  useEffect(() => {
    void getAllBoards().then((loaded) => (boards.value = loaded));
  }, []);

  const stage = wordStageSetting.signal.value;
  const usageOn = usageEnabledSetting.signal.value;
  const counts = usageCountsSetting.signal.value;

  // Every word on every board that isn't a folder, and isn't switched off.
  const words: Located[] = boards.value.flatMap((board) =>
    board.buttons
      .filter((item) => !item.load_board && !item.hidden)
      .map((item) => ({ item, boardName: board.name })),
  );
  const heldBack = words.filter(({ item }) => !isItemShown(item, stage)).length;
  const focusWords = words.filter(({ item }) => item.target);

  const summary = summariseUsage(counts, period.value);
  const unused = wordsNotUsed(
    words.filter(({ item }) => isItemShown(item, stage)).map(({ item }) => item.label),
    summary,
  );

  async function exportCsv(): Promise<void> {
    exportMessage.value = null;
    const result = await window.myWords.files.save(usageToCsv(counts), {
      suggestedName: 'rugged-speech-word-counts.csv',
      filterName: 'Spreadsheet (CSV)',
      extensions: ['csv'],
    });
    exportMessage.value = result.ok ? 'Saved.' : null;
  }

  return (
    <div class="parent-mode-screen__body learning-tab">
      <section class="learning-tab__section">
        <h2 class="learning-tab__heading">Word stage</h2>
        <p class="learning-tab__hint">
          Bring words in gradually. Give a word a stage under <strong>Boards → Details</strong>; words
          above the stage chosen here are held back, and their space stays empty so nothing else moves.
          Words without a stage are always shown.
        </p>
        <label class="learning-tab__row">
          Show words up to
          <select
            value={stage}
            onChange={(event) => void wordStageSetting.set(Number((event.target as HTMLSelectElement).value))}
          >
            <option value={0}>All words</option>
            {WORD_STAGES.map((value) => (
              <option value={value} key={value}>
                Stage {value}
              </option>
            ))}
          </select>
        </label>
        <p class="learning-tab__status">
          {heldBack === 0 ? 'No words are being held back.' : `${heldBack} word${heldBack === 1 ? ' is' : 's are'} held back right now.`}
        </p>
      </section>

      <section class="learning-tab__section">
        <h2 class="learning-tab__heading">Focus words</h2>
        <p class="learning-tab__hint">
          Words being worked on show with a blue outline on the child's board. Mark or unmark them
          under <strong>Boards → Details</strong>.
        </p>
        {focusWords.length === 0 ? (
          <p class="learning-tab__status">No focus words yet.</p>
        ) : (
          <ul class="learning-tab__list">
            {focusWords.map(({ item, boardName }) => (
              <li key={`${boardName}-${item.id}`}>
                {item.label} <span class="learning-tab__muted">on {boardName}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section class="learning-tab__section">
        <h2 class="learning-tab__heading">After speaking</h2>
        <label class="learning-tab__check">
          <input
            type="checkbox"
            checked={clearAfterSpeakSetting.signal.value}
            onChange={(event) => void clearAfterSpeakSetting.set((event.target as HTMLInputElement).checked)}
          />
          Clear the sentence once it has been spoken
        </label>
        <p class="learning-tab__hint">For people who start each sentence afresh. Off keeps it, so it can be said again.</p>
      </section>

      <section class="learning-tab__section">
        <h2 class="learning-tab__heading">Word counts</h2>
        <p class="learning-tab__hint">
          Off by default. When on, it counts how many times each word is pressed each day, and
          nothing else: no sentences and no times of day. Counts stay on this device, are kept for
          {` ${USAGE_RETENTION_DAYS} `}days, and can be cleared or switched off whenever you like. Every
          word button is counted the same way. They are included in a backup.
        </p>
        <label class="learning-tab__check">
          <input
            type="checkbox"
            checked={usageOn}
            onChange={(event) => void usageEnabledSetting.set((event.target as HTMLInputElement).checked)}
          />
          Count how often each word is pressed
        </label>

        {usageOn || summary.totalPresses > 0 ? (
          <>
            <label class="learning-tab__row">
              Show the last
              <select
                value={period.value}
                onChange={(event) => (period.value = Number((event.target as HTMLSelectElement).value))}
              >
                {PERIODS.map((days) => (
                  <option value={days} key={days}>
                    {days} days
                  </option>
                ))}
              </select>
            </label>
            <p class="learning-tab__status">
              {summary.totalPresses} press{summary.totalPresses === 1 ? '' : 'es'} of {summary.distinctWords}{' '}
              different word{summary.distinctWords === 1 ? '' : 's'}.
            </p>
            {summary.rows.length > 0 && (
              <table class="learning-tab__table">
                <thead>
                  <tr>
                    <th scope="col">Word</th>
                    <th scope="col">Presses</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.rows.slice(0, 25).map((row) => (
                    <tr key={row.word}>
                      <td>{row.word}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {summary.totalPresses > 0 && unused.length > 0 && (
              <p class="learning-tab__status">
                <strong>Not pressed in this time:</strong> {unused.join(', ')}.
              </p>
            )}
            <div class="learning-tab__actions">
              <button
                type="button"
                class="parent-mode-screen__button"
                disabled={Object.keys(counts).length === 0}
                onClick={() => void exportCsv()}
              >
                Save the counts as a spreadsheet…
              </button>
              {confirmClear.value ? (
                <>
                  <span>Delete all the counts?</span>
                  <button
                    type="button"
                    class="parent-mode-screen__button"
                    onClick={() => {
                      confirmClear.value = false;
                      void clearUsage();
                    }}
                  >
                    Yes, clear them
                  </button>
                  <button type="button" class="parent-mode-screen__button" onClick={() => (confirmClear.value = false)}>
                    Keep them
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  class="parent-mode-screen__button"
                  disabled={Object.keys(counts).length === 0}
                  onClick={() => (confirmClear.value = true)}
                >
                  Clear the counts
                </button>
              )}
            </div>
            {exportMessage.value && <p class="learning-tab__status">{exportMessage.value}</p>}
          </>
        ) : null}
      </section>
    </div>
  );
}
