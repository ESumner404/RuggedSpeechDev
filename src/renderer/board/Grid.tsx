import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import type { Board, Item } from '../store/types';
import { BoardButton } from './BoardButton';
import { DEFAULT_ACCESS_SETTINGS, accessSettingsVersion, getAccessSettings, wordStageSetting } from '../store/db';
import { isItemShown } from './visibility';
import {
  advanceScan,
  gridScanningActive,
  initialScanPhase,
  selectScan,
  type GridShape,
  type ScanPhase,
} from '../access/scanning';
import { moveFocus, type Direction } from '../access/gridNavigation';

// A control outside the board grid itself (e.g. Talk's Speak button) that
// still needs to be reachable by the same two inputs, otherwise switch
// scanning could build a sentence but never actually speak it.
export type AuxiliaryControl = { label: string; onActivate: () => void };

type Props = {
  board: Board;
  onPress: (item: Item) => void;
  auxiliaryControls?: AuxiliaryControl[];
};

const ARROW_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

// Every cell in board.grid.order gets a slot, filled or not, grids never
// reflow to fill gaps (invariant I3). A button's row/column is data, not a
// layout side-effect of how many buttons happen to exist right now. That
// same fixed shape is what switch scanning and arrow-key navigation
// (docs/build-plan.md Phase 7) sweep over.
export function Grid({ board, onPress, auxiliaryControls = [] }: Props) {
  // Reading the signal here means the board follows a change of word stage
  // made in Parent Mode without needing to be reopened.
  const wordStage = wordStageSetting.signal.value;
  const itemsById = new Map(board.buttons.map((button) => [button.id, button]));

  // The auxiliary row is one past the board's own rows, scanned as if it
  // were just another row, so Speak (etc.) is reachable without ever
  // leaving the same Space/Enter scan sweep the board itself uses.
  const auxRow = board.grid.rows;
  const hasAux = auxiliaryControls.length > 0;

  function isSelectable(row: number, column: number): boolean {
    if (hasAux && row === auxRow) return column < auxiliaryControls.length;
    const cellId = board.grid.order[row]?.[column];
    const item = cellId ? itemsById.get(cellId) : undefined;
    return Boolean(item) && isItemShown(item!, wordStage);
  }

  function firstSelectableCell(): { row: number; column: number } {
    for (let r = 0; r < board.grid.rows; r += 1) {
      for (let c = 0; c < board.grid.columns; c += 1) {
        if (isSelectable(r, c)) return { row: r, column: c };
      }
    }
    return { row: 0, column: 0 };
  }

  const shape: GridShape = {
    rows: board.grid.rows + (hasAux ? 1 : 0),
    columns: Math.max(board.grid.columns, auxiliaryControls.length),
    isSelectable,
  };

  const access = useSignal(DEFAULT_ACCESS_SETTINGS);
  const scanPhase = useSignal<ScanPhase | null>(null);
  const focusCell = useSignal<{ row: number; column: number }>(firstSelectableCell());
  const lastActivated = useRef<Map<string, number>>(new Map());

  const accessVersion = accessSettingsVersion.value;
  useEffect(() => {
    void getAccessSettings().then((settings) => (access.value = settings));
  }, [accessVersion]);

  function wrappedPress(item: Item): void {
    if (access.value.repeatSuppressMs > 0) {
      const now = Date.now();
      const last = lastActivated.current.get(item.id) ?? 0;
      if (now - last < access.value.repeatSuppressMs) return;
      lastActivated.current.set(item.id, now);
    }
    onPress(item);
  }

  function activateCell(row: number, column: number): void {
    if (hasAux && row === auxRow) {
      auxiliaryControls[column]?.onActivate();
      return;
    }
    const cellId = board.grid.order[row]?.[column];
    const item = cellId ? itemsById.get(cellId) : undefined;
    if (item && isItemShown(item, wordStage)) wrappedPress(item);
  }

  // Switch scanning (docs/build-plan.md Phase 7): Space and Enter so any
  // keyboard-emulating switch interface works, whichever mode is active.
  // One-switch timed has only Space, auto-advancing on a timer; two-switch
  // stepped uses Space to advance and Enter to select.
  useEffect(() => {
    if (access.value.scanningMode === 'off') {
      scanPhase.value = null;
      return;
    }
    scanPhase.value = initialScanPhase(shape);
    gridScanningActive.count += 1;

    function handleSelect(): void {
      if (!scanPhase.value) return;
      const result = selectScan(scanPhase.value, shape);
      if (result.kind === 'activate') {
        activateCell(result.row, result.column);
        scanPhase.value = initialScanPhase(shape);
      } else {
        scanPhase.value = result.phase;
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (!scanPhase.value) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (access.value.scanningMode === 'oneSwitchTimed') {
          handleSelect();
        } else {
          scanPhase.value = advanceScan(scanPhase.value, shape);
        }
      } else if (event.code === 'Enter' && access.value.scanningMode === 'twoSwitchStepped') {
        event.preventDefault();
        handleSelect();
      }
    }

    // Capture phase: switch hardware fires plain key events that may not
    // target a specific focused element, and this must win over any
    // native Enter/Space-activates-focused-button behaviour.
    document.addEventListener('keydown', handleKeyDown, true);

    let interval: number | undefined;
    if (access.value.scanningMode === 'oneSwitchTimed') {
      interval = window.setInterval(() => {
        if (scanPhase.value) scanPhase.value = advanceScan(scanPhase.value, shape);
      }, access.value.scanIntervalMs);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      if (interval !== undefined) clearInterval(interval);
      gridScanningActive.count -= 1;
    };
  }, [access.value.scanningMode, access.value.scanIntervalMs, board]);

  // External keyboard navigation (docs/build-plan.md Phase 7): a roving tabindex, off
  // while scanning owns Space/Enter instead.
  useEffect(() => {
    if (access.value.scanningMode !== 'off') return;
    if (!isSelectable(focusCell.value.row, focusCell.value.column)) {
      focusCell.value = firstSelectableCell();
    }
  }, [access.value.scanningMode, board]);

  useEffect(() => {
    if (access.value.scanningMode !== 'off') return;
    const cellId = board.grid.order[focusCell.value.row]?.[focusCell.value.column];
    if (cellId) document.getElementById(`board-button-${cellId}`)?.focus();
  }, [focusCell.value, access.value.scanningMode, board]);

  function handleGridKeyDown(event: KeyboardEvent): void {
    if (access.value.scanningMode !== 'off') return;
    const direction = ARROW_DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault();
    focusCell.value = moveFocus(focusCell.value, direction, shape);
  }

  function scanHighlightFor(row: number, column: number): 'row' | 'cell' | null {
    const phase = scanPhase.value;
    if (!phase) return null;
    if (phase.kind === 'row') return phase.row === row ? 'row' : null;
    return phase.row === row && phase.column === column ? 'cell' : null;
  }

  function scanStatusText(): string {
    const phase = scanPhase.value;
    if (!phase) return '';
    if (phase.kind === 'row') {
      return phase.row === auxRow ? 'Scanning: more controls' : `Scanning row ${phase.row + 1}`;
    }
    if (phase.column === 'back') return 'Back to rows';
    if (phase.row === auxRow) {
      return `Scanning: ${auxiliaryControls[phase.column]?.label ?? ''}`;
    }
    const cellId = board.grid.order[phase.row]?.[phase.column];
    const item = cellId ? itemsById.get(cellId) : undefined;
    return item ? `Scanning: ${item.label}` : '';
  }

  return (
    <div class="board-grid-wrapper">
      {access.value.scanningMode !== 'off' && (
        <p class="board-grid__scan-status" role="status" aria-live="polite">
          {scanStatusText()}
        </p>
      )}
      <div
        class="board-grid"
        style={{
          gridTemplateRows: `repeat(${board.grid.rows}, minmax(min-content, 1fr))`,
          gridTemplateColumns: `repeat(${board.grid.columns}, 1fr)`,
        }}
        onKeyDown={handleGridKeyDown}
      >
        {board.grid.order.map((row, rowIndex) =>
          row.map((cellId, columnIndex) => {
            const found = cellId ? itemsById.get(cellId) : undefined;
            // A hidden button, or one whose word stage hasn't been reached,
            // leaves its slot empty rather than closing the gap, it must not
            // reshuffle every other button's position (invariant I3).
            const item = found && isItemShown(found, wordStage) ? found : undefined;
            const key = `${rowIndex}-${columnIndex}`;
            if (!item) return <div class="board-grid__empty" key={key} />;
            return (
              <BoardButton
                key={key}
                item={item}
                onPress={wrappedPress}
                dwellMs={access.value.dwellMs}
                lowArousal={access.value.lowArousalPalette}
                scanHighlight={scanHighlightFor(rowIndex, columnIndex)}
                tabIndex={
                  access.value.scanningMode !== 'off'
                    ? -1
                    : rowIndex === focusCell.value.row && columnIndex === focusCell.value.column
                      ? 0
                      : -1
                }
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
