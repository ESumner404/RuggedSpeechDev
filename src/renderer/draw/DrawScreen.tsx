import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { drawingsSetting } from '../store/db';
import { BRUSH_SIZES, CANVAS_HEIGHT, CANVAS_WIDTH, DRAWING_COLOURS, MAX_KEPT_DRAWINGS, UNDO_LIMIT } from './palette';

// Draw: a blank page, some colours, three brush sizes. Nothing here speaks,
// scores or times anything, and nothing is judged: it is somewhere to make a
// picture. A child can keep a picture, and look at the pictures they kept.
// Pictures stay on this computer, and only leave in a backup an adult saves.
export function DrawScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colour = useSignal(DRAWING_COLOURS[0]!.value);
  const brush = useSignal<number>(BRUSH_SIZES[1].width);
  const showKept = useSignal(false);
  const openKept = useSignal<number | null>(null);
  const message = useSignal('');
  // Where the next pointer move should carry on from, while a finger or the
  // mouse is down.
  const last = useRef<{ x: number; y: number } | null>(null);
  // The picture before each stroke, so each can be undone.
  const history = useRef<ImageData[]>([]);
  const undoCount = useSignal(0);

  function context(): CanvasRenderingContext2D | null {
    return canvasRef.current?.getContext('2d') ?? null;
  }

  function clearToWhite(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  function rememberForUndo(): void {
    const ctx = context();
    if (!ctx) return;
    history.current.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
    if (history.current.length > UNDO_LIMIT) history.current.shift();
    undoCount.value = history.current.length;
  }

  useEffect(() => {
    const ctx = context();
    if (ctx) clearToWhite(ctx);
  }, []);

  function position(event: PointerEvent): { x: number; y: number } {
    const box = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * CANVAS_WIDTH,
      y: ((event.clientY - box.top) / box.height) * CANVAS_HEIGHT,
    };
  }

  function strokeTo(point: { x: number; y: number }): void {
    const ctx = context();
    const from = last.current;
    if (!ctx || !from) return;
    ctx.strokeStyle = colour.value;
    ctx.lineWidth = brush.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    // A zero-length line is drawn as a dot because of the round caps.
    ctx.lineTo(point.x + 0.01, point.y);
    ctx.stroke();
    last.current = point;
  }

  function down(event: PointerEvent): void {
    if (!context()) return;
    event.preventDefault();
    (event.currentTarget as HTMLCanvasElement).setPointerCapture?.(event.pointerId);
    rememberForUndo();
    message.value = '';
    last.current = position(event);
    strokeTo(last.current);
  }

  function move(event: PointerEvent): void {
    if (!last.current) return;
    event.preventDefault();
    strokeTo(position(event));
  }

  function up(): void {
    last.current = null;
  }

  function undo(): void {
    const ctx = context();
    const previous = history.current.pop();
    if (ctx && previous) ctx.putImageData(previous, 0, 0);
    undoCount.value = history.current.length;
    message.value = '';
  }

  // Starting again can itself be undone, so it never loses a picture by accident.
  function startAgain(): void {
    const ctx = context();
    if (!ctx) return;
    rememberForUndo();
    clearToWhite(ctx);
    openKept.value = null;
    message.value = '';
  }

  async function keep(): Promise<void> {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const kept = drawingsSetting.signal.value;
    if (kept.length >= MAX_KEPT_DRAWINGS) {
      message.value = 'There is no room for another picture. Open one in My pictures and throw it away first.';
      return;
    }
    await drawingsSetting.set([...kept, canvas.toDataURL('image/png')]);
    openKept.value = kept.length;
    message.value = 'Kept.';
  }

  function open(index: number): void {
    const ctx = context();
    const url = drawingsSetting.signal.value[index];
    if (!ctx || !url) return;
    const image = new Image();
    image.onload = () => {
      rememberForUndo();
      clearToWhite(ctx);
      ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    };
    image.src = url;
    openKept.value = index;
    showKept.value = false;
    message.value = '';
  }

  async function throwAway(): Promise<void> {
    const index = openKept.value;
    if (index === null) return;
    await drawingsSetting.set(drawingsSetting.signal.value.filter((_, i) => i !== index));
    openKept.value = null;
    message.value = 'Thrown away.';
  }

  const kept = drawingsSetting.signal.value;

  return (
    <div class="draw-screen">
      {showKept.value && (
        <div class="draw-screen__kept">
          <h1 class="draw-screen__title">My pictures</h1>
          {kept.length === 0 ? (
            <p class="draw-screen__empty">No pictures kept yet.</p>
          ) : (
            <div class="draw-screen__thumbs">
              {kept.map((url, index) => (
                <button
                  type="button"
                  class="draw-screen__thumb"
                  key={index}
                  aria-label={`Open picture ${index + 1}`}
                  onClick={() => open(index)}
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
          <button type="button" class="draw-screen__button" onClick={() => (showKept.value = false)}>
            Back to drawing
          </button>
        </div>
      )}
      {/* The page stays where it is, only hidden, while the kept pictures are shown, so what is being drawn is not lost. */}
      <div class="draw-screen__work" hidden={showKept.value}>
        <canvas
          ref={canvasRef}
          class="draw-screen__canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-label="Drawing page"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        />
        <div class="draw-screen__tools">
          <div class="draw-screen__colours" role="group" aria-label="Colours">
            {DRAWING_COLOURS.map((entry) => (
              <button
                type="button"
                key={entry.value}
                class={`draw-screen__colour${colour.value === entry.value ? ' draw-screen__colour--chosen' : ''}`}
                style={{ background: entry.value }}
                aria-label={entry.name}
                aria-pressed={colour.value === entry.value}
                onClick={() => (colour.value = entry.value)}
              />
            ))}
          </div>
          <div class="draw-screen__sizes" role="group" aria-label="Brush size">
            {BRUSH_SIZES.map((size) => (
              <button
                type="button"
                key={size.name}
                class={`draw-screen__size${brush.value === size.width ? ' draw-screen__size--chosen' : ''}`}
                aria-label={size.name}
                aria-pressed={brush.value === size.width}
                onClick={() => (brush.value = size.width)}
              >
                <span class="draw-screen__dot" style={{ width: `${size.width}px`, height: `${size.width}px` }} />
              </button>
            ))}
          </div>
          <div class="draw-screen__actions">
            <button type="button" class="draw-screen__button" onClick={undo} disabled={undoCount.value === 0}>
              Undo
            </button>
            <button type="button" class="draw-screen__button" onClick={startAgain}>
              Start again
            </button>
            <button type="button" class="draw-screen__button" onClick={() => void keep()}>
              Keep
            </button>
            <button type="button" class="draw-screen__button" onClick={() => (showKept.value = true)}>
              My pictures
            </button>
            {openKept.value !== null && (
              <button type="button" class="draw-screen__button" onClick={() => void throwAway()}>
                Throw this one away
              </button>
            )}
          </div>
        </div>
        <p class="draw-screen__message" role="status">
          {message.value}
        </p>
      </div>
    </div>
  );
}
