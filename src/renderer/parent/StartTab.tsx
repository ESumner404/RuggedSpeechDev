import { appleLinkSetting, getFavourites, getMyPages } from '../store/db';
import { linkPeers } from '../platform/linkStatus';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ReadyCheck } from './ReadyCheck';

type Job = { label: string; hint: string; go: string };

const JOBS: Job[] = [
  { label: 'Add a person', hint: 'A photo, a name, and where they fit in the family.', go: 'family' },
  { label: 'Change the voice', hint: 'Choose a voice and how fast it speaks.', go: 'access' },
  { label: 'Change how it looks', hint: 'Colours, pictures and text size.', go: 'look' },
  { label: 'Make a page', hint: 'Words for a place, a lesson or a routine.', go: 'mypages' },
  { label: 'Plan the day', hint: 'My Day and a weekly timetable.', go: 'myday' },
  { label: 'Add music or movies', hint: 'From this device, with no internet.', go: 'music' },
  { label: 'Link a TV or watch', hint: 'Show words on the Apple TV and Apple Watch.', go: 'access' },
  { label: 'Save a backup', hint: 'Keep photos, pages and settings safe.', go: 'backup' },
  { label: 'Read the guide', hint: 'Step-by-step help for everything.', go: 'guide' },
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

  const linkOn = appleLinkSetting.signal.value.enabled;
  const peers = linkPeers.value;
  const linkText = !linkOn
    ? 'Linking is off. Turn it on to show words on an Apple TV or Apple Watch, or to use this device as a controller.'
    : peers === 0
      ? 'Linking is on. No other device is connected yet.'
      : `Linking is on. ${peers} ${peers === 1 ? 'device is' : 'devices are'} connected.`;

  return (
    <div class="parent-mode-screen__body start-tab">
      <h2 class="start-tab__title">What would you like to do?</h2>
      <div class="start-tab__jobs">
        {JOBS.map((job) => (
          <button type="button" class="start-tab__job" key={job.label} onClick={() => go(job.go)}>
            <span class="start-tab__label">{job.label}</span>
            <span class="start-tab__hint">{job.hint}</span>
          </button>
        ))}
      </div>
      <section class="access-tab__section start-tab__link" aria-labelledby="start-link-heading">
        <h3 class="access-tab__heading" id="start-link-heading">
          Linked devices
        </h3>
        <p class="access-tab__hint" role="status">
          {linkText}
        </p>
        <button type="button" class="parent-mode-screen__button" onClick={() => go('access')}>
          {linkOn ? 'Manage linked devices' : 'Set up linking'}
        </button>
      </section>
      <ReadyCheck kind="parent" go={go} favouriteCount={favourites.value} lessonPageCount={pages.value} />
    </div>
  );
}
