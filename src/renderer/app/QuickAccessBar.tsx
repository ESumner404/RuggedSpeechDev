import { announceText } from '../speech/announce';

export type QuickAccessTarget = 'home' | 'help' | 'favourites' | 'keyboard';

type ButtonId = QuickAccessTarget | 'yes' | 'no';

type Props = {
  onNavigate: (target: QuickAccessTarget) => void;
};

// Persistent across the whole app (invariant I3) — this is what keeps Help
// reachable in one press from anywhere, including deep inside a Talk
// folder.
const BUTTONS: { id: ButtonId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'help', label: 'Help' },
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'keyboard', label: 'Keyboard' },
];

export function QuickAccessBar({ onNavigate }: Props) {
  function press(id: ButtonId): void {
    if (id === 'yes' || id === 'no') {
      announceText(id);
      return;
    }
    onNavigate(id);
  }

  return (
    <nav class="quick-access-bar">
      {BUTTONS.map((button) => (
        <button
          type="button"
          class="quick-access-bar__button"
          key={button.id}
          onClick={() => press(button.id)}
        >
          {button.label}
        </button>
      ))}
    </nav>
  );
}
