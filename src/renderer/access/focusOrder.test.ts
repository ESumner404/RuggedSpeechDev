import { afterEach, describe, expect, it } from 'vitest';
import { focusableElements, focusNext } from './focusOrder';

describe('focusOrder (PLAN.md Phase 7)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not treat a stylesheet <link href> in <head> as focusable', () => {
    // A real regression: [href] alone also matches <link>, which isn't
    // focusable — calling .focus() on it is a silent no-op that stalls
    // the whole Space-advance chain on the very first press.
    const found = focusableElements(document);
    expect(found.every((el) => el.tagName !== 'LINK')).toBe(true);
  });

  it('advances through real buttons in document order', () => {
    document.body.innerHTML = '<button id="a">A</button><button id="b">B</button>';
    const a = document.getElementById('a')!;
    const b = document.getElementById('b')!;
    a.focus();
    expect(document.activeElement).toBe(a);

    focusNext();
    expect(document.activeElement).toBe(b);
  });

  it('wraps from the last focusable element back to the first', () => {
    document.body.innerHTML = '<button id="a">A</button><button id="b">B</button>';
    document.getElementById('b')!.focus();

    focusNext();
    expect(document.activeElement?.id).toBe('a');
  });

  it('skips a disabled button and one already removed from tab order', () => {
    document.body.innerHTML =
      '<button id="a">A</button><button id="mid" disabled>Mid</button><button id="hidden" tabindex="-1">Hidden</button><button id="c">C</button>';
    document.getElementById('a')!.focus();

    focusNext();
    expect(document.activeElement?.id).toBe('c');
  });

  it('starts at the first focusable element when nothing is currently focused', () => {
    document.body.innerHTML = '<button id="a">A</button><button id="b">B</button>';
    focusNext();
    expect(document.activeElement?.id).toBe('a');
  });
});
