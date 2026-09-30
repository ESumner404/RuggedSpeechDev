import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getAllBoards } from '../store/db';
import { ROOT_BOARD_ID } from '../vocab/starter';
import type { Board } from '../store/types';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';

// Laminated cards are what get used when the machine is broken, charging or
// elsewhere (PLAN.md Phase 6) — physical backups of the same vocabulary.
// The print dialog Electron opens already shows its own preview before
// anything reaches the printer, so this tab doesn't build a second one.
const CARD_SIZES_MM = [20, 30, 50, 70] as const;
type Mode = 'cards' | 'strip';

export function PrintTab() {
  const boards = useSignal<Board[]>([]);
  const selectedBoardId = useSignal<string | null>(null);
  const cardSize = useSignal<number>(50);
  const mode = useSignal<Mode>('cards');

  useEffect(() => {
    void getAllBoards().then((loaded) => {
      const sorted = [...loaded].sort((a, b) =>
        a.id === ROOT_BOARD_ID ? -1 : b.id === ROOT_BOARD_ID ? 1 : a.name.localeCompare(b.name),
      );
      boards.value = sorted;
      selectedBoardId.value = sorted[0]?.id ?? null;
    });
  }, []);

  const selectedBoard = boards.value.find((board) => board.id === selectedBoardId.value) ?? null;

  return (
    <div class="parent-mode-screen__body print-tab">
      <div class="print-tab__controls">
        <label>
          What to print
          <select
            value={mode.value}
            onChange={(event) => (mode.value = (event.target as HTMLSelectElement).value as Mode)}
          >
            <option value="cards">Board cards</option>
            <option value="strip">Sentence strip template</option>
          </select>
        </label>

        {mode.value === 'cards' && (
          <label>
            Board
            <select
              value={selectedBoardId.value ?? ''}
              onChange={(event) => (selectedBoardId.value = (event.target as HTMLSelectElement).value)}
            >
              {boards.value.map((board) => (
                <option value={board.id} key={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Card size
          <select
            value={cardSize.value}
            onChange={(event) => (cardSize.value = Number((event.target as HTMLSelectElement).value))}
          >
            {CARD_SIZES_MM.map((size) => (
              <option value={size} key={size}>
                {size}mm
              </option>
            ))}
          </select>
        </label>

        <button type="button" class="parent-mode-screen__button print-tab__print-button" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <p class="print-tab__hint">
        Printing opens the printer dialog, which shows its own preview before anything is
        sent to the printer.
      </p>

      <div class="print-page">
        {mode.value === 'cards' && selectedBoard && (
          <div class="print-card-grid">
            {selectedBoard.buttons
              .filter((button) => !button.hidden)
              .map((button) => (
                <div
                  class="print-card"
                  style={{ width: `${cardSize.value}mm`, height: `${cardSize.value}mm` }}
                  key={button.id}
                >
                  {button.image?.kind === 'emoji' && <span class="print-card__emoji">{button.image.char}</span>}
                  {button.image?.kind === 'photo' && (
                    <PhotoThumbnail class="print-card__photo" blobId={button.image.blobId} alt="" />
                  )}
                  <span class="print-card__label">{button.label}</span>
                </div>
              ))}
          </div>
        )}

        {mode.value === 'strip' && (
          <div class="print-strip">
            <div class="print-strip__boxes">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  class="print-card print-strip__box"
                  style={{ width: `${cardSize.value}mm`, height: `${cardSize.value}mm` }}
                  key={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
