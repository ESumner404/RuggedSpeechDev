import { signal } from '@preact/signals';
import type { AccessSettings } from '../store/types';
import type { DeviceAccessibility } from './nativeBridge';

// Some devices let the person set accessibility preferences once, for every
// app (Reduce Motion, Increase Contrast, Bold Text, text size). This reads
// them so Rugged Speech can follow, instead of making a family set the same
// thing twice. Nothing is sent anywhere: the device is only asked.

export const NO_DEVICE_ACCESSIBILITY: DeviceAccessibility = {
  reduceMotion: false,
  increaseContrast: false,
  boldText: false,
  textScale: 1,
  voiceOver: false,
  switchControl: false,
  guidedAccess: false,
};

/** What the device said last. Everything off until it has been asked. */
export const deviceAccessibility = signal<DeviceAccessibility>(NO_DEVICE_ACCESSIBILITY);

/** The most the page scales its writing, whatever the device asks for. */
const MAX_TEXT_SCALE = 2;

/**
 * The app's own settings with the device's added: an adult's choice is never
 * made weaker (motion off stays off, a larger size stays larger), the device
 * can only ask for more.
 */
export function followDevice(settings: AccessSettings, device: DeviceAccessibility): AccessSettings {
  const deviceScale = Number.isFinite(device.textScale) ? Math.min(MAX_TEXT_SCALE, Math.max(1, device.textScale)) : 1;
  return {
    ...settings,
    reduceMotion: settings.reduceMotion || device.reduceMotion,
    highContrast: settings.highContrast === 'off' && device.increaseContrast ? 'light' : settings.highContrast,
    textScale: Math.max(settings.textScale, deviceScale),
  };
}

const POLL_MS = 4000;

/**
 * Asks the device now, and again whenever the app comes back to the front
 * (which is when a change made in Settings or Control Centre shows up), and
 * every few seconds while it is in front. Returns a function that stops it.
 * Does nothing where the device cannot be asked.
 */
export function watchDeviceAccessibility(): () => void {
  const ask = window.myWords?.deviceAccessibility;
  if (!ask) return () => undefined;

  let stopped = false;
  const refresh = (): void => {
    if (document.visibilityState === 'hidden') return;
    void ask()
      .then((value) => {
        if (!stopped) deviceAccessibility.value = { ...NO_DEVICE_ACCESSIBILITY, ...value };
      })
      .catch(() => undefined);
  };

  refresh();
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  const timer = window.setInterval(refresh, POLL_MS);
  return () => {
    stopped = true;
    document.removeEventListener('visibilitychange', refresh);
    window.removeEventListener('focus', refresh);
    window.removeEventListener('pageshow', refresh);
    window.clearInterval(timer);
  };
}

/** A short buzz on every button press, for as long as it is switched on. Returns a function that stops it. */
export function buzzOnPress(): () => void {
  const buzz = window.myWords?.haptic;
  if (!buzz) return () => undefined;
  const onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (target instanceof Element && target.closest('button, [role="button"]')) void buzz().catch(() => undefined);
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
