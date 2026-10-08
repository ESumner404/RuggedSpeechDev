import { announceText } from '../speech/announce';
import { quickAccessButtons } from '../store/db';
import { QUICK_ACCESS_LABELS, QUICK_ACCESS_SPEECH } from '../store/quickAccess';
import type { QuickAccessId } from '../store/types';

export type QuickAccessTarget = Exclude<QuickAccessId, 'yes' | 'no' | 'break' | 'question' | 'toilet' | 'finished' | 'again'>;

type Props = {
  onNavigate: (target: QuickAccessTarget) => void;
};

// Persistent across the whole app (invariant I3), this is what keeps Help
// reachable in one press from anywhere, including deep inside a Talk
// folder. Which six buttons sit here is an adult's choice in Parent Mode
// (docs/build-plan.md Phase 2), and Help can never be removed from it.
export function QuickAccessBar({ onNavigate }: Props) {
  function press(id: QuickAccessId): void {
    const phrase = QUICK_ACCESS_SPEECH[id];
    if (phrase) {
      announceText(phrase);
      return;
    }
    onNavigate(id as QuickAccessTarget);
  }

  return (
    <nav class="quick-access-bar">
      {quickAccessButtons.value.map((id) => (
        <button type="button" class="quick-access-bar__button" key={id} data-id={id} onClick={() => press(id)}>
          {QUICK_ACCESS_LABELS[id]}
        </button>
      ))}
    </nav>
  );
}
