import { useSignal } from '@preact/signals';
import { seasonsSetting } from '../store/db';
import { FITZGERALD_CLASSES, FITZGERALD_LABELS, type FitzgeraldClass } from '../ui/fitzgerald';
import { Pic } from '../symbols/Pic';
import { emojiPickerHint } from '../ui/platform';
import {
  MAX_CUSTOM_SEASONS,
  MAX_SEASON_WORDS,
  MORE_SEASONS,
  SEASONS,
  TRADITIONS,
  effectiveSeasons,
  isSeasonShown,
  type Season,
  type SeasonWord,
  type SeasonsConfig,
} from '../vocab/seasons';

const usual = (id: string): Season | undefined => SEASONS.find((s) => s.id === id) ?? MORE_SEASONS.find((s) => s.id === id);

// Seasons and celebrations: which ones the child sees in Games (Seasons), and
// the words in each. Everything starts as the usual set. Leave out any that
// are not part of the family's life, change any words to match how they keep
// a celebration, and add others. A season that is left out leaves its place
// empty on the child's screen, so nothing else moves.
export function SeasonsTab() {
  const config = seasonsSetting.signal.value;
  const all = effectiveSeasons(config);
  const open = useSignal<string | null>(null);
  const message = useSignal('');
  const newName = useSignal('');
  const newEmoji = useSignal('🎉');
  const library = useSignal('');
  const wordLabel = useSignal('');
  const wordEmoji = useSignal('⭐');
  const wordKind = useSignal<FitzgeraldClass>('things');

  const available = MORE_SEASONS.filter((entry) => !config.custom.some((c) => c.id === entry.id));

  function save(next: SeasonsConfig): void {
    void seasonsSetting.set(next);
  }

  function toggle(id: string, on: boolean): void {
    save({ ...config, hidden: on ? config.hidden.filter((h) => h !== id) : [...config.hidden.filter((h) => h !== id), id] });
  }

  function setWords(id: string, words: SeasonWord[]): void {
    save({ ...config, words: { ...config.words, [id]: words } });
  }

  function putBack(id: string): void {
    const rest = { ...config.words };
    delete rest[id];
    const original = usual(id);
    // Something added from the list goes back to the list's words; something of your own goes back to empty.
    save({ ...config, words: original && config.custom.some((c) => c.id === id) ? { ...rest, [id]: original.words } : rest });
    message.value = 'Put back the usual words.';
  }

  function changeWord(season: Season, index: number, patch: Partial<SeasonWord>): void {
    const words = season.words.map((word, i) => (i === index ? { ...word, ...patch } : word));
    setWords(season.id, words);
  }

  function addWord(season: Season): void {
    const label = wordLabel.value.trim();
    if (!label || season.words.length >= MAX_SEASON_WORDS) return;
    setWords(season.id, [...season.words, { label, emoji: wordEmoji.value.trim() || '⭐', colour: wordKind.value }]);
    wordLabel.value = '';
  }

  function addOwn(event: Event): void {
    event.preventDefault();
    const name = newName.value.trim();
    if (!name || config.custom.length >= MAX_CUSTOM_SEASONS) return;
    const id = `own-${Date.now().toString(36)}`;
    save({ ...config, custom: [...config.custom, { id, name, emoji: newEmoji.value.trim() || '🎉', tradition: 'Your own' }], words: { ...config.words, [id]: [] } });
    newName.value = '';
    open.value = id;
    message.value = `Added ${name}. Add its words below.`;
  }

  function addFromList(): void {
    const entry = MORE_SEASONS.find((candidate) => candidate.id === library.value);
    if (!entry || config.custom.length >= MAX_CUSTOM_SEASONS) return;
    save({
      ...config,
      custom: [...config.custom, { id: entry.id, name: entry.name, emoji: entry.emoji, tradition: entry.tradition }],
      words: { ...config.words, [entry.id]: entry.words },
    });
    library.value = '';
    open.value = entry.id;
    message.value = `Added ${entry.name}. Check the words suit your family.`;
  }

  function removeOwn(id: string): void {
    const words = { ...config.words };
    delete words[id];
    save({ hidden: config.hidden.filter((h) => h !== id), words, custom: config.custom.filter((c) => c.id !== id) });
    if (open.value === id) open.value = null;
  }

  const groups = TRADITIONS.map((tradition) => ({ tradition, seasons: all.filter((season) => season.tradition === tradition) })).filter(
    (group) => group.seasons.length > 0,
  );

  return (
    <div class="parent-mode-screen__body seasons-tab">
      <p class="about-tab__hint">
        These are the times of the year and celebrations in Games, Seasons. Leave out any that are not part of your
        family&rsquo;s life. A season you leave out leaves its place empty on the child&rsquo;s screen, so nothing else
        moves. You can change the words in any of them, and add others.
      </p>
      <p class="about-tab__hint">
        The words are a starting point. Only you know how your family keeps a celebration, so please read them and change
        anything that is not right for you.
      </p>
      <p role="status" class="music-tab__message">
        {message.value}
      </p>

      {groups.map((group) => (
        <section class="access-tab__section" key={group.tradition}>
          <h2 class="access-tab__heading">{group.tradition}</h2>
          {group.seasons.map((season) => {
            const shown = isSeasonShown(config, season.id);
            const isOpen = open.value === season.id;
            const addedByAdult = config.custom.some((c) => c.id === season.id);
            return (
              <div class="seasons-tab__season" key={season.id}>
                <div class="seasons-tab__row">
                  <label class="seasons-tab__show">
                    <input type="checkbox" checked={shown} onChange={(event) => toggle(season.id, (event.target as HTMLInputElement).checked)} />
                    <Pic class="seasons-tab__emoji" char={season.emoji} />
                    <span>
                      <strong>{season.name}</strong>
                      {season.note && <span class="access-tab__preset-hint"> {season.note}</span>}
                    </span>
                  </label>
                  <button
                    type="button"
                    class="parent-mode-screen__button"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Close the words for' : 'Change the words for'} ${season.name}`}
                    onClick={() => (open.value = isOpen ? null : season.id)}
                  >
                    {isOpen ? 'Close' : 'Change the words'}
                  </button>
                  {addedByAdult && (
                    <button type="button" class="parent-mode-screen__button" aria-label={`Remove ${season.name}`} onClick={() => removeOwn(season.id)}>
                      Remove
                    </button>
                  )}
                </div>

                {isOpen && (
                  <div class="seasons-tab__words">
                    {season.words.length === 0 && <p class="access-tab__hint">No words yet. Add some below.</p>}
                    {season.words.map((word, index) => (
                      <div class="seasons-tab__word" key={index}>
                        <input
                          type="text"
                          class="seasons-tab__emoji-input"
                          aria-label={`Picture for ${word.label || 'this word'}`}
                          maxLength={16}
                          value={word.emoji}
                          onInput={(event) => changeWord(season, index, { emoji: (event.target as HTMLInputElement).value })}
                        />
                        <input
                          type="text"
                          class="parent-mode-screen__label-input"
                          aria-label={`Word ${index + 1} of ${season.name}`}
                          maxLength={40}
                          value={word.label}
                          onInput={(event) => changeWord(season, index, { label: (event.target as HTMLInputElement).value })}
                        />
                        <input
                          type="text"
                          class="parent-mode-screen__label-input"
                          aria-label={`What ${word.label || 'this word'} says, if different`}
                          placeholder="What it says, if different"
                          maxLength={80}
                          value={word.says ?? ''}
                          onInput={(event) => {
                            const says = (event.target as HTMLInputElement).value;
                            const next: SeasonWord = { label: word.label, emoji: word.emoji, colour: word.colour };
                            if (says) next.says = says;
                            setWords(season.id, season.words.map((w, i) => (i === index ? next : w)));
                          }}
                        />
                        <select
                          aria-label={`Kind of word for ${word.label || 'this word'}`}
                          value={word.colour}
                          onChange={(event) => changeWord(season, index, { colour: (event.target as HTMLSelectElement).value as FitzgeraldClass })}
                        >
                          {FITZGERALD_CLASSES.map((kind) => (
                            <option value={kind} key={kind}>
                              {FITZGERALD_LABELS[kind]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          class="parent-mode-screen__button"
                          aria-label={`Remove the word ${word.label || 'this word'} from ${season.name}`}
                          onClick={() => setWords(season.id, season.words.filter((_, i) => i !== index))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {season.words.length < MAX_SEASON_WORDS ? (
                      <form
                        class="seasons-tab__word seasons-tab__add"
                        onSubmit={(event) => {
                          event.preventDefault();
                          addWord(season);
                        }}
                      >
                        <input
                          type="text"
                          class="seasons-tab__emoji-input"
                          aria-label="Picture for the new word"
                          maxLength={16}
                          value={wordEmoji.value}
                          onInput={(event) => (wordEmoji.value = (event.target as HTMLInputElement).value)}
                        />
                        <input
                          type="text"
                          class="parent-mode-screen__label-input"
                          aria-label="The new word"
                          placeholder="A new word"
                          maxLength={40}
                          value={wordLabel.value}
                          onInput={(event) => (wordLabel.value = (event.target as HTMLInputElement).value)}
                        />
                        <select
                          aria-label="Kind of word for the new word"
                          value={wordKind.value}
                          onChange={(event) => (wordKind.value = (event.target as HTMLSelectElement).value as FitzgeraldClass)}
                        >
                          {FITZGERALD_CLASSES.map((kind) => (
                            <option value={kind} key={kind}>
                              {FITZGERALD_LABELS[kind]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" class="parent-mode-screen__button" disabled={!wordLabel.value.trim()}>
                          Add word
                        </button>
                      </form>
                    ) : (
                      <p class="access-tab__hint">That is the most words for one season ({MAX_SEASON_WORDS}).</p>
                    )}
                    <p class="access-tab__hint">
                      To choose a picture, {emojiPickerHint()}, then pick an emoji. The kind of word sets the colour of
                      its button.
                    </p>
                    {(config.words[season.id] !== undefined || addedByAdult) && (usual(season.id) || config.words[season.id]) && (
                      <button type="button" class="parent-mode-screen__button" onClick={() => putBack(season.id)}>
                        Put back the usual words
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Add a celebration</h2>
        {available.length > 0 && (
          <div class="seasons-tab__row">
            <label class="access-tab__select-row">
              From a list
              <select aria-label="Add a celebration from the list" value={library.value} onChange={(event) => (library.value = (event.target as HTMLSelectElement).value)}>
                <option value="">Choose one</option>
                {available.map((entry) => (
                  <option value={entry.id} key={entry.id}>
                    {entry.name} ({entry.tradition === 'Other celebrations' ? 'any family' : entry.tradition})
                  </option>
                ))}
              </select>
            </label>
            <button type="button" class="parent-mode-screen__button" disabled={!library.value || config.custom.length >= MAX_CUSTOM_SEASONS} onClick={addFromList}>
              Add it
            </button>
          </div>
        )}
        <form class="seasons-tab__row" onSubmit={addOwn}>
          <input
            type="text"
            class="seasons-tab__emoji-input"
            aria-label="Picture for your own celebration"
            maxLength={16}
            value={newEmoji.value}
            onInput={(event) => (newEmoji.value = (event.target as HTMLInputElement).value)}
          />
          <input
            type="text"
            class="parent-mode-screen__label-input"
            aria-label="Name of your own celebration"
            placeholder="Or name your own"
            maxLength={40}
            value={newName.value}
            onInput={(event) => (newName.value = (event.target as HTMLInputElement).value)}
          />
          <button type="submit" class="parent-mode-screen__button" disabled={!newName.value.trim() || config.custom.length >= MAX_CUSTOM_SEASONS}>
            Add
          </button>
        </form>
        <p class="access-tab__hint">Up to {MAX_CUSTOM_SEASONS} of your own.</p>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Start again</h2>
        <button
          type="button"
          class="parent-mode-screen__button"
          disabled={config.hidden.length === 0 && Object.keys(config.words).length === 0 && config.custom.length === 0}
          onClick={() => {
            save({ hidden: [], words: {}, custom: [] });
            open.value = null;
            message.value = 'Everything is back to the usual seasons and words.';
          }}
        >
          Put everything back to the usual
        </button>
      </section>
    </div>
  );
}
