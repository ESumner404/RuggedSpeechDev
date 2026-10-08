import { describe, expect, it } from 'vitest';
import { ageYears, deviceTitle, possessive } from './deviceName';
import { EMPTY_USER_PROFILE } from '../store/db';

describe('deviceTitle', () => {
  it('is the app\'s own name until someone is named', () => {
    expect(deviceTitle(EMPTY_USER_PROFILE)).toBe('Rugged Speech Test');
  });

  it('makes "Lucy\'s device" from a name, and "James\'s device" too', () => {
    expect(deviceTitle({ ...EMPTY_USER_PROFILE, name: ' Lucy ' })).toBe("Lucy's device");
    expect(possessive('James')).toBe("James's");
  });

  it('uses the device name as typed when there is one', () => {
    expect(deviceTitle({ ...EMPTY_USER_PROFILE, name: 'Lucy', deviceName: "Lucy's talker" })).toBe("Lucy's talker");
  });
});

describe('ageYears', () => {
  it('reads whole years only', () => {
    expect(ageYears({ ...EMPTY_USER_PROFILE, age: '6' })).toBe(6);
    expect(ageYears({ ...EMPTY_USER_PROFILE, age: '' })).toBeUndefined();
    expect(ageYears({ ...EMPTY_USER_PROFILE, age: '6.5' })).toBeUndefined();
    expect(ageYears({ ...EMPTY_USER_PROFILE, age: 'six' })).toBeUndefined();
  });
});
