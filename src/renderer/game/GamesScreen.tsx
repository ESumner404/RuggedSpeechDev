import { useSignal } from '@preact/signals';
import { DrawScreen } from '../draw/DrawScreen';
import { GameScreen } from './GameScreen';
import { JokesScreen } from './JokesScreen';
import { MusicScreen } from '../music/MusicScreen';
import { PianoScreen } from '../music/PianoScreen';
import { RideScreen } from './RideScreen';
import { SeasonsScreen } from './SeasonsScreen';
import { SnapScreen } from './SnapScreen';
import { TreeScreen } from './TreeScreen';

type Which = 'find' | 'snap' | 'ride' | 'draw' | 'jokes' | 'music' | 'piano' | 'seasons' | 'tree';

const GAMES: { id: Which; label: string; icon: string; hint: string }[] = [
  { id: 'find', label: 'Find the word', icon: '🔎', hint: 'Match the word to the picture.' },
  { id: 'snap', label: 'Snap', icon: '🃏', hint: 'Turn the cards. Press SNAP for two the same.' },
  { id: 'ride', label: 'Rollercoaster', icon: '🎢', hint: 'Build a sentence to climb each hill.' },
  { id: 'draw', label: 'Draw', icon: '🎨', hint: 'Make a picture.' },
  { id: 'jokes', label: 'Jokes', icon: '😄', hint: 'Questions and answers to make you laugh.' },
  { id: 'music', label: 'Music', icon: '🎵', hint: 'Songs to listen to.' },
  { id: 'piano', label: 'Piano', icon: '🎹', hint: 'Play the keys.' },
  { id: 'seasons', label: 'Seasons', icon: '🍂', hint: 'Words and games for times of the year.' },
  { id: 'tree', label: 'Make a tree', icon: '🎄', hint: 'Hang decorations on a Christmas tree.' },
];

// A small menu of things to do for fun. The nine tiles stay in the same
// places, and each game has the same "All games" button in the same corner.
// None keeps a score against anyone, none has a clock, and none speaks
// unless a button is pressed.
export function GamesScreen() {
  const which = useSignal<Which | null>(null);

  if (which.value === null) {
    return (
      <div class="games-menu">
        {GAMES.map((game) => (
          <button type="button" class="games-menu__tile" key={game.id} onClick={() => (which.value = game.id)}>
            <span class="games-menu__icon" aria-hidden="true">
              {game.icon}
            </span>
            <span class="games-menu__label">{game.label}</span>
            <span class="games-menu__hint">{game.hint}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div class="games-shell">
      <button type="button" class="games-shell__back" onClick={() => (which.value = null)}>
        All games
      </button>
      <div class="games-shell__game">
        {which.value === 'find' && <GameScreen />}
        {which.value === 'snap' && <SnapScreen />}
        {which.value === 'ride' && <RideScreen />}
        {which.value === 'draw' && <DrawScreen />}
        {which.value === 'jokes' && <JokesScreen />}
        {which.value === 'music' && <MusicScreen />}
        {which.value === 'piano' && <PianoScreen />}
        {which.value === 'seasons' && <SeasonsScreen />}
        {which.value === 'tree' && <TreeScreen />}
      </div>
    </div>
  );
}
