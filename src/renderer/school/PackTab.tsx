import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getMyPages, pendingPacksSetting, schoolInfoSetting, weeklyRoutineSetting, type PendingPack } from '../store/db';
import { exportMyPageText } from '../store/pages';
import type { MyPage } from '../store/types';
import { applyPackHere, planPackHere } from './applyPack';
import { buildPack, parsePack, type PackPlan, type SchoolPack } from './pack';

type Preview = { id: string; pack: SchoolPack; plan: PackPlan };

const describe = (plan: PackPlan, pack: SchoolPack): string[] => {
  const lines: string[] = [];
  if (plan.addPages.length > 0) lines.push(`Adds ${plan.addPages.length} lesson ${plan.addPages.length === 1 ? 'page' : 'pages'}: ${plan.addPages.join(', ')}.`);
  if (plan.skipPages.length > 0) lines.push(`Already here, so left as they are: ${plan.skipPages.join(', ')}.`);
  if (plan.addRoutine) lines.push('Adds the timetable (there is none here yet).');
  if (plan.skipRoutine) lines.push('The pack has a timetable, but there is one here already, so it is left alone.');
  if (plan.fillInfo.length > 0) lines.push(`Fills in ${plan.fillInfo.length} blank school ${plan.fillInfo.length === 1 ? 'detail' : 'details'}.`);
  if (lines.length === 0) lines.push(`Nothing new: everything in “${pack.name}” is here already.`);
  return lines;
};

