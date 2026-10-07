import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { createMyPage, deleteMyPage, getBoard, getMyPages, renameMyPage, updateBoard } from '../store/db';
import {
  addButton,
  moveButton,
  resizeGrid,
  slugify,
  swapButtons,
  toggleButtonHidden,
  updateButtonLabel,
} from './boardEditing';
import { useRowDragDrop } from './useRowDragDrop';
import { FITZGERALD_COLORS, type FitzgeraldClass } from '../ui/fitzgerald';
import type { Board, GridSize, Item, MyPage } from '../store/types';
import { VALID_GRID_SIZES } from '../store/types';

// Fully custom pages an adult builds from scratch (feature review follow-up,
// Sep 2026), separate from the Talk board tree. Page lifecycle (add, rename,
// delete) lives here; the per-page button editor reuses the same pure
// boardEditing.ts transforms BoardsTab uses, since a page's content is just
// an ordinary Board.
export function MyPagesTab() {
  const pages = useSignal<MyPage[]>([]);
  const selectedPageId = useSignal<string | null>(null);
  const board = useSignal<Board | null>(null);
  const newPageName = useSignal('');
  const renameValue = useSignal('');
  const newLabel = useSignal('');
  const newEmoji = useSignal('⭐');
  const newClass = useSignal<FitzgeraldClass>('things');
  const error = useSignal<string | null>(null);

  useEffect(() => {
    void getMyPages().then((loaded) => {
      pages.value = loaded;
      selectedPageId.value = loaded[0]?.id ?? null;
    });
  }, []);

  const selectedPage = pages.value.find((page) => page.id === selectedPageId.value) ?? null;

  useEffect(() => {
    if (!selectedPage) {
      board.value = null;
      return;
    }
    renameValue.value = selectedPage.name;
    void getBoard(selectedPage.boardId).then((loaded) => (board.value = loaded ?? null));
  }, [selectedPage?.id]);

  async function handleAddPage(event: Event): Promise<void> {
    event.preventDefault();
    if (!newPageName.value.trim()) return;
    error.value = null;
    const page = await createMyPage(newPageName.value.trim());
    newPageName.value = '';
    pages.value = [...pages.value, page];
    selectedPageId.value = page.id;
  }

  async function handleRenamePage(event: Event): Promise<void> {
    event.preventDefault();
    if (!selectedPage || !renameValue.value.trim()) return;
    const name = renameValue.value.trim();
    await renameMyPage(selectedPage.id, name);
    pages.value = pages.value.map((page) => (page.id === selectedPage.id ? { ...page, name } : page));
  }

  async function handleDeletePage(page: MyPage): Promise<void> {
    await deleteMyPage(page.id);
    const remaining = pages.value.filter((candidate) => candidate.id !== page.id);
    pages.value = remaining;
    if (selectedPageId.value === page.id) {
      selectedPageId.value = remaining[0]?.id ?? null;
    }
  }

  async function persistBoard(next: Board): Promise<void> {
    error.value = null;
    board.value = next;
    await updateBoard(next);
  }

  function withErrorHandling(fn: (current: Board) => Board): void {
    if (!board.value) return;
    try {
      void persistBoard(fn(board.value));
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
  }

  const drag = useRowDragDrop((draggedId, targetId) => {
    withErrorHandling((current) => swapButtons(current, draggedId, targetId));
  });

  function handleAddButton(event: Event): void {
    event.preventDefault();
    if (!board.value || !newLabel.value.trim()) return;
    const item: Item = {
      id: slugify(newLabel.value),
      label: newLabel.value.trim(),
      image: { kind: 'emoji', char: newEmoji.value || '⭐' },
      background_color: FITZGERALD_COLORS[newClass.value],
    };
    withErrorHandling((current) => addButton(current, item));
    newLabel.value = '';
  }

  return (
    <div class="parent-mode-screen__body my-pages-tab">
      <form class="my-pages-tab__add-page" onSubmit={(event) => void handleAddPage(event)}>
        <input
          class="parent-mode-screen__label-input"
          type="text"
          placeholder="New page name"
          value={newPageName.value}
          onInput={(event) => (newPageName.value = (event.target as HTMLInputElement).value)}
        />
        <button type="submit" class="parent-mode-screen__button">
          Add page
        </button>
      </form>

      {pages.value.length === 0 ? (
        <p class="my-pages-tab__empty">No pages yet — add one above to get started.</p>
      ) : (
        <ul class="my-pages-tab__list">
          {pages.value.map((page) => (
            <li class="my-pages-tab__list-row" key={page.id}>
              <button
                type="button"
                class="my-pages-tab__page-button"
                aria-pressed={page.id === selectedPageId.value}
                onClick={() => (selectedPageId.value = page.id)}
              >
                {page.name}
              </button>
              <button
                type="button"
                class="my-pages-tab__delete-button"
                onClick={() => void handleDeletePage(page)}
                aria-label={`Delete ${page.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {error.value && <p class="parent-mode-screen__error">{error.value}</p>}

      {selectedPage && board.value && (
        <>
          <form class="my-pages-tab__rename-form" onSubmit={(event) => void handleRenamePage(event)}>
            <label>
              Page name
              <input
                class="parent-mode-screen__label-input"
                type="text"
                value={renameValue.value}
                onInput={(event) => (renameValue.value = (event.target as HTMLInputElement).value)}
              />
            </label>
            <button type="submit" class="parent-mode-screen__button">
              Rename
            </button>
          </form>

          <div class="parent-mode-screen__grid-size">
            <span>Grid size</span>
            <label>
              rows
              <select
                value={board.value.grid.rows}
                onChange={(event) =>
                  withErrorHandling((current) =>
                    resizeGrid(
                      current,
                      Number((event.target as HTMLSelectElement).value) as GridSize,
                      current.grid.columns,
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
                value={board.value.grid.columns}
                onChange={(event) =>
                  withErrorHandling((current) =>
                    resizeGrid(
                      current,
                      current.grid.rows,
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
            {board.value.buttons.map((button) => (
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
                    withErrorHandling((current) =>
                      updateButtonLabel(current, button.id, (event.target as HTMLInputElement).value),
                    )
                  }
                />
                <label class="parent-mode-screen__hidden-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(button.hidden)}
                    onChange={() => withErrorHandling((current) => toggleButtonHidden(current, button.id))}
                  />
                  Hidden
                </label>
                <button
                  type="button"
                  class="parent-mode-screen__move-button"
                  onClick={() => withErrorHandling((current) => moveButton(current, button.id, 'up'))}
                  aria-label={`Move ${button.label} earlier`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  class="parent-mode-screen__move-button"
                  onClick={() => withErrorHandling((current) => moveButton(current, button.id, 'down'))}
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
        </>
      )}
    </div>
  );
}
