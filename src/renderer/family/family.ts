// My family and friends: the people who matter to the child, with a photo and a name each, and a family tree that
// shows how they belong together. An adult builds it in Parent Mode; the child presses a person to hear who they are.
// Kept on this device, and in a backup an adult saves, like everything else (PRINCIPLES.md I2).

export type FamilyMember = {
  id: string;
  name: string;
  /** How they are to the child: Mum, Grandad, Auntie, Best friend. */
  relation: string;
  group: 'family' | 'friends';
  /** A picture when there is no photo, one emoji. */
  emoji: string;
  /** A photo, in the same store as every other photo. */
  photoBlobId?: string;
  /** The people this person is a child of, for the tree. */
  parentIds: string[];
  /** Who they are partners with, for the tree. */
  partnerId?: string;
  /** What to say when they are pressed, if not "This is Mum, my mum". */
  says?: string;
};

export const MAX_FAMILY = 60;

export const isFamilyList = (value: unknown): value is FamilyMember[] =>
  Array.isArray(value) &&
  value.length <= MAX_FAMILY &&
  value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const m = entry as Record<string, unknown>;
    return (
      typeof m['id'] === 'string' &&
      typeof m['name'] === 'string' &&
      typeof m['relation'] === 'string' &&
      (m['group'] === 'family' || m['group'] === 'friends') &&
      typeof m['emoji'] === 'string' &&
      (m['photoBlobId'] === undefined || typeof m['photoBlobId'] === 'string') &&
      Array.isArray(m['parentIds']) &&
      m['parentIds'].every((id) => typeof id === 'string') &&
      (m['partnerId'] === undefined || typeof m['partnerId'] === 'string') &&
      (m['says'] === undefined || typeof m['says'] === 'string')
    );
  });

export const RELATIONS = [
  'Me',
  'Mum',
  'Dad',
  'Sister',
  'Brother',
  'Grandma',
  'Grandad',
  'Auntie',
  'Uncle',
  'Cousin',
  'Stepmum',
  'Stepdad',
  'Carer',
  'Friend',
  'Best friend',
  'Teacher',
  'Pet',
] as const;

/** What is said when a person is pressed. */
export function sayAbout(member: FamilyMember): string {
  if (member.says?.trim()) return member.says.trim();
  const relation = member.relation.trim();
  if (!relation || relation.toLowerCase() === 'me') return `This is ${member.name}.`;
  if (relation.toLowerCase() === member.name.trim().toLowerCase()) return `This is my ${relation.toLowerCase()}.`;
  return `This is ${member.name}, my ${relation.toLowerCase()}.`;
}

export type TreeNode = {
  /** The person, and their partner beside them if they have one. */
  people: FamilyMember[];
  children: TreeNode[];
};

/**
 * The family as a tree, from the oldest generation down. Partners sit side by side as one couple, children hang from
 * their parents (a child of two couples hangs from the first one found), and anybody with no parent here starts a
 * branch of their own. Friends are not in the tree. A person is never shown twice, and a muddle (someone who is
 * their own grandparent) cannot make it run forever.
 */
export function buildTree(members: FamilyMember[]): TreeNode[] {
  const family = members.filter((member) => member.group === 'family');
  const byId = new Map(family.map((member) => [member.id, member]));
  const placed = new Set<string>();

  const partnerOf = (member: FamilyMember): FamilyMember | undefined => {
    const direct = member.partnerId ? byId.get(member.partnerId) : undefined;
    if (direct) return direct;
    return family.find((other) => other.partnerId === member.id);
  };

  const hasParentHere = (member: FamilyMember): boolean => member.parentIds.some((id) => byId.has(id));
  // A person with no parents here starts a branch, unless their partner has parents here: then they join that branch.
  const isRoot = (member: FamilyMember): boolean => {
    if (hasParentHere(member)) return false;
    const partner = partnerOf(member);
    return !partner || !hasParentHere(partner);
  };

  const build = (member: FamilyMember): TreeNode => {
    placed.add(member.id);
    const partner = partnerOf(member);
    if (partner && !placed.has(partner.id)) placed.add(partner.id);
    const couple = partner ? [member, partner] : [member];
    const ids = new Set(couple.map((person) => person.id));
    const children = family
      .filter((child) => !placed.has(child.id) && child.parentIds.some((id) => ids.has(id)))
      .map((child) => (placed.has(child.id) ? null : build(child)))
      .filter((node): node is TreeNode => node !== null);
    return { people: couple, children };
  };

  const roots: TreeNode[] = [];
  for (const member of family) {
    if (placed.has(member.id) || !isRoot(member)) continue;
    roots.push(build(member));
  }
  // Anybody left is in a loop with no way in; show them rather than lose them.
  for (const member of family) if (!placed.has(member.id)) roots.push(build(member));
  return roots;
}

/** A copy of a person without one optional field, for taking a photo or a partner away. */
export function without(member: FamilyMember, field: 'photoBlobId' | 'partnerId' | 'says'): FamilyMember {
  const copy = { ...member };
  delete copy[field];
  return copy;
}
