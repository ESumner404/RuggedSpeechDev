// Small differences between Windows and a Mac, for wording only. Nothing about
// how the app works depends on which one it is.

export const isMac = (): boolean => typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform || navigator.userAgent);

/** How to open the computer's own emoji picker. */
export const emojiPickerHint = (mac: boolean = isMac()): string =>
  mac ? 'press Control, Command and Space together' : 'press the Windows key and the full stop together';

/** How to switch to another program, which the app cannot stop. */
export const switchProgramKeys = (mac: boolean = isMac()): string => (mac ? 'Command and Tab' : 'Alt and Tab');
