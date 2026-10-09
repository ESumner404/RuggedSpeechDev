// Make a tree: a Christmas tree to decorate. The places for decorations are
// fixed, so nothing ever moves: choose a decoration, then press an empty
// place to hang it. Presents go under the tree and the star goes on top.

export type SlotKind = 'top' | 'tree' | 'floor';

export type TreeSlot = {
  id: string;
  kind: SlotKind;
  /** Where it is, as a percentage across and down the picture. */
  x: number;
  y: number;
};

// Worked out from a 300 by 360 picture.
const at = (id: string, kind: SlotKind, x: number, y: number): TreeSlot => ({
  id,
  kind,
  x: Math.round((x / 3) * 10) / 10,
  y: Math.round((y / 3.6) * 10) / 10,
});

export const TREE_SLOTS: TreeSlot[] = [
  at('top', 'top', 150, 34),
  at('t1', 'tree', 150, 88),
  at('t2', 'tree', 128, 118),
  at('t3', 'tree', 172, 118),
  at('t4', 'tree', 132, 148),
  at('t5', 'tree', 168, 148),
  at('t6', 'tree', 106, 184),
  at('t7', 'tree', 150, 178),
  at('t8', 'tree', 194, 184),
  at('t9', 'tree', 122, 218),
  at('t10', 'tree', 178, 218),
  at('t11', 'tree', 98, 248),
  at('t12', 'tree', 150, 248),
  at('t13', 'tree', 202, 248),
  at('t14', 'tree', 66, 278),
  at('t15', 'tree', 108, 278),
  at('t16', 'tree', 150, 278),
  at('t17', 'tree', 192, 278),
  at('t18', 'tree', 234, 278),
  at('f1', 'floor', 58, 334),
  at('f2', 'floor', 118, 338),
  at('f3', 'floor', 182, 338),
  at('f4', 'floor', 242, 334),
];

export type ToolId =
  | 'star'
  | 'red'
  | 'blue'
  | 'gold'
  | 'pink'
  | 'purple'
  | 'light'
  | 'bell'
  | 'candy'
  | 'giftRed'
  | 'giftBlue'
  | 'giftGold'
  | 'off';

export type TreeTool = {
  id: ToolId;
  label: string;
  /** Where it can go; "off" takes a decoration off any place. */
  kind: SlotKind | 'any';
  emoji?: string;
  /** A round bauble is drawn in this colour. */
  colour?: string;
};

export const TREE_TOOLS: TreeTool[] = [
  { id: 'star', label: 'Star', kind: 'top', emoji: '⭐' },
  { id: 'red', label: 'Red bauble', kind: 'tree', colour: '#dc2626' },
  { id: 'blue', label: 'Blue bauble', kind: 'tree', colour: '#2563eb' },
  { id: 'gold', label: 'Gold bauble', kind: 'tree', colour: '#eab308' },
  { id: 'pink', label: 'Pink bauble', kind: 'tree', colour: '#ec4899' },
  { id: 'purple', label: 'Purple bauble', kind: 'tree', colour: '#7c3aed' },
  { id: 'light', label: 'Light', kind: 'tree', emoji: '💡' },
  { id: 'bell', label: 'Bell', kind: 'tree', emoji: '🔔' },
  { id: 'candy', label: 'Sweet', kind: 'tree', emoji: '🍬' },
  { id: 'giftRed', label: 'Red present', kind: 'floor', emoji: '🎁' },
  { id: 'giftBlue', label: 'Blue present', kind: 'floor', colour: '#2563eb', emoji: '🎁' },
  { id: 'giftGold', label: 'Gold present', kind: 'floor', colour: '#eab308', emoji: '🎁' },
  { id: 'off', label: 'Take off', kind: 'any', emoji: '🧽' },
];

/** What has been hung where: the place's id, and what is on it. An empty place is simply absent. */
export type TreeDesign = Record<string, ToolId>;

const TOOL_IDS = new Set<string>(TREE_TOOLS.map((tool) => tool.id));
const SLOT_IDS = new Set<string>(TREE_SLOTS.map((slot) => slot.id));

export const isTreeDesign = (value: unknown): value is TreeDesign =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.entries(value).every(([slot, tool]) => SLOT_IDS.has(slot) && typeof tool === 'string' && TOOL_IDS.has(tool) && tool !== 'off');

export const toolById = (id: ToolId): TreeTool => TREE_TOOLS.find((tool) => tool.id === id)!;

/** What happens when a place is pressed with a tool chosen. */
export type PlaceResult = { design: TreeDesign; message: string };

export function place(design: TreeDesign, slot: TreeSlot, toolId: ToolId): PlaceResult {
  const tool = toolById(toolId);
  if (tool.id === 'off') {
    if (!design[slot.id]) return { design, message: 'There is nothing there to take off.' };
    const rest = { ...design };
    delete rest[slot.id];
    return { design: rest, message: 'Taken off.' };
  }
  if (tool.kind !== slot.kind) {
    const where = tool.kind === 'top' ? 'The star goes on the very top.' : tool.kind === 'floor' ? 'Presents go under the tree.' : 'That goes on the tree.';
    return { design, message: where };
  }
  return { design: { ...design, [slot.id]: tool.id }, message: `${tool.label} hung.` };
}

export const hungCount = (design: TreeDesign): number => Object.keys(design).length;
