import { useSignal } from '@preact/signals';
import { quickAccessButtons, schoolTimeoutSetting, weeklyRoutineSetting } from '../store/db';
import { applySchoolTopBar } from '../store/school';
import { SCHOOL_QUICK_ACCESS, QUICK_ACCESS_LABELS } from '../store/quickAccess';
import { routineIsEmpty, typicalSchoolWeek } from '../store/staff';
import { PinGate } from '../parent/PinGate';

const TIMEOUTS = [0, 5, 10, 15, 30, 60];

// Classroom set-up: the few choices that suit a school, each one made on
// purpose. Nothing here is done for you, because each can move buttons a child
// has already learned.
export function ClassroomTab() {
  const confirmBar = useSignal(false);
  const barApplied = useSignal(false);
  const timetableAdded = useSignal(false);
  const changingPin = useSignal(false);
  const pinChanged = useSignal(false);
  const routineEmpty = routineIsEmpty(weeklyRoutineSetting.signal.value);

  async function addTypicalWeek(): Promise<void> {
    if (!routineIsEmpty(weeklyRoutineSetting.signal.value)) return;
    await weeklyRoutineSetting.set(typicalSchoolWeek());
    timetableAdded.value = true;
  }

  return (
    <div class="parent-mode-screen__body classroom-tab">
      <section class="school-tab__section">
        <h2 class="school-tab__heading">The child's top bar and first page</h2>
        <p class="school-tab__hint">
          For a classroom, the top bar can be <strong>{SCHOOL_QUICK_ACCESS.map((id) => QUICK_ACCESS_LABELS[id]).join(', ')}</strong>
          , and Talk can open to the School page. This moves buttons a child may already know, so it is only done when
          you press the button.
        </p>
        {confirmBar.value ? (
          <div class="school-tab__buttons">
            <span>Change the top bar and the first page now?</span>
            <button
              type="button"
              class="parent-mode-screen__button"
              onClick={() => {
                void applySchoolTopBar().then(() => {
                  barApplied.value = true;
                  confirmBar.value = false;
                });
              }}
            >
              Yes, change them
            </button>
            <button type="button" class="parent-mode-screen__button" onClick={() => (confirmBar.value = false)}>
              Not now
            </button>
          </div>
        ) : (
          <button type="button" class="parent-mode-screen__button" onClick={() => (confirmBar.value = true)}>
            Use the school top bar
          </button>
        )}
        {barApplied.value && (
          <p role="status" class="school-tab__hint">
            Done. The top bar is now Home, Help, Yes, No, Break and Question. Parents can change it again in Parent Mode.
          </p>
        )}
        <CurrentBar />
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">The timetable</h2>
        <p class="school-tab__hint">
          Start from a typical school day, Monday to Friday, then change the names and times in <strong>Timetable</strong>.
          It never replaces a timetable that is already there.
        </p>
        <button type="button" class="parent-mode-screen__button" disabled={!routineEmpty} onClick={() => void addTypicalWeek()}>
          Start from a typical school day
        </button>
        {!routineEmpty && !timetableAdded.value && <p class="school-tab__hint">There is a timetable already, so it is left alone.</p>}
        {timetableAdded.value && (
          <p role="status" class="school-tab__hint">
            Added Monday to Friday. Change the times and names in Timetable to match.
          </p>
        )}
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">Closing School Mode</h2>
        <label class="access-tab__select-row">
          Close School Mode after
          <select
            value={String(schoolTimeoutSetting.signal.value)}
            onChange={(event) => void schoolTimeoutSetting.set(Number((event.target as HTMLSelectElement).value))}
          >
            {TIMEOUTS.map((minutes) => (
              <option value={String(minutes)} key={minutes}>
                {minutes === 0 ? 'Never' : `${minutes} minutes without use`}
              </option>
            ))}
          </select>
        </label>
        <p class="school-tab__hint">So a device left on a desk is not left open. Any press or key counts as use.</p>
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">The School PIN</h2>
        <p class="school-tab__hint">
          Four numbers, separate from the Parent PIN. If it is forgotten, whoever has the Parent PIN can choose a new one in
          Parent Mode.
        </p>
        <button type="button" class="parent-mode-screen__button" onClick={() => (changingPin.value = true)}>
          Choose a new School PIN
        </button>
        {pinChanged.value && (
          <p role="status" class="school-tab__hint">
            The School PIN is changed.
          </p>
        )}
      </section>

      <section class="school-tab__section">
        <h2 class="school-tab__heading">About me on the child's screen</h2>
        <p class="school-tab__hint">
          While School Mode is on, an <strong>About me</strong> button shows on the child's screen, so a supply teacher can read
          it without a PIN. Write it under <strong>About me</strong> in the menu.
        </p>
      </section>

      {changingPin.value && (
        <div class="pin-gate-overlay">
          <PinGate
            kind="school"
            changePin
            onUnlock={() => {
              changingPin.value = false;
              pinChanged.value = true;
            }}
            onCancel={() => (changingPin.value = false)}
          />
        </div>
      )}
    </div>
  );
}

function CurrentBar() {
  return <p class="school-tab__hint">The top bar now: {quickAccessButtons.value.map((id) => QUICK_ACCESS_LABELS[id]).join(', ')}.</p>;
}
