import { useSignal } from '@preact/signals';
import { PinGate } from '../parent/PinGate';
import { announceText } from '../speech/announce';
import { lostModeSetting, userProfileSetting } from '../store/db';
import { deviceTitle } from '../ui/deviceName';
import { EMPTY_LOST_MODE, lostMessage } from './lostMode';

// Covers everything while Lost mode is on. Anyone can read it, and can have
// it read aloud, and nothing else can be reached. Only the PIN turns it off.
export function LostModeScreen() {
  const askingForPin = useSignal(false);
  const lost = lostModeSetting.signal.value;
  const profile = userProfileSetting.signal.value;
  const named = profile.deviceName.trim() || profile.name.trim() ? deviceTitle(profile) : '';
  const message = lostMessage(lost, named);

  if (askingForPin.value) {
    return (
      <div class="lost-mode lost-mode--pin">
        <PinGate
          onUnlock={() => {
            void lostModeSetting.set({ ...lostModeSetting.signal.value, on: false });
            askingForPin.value = false;
          }}
          onCancel={() => (askingForPin.value = false)}
        />
      </div>
    );
  }

  return (
    <div class="lost-mode" role="alertdialog" aria-label="Lost device" aria-describedby="lost-mode-message">
      <p class="lost-mode__heading">This device is lost</p>
      <p class="lost-mode__big">This is a critical communication device.</p>
      {named && <p class="lost-mode__name">{named}</p>}
      <div id="lost-mode-message" class="lost-mode__details">
        <p>Please return it to:</p>
        {lost.returnTo.trim() && <p class="lost-mode__line">{lost.returnTo.trim()}</p>}
        {lost.address.trim() && <p class="lost-mode__line">{lost.address.trim()}</p>}
        {lost.phone.trim() && <p class="lost-mode__line">Phone: {lost.phone.trim()}</p>}
        {lost.note.trim() && <p class="lost-mode__note">{lost.note.trim()}</p>}
      </div>
      <div class="lost-mode__actions">
        <button type="button" class="lost-mode__button" onClick={() => announceText(message, { keepInHistory: false })}>
          Read this out
        </button>
        <button type="button" class="lost-mode__button" onClick={() => (askingForPin.value = true)}>
          Owner: turn off
        </button>
      </div>
    </div>
  );
}

export { EMPTY_LOST_MODE };
