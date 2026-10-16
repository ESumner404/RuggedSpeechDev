import { useSignal } from '@preact/signals';
import { appleLinkSetting } from '../store/db';
import { linkPeers } from '../platform/linkStatus';

// Only shown on an iPhone or iPad. Everything here is off until an adult turns it on, and says plainly what is shared.
export function AppleLinkSection() {
  const capabilities = window.myWords?.capabilities;
  if (!capabilities?.link) return null;

  const setting = appleLinkSetting.signal.value;
  const draft = useSignal(setting.code);
  const codeOk = /^\d{4}$/.test(draft.value);
  const peers = linkPeers.value;

  async function turnOn(): Promise<void> {
    if (!codeOk) return;
    await appleLinkSetting.set({ enabled: true, code: draft.value });
  }

  async function turnOff(): Promise<void> {
    await appleLinkSetting.set({ enabled: false, code: '' });
    draft.value = '';
  }

  return (
    <section class="access-tab__section" data-section="apple-link">
      <h2 class="access-tab__heading">Link with the Apple Watch and Apple TV</h2>
      <p class="access-tab__hint">
        Lets this family's own Apple Watch and Apple TV show the Favourites and today's plan, share the traffic light,
        and open pages here, such as Games or Draw. It works over Bluetooth to the watch and over the home wifi to the
        television, never the internet, and nothing the child says or types is sent. Off unless you turn it on.
      </p>
      {setting.enabled ? (
        <>
          <p class="access-tab__hint" role="status">
            On. {peers === 0 ? 'Nothing is connected yet.' : `${peers} connected.`} The code is {setting.code}.
          </p>
          <button type="button" class="parent-mode-screen__button" onClick={() => void turnOff()}>
            Turn the link off
          </button>
        </>
      ) : (
        <>
          <p class="access-tab__hint">
            For the Apple TV: open the Rugged Speech app on it, go to the iPad tab, and type the four-digit code it
            shows here. The Apple Watch needs no code, only to be paired with this iPhone.
          </p>
          <label class="access-tab__select-row">
            Code from the Apple TV
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={draft.value}
              onInput={(event) => (draft.value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))}
            />
          </label>
          <button type="button" class="parent-mode-screen__button" disabled={!codeOk} onClick={() => void turnOn()}>
            Turn the link on
          </button>
        </>
      )}
    </section>
  );
}
