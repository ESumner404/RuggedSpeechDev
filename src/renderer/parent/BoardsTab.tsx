import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { createBoard, getAllBoards, updateBoard } from '../store/db';
import {
  addButton,
  hasEmptySlot,
  moveButton,
  resizeGrid,
  slugify,
  swapButtons,
  toggleButtonHidden,
  updateButtonLabel,
} from './boardEditing';
import { useRowDragDrop } from './useRowDragDrop';
import { FITZGERALD_COLORS, type FitzgeraldClass } from '../ui/fitzgerald';
import type { Board, GridSize, Item } from '../store/types';
import { VALID_GRID_SIZES } from '../store/types';
import { ROOT_BOARD_ID } from '../vocab/starter';

export function BoardsTab() {
  const boards = useSignal<Board[]>([]);
  const selectedBoardId = useSignal<string | null>(null);
  const newLabel = useSignal('');
  const newEmoji = useSignal('⭐');
  const newClass = useSignal<FitzgeraldClass>('things');
  const newFolderName = useSignal('');
  const newFolderEmoji = useSignal('📁');
  const newFolderClass = useSignal<FitzgeraldClass>('things');
  const error = useSignal<string | null>(null);

  useEffect(() => {
    void getAllBoards().then((loaded) => {
      // getAllBoards reads back in IndexedDB key order (alphabetical), not
      // seed order — put the main Talk board first since that's the one
      // an adult almost always wants to edit first.
      const sorted = [...loaded].sort((a, b) =>
        a.id === ROOT_BOARD_ID ? -1 : b.id === ROOT_BOARD_ID ? 1 : a.name.localeCompare(b.name),
      );
      boards.value = sorted;
      selectedBoardId.value = sorted[0]?.id ?? null;
    });
  }, []);

  const selectedBoard = boards.value.find((board) => board.id === selectedBoardId.value) ?? null;

  async function persist(next: Board): Promise<void> {
    error.value = null;
    boards.value = boards.value.map((board) => (board.id === next.id ? next : board));
    await updateBoard(next);
  }

  function withErrorHandling(fn: () => Board): void {
    if (!selectedBoard) return;
    try {
      void persist(fn());
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
  }

  const drag = useRowDragDrop((draggedId, targetId) => {
    if (selectedBoard) withErrorHandling(() => swapButtons(selectedBoard, draggedId, targetId));
  });

  // A folder is a new board plus a button on this board that opens it
  // (PLAN.md Phase 4: "create categories"). Capacity is checked first so a
  // full board can't leave an orphaned, unreachable folder behind.
  async function handleAddFolder(event: Event): Promise<void> {
    event.preventDefault();
    const name = newFolderName.value.trim();
    if (!selectedBoard || !name) return;
    if (!hasEmptySlot(selectedBoard)) {
      error.value = 'No empty slot on this board — resize the grid or remove a button first.';
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

  function handleAddButton(event: Event): void {
    event.preventDefault();
    if (!selectedBoard || !newLabel.value.trim()) return;
    const item: Item = {
      id: slugify(newLabel.value),
      label: newLabel.value.trim(),
      image: { kind: 'emoji', char: newEmoji.value || '⭐' },
      background_color: FITZGERALD_COLORS[newClass.value],
    };
    withErrorHandling(() => addButton(selectedBoard, item));
    newLabel.value = '';
  }

  return (
    <div class="parent-mode-screen__body">
      <label class="parent-mode-screen__board-picker">
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
                  withErrorHandling(() =>
                    resizeGrid(
                      selectedBoard,
                      Number((event.target as HTMLSelectElement).value) as GridSize,
                      selectedBoard.grid.columns,
                    ),
                  )
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
                  withErrorHandling(() =>
                    resizeGrid(
                      selectedBoard,
                      selectedBoard.grid.rows,
                      Number((event.target as HTMLSelectElement).value) as GridSize,
                    ),
                  )
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

          <ul class="parent-mode-screen__button-list">
            {selectedBoard.buttons.map((button) => (
              <li
                class={`parent-mode-screen__button-row${drag.overId.value === button.id ? ' parent-mode-screen__button-row--drop-target' : ''}`}
                key={button.id}
                onDragOver={(event) => drag.over(event, button.id)}
                onDrop={(event) => drag.drop(event, button.id)}
              >
                <span
                  class="parent-mode-screen__drag-handle"
                  draggable
                  role="img"
                  aria-label={`Drag ${button.label} to swap places with another button`}
                  onDragStart={(event) => drag.start(event, button.id)}
                  onDragEnd={() => drag.end()}
                >
                  ⠿
                </span>
                <input
                  class="parent-mode-screen__label-input"
                  type="text"
                  value={button.label}
                  onInput={(event) =>
                    withErrorHandling(() =>
                      updateButtonLabel(selectedBoard, button.id, (event.target as HTMLInputElement).value),
                    )
                  }
                />
                <label class="parent-mode-screen__hidden-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(button.hidden)}
                    onChange={() => withErrorHandling(() => toggleButtonHidden(selectedBoard, button.id))}
                  />
                  Hidden
                </label>
                <button
                  type="button"
                  class="parent-mode-screen__move-button"
                  onClick={() => withErrorHandling(() => moveButton(selectedBoard, button.id, 'up'))}
                  aria-label={`Move ${button.label} earlier`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  class="parent-mode-screen__move-button"
                  onClick={() => withErrorHandling(() => moveButton(selectedBoard, button.id, 'down'))}
                  aria-label={`Move ${button.label} later`}
                >
                  ▼
                </button>
              </li>
            ))}
          </ul>

          <form class="parent-mode-screen__add-form" onSubmit={handleAddButton}>
            <input
              class="parent-mode-screen__label-input"
              type="text"
              placeholder="New button label"
              value={newLabel.value}
              onInput={(event) => (newLabel.value = (event.target as HTMLInputElement).value)}
            />
            <input
              class="parent-mode-screen__emoji-input"
              type="text"
              value={newEmoji.value}
              onInput={(event) => (newEmoji.value = (event.target as HTMLInputElement).value)}
              aria-label="Emoji"
            />
            <select
              value={newClass.value}
              onChange={(event) => (newClass.value = (event.target as HTMLSelectElement).value as FitzgeraldClass)}
            >
              {Object.keys(FITZGERALD_COLORS).map((cls) => (
                <option value={cls} key={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <button type="submit" class="parent-mode-screen__button">
              Add button
            </button>
          </form>

          {!selectedBoard.id.startsWith('mypage-') && (
            <form class="parent-mode-screen__add-form parent-mode-screen__add-folder" onSubmit={(event) => void handleAddFolder(event)}>
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
                {Object.keys(FITZGERALD_COLORS).map((cls) => (
                  <option value={cls} key={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <button type="submit" class="parent-mode-screen__button">
                Add folder
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
