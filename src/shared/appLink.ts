// A link that opens another app on the same device (a phone call, the camera, a game, the device's settings).
// An adult adds these in Parent Mode and the child presses one. A link opens an app and nothing else: a web
// address is refused, because it would open a browser and go onto the internet (PRINCIPLES.md I1). The main
// process of the desktop app and the page both use this, so what the page allows and what the app will do agree.

const MAX_LENGTH = 200;

const WEB_AND_FILE_SCHEMES = new Set([
  'http',
  'https',
  'ftp',
  'ftps',
  'sftp',
  'ws',
  'wss',
  'smb',
  'file',
  'data',
  'blob',
  'javascript',
  'vbscript',
  'about',
  'chrome',
  'view-source',
]);

/** The scheme of a link, lower case, or undefined if it does not start with one. */
export function appLinkScheme(link: string): string | undefined {
  return /^([a-z][a-z0-9+.-]*):/i.exec(link.trim())?.[1]?.toLowerCase();
}

/** Whether this opens another app. Not a web page, a file or a script, and with no spaces or odd characters in it. */
export function isAppLink(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const link = value.trim();
  if (link.length === 0 || link.length > MAX_LENGTH) return false;
  // eslint-disable-next-line no-control-regex
  if (/[\s\u0000-\u001f\u007f]/.test(link)) return false;
  const scheme = appLinkScheme(link);
  return scheme !== undefined && !WEB_AND_FILE_SCHEMES.has(scheme);
}
