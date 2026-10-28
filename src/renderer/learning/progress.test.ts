import { describe, expect, it } from 'vitest';
import { languageProgress, wordsOf } from './progress';
import type { ActivityEntry } from '../store/activity';

const monday = new Date(2026, 2, 2, 12).getTime(); // a Monday
const DAY = 24 * 60 * 60 * 1000;
const said = (at: number, label: string): ActivityEntry => ({ at, kind: 'speech', label });

describe('counting words', () => {
  it('ignores capitals and punctuation, and keeps apostrophes inside a word', () => {
    expect(wordsOf('I want, JUICE!')).toEqual(['i', 'want', 'juice']);
    expect(wordsOf("Don't go")).toEqual(["don't", 'go']);
    expect(wordsOf('   ')).toEqual([]);
  });
});

describe('how what is said changes by week', () => {
  const entries = [
    said(monday - 10 * DAY, 'more'),
    said(monday - 9 * DAY, 'want juice'),
    said(monday + 0, 'I want more juice'),
    said(monday + 1 * DAY, 'help'),
    said(monday + 2 * DAY, 'I want a biscuit please'),
    { at: monday + 2 * DAY, kind: 'screen' as const, label: 'Talk' },
  ];

  it('gives a week at a time, oldest first, the last being this one', () => {
    const weeks = languageProgress(entries, monday + 3 * DAY, 3);
    expect(weeks).toHaveLength(3);
    expect(weeks[2]!.start).toBe(new Date(2026, 2, 2).setHours(0, 0, 0, 0));
    expect(weeks[2]!.start - weeks[1]!.start).toBe(7 * DAY);
  });

  it('works out how long what was said is, and how much of it was three words or more', () => {
    const [, , thisWeek] = languageProgress(entries, monday + 3 * DAY, 3);
    expect(thisWeek).toMatchObject({ utterances: 3, longest: 5, threePlus: 2 / 3 });
    expect(thisWeek!.averageWords).toBeCloseTo((4 + 1 + 5) / 3, 1);
  });

  it('counts only speech, not which screens were opened', () => {
    expect(languageProgress(entries, monday + 3 * DAY, 3)[2]!.utterances).toBe(3);
  });

  it('finds words that are new this week, and not ones used before', () => {
    const [first, , thisWeek] = languageProgress(entries, monday + 3 * DAY, 3);
    expect(first!.newWords).toEqual(['juice', 'more', 'want']);
    expect(thisWeek!.newWords).toEqual(['a', 'biscuit', 'help', 'i', 'please']);
    expect(thisWeek!.newWords).not.toContain('more');
  });

  it('keeps a week with nothing said, so a gap shows', () => {
    const weeks = languageProgress([said(monday - 21 * DAY, 'hello')], monday, 3);
    expect(weeks.map((w) => w.utterances)).toEqual([0, 0, 0]);
    expect(weeks[0]!.averageWords).toBe(0);
  });
});
