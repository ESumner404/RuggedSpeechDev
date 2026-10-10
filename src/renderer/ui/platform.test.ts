import { describe, expect, it } from 'vitest';
import { emojiPickerHint, switchProgramKeys } from './platform';

describe('wording for Windows and a Mac', () => {
  it('says how to open the emoji picker on each', () => {
    expect(emojiPickerHint(false)).toContain('Windows key');
    expect(emojiPickerHint(true)).toContain('Control, Command and Space');
  });

  it('says how to switch program on each', () => {
    expect(switchProgramKeys(false)).toBe('Alt and Tab');
    expect(switchProgramKeys(true)).toBe('Command and Tab');
  });
});
