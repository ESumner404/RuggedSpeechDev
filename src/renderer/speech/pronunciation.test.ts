import { describe, expect, it } from 'vitest';
import { applyPronunciations } from './pronunciation';

const NIAMH = { written: 'Niamh', spoken: 'Neev' };

describe('applyPronunciations', () => {
  it('says a word the way it was asked, whatever its capitals', () => {
    expect(applyPronunciations('I want Niamh', [NIAMH])).toBe('I want Neev');
    expect(applyPronunciations('niamh and NIAMH', [NIAMH])).toBe('Neev and Neev');
  });

  it('changes whole words only', () => {
    const sam = { written: 'Sam', spoken: 'Sam-ee' };
    expect(applyPronunciations('Samuel, Sam and Sam’s dog', [sam])).toBe('Samuel, Sam-ee and Sam-ee’s dog');
  });

  it('leaves text alone when there is nothing to change, or an entry is unfinished', () => {
    expect(applyPronunciations('hello there', [NIAMH])).toBe('hello there');
    expect(applyPronunciations('hello', [])).toBe('hello');
    expect(applyPronunciations('Niamh', [{ written: 'Niamh', spoken: '  ' }, { written: '', spoken: 'x' }])).toBe('Niamh');
  });

  it('prefers the longer entry where two overlap, and never rewrites a replacement', () => {
    const entries = [
      { written: 'Mac', spoken: 'Mack' },
      { written: 'Mac Dougall', spoken: 'Mac Doogle' },
      { written: 'Neev', spoken: 'SHOULD NOT HAPPEN' },
    ];
    expect(applyPronunciations('Mac Dougall met Mac and Niamh', [...entries, NIAMH])).toBe(
      'Mac Doogle met Mack and Neev',
    );
  });

  it('copes with punctuation, accents and characters that mean something in a pattern', () => {
    expect(applyPronunciations('Hi, Zoë!', [{ written: 'Zoë', spoken: 'Zoe-ee' }])).toBe('Hi, Zoe-ee!');
    expect(applyPronunciations('Mr. (X) arrived', [{ written: 'Mr. (X)', spoken: 'Mister X' }])).toBe('Mister X arrived');
  });
});
