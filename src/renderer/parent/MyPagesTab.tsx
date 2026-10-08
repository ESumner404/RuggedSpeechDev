import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { createMyPage, deleteMyPage, getBoard, getMyPages, renameMyPage, updateBoard } from '../store/db';
import { resizeGrid } from './boardEditing';
import {
  createPageWithButtons,
  exportMyPageText,
  importMyPageFromText,
  suggestedPageFileName,
} from '../store/pages';
import { PAGE_TEMPLATES } from '../vocab/pageTemplates';
import { AddButtonForm } from './AddButtonForm';
import { ButtonList } from './ButtonList';
import type { Board, GridSize, MyPage } from '../store/types';
import { VALID_GRID_SIZES } from '../store/types';

// Fully custom pages an adult builds from scratch (feature review follow-up,
// Sep 2026), separate from the Talk board tree. Page lifecycle (add, rename,
// delete) lives here; the button editor is the same one the Boards tab uses,
// since a page's content is just an ordinary Board.
export function MyPagesTab() {
  const pages = useSignal<MyPage[]>([]);
  const selectedPageId = useSignal<string | null>(null);
  const board = useSignal<Board | null>(null);
  const newPageName = useSignal('');
  const renameValue = useSignal('');
  const error = useSignal<string | null>(null);
  const shareMessage = useSignal<string | null>(null);
  const templateId = useSignal(PAGE_TEMPLATES[0]!.id);

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

  // Sharing a page is an explicit file the adult saves and hands over (the
  // same rule as backup, invariant I2): nothing is sent anywhere.
  async function handleShare(page: MyPage): Promise<void> {
    shareMessage.value = null;
    const text = await exportMyPageText(page);
    if (text === null) return;
    const result = await window.myWords.files.save(text, {
      suggestedName: suggestedPageFileName(page),
      filterName: 'Shared page (Open Board Format)',
      extensions: ['obf'],
    });
    shareMessage.value = result.ok ? `Saved “${page.name}” as a file you can give to another device.` : null;
  }

  async function handleUseTemplate(): Promise<void> {
    const template = PAGE_TEMPLATES.find((candidate) => candidate.id === templateId.value);
    if (!template) return;
    error.value = null;
    const page = await createPageWithButtons(template.name, template.buttons);
    pages.value = [...pages.value, page];
    selectedPageId.value = page.id;
    shareMessage.value = `Made the page “${template.name}”. Change anything to suit.`;
  }

  async function handleAddShared(): Promise<void> {
    shareMessage.value = null;
    error.value = null;
    const file = await window.myWords.files.open({
      filterName: 'Shared page (Open Board Format)',
      extensions: ['obf'],
    });
    if (!file.ok) return;
    const result = await importMyPageFromText(file.data);
    if (!result.ok) {
      error.value = result.error;
      return;
    }
    pages.value = [...pages.value, result.page];
    selectedPageId.value = result.page.id;
    shareMessage.value = `Added “${result.page.name}” as a new page.${result.notes.length ? ' ' + result.notes.join(' ') : ''}`;
  }

  async function persistBoard(next: Board): Promise<void> {
    error.value = null;
    board.value = next;
    await updateBoard(next);
  }

  function resize(rows: GridSize, columns: GridSize): void {
    if (!board.value) return;
    try {
      void persistBoard(resizeGrid(board.value, rows, columns));
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
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

      <div class="my-pages-tab__template">
        <label>
          Start from a ready-made page
          <select
            value={templateId.value}
            onChange={(event) => (templateId.value = (event.target as HTMLSelectElement).value)}
          >
            {PAGE_TEMPLATES.map((template) => (
              <option value={template.id} key={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" class="parent-mode-screen__button" onClick={() => void handleUseTemplate()}>
          Make this page
        </button>
        <span class="my-pages-tab__share-hint">
          {PAGE_TEMPLATES.find((template) => template.id === templateId.value)?.description} It becomes an
          ordinary page you can change.
        </span>
      </div>

      <div class="my-pages-tab__share">
        <button type="button" class="parent-mode-screen__button" onClick={() => void handleAddShared()}>
          Add a shared page…
        </button>
        <span class="my-pages-tab__share-hint">
          Opens a page someone saved from this app or another that uses Open Board Format. It is always added as
          a new page.
        </span>
      </div>
      {shareMessage.value && (
        <p class="my-pages-tab__share-message" role="status">
          {shareMessage.value}
        </p>
      )}

      {pages.value.length === 0 ? (
        <p class="my-pages-tab__empty">No pages yet. Add one above to get started.</p>
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
            <button type="button" class="parent-mode-screen__button" onClick={() => void handleShare(selectedPage)}>
              Share this page…
            </button>
          </form>

          <div class="parent-mode-screen__grid-size">
            <span>Grid size</span>
            <label>
              rows
              <select
                value={board.value.grid.rows}
                onChange={(event) =>
                  resize(Number((event.target as HTMLSelectElement).value) as GridSize, board.value!.grid.columns)
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
                  resize(board.value!.grid.rows, Number((event.target as HTMLSelectElement).value) as GridSize)
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

          <ButtonList board={board.value} onChange={(next) => void persistBoard(next)} />

          <AddButtonForm
            board={board.value}
            onChange={(next) => void persistBoard(next)}
            onError={(message) => (error.value = message)}
          />
        </>
      )}
    </div>
  );
}
