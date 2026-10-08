import { firstThenSetting } from '../store/db';
import { announceText } from '../speech/announce';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { modeName } from '../ui/modeName';
import type { FirstThenCard } from '../store/types';

// First and Then: a two-step visual support. What to do now, and what comes
// after it. An adult sets it up (My Day tab) and adds First / Then to the
// Quick Access bar. The child can press either card to hear it, and press
// "First is finished" to move on: that state change is just a tick and a
// highlight, never an animation (PRINCIPLES.md section 8).
export function FirstThenScreen() {
  const { first, then, firstDone } = firstThenSetting.signal.value;

  if (!first.label.trim() || !then.label.trim()) {
    return (
      <div class="first-then-screen first-then-screen--empty">
        <p class="first-then-screen__empty-title">Nothing here yet</p>
        <p class="first-then-screen__empty-note">An adult can set up First and Then in {modeName()} (My Day).</p>
      </div>
    );
  }

  function finishFirst(): void {
    void firstThenSetting.set({ first, then, firstDone: true });
    announceText(`All done. Now ${then.label}`);
  }

  function startAgain(): void {
    void firstThenSetting.set({ first, then, firstDone: false });
  }

  function card(kind: 'first' | 'then', data: FirstThenCard, state: 'now' | 'done' | 'later') {
    return (
      <button
        type="button"
        class={`first-then-card first-then-card--${kind} first-then-card--${state}`}
        onClick={() => announceText(kind === 'first' ? `First, ${data.label}` : `Then, ${data.label}`)}
        aria-label={`${kind === 'first' ? 'First' : 'Then'}: ${data.label}${state === 'done' ? ', finished' : ''}`}
      >
        <span class="first-then-card__heading">{kind === 'first' ? 'First' : 'Then'}</span>
        {data.photoBlobId ? (
          <PhotoThumbnail class="first-then-card__photo" blobId={data.photoBlobId} alt="" />
        ) : (
          data.emoji && (
            <span class="first-then-card__emoji" aria-hidden="true">
              {data.emoji}
            </span>
          )
        )}
        <span class="first-then-card__label">{data.label}</span>
        {state === 'done' && (
          <span class="first-then-card__tick" aria-hidden="true">
            ✓ Done
          </span>
        )}
      </button>
    );
  }

  return (
    <div class="first-then-screen">
      <div class="first-then-screen__cards">
        {card('first', first, firstDone ? 'done' : 'now')}
        {card('then', then, firstDone ? 'now' : 'later')}
      </div>
      <div class="first-then-screen__actions">
        {firstDone ? (
          <button type="button" class="first-then-screen__button" onClick={startAgain}>
            Start again
          </button>
        ) : (
          <button type="button" class="first-then-screen__button" onClick={finishFirst}>
            First is finished
          </button>
        )}
      </div>
    </div>
  );
}
