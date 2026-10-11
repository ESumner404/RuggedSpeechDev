import { useSignal } from '@preact/signals';
import { seasonsSetting } from '../store/db';
import { announceText } from '../speech/announce';
import { Pic } from '../symbols/Pic';
import { effectiveSeasons, isSeasonShown, seasonItems, suggestedSeason } from '../vocab/seasons';
import { GameScreen } from './GameScreen';
import { SnapScreen } from './SnapScreen';

type Mode = 'words' | 'find' | 'snap';

const MODES: { id: Mode; label: string }[] = [
  { id: 'words', label: 'Words' },
  { id: 'find', label: 'Find the word' },
  { id: 'snap', label: 'Snap' },
];

// Seasons: words and games for a time of year or a celebration. Choose one
// along the top (they always stay in the same order; the one that suits today's
// date is only marked "Now"), then look at its words, find a word, or play
// Snap with them. An adult chooses which to show and can change the words
// (Parent Mode, Seasons). One that is left out leaves its place empty, so
// nothing else moves. Nothing speaks unless a word or button is pressed, there
// is no score and no clock, and nothing here changes anything on a board.
export function SeasonsScreen() {
  const config = seasonsSetting.signal.value;
  const all = effectiveSeasons(config);
  const shown = all.filter((entry) => isSeasonShown(config, entry.id));
  const now = suggestedSeason(new Date());
  const first = shown.find((entry) => entry.id === now) ?? shown[0];
  const chosenId = useSignal<string | null>(null);
  const mode = useSignal<Mode>('words');
  const season = shown.find((entry) => entry.id === chosenId.value) ?? first;

  if (!season) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">No seasons are turned on</p>
        <p class="game-screen__empty-note">An adult can turn some on in Parent Mode (Seasons).</p>
      </div>
    );
  }
  const items = seasonItems(season);

  return (
    <div class="seasons-screen">
      <div class="seasons-screen__choices" role="group" aria-label="Season or celebration">
        {all.map((entry) => {
          const visible = isSeasonShown(config, entry.id);
          return (
            <button
              type="button"
              key={entry.id}
              class={`seasons-screen__choice${season.id === entry.id ? ' seasons-screen__choice--chosen' : ''}${visible ? '' : ' seasons-screen__choice--gap'}`}
              aria-pressed={season.id === entry.id}
              aria-hidden={visible ? undefined : 'true'}
              tabIndex={visible ? undefined : -1}
              disabled={!visible}
              onClick={() => (chosenId.value = entry.id)}
            >
              <Pic class="seasons-screen__choice-emoji" char={entry.emoji} />
              <span>{entry.name}</span>
              {entry.id === now && <span class="seasons-screen__now">Now</span>}
            </button>
          );
        })}
      </div>

      <div class="seasons-screen__modes" role="group" aria-label="What to do">
        {MODES.map((entry) => (
          <button
            type="button"
            key={entry.id}
            class={`seasons-screen__mode${mode.value === entry.id ? ' seasons-screen__mode--chosen' : ''}`}
            aria-pressed={mode.value === entry.id}
            onClick={() => (mode.value = entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div class="seasons-screen__body">
        {items.length === 0 && (
          <p class="seasons-screen__none">There are no words here yet. An adult can add some in Parent Mode (Seasons).</p>
        )}
        {items.length > 0 && mode.value === 'words' && (
          <div class="seasons-screen__words">
            {items.map((item) => (
              <button
                type="button"
                class="seasons-screen__word"
                key={item.id}
                style={{ background: item.background_color }}
                onClick={() => announceText(item.vocalization ?? item.label, { keepInHistory: false })}
              >
                {item.image?.kind === 'emoji' && <Pic class="seasons-screen__word-emoji" char={item.image.char} />}
                <span class="seasons-screen__word-label">{item.label}</span>
              </button>
            ))}
          </div>
        )}
        {items.length > 0 && mode.value === 'find' && <GameScreen key={season.id} fixedWords={items} />}
        {items.length > 0 && mode.value === 'snap' && <SnapScreen key={season.id} fixedWords={items} />}
      </div>
    </div>
  );
}
