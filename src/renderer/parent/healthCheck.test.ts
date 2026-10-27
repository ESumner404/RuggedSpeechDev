import { describe, expect, it } from 'vitest';
import { parentChecks, progressOf, schoolChecks, type CheckInput } from './healthCheck';

const now = Date.UTC(2026, 5, 15);
const base: CheckInput = { hasVoice: false, lastBackupAt: null, now, hasFamily: false, hasAboutMe: false, hasFavourites: false };

describe('is everything ready (parents)', () => {
  it('starts with nothing done, and each thing says where to go', () => {
    const items = parentChecks(base);
    expect(progressOf(items)).toEqual({ done: 0, total: 5 });
    expect(items.every((item) => item.go && item.goLabel)).toBe(true);
  });

  it('ticks what has been done', () => {
    const items = parentChecks({ ...base, hasVoice: true, hasFamily: true, lastBackupAt: now - 5 * 86_400_000 });
    expect(items.filter((item) => item.done).map((item) => item.id).sort()).toEqual(['backup', 'family', 'voice']);
  });

  it('counts a backup older than a month as not done', () => {
    expect(parentChecks({ ...base, lastBackupAt: now - 40 * 86_400_000 }).find((i) => i.id === 'backup')!.done).toBe(false);
    expect(parentChecks({ ...base, lastBackupAt: now - 29 * 86_400_000 }).find((i) => i.id === 'backup')!.done).toBe(true);
  });
});

describe('is everything ready (school)', () => {
  it('asks about the school’s own things', () => {
    const items = schoolChecks({ ...base, school: { hasDetails: true, hasTimetable: false, hasLessonPages: true, hasTargets: false } });
    expect(items.filter((i) => i.done).map((i) => i.id)).toEqual(['details', 'lessons']);
  });

  it('is written plainly, never as a failing grade', () => {
    const text = JSON.stringify([...parentChecks(base), ...schoolChecks(base)]).toLowerCase();
    for (const word of ['fail', 'poor', 'bad', 'wrong', 'problem']) expect(text).not.toContain(word);
  });
});
