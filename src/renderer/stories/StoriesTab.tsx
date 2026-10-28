import { useSignal } from '@preact/signals';
import { savePhoto, storiesSetting } from '../store/db';
import { PhotoCapture } from '../parent/PhotoCapture';
import { PhotoThumbnail } from '../ui/PhotoThumbnail';
import { MAX_STEPS, MAX_STORIES, STARTER_STORIES, moveStep, newStep, newStory, storyFromStarter, type Story, type StoryStep } from './stories';

// Write the stories a child reads in My stories. A step is a sentence in plain words, with a picture. Photos stay on this device.
export function StoriesTab() {
  const stories = storiesSetting.signal.value;
  const title = useSignal('');
  const message = useSignal('');

  const save = (next: Story[]): void => void storiesSetting.set(next);
  const change = (id: string, changes: Partial<Story>): void => save(stories.map((story) => (story.id === id ? { ...story, ...changes } : story)));
  const changeStep = (story: Story, stepId: string, changes: Partial<StoryStep>): void =>
    change(story.id, { steps: story.steps.map((step) => (step.id === stepId ? { ...step, ...changes } : step)) });

  function add(): void {
    if (!title.value.trim() || stories.length >= MAX_STORIES) return;
    save([...stories, newStory(title.value)]);
    title.value = '';
  }

  function addStarter(index: number): void {
    const story = storyFromStarter(index);
    if (!story || stories.length >= MAX_STORIES) return;
    save([...stories, story]);
    message.value = `Added “${story.title}”. Change the words to suit the child and the place.`;
  }

  async function setPhoto(story: Story, step: StoryStep, blob: Blob): Promise<void> {
    changeStep(story, step.id, { photoBlobId: await savePhoto(blob) });
  }

  return (
    <div class="parent-mode-screen__body stories-tab">
      <p class="about-tab__hint">
        Short stories that get a child ready for something: the dentist, a haircut, a fire drill. Write each step as a plain, kind
        sentence in the first person ("I sit in a big chair"), with a picture. The child reads one a step at a time and presses to
        hear it. Put <strong>My stories</strong> on the top bar in <strong>Quick Access</strong>.
      </p>
      <div class="stories-tab__add">
        <label>
          New story
          <input type="text" value={title.value} placeholder="Going to the dentist" onInput={(event) => (title.value = (event.target as HTMLInputElement).value)} />
        </label>
        <button type="button" class="parent-mode-screen__button" disabled={!title.value.trim()} onClick={add}>
          Add story
        </button>
      </div>
      <details>
        <summary>Starting points</summary>
        <p class="about-tab__hint">Written to be gentle and plain. Change them to suit the child, and have them read by someone who knows the child.</p>
        <div class="stories-tab__starters">
          {STARTER_STORIES.map((starter, index) => (
            <button type="button" class="parent-mode-screen__button" key={starter.title} onClick={() => addStarter(index)}>
              {starter.emoji} {starter.title}
            </button>
          ))}
        </div>
      </details>
      {message.value && <p role="status">{message.value}</p>}
      {stories.map((story) => (
        <section class="stories-tab__story" key={story.id}>
          <div class="stories-tab__head">
            <input class="parent-mode-screen__emoji-input" type="text" aria-label={`Emoji for ${story.title}`} value={story.emoji} onInput={(event) => change(story.id, { emoji: (event.target as HTMLInputElement).value })} />
            <input type="text" aria-label="Title" value={story.title} onInput={(event) => change(story.id, { title: (event.target as HTMLInputElement).value })} />
            <button type="button" class="parent-mode-screen__button" aria-label={`Delete ${story.title}`} onClick={() => save(stories.filter((other) => other.id !== story.id))}>
              Delete story
            </button>
          </div>
          <ol class="stories-tab__steps">
            {story.steps.map((step, index) => (
              <li key={step.id}>
                <div class="stories-tab__step">
                  {step.photoBlobId ? <PhotoThumbnail class="stories-tab__thumb" blobId={step.photoBlobId} alt="" /> : null}
                  <input class="parent-mode-screen__emoji-input" type="text" aria-label="Emoji" value={step.emoji} onInput={(event) => changeStep(story, step.id, { emoji: (event.target as HTMLInputElement).value })} />
                  <input class="stories-tab__text" type="text" aria-label={`Step ${index + 1}`} value={step.text} onInput={(event) => changeStep(story, step.id, { text: (event.target as HTMLInputElement).value })} />
                  <button type="button" class="parent-mode-screen__move-button" aria-label={`Move step ${index + 1} earlier`} disabled={index === 0} onClick={() => change(story.id, { steps: moveStep(story.steps, index, -1) })}>
                    ▲
                  </button>
                  <button type="button" class="parent-mode-screen__move-button" aria-label={`Move step ${index + 1} later`} disabled={index === story.steps.length - 1} onClick={() => change(story.id, { steps: moveStep(story.steps, index, 1) })}>
                    ▼
                  </button>
                  <button type="button" class="parent-mode-screen__button" aria-label={`Delete step ${index + 1}`} onClick={() => change(story.id, { steps: story.steps.filter((other) => other.id !== step.id) })}>
                    Delete
                  </button>
                </div>
                <details>
                  <summary>Photo</summary>
                  <PhotoCapture onCapture={(blob) => void setPhoto(story, step, blob)} />
                </details>
              </li>
            ))}
          </ol>
          <button type="button" class="parent-mode-screen__button" disabled={story.steps.length >= MAX_STEPS} onClick={() => change(story.id, { steps: [...story.steps, newStep()] })}>
            Add a step
          </button>
        </section>
      ))}
    </div>
  );
}
