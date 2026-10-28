import { render } from 'preact';
import { afterEach, describe, expect, it } from 'vitest';
import { NO_DEVICE_ACCESSIBILITY, deviceAccessibility } from '../platform/deviceAccessibility';
import { AppleAccessibilitySection, deviceAsking } from './AppleAccessibilitySection';

function setBridge(capabilities?: { deviceAccessibility: boolean; haptics: boolean }): void {
  (window as unknown as { myWords: unknown }).myWords = {
    capabilities: capabilities ? { fullscreen: false, startup: false, ...capabilities } : undefined,
  };
}

describe('Apple accessibility in Parent Mode', () => {
  afterEach(() => {
    delete (window as unknown as { myWords?: unknown }).myWords;
    deviceAccessibility.value = NO_DEVICE_ACCESSIBILITY;
    document.body.innerHTML = '';
  });

  it('is not there on the desktop', () => {
    setBridge();
    const root = document.createElement('div');
    render(<AppleAccessibilitySection />, root);
    expect(root.textContent).toBe('');
  });

  it('explains Eye Tracking and says it cannot see where anyone looks', () => {
    setBridge({ deviceAccessibility: true, haptics: true });
    const root = document.createElement('div');
    render(<AppleAccessibilitySection />, root);
    expect(root.textContent).toContain('Eye Tracking');
    expect(root.textContent).toContain('cannot see where anyone is looking');
    expect(root.textContent).toContain('Guided Access');
    expect(root.querySelectorAll('input[type="checkbox"]').length).toBe(2);
  });

  it('leaves out the buzz when the device has none', () => {
    setBridge({ deviceAccessibility: true, haptics: false });
    const root = document.createElement('div');
    render(<AppleAccessibilitySection />, root);
    expect(root.querySelectorAll('input[type="checkbox"]').length).toBe(1);
  });

  it('says what the device is asking for, and when Guided Access is on', () => {
    setBridge({ deviceAccessibility: true, haptics: true });
    deviceAccessibility.value = { ...NO_DEVICE_ACCESSIBILITY, reduceMotion: true, textScale: 1.5, guidedAccess: true };
    const root = document.createElement('div');
    render(<AppleAccessibilitySection />, root);
    expect(root.textContent).toContain('Reduce Motion, larger text (×1.5)');
    expect(root.textContent).toContain('the child cannot leave the app');
  });

  it('lists nothing when nothing is on', () => {
    expect(deviceAsking(NO_DEVICE_ACCESSIBILITY)).toEqual([]);
  });
});
