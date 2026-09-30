import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { BREATH_CYCLE, QUIET_TIME_DURATIONS_MIN, formatCountdown, nextBreathStepIndex } from './breathingCycle';
import { announceText } from '../speech/announce';

// Feature review, Aug 2026: "meltdown/overwhelm support — a 'calm down' or
// sensory break section... breathing exercises or a countdown timer."
// Lives alongside Feelings and Help rather than as its own Home tile —
// same reachability, no new fixed position to add (CLAUDE.md I3).
export function CalmTab() {
  const breathingActive = useSignal(false);
  const breathStepIndex = useSignal(0);
  const breathTimerRef = useRef<number | null>(null);

  function stopBreathing(): void {
    breathingActive.value = false;
    if (breathTimerRef.current !== null) {
      clearTimeout(breathTimerRef.current);
      breathTimerRef.current = null;
    }
  }

  function runBreathStep(index: number): void {
    breathStepIndex.value = index;
    const step = BREATH_CYCLE[index]!;
    announceText(step.spoken);
    breathTimerRef.current = window.setTimeout(() => runBreathStep(nextBreathStepIndex(index)), step.durationMs);
  }

  function startBreathing(): void {
    breathingActive.value = true;
    runBreathStep(0);
  }

  useEffect(() => stopBreathing, []);

  const quietSecondsLeft = useSignal<number | null>(null);
  const quietTimerRef = useRef<number | null>(null);

  function stopQuietTime(): void {
    quietSecondsLeft.value = null;
    if (quietTimerRef.current !== null) {
      clearInterval(quietTimerRef.current);
      quietTimerRef.current = null;
    }
  }

  function startQuietTime(minutes: number): void {
    stopQuietTime();
    quietSecondsLeft.value = minutes * 60;
    quietTimerRef.current = window.setInterval(() => {
      if (quietSecondsLeft.value === null) return;
      const remaining = quietSecondsLeft.value - 1;
      if (remaining <= 0) {
        stopQuietTime();
        announceText("The timer's finished. Take your time.");
      } else {
        quietSecondsLeft.value = remaining;
      }
    }, 1000);
  }

  useEffect(() => stopQuietTime, []);

  return (
    <div class="calm-tab">
      <section class="calm-tab__section">
        <h2 class="calm-tab__heading">Breathing</h2>
        <p class="calm-tab__phase" role="status" aria-live="polite">
          {breathingActive.value ? BREATH_CYCLE[breathStepIndex.value]!.label : 'Ready when you are'}
        </p>
        {breathingActive.value ? (
          <button type="button" class="calm-tab__button" onClick={stopBreathing}>
            Stop
          </button>
        ) : (
          <button type="button" class="calm-tab__button" onClick={startBreathing}>
            Start
          </button>
        )}
      </section>

      <section class="calm-tab__section">
        <h2 class="calm-tab__heading">Quiet time</h2>
        {quietSecondsLeft.value !== null ? (
          <>
            <p class="calm-tab__countdown" role="status" aria-live="polite">
              {formatCountdown(quietSecondsLeft.value)}
            </p>
            <button type="button" class="calm-tab__button" onClick={stopQuietTime}>
              Stop
            </button>
          </>
        ) : (
          <div class="calm-tab__durations">
            {QUIET_TIME_DURATIONS_MIN.map((minutes) => (
              <button type="button" class="calm-tab__button" key={minutes} onClick={() => startQuietTime(minutes)}>
                {minutes} min
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
