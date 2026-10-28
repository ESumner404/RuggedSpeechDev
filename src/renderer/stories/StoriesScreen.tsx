import { useSignal } from '@preact/signals';
import { storiesSetting } from '../store/db';
import { announceText } from '../speech/announce';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { Pic } from '../symbols/Pic';

// My stories: pick a story, then read it a step at a time. Back, Read to me and Next stay in the same places. Nothing is read
// aloud unless Read to me is pressed.
export function StoriesScreen() {
  const stories = storiesSetting.signal.value.filter((story) => story.steps.length > 0);
  const openId = useSignal<string | null>(null);
  const step = useSignal(0);
  const story = stories.find((candidate) => candidate.id === openId.value);

  if (stories.length === 0) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">No stories yet</p>
        <p class="game-screen__empty-note">An adult can write stories in Parent Mode (My stories).</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div class="stories-screen">
        <div class="stories-screen__list">
          {stories.map((entry) => (
            <button
              type="button"
              class="stories-screen__tile"
              key={entry.id}
              onClick={() => {
                openId.value = entry.id;
                step.value = 0;
              }}
            >
              <span class="stories-screen__emoji" aria-hidden="true">
                {entry.emoji || '📖'}
              </span>
              <span class="stories-screen__title">{entry.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const current = story.steps[Math.min(step.value, story.steps.length - 1)]!;
  const last = step.value >= story.steps.length - 1;

  return (
    <div class="stories-screen stories-screen--reading">
      <p class="stories-screen__count">
        {story.title}: {step.value + 1} of {story.steps.length}
      </p>
      <div class="stories-screen__picture">
        {current.photoBlobId ? <PhotoThumbnail class="stories-screen__photo" blobId={current.photoBlobId} alt="" /> : <Pic class="stories-screen__big-emoji" char={current.emoji || '🙂'} />}
      </div>
      <p class="stories-screen__text">{current.text}</p>
      <div class="stories-screen__controls">
        <button type="button" class="stories-screen__button" disabled={step.value === 0} onClick={() => (step.value -= 1)}>
          Back
        </button>
        <button type="button" class="stories-screen__button" onClick={() => announceText(current.text, { keepInHistory: false })}>
          Read to me
        </button>
        {last ? (
          <button type="button" class="stories-screen__button" onClick={() => (openId.value = null)}>
            All stories
          </button>
        ) : (
          <button type="button" class="stories-screen__button" onClick={() => (step.value += 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
