import { describe, expect, it } from 'vitest';
import { generateRecoveryCode } from './recoveryCode';

describe('generateRecoveryCode', () => {
  it('produces three hyphen-separated words', () => {
    const code = generateRecoveryCode(() => 0);
    expect(code.split('-')).toHaveLength(3);
  });

  it('is deterministic for a given random source', () => {
    const a = generateRecoveryCode(() => 0.5);
    const b = generateRecoveryCode(() => 0.5);
    expect(a).toBe(b);
  });

  it('varies with the random source', () => {
    const a = generateRecoveryCode(() => 0);
    const b = generateRecoveryCode(() => 0.99);
    expect(a).not.toBe(b);
  });
});
