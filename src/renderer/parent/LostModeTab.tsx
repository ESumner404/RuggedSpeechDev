import { lostModeSetting, schoolInfoSetting, userProfileSetting } from '../store/db';
import { suggestedReturnTo } from '../store/staff';
import { deviceTitle } from '../ui/deviceName';
import { canTurnOn, lostMessage, type LostMode } from '../safety/lostMode';

// Lost mode: type in who to return the device to, then turn it on. The
// screen is then covered by a message until the PIN is entered. It is a
// label, not a tracker: nothing here can find a device or lock it from afar.
export function LostModeTab() {
  const lost = lostModeSetting.signal.value;
  const profile = userProfileSetting.signal.value;
  const named = profile.deviceName.trim() || profile.name.trim() ? deviceTitle(profile) : '';

  function update(changes: Partial<LostMode>): void {
    void lostModeSetting.set({ ...lostModeSetting.signal.value, ...changes });
  }

  const ready = canTurnOn(lost);
  const school = suggestedReturnTo(schoolInfoSetting.signal.value);
  const schoolPhone = schoolInfoSetting.signal.value.phone.trim();

  return (
    <div class="parent-mode-screen__body lost-tab">
      <p class="about-tab__hint">
        If the device goes missing, turn Lost mode on and the screen asks whoever has it to return it, with the
        details you type here. These details are shown on the screen to anyone while Lost mode is on, and at no
        other time. Only the Parent PIN turns it off. This is a note on the screen: the app has no internet, so it
        cannot find a device or lock it from somewhere else. Turn it on <strong>before</strong> the device is
        lost if you can, for example when it is left somewhere.
      </p>

      <label class="about-tab__field">
        Return it to (a name, a school or a place)
        <input class="about-tab__input" type="text" value={lost.returnTo} onInput={(e) => update({ returnTo: (e.target as HTMLInputElement).value })} />
      </label>
      {school && lost.returnTo.trim() !== school && (
        <button
          type="button"
          class="parent-mode-screen__button"
          onClick={() => update({ returnTo: school, phone: lost.phone.trim() || schoolPhone })}
        >
          Use the school: {school}
        </button>
      )}
      <label class="about-tab__field">
        Phone number
        <input class="about-tab__input" type="tel" value={lost.phone} onInput={(e) => update({ phone: (e.target as HTMLInputElement).value })} />
      </label>
      <label class="about-tab__field">
        Address (optional)
        <input class="about-tab__input" type="text" value={lost.address} onInput={(e) => update({ address: (e.target as HTMLInputElement).value })} />
      </label>
      <label class="about-tab__field">
        Anything else to say (optional)
        <textarea class="about-tab__input about-tab__textarea" value={lost.note} onInput={(e) => update({ note: (e.target as HTMLTextAreaElement).value })} />
      </label>

      <h2 class="access-tab__heading">What it will say</h2>
      <p class="lost-tab__preview">{lostMessage(lost, named)}</p>

      {lost.on ? (
        <p role="status" class="lost-tab__on">
          Lost mode is on. The screen is covered until the PIN is entered.
        </p>
      ) : (
        <>
          <button type="button" class="parent-mode-screen__button" disabled={!ready} onClick={() => update({ on: true })}>
            Turn Lost mode on
          </button>
          {!ready && <p class="access-tab__hint">Type a name, a phone number or an address first.</p>}
        </>
      )}
    </div>
  );
}
