/**
 * What to call the thing the app is running on, in the words an adult reads.
 * "This computer" on a Windows PC or a Mac, "this device" on a phone or tablet.
 * Read when the text is drawn, not when the file is loaded, because the shell
 * that says which device it is starts after the files are loaded.
 */
export function deviceNoun(): string {
  return window.myWords?.platform ? 'device' : 'computer';
}
