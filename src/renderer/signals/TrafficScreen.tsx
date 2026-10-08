import { useSignal } from '@preact/signals';
import { announceText } from '../speech/announce';
import { trafficSetting } from '../store/db';
import { TRAFFIC_LIGHTS, trafficLight, type TrafficLight } from './traffic';

// The traffic light. Press a colour to show it; it stays until changed, and
// a small version stays along the top of every screen so other people can
// see it without being told. Show puts it across the whole screen. Nothing
// is spoken unless Say it is pressed.
export function TrafficScreen() {
  const full = useSignal(false);
  const { status, phrases } = trafficSetting.signal.value;

  function choose(id: TrafficLight): void {
    void trafficSetting.set({ ...trafficSetting.signal.value, status: status === id ? 'off' : id });
  }

  if (full.value && status !== 'off') {
    const light = trafficLight(status);
    return (
      <button
        type="button"
        class="traffic-full"
        style={{ background: light.colour }}
        onClick={() => (full.value = false)}
        aria-label={`${phrases[status]} Press to go back.`}
      >
        <span class="traffic-full__text">{phrases[status]}</span>
      </button>
    );
  }

  return (
    <div class="traffic-screen">
      <p class="traffic-screen__title">How much do you want people to talk to you?</p>
      <div class="traffic-screen__lights" role="group" aria-label="Traffic light">
        {TRAFFIC_LIGHTS.map((light) => (
          <button
            type="button"
            key={light.id}
            class={`traffic-light${status === light.id ? ' traffic-light--on' : ''}`}
            style={{ '--light': light.colour } as Record<string, string>}
            aria-pressed={status === light.id}
            onClick={() => choose(light.id)}
          >
            <span class="traffic-light__lamp" aria-hidden="true" />
            <span class="traffic-light__label">{light.short}</span>
          </button>
        ))}
      </div>
      <p class="traffic-screen__phrase" aria-live="polite">
        {status === 'off' ? 'Choose a colour to show people.' : phrases[status]}
      </p>
      <div class="traffic-screen__actions">
        <button type="button" class="game-screen__button" disabled={status === 'off'} onClick={() => announceText(phrases[status as TrafficLight])}>
          Say it
        </button>
        <button type="button" class="game-screen__button" disabled={status === 'off'} onClick={() => (full.value = true)}>
          Show everyone
        </button>
        <button type="button" class="game-screen__button" disabled={status === 'off'} onClick={() => void trafficSetting.set({ ...trafficSetting.signal.value, status: 'off' })}>
          Turn off
        </button>
      </div>
    </div>
  );
}

/** A small light along the top of the screen while one is showing. */
export function TrafficChip() {
  const { status } = trafficSetting.signal.value;
  if (status === 'off') return null;
  const light = trafficLight(status);
  return (
    <span class="traffic-chip" style={{ '--light': light.colour } as Record<string, string>}>
      <span class="traffic-chip__lamp" aria-hidden="true" />
      {light.short}
    </span>
  );
}
