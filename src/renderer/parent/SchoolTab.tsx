import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { clearSchoolPin, hasSchoolPin, schoolModeSetting } from '../store/db';
import { disableSchoolMode, enableSchoolMode } from '../store/school';
import { SCHOOL_MODE_NAME } from '../ui/modeName';
import { PinGate } from './PinGate';

// School: turns School Mode on, and looks after its PIN. School Mode is a
// separate part of the app for the adults who work with a child in school, with
// its own button next to Parent Mode and its own PIN, chosen here, afterwards,
// and never during first-run set-up. Whoever has the Parent PIN can always
// choose a new School PIN, so nobody is locked out.
export function SchoolTab() {
  const on = schoolModeSetting.signal.value;
  const pinSet = useSignal<boolean | null>(null);
  const choosing = useSignal<'new' | 'change' | null>(null);
  const confirmForget = useSignal(false);
  const message = useSignal('');

  useEffect(() => {
    void hasSchoolPin().then((exists) => (pinSet.value = exists));
  }, []);

  async function turnOn(): Promise<void> {
    if (pinSet.value) {
      await enableSchoolMode();
      message.value = `${SCHOOL_MODE_NAME} is on. Its PIN is the one you chose before.`;
      return;
    }
    choosing.value = 'new';
  }

  return (
    <div class="parent-mode-screen__body school-tab">
      <section class="school-tab__section">
        <h2 class="school-tab__heading">{SCHOOL_MODE_NAME} is {on ? 'on' : 'off'}</h2>
        <p class="school-tab__hint">
          A separate part of the app for the teachers and staff who work with this child at school. It has its own
          button, next to Parent Mode on the child's screen, and its own <strong>School PIN</strong>, so school staff
          never need the Parent PIN and parents never need the School PIN. It holds school details, a Today page,
          the timetable, lesson pages, vocabulary, communication targets, session notes, an activity log, a
          safeguarding page and printable handover and review sheets.
        </p>

        {!on ? (
          <>
            <ul class="school-tab__list">
              <li>You will choose a four-digit School PIN now. It is not the Parent PIN.</li>
              <li>A <strong>{SCHOOL_MODE_NAME}</strong> button then appears next to Parent Mode.</li>
              <li>Nothing on the child's screen moves. The top bar stays as it is until staff choose to change it.</li>
            </ul>
            <button type="button" class="parent-mode-screen__button" onClick={() => void turnOn()}>
              Turn {SCHOOL_MODE_NAME} on…
            </button>
          </>
        ) : (
          <>
            <ul class="school-tab__list">
              <li>The {SCHOOL_MODE_NAME} button is next to Parent Mode on every screen.</li>
              <li>School staff open it with the School PIN. The Parent PIN does not open it.</li>
            </ul>
            <div class="school-tab__buttons">
              <button type="button" class="parent-mode-screen__button" onClick={() => (choosing.value = 'change')}>
                Choose a new School PIN
              </button>
              <button
                type="button"
                class="parent-mode-screen__button"
                onClick={() => {
                  void disableSchoolMode();
                  message.value = `${SCHOOL_MODE_NAME} is off. The button is gone. Everything staff wrote, and the School PIN, are kept.`;
                }}
              >
                Turn {SCHOOL_MODE_NAME} off
              </button>
            </div>
          </>
        )}

        {!on && pinSet.value && (
          <div class="school-tab__buttons">
            {confirmForget.value ? (
              <>
                <span>Forget the School PIN? A new one will be chosen next time.</span>
                <button
                  type="button"
                  class="parent-mode-screen__button"
                  onClick={() => {
                    void clearSchoolPin().then(() => {
                      pinSet.value = false;
                      confirmForget.value = false;
                      message.value = 'The School PIN is forgotten.';
                    });
                  }}
                >
                  Yes, forget it
                </button>
                <button type="button" class="parent-mode-screen__button" onClick={() => (confirmForget.value = false)}>
                  Keep it
                </button>
              </>
            ) : (
              <button type="button" class="parent-mode-screen__button" onClick={() => (confirmForget.value = true)}>
                Forget the School PIN
              </button>
            )}
          </div>
        )}

        <p role="status" class="school-tab__hint">
          {message.value}
        </p>
      </section>

      {choosing.value && (
        <div class="pin-gate-overlay">
          <PinGate
            kind="school"
            changePin={choosing.value === 'change'}
            onUnlock={() => {
              const wasNew = choosing.value === 'new';
              choosing.value = null;
              pinSet.value = true;
              if (wasNew) {
                void enableSchoolMode();
                message.value = `${SCHOOL_MODE_NAME} is on. The button is next to Parent Mode.`;
              } else {
                message.value = 'The School PIN is changed.';
              }
            }}
            onCancel={() => (choosing.value = null)}
          />
        </div>
      )}
    </div>
  );
}
