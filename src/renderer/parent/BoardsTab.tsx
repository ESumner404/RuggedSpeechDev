import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { createBoard, getAllBoards, updateBoard } from '../store/db';
import { addButton, hasEmptySlot, resizeGrid, slugify } from './boardEditing';
import { AddButtonForm } from './AddButtonForm';
import { ButtonList } from './ButtonList';
import { FITZGERALD_CLASSES, FITZGERALD_COLORS, FITZGERALD_LABELS, type FitzgeraldClass } from '../ui/fitzgerald';
import type { Board, GridSize, Item } from '../store/types';
import { VALID_GRID_SIZES } from '../store/types';
import { ROOT_BOARD_ID, STARTER_BOARDS } from '../vocab/starter';
import { mergeStarterBoards, newStarterWordsAvailable } from '../vocab/upgrade';

export function BoardsTab() {
  const boards = useSignal<Board[]>([]);
  const selectedBoardId = useSignal<string | null>(null);
  const newFolderName = useSignal('');
  const newFolderEmoji = useSignal('📁');
  const newFolderClass = useSignal<FitzgeraldClass>('things');
  const confirmRestore = useSignal(false);
  const confirmNewWords = useSignal(false);
  const addedNewWords = useSignal(false);
  const error = useSignal<string | null>(null);

  useEffect(() => {
    void getAllBoards().then((loaded) => {
      // getAllBoards reads back in IndexedDB key order (alphabetical), not
      // seed order, put the main Talk board first since that's the one
      // an adult almost always wants to edit first.
      const sorted = [...loaded].sort((a, b) =>
        a.id === ROOT_BOARD_ID ? -1 : b.id === ROOT_BOARD_ID ? 1 : a.name.localeCompare(b.name),
      );
      boards.value = sorted;
      selectedBoardId.value = sorted[0]?.id ?? null;
    });
  }, []);

  const selectedBoard = boards.value.find((board) => board.id === selectedBoardId.value) ?? null;
  const starterVersion = STARTER_BOARDS.find((board) => board.id === selectedBoardId.value);

  async function persist(next: Board): Promise<void> {
    error.value = null;
    boards.value = boards.value.map((board) => (board.id === next.id ? next : board));
    await updateBoard(next);
  }

  function resize(rows: GridSize, columns: GridSize): void {
    if (!selectedBoard) return;
    try {
      void persist(resizeGrid(selectedBoard, rows, columns));
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
  }

  // Brings the larger starter vocabulary onto a device that has the older
  // one. Only ever asked for by an adult, and nothing already there moves.
  async function addNewStarterWords(): Promise<void> {
    confirmNewWords.value = false;
    const changed = mergeStarterBoards(boards.value);
    for (const board of changed) await updateBoard(board);
    const byId = new Map(changed.map((board) => [board.id, board]));
    const merged = boards.value.map((board) => byId.get(board.id) ?? board);
    const fresh = changed.filter((board) => !boards.value.some((b) => b.id === board.id));
    boards.value = [...merged, ...fresh].sort((a, b) =>
      a.id === ROOT_BOARD_ID ? -1 : b.id === ROOT_BOARD_ID ? 1 : a.name.localeCompare(b.name),
    );
    addedNewWords.value = true;
  }

  // Puts back the words, positions and colours this board shipped with.
  // Photos and recordings already stored are left alone; only this board's
  // layout and buttons change.
  async function restoreStarter(): Promise<void> {
    if (!starterVersion) return;
    confirmRestore.value = false;
    await persist(structuredClone(starterVersion));
  }

  // A folder is a new board plus a button on this board that opens it
  // (docs/build-plan.md Phase 4: "create categories"). Capacity is checked first so a
  // full board can't leave an orphaned, unreachable folder behind.
  async function handleAddFolder(event: Event): Promise<void> {
    event.preventDefault();
    const name = newFolderName.value.trim();
    if (!selectedBoard || !name) return;
    if (!hasEmptySlot(selectedBoard)) {
      error.value = 'No empty slot on this board. Resize the grid or remove a button first.';
      return;
    }
    const folder = await createBoard(name);
    const item: Item = {
      id: slugify(name),
      label: name,
      image: { kind: 'emoji', char: newFolderEmoji.value || '📁' },
      background_color: FITZGERALD_COLORS[newFolderClass.value],
      load_board: { id: folder.id },
    };
    boards.value = [...boards.value, folder];
    await persist(addButton(selectedBoard, item));
    newFolderName.value = '';
  }

  return (
    <div class="parent-mode-screen__body">
      {newStarterWordsAvailable(boards.value) && (
        <div class="parent-mode-screen__restore boards-tab__new-words">
          {confirmNewWords.value ? (
            <>
              <span>
                Add the newer starter words (animals, body, clothes, doing words, greetings, colours, numbers and
                weather, and more words on the pages you have)? Every button you have stays exactly where it is. The
                Talk page gets bigger, so its buttons get a little smaller.
              </span>
              <button type="button" class="parent-mode-screen__button" onClick={() => void addNewStarterWords()}>
                Yes, add them
              </button>
              <button type="button" class="parent-mode-screen__button" onClick={() => (confirmNewWords.value = false)}>
                Not now
              </button>
            </>
          ) : (
            <button type="button" class="parent-mode-screen__button" onClick={() => (confirmNewWords.value = true)}>
              Add the newer starter words
            </button>
          )}
        </div>
      )}
      {addedNewWords.value && <p role="status">The newer starter words are added.</p>}
      <label class="parent-mode-screen__board-picker">
        Board
        <select
          value={selectedBoardId.value ?? ''}
          onChange={(event) => {
            selectedBoardId.value = (event.target as HTMLSelectElement).value;
            confirmRestore.value = false;
          }}
        >
          {boards.value.map((board) => (
            <option value={board.id} key={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </label>

      {error.value && <p class="parent-mode-screen__error">{error.value}</p>}

      {selectedBoard && (
        <>
          <div class="parent-mode-screen__grid-size">
            <span>Grid size</span>
            <label>
              rows
              <select
                value={selectedBoard.grid.rows}
                onChange={(event) =>
                  resize(Number((event.target as HTMLSelectElement).value) as GridSize, selectedBoard.grid.columns)
                }
              >
                {VALID_GRID_SIZES.map((size) => (
                  <option value={size} key={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label>
              columns
              <select
                value={selectedBoard.grid.columns}
                onChange={(event) =>
                  resize(selectedBoard.grid.rows, Number((event.target as HTMLSelectElement).value) as GridSize)
                }
              >
                {VALID_GRID_SIZES.map((size) => (
                  <option value={size} key={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ButtonList board={selectedBoard} onChange={(next) => void persist(next)} />

          <AddButtonForm
            board={selectedBoard}
            onChange={(next) => void persist(next)}
            onError={(message) => (error.value = message)}
          />

          {!selectedBoard.id.startsWith('mypage-') && (
            <form
              class="parent-mode-screen__add-form parent-mode-screen__add-folder"
              onSubmit={(event) => void handleAddFolder(event)}
            >
              <input
                class="parent-mode-screen__label-input"
                type="text"
                placeholder="New folder name"
                aria-label="New folder name"
                value={newFolderName.value}
                onInput={(event) => (newFolderName.value = (event.target as HTMLInputElement).value)}
              />
              <input
                class="parent-mode-screen__emoji-input"
                type="text"
                value={newFolderEmoji.value}
                onInput={(event) => (newFolderEmoji.value = (event.target as HTMLInputElement).value)}
                aria-label="Folder emoji"
              />
              <select
                value={newFolderClass.value}
                aria-label="Folder colour"
                onChange={(event) =>
                  (newFolderClass.value = (event.target as HTMLSelectElement).value as FitzgeraldClass)
                }
              >
                {FITZGERALD_CLASSES.map((cls) => (
                  <option value={cls} key={cls}>
                    {FITZGERALD_LABELS[cls]}
                  </option>
                ))}
              </select>
              <button type="submit" class="parent-mode-screen__button">
                Add folder
              </button>
            </form>
          )}

          {starterVersion && (
            <div class="parent-mode-screen__restore">
              {confirmRestore.value ? (
                <>
                  <span>
                    Put “{selectedBoard.name}” back exactly as it came, losing any changes you made to its
                    words, positions and colours?
                  </span>
                  <button type="button" class="parent-mode-screen__button" onClick={() => void restoreStarter()}>
                    Yes, put it back
                  </button>
                  <button type="button" class="parent-mode-screen__button" onClick={() => (confirmRestore.value = false)}>
                    Keep my changes
                  </button>
                </>
              ) : (
                <button type="button" class="parent-mode-screen__button" onClick={() => (confirmRestore.value = true)}>
                  Put this board back to the starter version
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
