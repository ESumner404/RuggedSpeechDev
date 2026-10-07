import { describe, expect, it } from 'vitest';
import { DEFAULT_QUICK_ACCESS, isValidQuickAccess, setQuickAccessSlot } from './quickAccess';

describe('isValidQuickAccess', () => {
  it('accepts the default', () => {
    expect(isValidQuickAccess(DEFAULT_QUICK_ACCESS)).toBe(true);
  });

  it('rejects the wrong length, duplicates, unknown ids, and a missing Help', () => {
    expect(isValidQuickAccess(['home', 'help'])).toBe(false);
    expect(isValidQuickAccess(['home', 'help', 'yes', 'no', 'yes', 'keyboard'])).toBe(false);
    expect(isValidQuickAccess(['home', 'help', 'yes', 'no', 'favourites', 'nonsense'])).toBe(false);
    expect(isValidQuickAccess(['home', 'talk', 'yes', 'no', 'favourites', 'keyboard'])).toBe(false);
    expect(isValidQuickAccess('home')).toBe(false);
  });
});

describe('setQuickAccessSlot', () => {
  it('replaces a slot with a button that is not yet on the bar', () => {
    const result = setQuickAccessSlot(DEFAULT_QUICK_ACCESS, 5, 'talk');
    expect(result).toEqual({ ok: true, buttons: ['home', 'help', 'yes', 'no', 'favourites', 'talk'] });
  });

  it('swaps when the chosen button is already elsewhere, so nothing duplicates', () => {
    const result = setQuickAccessSlot(DEFAULT_QUICK_ACCESS, 0, 'keyboard');
    expect(result).toEqual({ ok: true, buttons: ['keyboard', 'help', 'yes', 'no', 'favourites', 'home'] });
  });

  it('lets Help move, but never leave', () => {
    expect(setQuickAccessSlot(DEFAULT_QUICK_ACCESS, 1, 'home')).toMatchObject({ ok: true });
    const refused = setQuickAccessSlot(DEFAULT_QUICK_ACCESS, 1, 'talk');
    expect(refused.ok).toBe(false);
  });

  it('is a no-op when the slot already holds that button', () => {
    expect(setQuickAccessSlot(DEFAULT_QUICK_ACCESS, 2, 'yes')).toEqual({ ok: true, buttons: DEFAULT_QUICK_ACCESS });
  });
});
