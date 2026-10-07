import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import type { Item } from '../store/types';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { resolveBackgroundColor } from '../ui/fitzgerald';
import { preferredSpeechPitch, preferredSpeechRate, preferredVoiceURI, saveFavourite } from '../store/db';
import { speak } from '../speech/speak';

type ScanHighlight = 'row' | 'cell' | null;

// Feature review, Aug 2026: "add a long-press action on any button to add
// to Favourites so it works from anywhere in the app". Deliberately a
// separate gesture from hold-to-select dwell (Phase 7) — dwell activates
// on hover for switch/gaze input, this activates on a held pointer-down
// for touch/mouse, and the two never fire from the same event pair.
const LONG_PRESS_MS = 700;

type Props = {
  item: Item;
  onPress: (item: Item) => void;
  // Hold-to-select (PLAN.md Phase 7): 0 means off, activating immediately
  // on click as before. Above 0, click is ignored and activation happens
  // only once the pointer or keyboard focus has dwelled here this long —
  // dwell replaces click rather than racing it, since a touch tap would
  // otherwise fire click before the timer ever gets a chance to complete.
  dwellMs?: number;
  // Set by Grid while switch scanning is active; not a normal focus state.
  scanHighlight?: ScanHighlight;
  tabIndex?: number;
  lowArousal?: boolean;
};

export function BoardButton({
  item,
  onPress,
  dwellMs = 0,
  scanHighlight = null,
  tabIndex,
  lowArousal = false,
}: Props) {
  const dwelling = useSignal(false);
  const timerRef = useRef<number | null>(null);
  const longPressing = useSignal(false);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);

  function clearDwell(): void {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dwelling.value = false;
  }

  function startDwell(): void {
    if (dwellMs <= 0) return;
    dwelling.value = true;
    timerRef.current = window.setTimeout(() => {
      dwelling.value = false;
      onPress(item);
    }, dwellMs);
  }

  function clearLongPress(): void {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressing.value = false;
  }

  function startLongPress(): void {
    clearLongPress();
    longPressFiredRef.current = false;
    longPressing.value = true;
    longPressTimerRef.current = window.setTimeout(() => {
      longPressing.value = false;
      longPressFiredRef.current = true;
      void saveFavourite(item);
      speak('Added to Favourites', {
        rate: preferredSpeechRate.value,
        pitch: preferredSpeechPitch.value,
        ...(preferredVoiceURI.value ? { voiceURI: preferredVoiceURI.value } : {}),
      });
    }, LONG_PRESS_MS);
  }

  function handleClick(): void {
    // The long press already handled this press — a held-then-released
    // pointer still fires a native click, which must not also add the
    // word to the sentence on top of favouriting it.
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (dwellMs > 0) return;
    onPress(item);
  }

  // A pending timer must not fire after this button is gone — navigating
  // to a different board mid-gesture should not act on whatever used to
  // be under the pointer.
  useEffect(() => {
    return () => {
      clearDwell();
      clearLongPress();
    };
  }, [item.id]);

  const classes = [
    'board-button',
    scanHighlight === 'row' && 'board-button--scan-row',
    scanHighlight === 'cell' && 'board-button--scan-cell',
    dwelling.value && 'board-button--dwelling',
    longPressing.value && 'board-button--long-pressing',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      id={`board-button-${item.id}`}
      class={classes}
      style={{ backgroundColor: resolveBackgroundColor(item.background_color, lowArousal) }}
      onClick={handleClick}
      onPointerEnter={startDwell}
      onPointerLeave={() => {
        clearDwell();
        clearLongPress();
      }}
      onPointerDown={startLongPress}
      onPointerUp={clearLongPress}
      onFocus={startDwell}
      onBlur={clearDwell}
      {...(item.load_board ? { 'aria-label': `${item.label}, opens more` } : {})}
      {...(tabIndex !== undefined ? { tabIndex } : {})}
    >
      {item.image?.kind === 'emoji' && (
        <span class="board-button__emoji" aria-hidden="true">
          {item.image.char}
        </span>
      )}
      {item.image?.kind === 'photo' && (
        <PhotoThumbnail class="board-button__photo" blobId={item.image.blobId} alt="" />
      )}
      <span class="board-button__label">{item.label}</span>
    </button>
  );
}
