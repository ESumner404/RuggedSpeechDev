import { useSignal } from '@preact/signals';
import { treeDesignSetting } from '../store/db';
import { Pic } from '../symbols/Pic';
import { TREE_SLOTS, TREE_TOOLS, hungCount, place, toolById, type ToolId, type TreeDesign, type TreeSlot } from './tree';

function Hung({ tool }: { tool: ToolId }) {
  const item = toolById(tool);
  if (item.colour && !item.emoji) return <span class="tree-screen__bauble" style={{ background: item.colour }} aria-hidden="true" />;
  return (
    <span class="tree-screen__emoji" aria-hidden="true">
      {item.emoji ? <Pic char={item.emoji} class="tree-screen__pic" /> : null}
    </span>
  );
}

const slotName = (slot: TreeSlot): string =>
  slot.kind === 'top' ? 'the top of the tree' : slot.kind === 'floor' ? 'a place under the tree' : 'a place on the tree';

// Make a tree: choose a decoration, then press a place to hang it. The places
// never move, there is no score and no clock, and nothing is said unless
// something is pressed. What is hung is remembered, so the tree is still there
// next time, and Undo takes back the last thing done.
export function TreeScreen() {
  const tool = useSignal<ToolId>('red');
  const message = useSignal('Choose a decoration, then press a place on the tree.');
  const history = useSignal<TreeDesign[]>([]);
  const design = treeDesignSetting.signal.value;

  function commit(next: TreeDesign, said: string): void {
    if (next !== design) {
      history.value = [...history.value.slice(-30), design];
      void treeDesignSetting.set(next);
    }
    message.value = said;
  }

  function press(slot: TreeSlot): void {
    const result = place(design, slot, tool.value);
    commit(result.design, result.message);
  }

  function undo(): void {
    const previous = history.value[history.value.length - 1];
    if (!previous) return;
    history.value = history.value.slice(0, -1);
    void treeDesignSetting.set(previous);
    message.value = 'Undone.';
  }

  function startAgain(): void {
    if (hungCount(design) === 0) return;
    commit({}, 'The tree is bare again. Undo brings it back.');
  }

  return (
    <div class="tree-screen">
      <div class="tree-screen__stage">
        <div class="tree-screen__picture">
          <svg class="tree-screen__svg" viewBox="0 0 300 360" role="img" aria-label="A Christmas tree to decorate">
            <rect x="0" y="0" width="300" height="360" fill="#e0f2fe" />
            <rect x="0" y="318" width="300" height="42" fill="#f8fafc" />
            <rect x="133" y="282" width="34" height="40" fill="#92400e" stroke="#1a1a1a" stroke-width="2" />
            <polygon points="150,168 36,288 264,288" fill="#15803d" stroke="#1a1a1a" stroke-width="2.5" />
            <polygon points="150,100 66,200 234,200" fill="#16a34a" stroke="#1a1a1a" stroke-width="2.5" />
            <polygon points="150,46 96,132 204,132" fill="#22c55e" stroke="#1a1a1a" stroke-width="2.5" />
          </svg>
          {TREE_SLOTS.map((slot) => {
            const hung = design[slot.id];
            return (
              <button
                type="button"
                key={slot.id}
                class={`tree-screen__slot tree-screen__slot--${slot.kind}${hung ? ' tree-screen__slot--full' : ''}`}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                aria-label={hung ? `${toolById(hung).label} on ${slotName(slot)}` : `Empty place on ${slotName(slot)}`}
                onClick={() => press(slot)}
              >
                {hung && <Hung tool={hung} />}
              </button>
            );
          })}
        </div>
      </div>

      <div class="tree-screen__side">
        <p class="game-screen__message" role="status">
          {message.value}
        </p>
        <div class="tree-screen__tools" role="group" aria-label="Decorations">
          {TREE_TOOLS.map((item) => (
            <button
              type="button"
              key={item.id}
              class={`tree-screen__tool${tool.value === item.id ? ' tree-screen__tool--chosen' : ''}`}
              aria-pressed={tool.value === item.id}
              onClick={() => (tool.value = item.id)}
            >
              <span class="tree-screen__tool-sample" aria-hidden="true">
                {item.colour && !item.emoji ? (
                  <span class="tree-screen__bauble" style={{ background: item.colour }} />
                ) : (
                  <Pic char={item.emoji ?? ''} class="tree-screen__pic" />
                )}
              </span>
              <span class="tree-screen__tool-label">{item.label}</span>
            </button>
          ))}
        </div>
        <div class="tree-screen__controls">
          <button type="button" class="game-screen__button" disabled={history.value.length === 0} onClick={undo}>
            Undo
          </button>
          <button type="button" class="game-screen__button" disabled={hungCount(design) === 0} onClick={startAgain}>
            Start again
          </button>
        </div>
      </div>
    </div>
  );
}
