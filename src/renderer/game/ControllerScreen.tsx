import { controllerSpec } from '../platform/linkStatus';

type Props = {
  /** Sends a press to the television. */
  onPress: (button: string) => void;
};

const hex = (colour: number): string => `#${colour.toString(16).padStart(6, '0')}`;

// The iPad as the controller for a game on the Apple TV. The television says what to show: a question and up to
// eight big buttons, which stay where they are for the whole of that question. A press is only ever a person pressing
// something, and the iPad says nothing by itself.
export function ControllerScreen({ onPress }: Props) {
  const spec = controllerSpec.value;
  if (!spec) return <div class="controller-screen"><p class="controller-screen__prompt">No game on the television.</p></div>;

  return (
    <div class="controller-screen">
      <p class="controller-screen__prompt" role="status">
        {spec.prompt}
      </p>
      <p class="controller-screen__turn">{spec.yourTurn ? 'Your turn' : 'Waiting for the others'}</p>
      <div class="controller-screen__grid">
        {spec.buttons.map((button) => (
          <button
            type="button"
            class="controller-screen__button"
            key={button.id}
            style={{ backgroundColor: hex(button.colour) }}
            onClick={() => onPress(button.id)}
          >
            {button.emoji && <span class="controller-screen__emoji" aria-hidden="true">{button.emoji}</span>}
            <span class="controller-screen__label">{button.label}</span>
          </button>
        ))}
      </div>
      <button type="button" class="controller-screen__stop" onClick={() => onPress('quit')}>
        Stop the game
      </button>
    </div>
  );
}
