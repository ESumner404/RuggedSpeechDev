import { describe, expect, it } from 'vitest';
import { appLinkScheme, isAppLink } from './appLink';

describe('isAppLink', () => {
  it('accepts a link that opens an app', () => {
    for (const link of ['tel:', 'facetime:', 'sms:', 'music:', 'app-settings:', 'ms-settings:', 'maps://', 'mygame://play/level1', ' photos-redirect: ']) {
      expect(isAppLink(link), link).toBe(true);
    }
  });

  it('refuses a web address, a file or a script, in any case', () => {
    for (const link of ['https://example.com', 'HTTP://example.com', 'ftp://x', 'file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,hi', 'blob:abc', 'about:blank']) {
      expect(isAppLink(link), link).toBe(false);
    }
  });

  it('refuses anything that is not a plain link', () => {
    for (const link of ['', '   ', 'no scheme here', 'tel:123 456', 'tel:\u0000', '1abc:', ':x', 'x'.repeat(201), 42, null, undefined]) {
      expect(isAppLink(link), String(link)).toBe(false);
    }
  });

  it('finds the scheme', () => {
    expect(appLinkScheme(' FaceTime:abc')).toBe('facetime');
    expect(appLinkScheme('nothing')).toBeUndefined();
  });
});
