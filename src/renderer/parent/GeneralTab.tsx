import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getFavourites, parentModeTimeoutSetting, removeFavourite } from '../store/db';
import type { Item } from '../store/types';
import { modeName } from '../ui/modeName';
import { PinGate } from './PinGate';

const TIMEOUT_CHOICES = [0, 5, 10, 15, 30, 60] as const;

// Off by default (docs/build-plan.md Phase 8), a real Windows login-item setting,
// read live from the OS rather than cached in this app's own database.
export function GeneralTab() {
  const openAtLogin = useSignal<boolean | null>(null);
  const changingPin = useSignal(false);
  const pinChanged = useSignal(false);
  const favourites = useSignal<Item[]>([]);

  async function removeOne(id: string): Promise<void> {
    await removeFavourite(id);
    favourites.value = await getFavourites();
  }

  useEffect(() => {
    void getFavourites().then((items) => (favourites.value = items));
    void window.myWords.startup.getOpenAtLogin().then((value) => (openAtLogin.value = value));
  }, []);

  async function toggle(): Promise<void> {
    const next = !openAtLogin.value;
    await window.myWords.startup.setOpenAtLogin(next);
    openAtLogin.value = next;
  }

  if (openAtLogin.value === null) return null;

  return (
    <div class="parent-mode-screen__body general-tab">
      <label class="general-tab__checkbox">
        <input type="checkbox" checked={openAtLogin.value} onChange={() => void toggle()} />
        Start when the computer starts
      </label>
      <p class="general-tab__hint">Off by default. On, the app opens automatically after login.</p>

      <label class="general-tab__row">
        Close {modeName()} after
        <select
          value={parentModeTimeoutSetting.signal.value}
          onChange={(event) =>
            void parentModeTimeoutSetting.set(Number((event.target as HTMLSelectElement).value))
          }
        >
          {TIMEOUT_CHOICES.map((minutes) => (
            <option value={minutes} key={minutes}>
              {minutes === 0 ? 'Never' : `${minutes} minutes without use`}
            </option>
          ))}
        </select>
      </label>
      <p class="general-tab__hint">
        Handy on a shared or unattended device. Any press, key or typing counts as use. The PIN is needed
        again to get back in.
      </p>

      <section class="general-tab__favourites">
        <h2 class="general-tab__heading">Favourites</h2>
        <p class="general-tab__hint">
          Words saved to Favourites, by holding a button down. Take any away here.
        </p>
        {favourites.value.length === 0 ? (
          <p class="general-tab__hint">No favourites.</p>
        ) : (
          <ul class="general-tab__favourite-list">
            {favourites.value.map((item) => (
              <li class="general-tab__favourite" key={item.id}>
                <span>
                  {item.image?.kind === 'emoji' ? `${item.image.char} ` : ''}
                  {item.label}
                </span>
                <button
                  type="button"
                  class="parent-mode-screen__button"
                  aria-label={`Remove ${item.label} from Favourites`}
                  onClick={() => void removeOne(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div class="general-tab__pin">
        <button type="button" class="parent-mode-screen__button" onClick={() => (changingPin.value = true)}>
          Change the PIN
        </button>
        {pinChanged.value && <p class="general-tab__hint">The PIN has been changed. Keep the new recovery code safe.</p>}
        <p class="general-tab__hint">
          Choosing a new PIN also gives you a new recovery code; the old one stops working.
        </p>
      </div>

      {changingPin.value && (
        <div class="pin-gate-overlay">
          <PinGate
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
