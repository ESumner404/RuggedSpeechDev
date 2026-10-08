import { trafficSetting, userProfileSetting } from '../store/db';
import { TRAFFIC_LIGHTS, type TrafficLight } from '../signals/traffic';
import { deviceTitle } from '../ui/deviceName';
import type { UserProfile } from '../store/types';

const PICTURES = ['🙂', '😀', '😎', '🦁', '🐯', '🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐸', '🦄', '🚀', '⚽', '🌈', '⭐', '🌻', '🚂', '🎨'];

// Whose device this is. A name, a name for the device ("Lucy's device"), a
// picture and, if wanted, an age. Everything here is optional, stays on this
// computer, and is only ever shown or printed, never sent anywhere.
export function UserTab() {
  const profile = userProfileSetting.signal.value;

  function update(changes: Partial<UserProfile>): void {
    void userProfileSetting.set({ ...userProfileSetting.signal.value, ...changes });
  }

  const title = deviceTitle(profile);

  return (
    <div class="parent-mode-screen__body user-tab">
      <p class="about-tab__hint">
        Tell the app whose device this is. All of it is optional, it stays on this computer, and none of it is sent
        anywhere. The device name shows along the top of the child's screen and in the window title, so it is
        clear whose device it is if it goes missing.
      </p>

      <label class="about-tab__field">
        Name
        <input
          class="about-tab__input"
          type="text"
          autocomplete="off"
          value={profile.name}
          placeholder="Lucy"
          onInput={(event) => update({ name: (event.target as HTMLInputElement).value })}
        />
      </label>

      <label class="about-tab__field">
        Device name
        <input
          class="about-tab__input"
          type="text"
          autocomplete="off"
          value={profile.deviceName}
          placeholder={profile.name.trim() ? `${profile.name.trim()}'s device` : "Lucy's device"}
          onInput={(event) => update({ deviceName: (event.target as HTMLInputElement).value })}
        />
        <span class="access-tab__hint">Leave blank to use the name, as in “Lucy's device”.</span>
      </label>

      <label class="about-tab__field user-tab__age">
        Age (optional)
        <input
          class="about-tab__input"
          type="text"
          inputMode="numeric"
          maxLength={2}
          autocomplete="off"
          value={profile.age}
          onInput={(event) => update({ age: (event.target as HTMLInputElement).value.replace(/\D/g, '') })}
        />
        <span class="access-tab__hint">Printed on the About me sheet. It is never used to decide anything.</span>
      </label>

      <fieldset class="user-tab__pictures">
        <legend>Picture</legend>
        <div class="user-tab__picture-grid">
          {PICTURES.map((emoji) => (
            <button
              type="button"
              key={emoji}
              class={`user-tab__picture${profile.emoji === emoji ? ' user-tab__picture--chosen' : ''}`}
              aria-pressed={profile.emoji === emoji}
              aria-label={`Use ${emoji}`}
              onClick={() => update({ emoji: profile.emoji === emoji ? '' : emoji })}
            >
              {emoji}
            </button>
          ))}
        </div>
      </fieldset>

      <label class="access-tab__checkbox">
        <input
          type="checkbox"
          checked={profile.showOnScreen}
          onChange={(event) => update({ showOnScreen: (event.target as HTMLInputElement).checked })}
        />
        Show the device name along the top of the child's screen
      </label>

      <h2 class="access-tab__heading">Traffic light words</h2>
      <p class="about-tab__hint">
        What the traffic light says when its button is pressed. Add <strong>Traffic light</strong> to the top bar in
        Quick Access to use it. Change the words to suit.
      </p>
      {TRAFFIC_LIGHTS.map((light) => (
        <label class="about-tab__field" key={light.id}>
          <span>
            <span aria-hidden="true">{light.icon}</span> {light.short}
          </span>
          <input
            class="about-tab__input"
            type="text"
            value={trafficSetting.signal.value.phrases[light.id]}
            onInput={(event) =>
              void trafficSetting.set({
                ...trafficSetting.signal.value,
                phrases: { ...trafficSetting.signal.value.phrases, [light.id as TrafficLight]: (event.target as HTMLInputElement).value },
              })
            }
          />
        </label>
      ))}

      <p class="user-tab__preview" aria-label="How it will look">
        <span aria-hidden="true">{profile.emoji}</span> {title}
      </p>
    </div>
  );
}