// School pack: hand a school's lesson pages, timetable and details to many pupils' devices at once, one way. A pack
// holds nothing about any child, a pupil's device never sends anything back, and nothing is ever added unless an adult
// looks at what is in it and chooses to.
export function PackTab() {
  const school = window.myWords?.school;
  const pages = useSignal<MyPage[]>([]);
  const chosen = useSignal<Set<string>>(new Set());
  const name = useSignal('');
  const withTimetable = useSignal(true);
  const withInfo = useSignal(true);
  const message = useSignal('');
  const code = useSignal('');
  const mode = useSignal<'' | 'sender' | 'listener'>('');
  const peers = useSignal(0);
  const previews = useSignal<Preview[]>([]);
  const pending = pendingPacksSetting.signal.value;

  useEffect(() => {
    void getMyPages().then((found) => {
      pages.value = found;
      chosen.value = new Set(found.map((page) => page.id));
    });
  }, []);

  useEffect(() => {
    void Promise.all(
      pending.map(async (entry) => {
        const parsed = parsePack(entry.text);
        return parsed.ok ? { id: entry.id, pack: parsed.pack, plan: await planPackHere(parsed.pack) } : null;
      }),
    ).then((found) => (previews.value = found.filter((item): item is Preview => item !== null)));
  }, [pending]);

  // The live link is only on while this page is open, and is stopped when it is closed.
  useEffect(() => {
    if (!school || !mode.value || !/^\d{4}$/.test(code.value)) return undefined;
    void school.start(mode.value, code.value);
    const timer = window.setInterval(() => {
      void school.inbox().then(async ({ messages, peers: count }) => {
        peers.value = count;
        for (const text of messages) await receive(text);
      });
    }, 800);
    return () => {
      window.clearInterval(timer);
      void school.stop();
      peers.value = 0;
    };
  }, [mode.value, code.value]);

  async function receive(text: string): Promise<void> {
    const parsed = parsePack(text);
    if (!parsed.ok) return;
    const waiting = pendingPacksSetting.signal.value;
    if (waiting.some((entry) => entry.text === text)) return;
    const entry: PendingPack = { id: `pack-${Date.now()}`, name: parsed.pack.name, receivedAt: Date.now(), text };
    await pendingPacksSetting.set([entry, ...waiting].slice(0, 3));
    message.value = `A pack arrived: “${parsed.pack.name}”. Look at it below, and add it if you want it.`;
  }

  async function build(): Promise<string> {
    const picked = pages.value.filter((page) => chosen.value.has(page.id));
    const packPages: Array<{ name: string; obf: string }> = [];
    for (const page of picked) {
      const obf = await exportMyPageText(page);
      if (obf) packPages.push({ name: page.name, obf });
    }
    return buildPack({
      name: name.value,
      pages: packPages,
      ...(withTimetable.value ? { routine: weeklyRoutineSetting.signal.value, pageNames: new Map(pages.value.map((page) => [page.id, page.name])) } : {}),
      ...(withInfo.value ? { info: schoolInfoSetting.signal.value } : {}),
    });
  }

  async function saveFile(): Promise<void> {
    const text = await build();
    const result = await window.myWords.files.save(text, { suggestedName: `${(name.value || 'school-pack').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.rspack`, filterName: 'School pack', extensions: ['rspack'] });
    message.value = result.ok ? 'Saved. Give the file to the other devices (AirDrop, email or a memory stick) and open it there.' : '';
  }

  async function sendNow(): Promise<void> {
    if (!school) return;
    const sent = await school.send(await build());
    message.value = sent > 0 ? `Sent to ${sent} ${sent === 1 ? 'device' : 'devices'}. Each one still has to look at it and choose to add it.` : 'No device is listening yet. On each one, open School Mode, School pack, and Listen with the same code.';
  }

  async function openFile(): Promise<void> {
    const file = await window.myWords.files.open({ filterName: 'School pack', extensions: ['rspack'] });
    if (!file.ok) return;
    const parsed = parsePack(file.data);
    if (!parsed.ok) {
      message.value = parsed.error;
      return;
    }
    await receive(file.data);
  }

  async function add(entry: Preview): Promise<void> {
    const result = await applyPackHere(entry.pack);
    await pendingPacksSetting.set(pendingPacksSetting.signal.value.filter((item) => item.id !== entry.id));
    message.value = `Added ${result.addedPages} ${result.addedPages === 1 ? 'page' : 'pages'}${result.addedRoutine ? ', the timetable' : ''}${result.filledInfo ? ` and ${result.filledInfo} school ${result.filledInfo === 1 ? 'detail' : 'details'}` : ''}. ${result.notes.join(' ')}`.trim();
  }

  function toggle(id: string): void {
    const next = new Set(chosen.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    chosen.value = next;
  }

  return (
    <div class="parent-mode-screen__body pack-tab">
      <p class="school-tab__hint">
        A school pack hands your lesson pages, timetable and school details to other devices at once. It holds nothing about
        any child, it only goes one way (from the school to the pupils), and a device never adds one by itself: an adult looks
        at what is in it and chooses.
      </p>
      {message.value && (
        <p role="status" class="school-tab__hint">
          {message.value}
        </p>
      )}

      <section class="school-tab__section">
        <h2 class="school-tab__heading">Make a pack</h2>
        <label>
          Name
          <input type="text" value={name.value} placeholder="Class 3, autumn term" onInput={(event) => (name.value = (event.target as HTMLInputElement).value)} />
        </label>
        <fieldset>
          <legend>Lesson pages to include</legend>
          {pages.value.length === 0 && <span>No lesson pages yet. Make them in Lesson pages first.</span>}
          {pages.value.map((page) => (
            <label class="access-tab__checkbox" key={page.id}>
              <input type="checkbox" checked={chosen.value.has(page.id)} onChange={() => toggle(page.id)} />
              {page.name}
            </label>
          ))}
        </fieldset>
        <label class="access-tab__checkbox">
          <input type="checkbox" checked={withTimetable.value} onChange={(event) => (withTimetable.value = (event.target as HTMLInputElement).checked)} />
          The timetable
        </label>
        <label class="access-tab__checkbox">
          <input type="checkbox" checked={withInfo.value} onChange={(event) => (withInfo.value = (event.target as HTMLInputElement).checked)} />
          The school's details (not the key adult)
        </label>
        <div class="school-tab__buttons">
          <button type="button" class="parent-mode-screen__button" onClick={() => void saveFile()}>
            Save as a file
          </button>
          {school && (
            <button type="button" class="parent-mode-screen__button" disabled={mode.value !== 'sender' || peers.value === 0} onClick={() => void sendNow()}>
              Send to the devices listening
            </button>
          )}
        </div>
      </section>

      {school && (
        <section class="school-tab__section">
          <h2 class="school-tab__heading">Over the school's wifi</h2>
          <p class="school-tab__hint">
            Choose a four-digit code. On the school's device press <strong>Send</strong>, and on each pupil's device press{' '}
            <strong>Listen</strong> with the same code, and keep this page open on it. Everything stays on the school's wifi.
          </p>
          <label>
            Code
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={code.value}
              onInput={(event) => (code.value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))}
            />
          </label>
          <div class="school-tab__buttons">
            <button type="button" class="parent-mode-screen__button" disabled={!/^\d{4}$/.test(code.value)} aria-pressed={mode.value === 'sender'} onClick={() => (mode.value = mode.value === 'sender' ? '' : 'sender')}>
              {mode.value === 'sender' ? 'Stop sending' : 'Send'}
            </button>
            <button type="button" class="parent-mode-screen__button" disabled={!/^\d{4}$/.test(code.value)} aria-pressed={mode.value === 'listener'} onClick={() => (mode.value = mode.value === 'listener' ? '' : 'listener')}>
              {mode.value === 'listener' ? 'Stop listening' : 'Listen'}
            </button>
          </div>
          {mode.value && (
            <p role="status" class="school-tab__hint">
              {mode.value === 'sender' ? 'Looking for devices that are listening.' : 'Listening for the school.'} {peers.value} connected.
            </p>
          )}
        </section>
      )}

      <section class="school-tab__section">
        <h2 class="school-tab__heading">Packs waiting to be added</h2>
        <button type="button" class="parent-mode-screen__button" onClick={() => void openFile()}>
          Open a pack file
        </button>
        {previews.value.length === 0 && <p class="school-tab__hint">None waiting.</p>}
        {previews.value.map((entry) => (
          <div class="pack-tab__waiting" key={entry.id}>
            <h3>{entry.pack.name}</h3>
            <ul>
              {describe(entry.plan, entry.pack).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div class="school-tab__buttons">
              <button type="button" class="parent-mode-screen__button" onClick={() => void add(entry)}>
                Add to this device
              </button>
              <button
                type="button"
                class="parent-mode-screen__button"
                onClick={() => void pendingPacksSetting.set(pendingPacksSetting.signal.value.filter((item) => item.id !== entry.id))}
              >
                Throw it away
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
