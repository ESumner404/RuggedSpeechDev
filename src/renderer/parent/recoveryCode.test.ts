import { describe, expect, it } from 'vitest';
import { WORDS, generateRecoveryCode } from './recoveryCode';

describe('generateRecoveryCode', () => {
  it('has 64 different plain words to draw from', () => {
    expect(WORDS).toHaveLength(64);
    expect(new Set(WORDS).size).toBe(64);
    expect(WORDS.every((w) => /^[a-z]+$/.test(w))).toBe(true);
  });

  it('makes four hyphen-separated words', () => {
    const code = generateRecoveryCode();
    expect(code.split('-')).toHaveLength(4);
    expect(code.split('-').every((w) => WORDS.includes(w))).toBe(true);
  });

  it('is deterministic for a given source of random bytes, and varies with it', () => {
    const fixed = (value: number) => (bytes: Uint8Array) => void bytes.fill(value);
    expect(generateRecoveryCode(fixed(0))).toBe(`${WORDS[0]}-${WORDS[0]}-${WORDS[0]}-${WORDS[0]}`);
    expect(generateRecoveryCode(fixed(5))).toBe(`${WORDS[5]}-${WORDS[5]}-${WORDS[5]}-${WORDS[5]}`);
  });

  it('every word is equally likely: all 256 byte values land evenly on the 64 words', () => {
    const counts = new Array(64).fill(0) as number[];
    for (let value = 0; value < 256; value += 1) {
      const code = generateRecoveryCode((bytes) => void bytes.fill(value));
      counts[WORDS.indexOf(code.split('-')[0]!)]! += 1;
    }
    expect(new Set(counts).size).toBe(1);
  });

  it('does not use Math.random', () => {
    const real = Math.random;
    Math.random = () => {
      throw new Error('Math.random must not be used for a recovery code');
    };
    try {
      expect(() => generateRecoveryCode()).not.toThrow();
    } finally {
      Math.random = real;
    }
  });
});
