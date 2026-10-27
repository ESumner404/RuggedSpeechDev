import { getFavourites, getMyPages } from '../store/db';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ReadyCheck } from './ReadyCheck';

type Job = { emoji: string; label: string; hint: string; go: string };

const JOBS: Job[] = [
  { emoji: '👪', label: 'Add a person', hint: 'A photo, a name, and where they fit in the family.', go: 'family' },
  { emoji: '🗣️', label: 'Change the voice', hint: 'Choose a voice and how fast it speaks.', go: 'access' },
  { emoji: '🎨', label: 'Change how it looks', hint: 'Colours, pictures and text size.', go: 'look' },
  { emoji: '📄', label: 'Make a page', hint: 'Words for a place, a lesson or a routine.', go: 'mypages' },
  { emoji: '📅', label: 'Plan the day', hint: 'My Day and a weekly timetable.', go: 'myday' },
  { emoji: '🎵', label: 'Add music or movies', hint: 'From this device, with no internet.', go: 'music' },
  { emoji: '📺', label: 'Link a TV or watch', hint: 'Show words on the Apple TV and Apple Watch.', go: 'access' },
  { emoji: '💾', label: 'Save a backup', hint: 'Keep photos, pages and settings safe.', go: 'backup' },
  { emoji: '📘', label: 'Read the guide', hint: 'Step-by-step help for everything.', go: 'guide' },
];

type Props = { go: (place: string) => void };

// The first page of Parent Mode: what to do next, in plain words, and a short check that everything is ready.
export function StartTab({ go }: Props) {
  const favourites = useSignal(0);
  const pages = useSignal(0);
  useEffect(() => {
    void getFavourites().then((items) => (favourites.value = items.length));
    void getMyPages().then((items) => (pages.value = items.length));
  }, []);

  return (
    <div class="parent-mode-screen__body start-tab">
      <h2 class="start-tab__title">What would you like to do?</h2>
      <div class="start-tab__jobs">
        {JOBS.map((job) => (
          <button type="button" class="start-tab__job" key={job.label} onClick={() => go(job.go)}>
            <span class="start-tab__emoji" aria-hidden="true">
              {job.emoji}
            </span>
            <span class="start-tab__label">{job.label}</span>
            <span class="start-tab__hint">{job.hint}</span>
          </button>
        ))}
      </div>
      <ReadyCheck kind="parent" go={go} favouriteCount={favourites.value} lessonPageCount={pages.value} />
    </div>
  );
}
