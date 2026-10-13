import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_ACCESS_SETTINGS } from '../store/db';
import {
  NO_DEVICE_ACCESSIBILITY,
  buzzOnPress,
  deviceAccessibility,
  followDevice,
  watchDeviceAccessibility,
} from './deviceAccessibility';

const device = (changes: Partial<typeof NO_DEVICE_ACCESSIBILITY>) => ({ ...NO_DEVICE_ACCESSIBILITY, ...changes });

describe('following the device', () => {
  it('changes nothing when the device is asking for nothing', () => {
    expect(followDevice(DEFAULT_ACCESS_SETTINGS, NO_DEVICE_ACCESSIBILITY)).toEqual(DEFAULT_ACCESS_SETTINGS);
  });

  it('adds Reduce Motion and Increase Contrast', () => {
    const result = followDevice(DEFAULT_ACCESS_SETTINGS, device({ reduceMotion: true, increaseContrast: true }));
    expect(result.reduceMotion).toBe(true);
    expect(result.highContrast).toBe('light');
  });

  it('never makes an adult’s own choice weaker', () => {
    const own = { ...DEFAULT_ACCESS_SETTINGS, highContrast: 'dark' as const, reduceMotion: true, textScale: 1.5 };
    const result = followDevice(own, device({ increaseContrast: true, textScale: 1.1 }));
    expect(result.highContrast).toBe('dark');
    expect(result.reduceMotion).toBe(true);
    expect(result.textScale).toBe(1.5);
  });

  it('uses the larger of the two text sizes, and never more than double', () => {
    expect(followDevice(DEFAULT_ACCESS_SETTINGS, device({ textScale: 1.5 })).textScale).toBe(1.5);
    expect(followDevice(DEFAULT_ACCESS_SETTINGS, device({ textScale: 9 })).textScale).toBe(2);
    expect(followDevice(DEFAULT_ACCESS_SETTINGS, device({ textScale: 0.5 })).textScale).toBe(1);
    expect(followDevice(DEFAULT_ACCESS_SETTINGS, device({ textScale: Number.NaN })).textScale).toBe(1);
  });
});

describe('watching the device', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    deviceAccessibility.value = NO_DEVICE_ACCESSIBILITY;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (window as unknown as { myWords?: unknown }).myWords;
  });

  it('does nothing where the device cannot be asked', () => {
    (window as unknown as { myWords: unknown }).myWords = {};
    const stop = watchDeviceAccessibility();
    expect(deviceAccessibility.value).toEqual(NO_DEVICE_ACCESSIBILITY);
    stop();
  });

  it('asks at once, when the app comes back, and every few seconds, until stopped', async () => {
    const ask = vi.fn(async () => device({ reduceMotion: true }));
    (window as unknown as { myWords: unknown }).myWords = { deviceAccessibility: ask };
    const stop = watchDeviceAccessibility();
    await vi.advanceTimersByTimeAsync(0);
    expect(ask).toHaveBeenCalledTimes(1);
    expect(deviceAccessibility.value.reduceMotion).toBe(true);

    window.dispatchEvent(new Event('focus'));
    expect(ask).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(4000);
    expect(ask).toHaveBeenCalledTimes(3);

    stop();
    await vi.advanceTimersByTimeAsync(10_000);
    window.dispatchEvent(new Event('focus'));
    expect(ask).toHaveBeenCalledTimes(3);
  });

  it('keeps the last answer when the device does not reply', async () => {
    const ask = vi.fn(async () => {
      throw new Error('no');
    });
    (window as unknown as { myWords: unknown }).myWords = { deviceAccessibility: ask };
    const stop = watchDeviceAccessibility();
    await vi.advanceTimersByTimeAsync(0);
    expect(deviceAccessibility.value).toEqual(NO_DEVICE_ACCESSIBILITY);
    stop();
  });
});

describe('buzzing on a press', () => {
  afterEach(() => {
    delete (window as unknown as { myWords?: unknown }).myWords;
    document.body.innerHTML = '';
  });

  it('buzzes for a button and not for anything else, and stops when switched off', () => {
    const haptic = vi.fn(async () => undefined);
    (window as unknown as { myWords: unknown }).myWords = { haptic };
    document.body.innerHTML = '<button id="b"><span id="inner">Go</span></button><p id="p">text</p>';
    const stop = buzzOnPress();
    document.getElementById('inner')!.click();
    expect(haptic).toHaveBeenCalledTimes(1);
    document.getElementById('p')!.click();
    expect(haptic).toHaveBeenCalledTimes(1);
    stop();
    document.getElementById('b')!.click();
    expect(haptic).toHaveBeenCalledTimes(1);
  });
});
