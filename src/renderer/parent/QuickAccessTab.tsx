import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getQuickAccess, setQuickAccess } from '../store/db';
import { DEFAULT_QUICK_ACCESS, QUICK_ACCESS_LABELS, setQuickAccessSlot } from '../store/quickAccess';
import { QUICK_ACCESS_IDS, type QuickAccessId } from '../store/types';

// The six buttons along the top of every screen (PLAN.md Phase 2). Changing
// them is a deliberate adult action here, never something that happens on
// its own (invariant I3) — and Help can move but never leave, so it stays
// one press away from every screen.
export function QuickAccessTab() {
  const buttons = useSignal<QuickAccessId[]>(DEFAULT_QUICK_ACCESS);
  const message = useSignal<string | null>(null);
  const loaded = useSignal(false);

  useEffect(() => {
    void getQuickAccess().then((stored) => {
      buttons.value = stored;
      loaded.value = true;
    });
  }, []);

  async function choose(slot: number, id: QuickAccessId): Promise<void> {
    const result = setQuickAccessSlot(buttons.value, slot, id);
    if (!result.ok) {
      message.value = result.reason;
      // A fresh array so the select snaps back to what's really there.
      buttons.value = [...buttons.value];
      return;
    }
    message.value = null;
    buttons.value = result.buttons;
    await setQuickAccess(result.buttons);
  }

  async function reset(): Promise<void> {
    message.value = null;
    buttons.value = [...DEFAULT_QUICK_ACCESS];
    await setQuickAccess([...DEFAULT_QUICK_ACCESS]);
  }

  if (!loaded.value) return null;

  return (
    <div class="parent-mode-screen__body quick-access-tab">
      <p class="quick-access-tab__hint">
        These six buttons sit along the top of every screen, left to right. Pick what each
        one should be.
      </p>
      <ol class="quick-access-tab__slots">
        {buttons.value.map((id, slot) => (
          <li class="quick-access-tab__slot" key={slot}>
            <label>
              Button {slot + 1}
              <select
                value={id}
                onChange={(event) => void choose(slot, (event.target as HTMLSelectElement).value as QuickAccessId)}
              >
                {QUICK_ACCESS_IDS.map((option) => (
                  <option value={option} key={option}>
                    {QUICK_ACCESS_LABELS[option]}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ol>
      {message.value && <p class="parent-mode-screen__error">{message.value}</p>}
      <button type="button" class="parent-mode-screen__button" onClick={() => void reset()}>
        Put back the usual six
      </button>
    </div>
  );
}
