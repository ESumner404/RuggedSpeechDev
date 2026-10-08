import { useSignal } from '@preact/signals';

// Drag-and-drop reordering for the button lists in Parent Mode (docs/build-plan.md
// Phase 4). Only a small handle is draggable, making the whole row
// draggable would turn selecting text inside its label field into an
// accidental drag. Rows are the drop targets, and a drop swaps the two
// buttons (see swapButtons). The ▲/▼ buttons stay as the keyboard fallback.
export function useRowDragDrop(onSwap: (draggedId: string, targetId: string) => void) {
  const draggingId = useSignal<string | null>(null);
  const overId = useSignal<string | null>(null);

  return {
    draggingId,
    overId,

    start(event: DragEvent, id: string): void {
      draggingId.value = id;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        // Chromium won't begin a drag without some data attached.
        event.dataTransfer.setData('text/plain', id);
      }
    },

    end(): void {
      draggingId.value = null;
      overId.value = null;
    },

    over(event: DragEvent, id: string): void {
      if (draggingId.value === null || draggingId.value === id) return;
      event.preventDefault();
      if (overId.value !== id) overId.value = id;
    },

    drop(event: DragEvent, id: string): void {
      event.preventDefault();
      const dragged = draggingId.value;
      draggingId.value = null;
      overId.value = null;
      if (dragged !== null && dragged !== id) onSwap(dragged, id);
    },
  };
}
