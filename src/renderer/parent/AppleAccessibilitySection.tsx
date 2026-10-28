import { followDeviceAccessibilitySetting, pressBuzzSetting } from '../store/db';
import { deviceAccessibility } from '../platform/deviceAccessibility';

/** What the device is currently asking for, in plain words. Empty when it is asking for nothing. */
export function deviceAsking(device: ReturnType<typeof deviceAccessibility.peek>): string[] {
  const asking: string[] = [];
  if (device.reduceMotion) asking.push('Reduce Motion');
  if (device.increaseContrast) asking.push('Increase Contrast');
  if (device.boldText) asking.push('Bold Text');
  if (device.textScale > 1) asking.push(`larger text (×${device.textScale})`);
  return asking;
}

// Only shown on an iPhone or iPad. Everything here is the device's own: this
// app reads which settings are on, and explains the rest, but it never sees
// where a person is looking, and nothing is sent anywhere.
export function AppleAccessibilitySection() {
  const capabilities = window.myWords?.capabilities;
  if (!capabilities?.deviceAccessibility) return null;

  const device = deviceAccessibility.value;
  const asking = deviceAsking(device);

  return (
    <>
      <section class="access-tab__section" data-section="device-accessibility">
        <h2 class="access-tab__heading">This device's accessibility settings</h2>
        <label class="access-tab__checkbox">
          <input
            type="checkbox"
            checked={followDeviceAccessibilitySetting.signal.value}
            onChange={(event) => void followDeviceAccessibilitySetting.set((event.target as HTMLInputElement).checked)}
          />
          Follow this device's accessibility settings
        </label>
        <p class="access-tab__hint">
          Reduce Motion, Increase Contrast, Bold Text and the text size, set once in Settings, Accessibility, are
          used here too. The choices made below are never made weaker: the device can only ask for more.
        </p>
        <p class="access-tab__hint" role="status">
          {asking.length > 0
            ? `Right now this device is asking for: ${asking.join(', ')}.`
            : 'Right now none of these are switched on.'}
        </p>
        {capabilities.haptics && (
          <>
            <label class="access-tab__checkbox">
              <input
                type="checkbox"
                checked={pressBuzzSetting.signal.value}
                onChange={(event) => void pressBuzzSetting.set((event.target as HTMLInputElement).checked)}
              />
              Buzz when a button is pressed
            </label>
            <p class="access-tab__hint">
              A short buzz from the device, so a press can be felt as well as heard. Off unless you turn it on,
              and only when the screen is touched.
            </p>
          </>
        )}
      </section>

      <section class="access-tab__section" data-section="apple-ways-of-pressing">
        <h2 class="access-tab__heading">Eye tracking and other ways of pressing</h2>
        <p class="access-tab__hint">
          <strong>Eye Tracking</strong> is built into iPadOS and iOS 18 and later, on recent iPads and iPhones. Turn
          it on in Settings, Accessibility, Eye Tracking, then follow the dots. It uses the front camera and then
          works in this app as it does everywhere else: resting the gaze on a button presses it. The gaze stays
          with the device. This app cannot see where anyone is looking, and cannot switch Eye Tracking on for you.
        </p>
        <p class="access-tab__hint">
          If you use Eye Tracking's own dwell, leave <em>Hold-to-select</em> above at 0, so a button is not asked to
          wait twice.
        </p>
        <p class="access-tab__hint">
          <strong>Switch Control</strong> (Settings, Accessibility) reaches every button. For switches that press
          Space and Enter, the <em>Switch scanning</em> above is simpler, and keeps the order of the buttons.
        </p>
        <p class="access-tab__hint">
          <strong>Voice Control</strong> can press any button by saying its name, and <strong>VoiceOver</strong>{' '}
          reads each one out.
          {device.voiceOver ? ' VoiceOver is on now.' : ''}
          {device.switchControl ? ' Switch Control is on now.' : ''}
        </p>
        <p class="access-tab__hint">
          <strong>Guided Access</strong> keeps a child inside this app.{' '}
          {device.guidedAccess
            ? 'It is on now: the child cannot leave the app.'
            : 'It is off now. Turn it on in Settings, Accessibility, Guided Access, then triple-press the side or Home button inside the app.'}{' '}
          <strong>Assistive Access</strong> (Settings, Accessibility) fills the whole screen with this app.
        </p>
      </section>
    </>
  );
}
