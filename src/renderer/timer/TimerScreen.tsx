import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { TIMER_BLOCKS, TIMER_PRESETS_MINUTES, blocksLeft, isFinished } from './timer';

// A visual timer for the child: press how long, and watch the blocks go. Silent, and no numbers counting down.
export function TimerScreen() {
  const total = useSignal(0);
  const startedAt = useSignal(0);
  const now = useSignal(0);

  useEffect(() => {
    if (total.value === 0) return undefined;
    const timer = window.setInterval(() => (now.value = Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [total.value]);

  function start(minutes: number): void {
    total.value = minutes * 60_000;
    startedAt.value = Date.now();
    now.value = Date.now();
  }

  if (total.value === 0) {
    return (
      <div class="timer-screen">
        <p class="timer-screen__title">How long?</p>
        <div class="timer-screen__presets">
          {TIMER_PRESETS_MINUTES.map((minutes) => (
            <button type="button" class="timer-screen__preset" key={minutes} onClick={() => start(minutes)}>
              {minutes} {minutes === 1 ? 'minute' : 'minutes'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const elapsed = now.value - startedAt.value;
  const left = blocksLeft(elapsed, total.value);
  const done = isFinished(elapsed, total.value);

  return (
    <div class="timer-screen">
      <div class="timer-screen__blocks" role="img" aria-label={done ? 'Time is up' : `${left} of ${TIMER_BLOCKS} blocks left`}>
        {Array.from({ length: TIMER_BLOCKS }, (_, i) => (
          <span class={`timer-screen__block${i < left ? ' timer-screen__block--on' : ''}`} key={i} />
        ))}
      </div>
      <p class="timer-screen__title" role="status">
        {done ? 'Time is up' : 'Time left'}
      </p>
      <button type="button" class="timer-screen__preset" onClick={() => (total.value = 0)}>
        {done ? 'Done' : 'Stop'}
      </button>
    </div>
  );
}
