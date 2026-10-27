import { describe, expect, it } from 'vitest';
import { buildTree, isFamilyList, sayAbout, type FamilyMember } from './family';

const person = (id: string, name: string, extra: Partial<FamilyMember> = {}): FamilyMember => ({
  id,
  name,
  relation: '',
  group: 'family',
  emoji: '🙂',
  parentIds: [],
  ...extra,
});

describe('what is said about a person', () => {
  it('says who they are to the child', () => {
    expect(sayAbout(person('a', 'Sue', { relation: 'Grandma' }))).toBe('This is Sue, my grandma.');
    expect(sayAbout(person('a', 'Mum', { relation: 'Mum' }))).toBe('This is my mum.');
    expect(sayAbout(person('a', 'Lucy', { relation: 'Me' }))).toBe('This is Lucy.');
    expect(sayAbout(person('a', 'Rex', { relation: 'Pet' }))).toBe('This is Rex, my pet.');
  });

  it('says what an adult chose instead, when there is something', () => {
    expect(sayAbout(person('a', 'Sue', { relation: 'Grandma', says: '  Nana Sue lives in Leeds.  ' }))).toBe('Nana Sue lives in Leeds.');
  });
});

describe('the family tree', () => {
  const nan = person('nan', 'Nan', { relation: 'Grandma', partnerId: 'pop' });
  const pop = person('pop', 'Pop', { relation: 'Grandad' });
  const mum = person('mum', 'Mum', { relation: 'Mum', parentIds: ['nan'], partnerId: 'dad' });
  const dad = person('dad', 'Dad', { relation: 'Dad' });
  const me = person('me', 'Lucy', { relation: 'Me', parentIds: ['mum', 'dad'] });
  const sis = person('sis', 'Amy', { relation: 'Sister', parentIds: ['mum'] });
  const friend = person('f', 'Jo', { relation: 'Friend', group: 'friends' });

  it('puts the oldest generation at the top, couples together, and children under their parents', () => {
    const tree = buildTree([me, sis, mum, dad, nan, pop, friend]);
    expect(tree).toHaveLength(1);
    expect(tree[0]!.people.map((p) => p.name)).toEqual(['Nan', 'Pop']);
    const [mumNode] = tree[0]!.children;
    expect(mumNode!.people.map((p) => p.name)).toEqual(['Mum', 'Dad']);
    expect(mumNode!.children.map((c) => c.people[0]!.name)).toEqual(['Lucy', 'Amy']);
  });

  it('leaves friends out, and shows nobody twice', () => {
    const tree = buildTree([me, sis, mum, dad, nan, pop, friend]);
    const names: string[] = [];
    const walk = (nodes: typeof tree): void => nodes.forEach((n) => { names.push(...n.people.map((p) => p.name)); walk(n.children); });
    walk(tree);
    expect(names.sort()).toEqual(['Amy', 'Dad', 'Lucy', 'Mum', 'Nan', 'Pop']);
  });

  it('starts a branch for anyone with no parents here, and copes with a loop', () => {
    const a = person('a', 'A', { parentIds: ['b'] });
    const b = person('b', 'B', { parentIds: ['a'] });
    const names: string[] = [];
    const walk = (nodes: ReturnType<typeof buildTree>): void => nodes.forEach((n) => { names.push(...n.people.map((p) => p.name)); walk(n.children); });
    walk(buildTree([a, b]));
    expect(names.sort()).toEqual(['A', 'B']);
    expect(buildTree([person('x', 'X'), person('y', 'Y')])).toHaveLength(2);
    expect(buildTree([])).toEqual([]);
  });
});

describe('a saved family', () => {
  it('is valid only if every person has the right shape', () => {
    expect(isFamilyList([person('a', 'A')])).toBe(true);
    expect(isFamilyList([{ ...person('a', 'A'), group: 'neighbours' }])).toBe(false);
    expect(isFamilyList([{ ...person('a', 'A'), parentIds: [1] }])).toBe(false);
    expect(isFamilyList('no')).toBe(false);
  });
});
