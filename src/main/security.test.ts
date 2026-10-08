// @vitest-environment node
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CONTENT_SECURITY_POLICY,
  MAX_FILE_CHARS,
  SECURITY_HEADERS,
  isAllowedRequest,
  isTrustedSender,
  resolveInside,
  safeExtensions,
  safeFileName,
} from './security';

const ROOT = join('/app', 'dist', 'renderer');

describe('resolveInside', () => {
  it('finds ordinary files', () => {
    expect(resolveInside(ROOT, '/index.html')).toBe(join(ROOT, 'index.html'));
    expect(resolveInside(ROOT, '/assets/index-abc.js')).toBe(join(ROOT, 'assets', 'index-abc.js'));
    expect(resolveInside(ROOT, 'index.html')).toBe(join(ROOT, 'index.html'));
  });

  it('refuses to leave the folder, however the dots are written', () => {
    for (const attack of [
      '/../package.json',
      '/..%2fpackage.json',
      '/%2e%2e/package.json',
      '/%2e%2e%2f%2e%2e%2fetc/passwd',
      '/assets/../../../secret',
      '/assets/%2e%2e/%2e%2e/%2e%2e/secret',
      '/..\\package.json',
      '/%5c..%5cpackage.json',
      '/index.html%00.png',
      '/%2e%2e',
    ]) {
      expect(resolveInside(ROOT, attack), attack).toBeUndefined();
    }
  });

  it('refuses a path that is not valid text, and a name that only starts with the same letters', () => {
    expect(resolveInside(ROOT, '/%E0%A4%A')).toBeUndefined();
    expect(resolveInside(join('/app', 'dist', 'render'), '/../renderer/index.html')).toBeUndefined();
  });
});

describe('isAllowedRequest', () => {
  it('lets the app and in-page data through', () => {
    for (const url of ['app://renderer/index.html', 'blob:app://renderer/1234', 'data:image/png;base64,AAAA']) {
      expect(isAllowedRequest(url), url).toBe(true);
    }
  });

  it('cancels everything that would leave this computer', () => {
    for (const url of [
      'http://example.com/x',
      'https://example.com/x',
      'ws://example.com/socket',
      'wss://example.com/socket',
      'ftp://example.com/x',
      'file:///etc/passwd',
      'chrome-extension://abc/x',
      'about:blank',
      'not a url',
      '',
    ]) {
      expect(isAllowedRequest(url), url).toBe(false);
    }
  });

  it('lets the development server through only in development, and only that one', () => {
    const dev = 'http://localhost:5173';
    expect(isAllowedRequest('http://localhost:5173/src/main.tsx', dev)).toBe(true);
    expect(isAllowedRequest('ws://localhost:5173/', dev)).toBe(true);
    expect(isAllowedRequest('http://localhost:9999/', dev)).toBe(false);
    expect(isAllowedRequest('https://example.com/', dev)).toBe(false);
    expect(isAllowedRequest('http://localhost:5173/src/main.tsx')).toBe(false);
  });
});

describe('isTrustedSender', () => {
  it('trusts the app page and nothing else', () => {
    expect(isTrustedSender('app://renderer/index.html')).toBe(true);
    expect(isTrustedSender('app://other/index.html')).toBe(false);
    expect(isTrustedSender('https://evil.example/')).toBe(false);
    expect(isTrustedSender('file:///tmp/x.html')).toBe(false);
    expect(isTrustedSender(undefined)).toBe(false);
    expect(isTrustedSender('garbage')).toBe(false);
  });

  it('trusts the development page only in development', () => {
    expect(isTrustedSender('http://localhost:5173/', 'http://localhost:5173')).toBe(true);
    expect(isTrustedSender('http://localhost:5173/')).toBe(false);
    expect(isTrustedSender('http://localhost:6000/', 'http://localhost:5173')).toBe(false);
  });
});

describe('the content security policy', () => {
  const directive = (name: string) =>
    CONTENT_SECURITY_POLICY.split('; ').find((d) => d.startsWith(`${name} `));

  it('starts by allowing nothing, then opens only what the app uses', () => {
    expect(directive('default-src')).toBe("default-src 'none'");
    expect(directive('script-src')).toBe("script-src 'self'");
  });

  it('allows no script from anywhere but the app, no eval, no inline script', () => {
    expect(directive('script-src')).not.toMatch(/unsafe-inline|unsafe-eval|https?:|\*/);
  });

  it('names no website anywhere', () => {
    expect(CONTENT_SECURITY_POLICY).not.toMatch(/https?:|\*/);
  });

  it('forbids frames, plug-ins, forms, a changed base address and being framed', () => {
    for (const d of ['object-src', 'frame-src', 'base-uri', 'form-action', 'frame-ancestors', 'worker-src']) {
      expect(directive(d), d).toBe(`${d} 'none'`);
    }
  });

  it('comes with the other headers that keep the page to itself', () => {
    expect(SECURITY_HEADERS['content-security-policy']).toBe(CONTENT_SECURITY_POLICY);
    expect(SECURITY_HEADERS['x-content-type-options']).toBe('nosniff');
    expect(SECURITY_HEADERS['referrer-policy']).toBe('no-referrer');
  });
});

describe('file dialog input', () => {
  it('cleans a file name so it cannot name a folder', () => {
    expect(safeFileName('../../etc/passwd', 'x')).toBe('..-..-etc-passwd'.replace(/^\.+/, ''));
    expect(safeFileName('a/b\\c:d.csv', 'x')).toBe('a-b-c-d.csv');
    expect(safeFileName('', 'fallback.txt')).toBe('fallback.txt');
    expect(safeFileName(42, 'fallback.txt')).toBe('fallback.txt');
    expect(safeFileName('x'.repeat(500), 'f').length).toBe(120);
  });

  it('only accepts plain extensions', () => {
    expect(safeExtensions(['csv', 'obf'])).toEqual(['csv', 'obf']);
    expect(safeExtensions(['../x', 'a b', '', 5, 'exe;'])).toEqual([]);
    expect(safeExtensions('csv')).toEqual([]);
    expect(safeExtensions(Array.from({ length: 30 }, () => 'csv'))).toHaveLength(8);
  });

  it('has a limit on how much text a dialog will write or read', () => {
    expect(MAX_FILE_CHARS).toBeGreaterThan(100_000_000);
    expect(MAX_FILE_CHARS).toBeLessThan(1_000_000_000);
  });
});
