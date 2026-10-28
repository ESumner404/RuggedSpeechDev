import { describe, expect, it } from 'vitest';
import { linkLessonPages, suggestPage } from './lessonPages';
import { EMPTY_ROUTINE } from '../store/db';

const pages = [
  { id: 'p1', name: 'Maths lesson', boardId: 'b1' },
  { id: 'p2', name: 'Lunchtime', boardId: 'b2' },
  { id: 'p3', name: 'Story time', boardId: 'b3' },
  { id: 'p4', name: 'Science and nature', boardId: 'b4' },
  { id: 'p5', name: 'Science week', boardId: 'b5' },
];

describe('which page goes with a timetable activity', () => {
  it('matches by name, either way round', () => {
    expect(suggestPage('Maths', pages)?.id).toBe('p1');
    expect(suggestPage('Lunch', pages)?.id).toBe('p2');
    expect(suggestPage('Story time', pages)?.id).toBe('p3');
    expect(suggestPage('Maths lesson with Mr Khan', pages)?.id).toBe('p1');
  });

  it('gives none for a short name, no match, or more than one match', () => {
    expect(suggestPage('PE', pages)).toBeUndefined();
    expect(suggestPage('Swimming', pages)).toBeUndefined();
    expect(suggestPage('Science', pages)).toBeUndefined();
  });
});

describe('linking the timetable to the pages', () => {
  it('sets the page where there is a clear match, and leaves everything else as it was', () => {
    const routine = {
      ...EMPTY_ROUTINE,
      mon: [
        { id: 'a', name: 'Maths' },
        { id: 'b', name: 'Swimming' },
        { id: 'c', name: 'Lunch', pageId: 'custom' },
      ],
      tue: [{ id: 'd', name: 'Story time' }],
    };
    const { routine: next, linked } = linkLessonPages(routine, pages);
    expect(linked).toBe(2);
    expect(next.mon.map((a) => a.pageId)).toEqual(['p1', undefined, 'custom']);
    expect(next.tue[0]!.pageId).toBe('p3');
    expect(routine.mon[0]!.pageId).toBeUndefined();
  });
});

describe('an activity whose page was cleared', () => {
  it('counts as having none, so it can be linked again', () => {
    const routine = { ...EMPTY_ROUTINE, mon: [{ id: 'a', name: 'Maths', pageId: '' }] };
    expect(linkLessonPages(routine, pages).routine.mon[0]!.pageId).toBe('p1');
  });
});
