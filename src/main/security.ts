import { resolve, sep } from 'node:path';

// The rules the main process holds the window to. They are plain functions
// so they can be tested without starting the app. The window is untrusted by
// construction (PRINCIPLES.md section 3): it can ask for things, and these decide.

/**
 * What the page is allowed to load and do. Everything comes from the app
 * itself; nothing from the internet, ever (invariant I1). Inline styles are
 * allowed because the app sets style attributes (colours, sizes); inline
 * script is not.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' data: blob:",
  "worker-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "child-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

export const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy': CONTENT_SECURITY_POLICY,
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
};

/**
 * Where a request for an app file may land. Returns the absolute path inside
 * `root`, or undefined for anything that would escape it, including `..`
 * written in ways URLs hide (%2e%2e, backslashes, a NUL byte).
 */
export function resolveInside(root: string, requestPath: string): string | undefined {
  let decoded: string;
  try {
    decoded = decodeURIComponent(requestPath);
  } catch {
    return undefined;
  }
  if (decoded.includes('\0') || decoded.includes('\\')) return undefined;
  const base = resolve(root);
  const target = resolve(base, `.${decoded.startsWith('/') ? decoded : `/${decoded}`}`);
  return target === base || target.startsWith(base + sep) ? target : undefined;
}

const LOCAL_PROTOCOLS = new Set(['app:', 'blob:', 'data:', 'devtools:']);

/**
 * Whether a request may go ahead. Only the app's own scheme and in-page
 * data and blobs. Anything else, http, https, ws, ftp or file, is cancelled,
 * so a dependency or a crafted file cannot quietly reach out. In development
 * the page is served by the dev server on this computer, which is let through
 * along with its reload socket.
 */
export function isAllowedRequest(rawUrl: string, devOrigin?: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }
  if (LOCAL_PROTOCOLS.has(url.protocol)) return true;
  if (devOrigin) {
    const dev = new URL(devOrigin);
    if ((url.protocol === 'http:' || url.protocol === 'ws:') && url.host === dev.host) return true;
  }
  return false;
}

/** Whether a message came from the app's own page, and not from anything else that ended up in the window. */
export function isTrustedSender(frameUrl: string | undefined, devOrigin?: string): boolean {
  if (!frameUrl) return false;
  try {
    const url = new URL(frameUrl);
    if (url.protocol === 'app:' && url.host === 'renderer') return true;
    if (devOrigin) return url.origin === new URL(devOrigin).origin;
  } catch {
    return false;
  }
  return false;
}

/** The largest file the app will write or read through the dialogs: a backup with a great many photographs and songs. */
export const MAX_FILE_CHARS = 700_000_000;

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/** A dialog file name with nothing in it that could name a folder or a device. */
export function safeFileName(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.replace(/[\\/:*?"<>|\0]/g, '-').replace(/^\.+/, '').slice(0, 120).trim();
  return cleaned || fallback;
}

export function safeExtensions(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((ext): ext is string => typeof ext === 'string' && /^[a-z0-9]{1,12}$/i.test(ext)).slice(0, 8)
    : [];
}

export function safeLabel(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.slice(0, 80) : fallback;
}
