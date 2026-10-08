import { themeSetting } from '../store/db';
import { PictureChoices } from '../symbols/PictureChoices';
import { FITZGERALD_CLASSES, FITZGERALD_COLORS, FITZGERALD_LABELS, type FitzgeraldClass } from '../ui/fitzgerald';
import {
  FUN_COLOURS,
  FUN_COLOUR_IDS,
  SCHEME_IDS,
  THEME_PRESETS,
  coloursFor,
  colourDistance,
  contrastRatio,
  readableOn,
  type Theme,
  type ThemeColours,
  type ThemePresetId,
} from '../ui/theme';

const CUSTOM_FIELDS: { key: keyof ThemeColours; label: string; hint: string }[] = [
  { key: 'background', label: 'Background', hint: 'Behind everything.' },
  { key: 'text', label: 'Writing', hint: 'Words and numbers.' },
  { key: 'border', label: 'Outlines', hint: 'Round buttons and boxes.' },
  { key: 'bars', label: 'Bars', hint: 'The top bar and tabs.' },
  { key: 'accent', label: 'Highlight', hint: 'What is selected or being said.' },
];

/** The usual pastel colours are at least about 30 apart, so anything closer than this is harder to tell apart than they are. */
const ALIKE_BELOW = 25;

/** Word colours that look too alike to tell apart, so each kind of word keeps a colour of its own. */
function alikePairs(chosen: Record<FitzgeraldClass, string>): [FitzgeraldClass, FitzgeraldClass][] {
  const pairs: [FitzgeraldClass, FitzgeraldClass][] = [];
  for (let i = 0; i < FITZGERALD_CLASSES.length; i += 1) {
    for (let j = i + 1; j < FITZGERALD_CLASSES.length; j += 1) {
      const a = FITZGERALD_CLASSES[i]!;
      const b = FITZGERALD_CLASSES[j]!;
      if (colourDistance(chosen[a], chosen[b]) < ALIKE_BELOW) pairs.push([a, b]);
    }
  }
  return pairs;
}

// Look: the colours of the whole app. A ready-made scheme, or the adult's own
// colours, and a colour for each kind of word. Changes show at once, because
// the screen they are on is the one being changed.
export function LookTab() {
  const theme = themeSetting.signal.value;
  const colours = coloursFor(theme);
  const readable = contrastRatio(colours.background, colours.text);

  function save(next: Theme): void {
    void themeSetting.set(next);
  }

  function choosePreset(preset: ThemePresetId): void {
    save({ ...theme, preset });
  }

  function setCustom(key: keyof ThemeColours, value: string): void {
    save({ ...theme, preset: 'custom', custom: { ...colours, [key]: value } });
  }

  function setWordColour(cls: FitzgeraldClass, value: string): void {
    save({ ...theme, wordColours: { ...theme.wordColours, [cls]: value } });
  }

  function resetWordColour(cls: FitzgeraldClass): void {
    const rest = { ...theme.wordColours };
    delete rest[cls];
    save({ ...theme, wordColours: rest });
  }

  const chosenWords = Object.fromEntries(
    FITZGERALD_CLASSES.map((cls) => [cls, theme.wordColours[cls] ?? FITZGERALD_COLORS[cls]]),
  ) as Record<FitzgeraldClass, string>;
  const alike = alikePairs(chosenWords);

  return (
    <div class="parent-mode-screen__body look-tab">
      <section class="access-tab__section">
        <h2 class="access-tab__heading">Favourite colour</h2>
        <p class="access-tab__hint">
          Pick a colour and the whole app is washed with it: the background, the bars and the highlight. Writing stays
          dark, so it is still easy to read. Word colours do not change. If High contrast is on in Access, that is
          used instead.
        </p>
        <div class="look-tab__funs" role="group" aria-label="Favourite colour">
          {FUN_COLOUR_IDS.map((id) => (
            <button
              type="button"
              key={id}
              class={`look-tab__fun${theme.preset === id ? ' look-tab__fun--chosen' : ''}`}
              aria-pressed={theme.preset === id}
              onClick={() => choosePreset(id)}
            >
              <span class="look-tab__fun-dot" style={{ background: FUN_COLOURS[id].swatch }} aria-hidden="true" />
              {FUN_COLOURS[id].name}
            </button>
          ))}
        </div>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Other looks</h2>
        <p class="access-tab__hint">Plain, soft, dark and strong contrast looks.</p>
        <div class="look-tab__presets" role="group" aria-label="Colour scheme">
          {SCHEME_IDS.map((id) => {
            const preset = THEME_PRESETS[id];
            return (
              <button
                type="button"
                key={id}
                class={`look-tab__preset${theme.preset === id ? ' look-tab__preset--chosen' : ''}`}
                aria-pressed={theme.preset === id}
                onClick={() => choosePreset(id)}
              >
                <span
                  class="look-tab__swatch"
                  style={{ background: preset.colours.background, color: preset.colours.text, borderColor: preset.colours.border }}
                  aria-hidden="true"
                >
                  <span class="look-tab__swatch-dot" style={{ background: preset.colours.accent }} />
                  Aa
                </span>
                <span class="access-tab__preset-name">{preset.name}</span>
                <span class="access-tab__preset-hint">{preset.hint}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Make your own</h2>
        <p class="access-tab__hint">Choose each colour. It starts from the scheme you are using now.</p>
        <div class="look-tab__custom">
          {CUSTOM_FIELDS.map((field) => (
            <label class="look-tab__colour-row" key={field.key}>
              <input
                type="color"
                value={colours[field.key]}
                aria-label={field.label}
                onInput={(event) => setCustom(field.key, (event.target as HTMLInputElement).value)}
              />
              <span>
                <strong>{field.label}</strong>
                <span class="access-tab__preset-hint"> {field.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <p class="look-tab__readability" role="status" data-readable={readable >= 4.5}>
          {readable >= 4.5
            ? 'The writing is easy to read on this background.'
            : 'The writing is hard to read on this background. Choose colours that are further apart, one light and one dark.'}
        </p>
        {theme.preset === 'custom' && <p class="access-tab__hint">Using your own colours.</p>}
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Colours of the words</h2>
        <p class="access-tab__hint">
          Each kind of word has a colour, so a child can learn to look for it: people, doing words, describing words
          and so on. You can change any of them. Keep each one different from the others so the colour still means
          something.
        </p>
        <div class="look-tab__custom">
          {FITZGERALD_CLASSES.map((cls) => (
            <div class="look-tab__colour-row" key={cls}>
              <input
                type="color"
                value={chosenWords[cls]}
                aria-label={FITZGERALD_LABELS[cls]}
                onInput={(event) => setWordColour(cls, (event.target as HTMLInputElement).value)}
              />
              <span
                class="look-tab__word-sample"
                style={{ background: chosenWords[cls], color: readableOn(chosenWords[cls]) }}
                aria-hidden="true"
              >
                word
              </span>
              <span>{FITZGERALD_LABELS[cls]}</span>
              {theme.wordColours[cls] && (
                <button
                  type="button"
                  class="parent-mode-screen__button"
                  aria-label={`Put back the usual colour for ${FITZGERALD_LABELS[cls]}`}
                  onClick={() => resetWordColour(cls)}
                >
                  Usual colour
                </button>
              )}
            </div>
          ))}
        </div>
        {alike.length > 0 && (
          <p class="look-tab__readability" role="status" data-readable="false">
            {alike
              .map(([a, b]) => `${FITZGERALD_LABELS[a]} and ${FITZGERALD_LABELS[b]}`)
              .join('; ')}{' '}
            look very alike. Choose colours that are easier to tell apart.
          </p>
        )}
        <button
          type="button"
          class="parent-mode-screen__button"
          disabled={Object.keys(theme.wordColours).length === 0}
          onClick={() => save({ ...theme, wordColours: {} })}
        >
          Put all the word colours back
        </button>
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Pictures</h2>
        <p class="access-tab__hint">
          The pictures on the buttons: drawn symbols made for this app, or emoji. And whether each button shows a
          picture, a word or both. Words and pictures you add yourself are never changed. Some emoji have no drawing
          yet, and those still show as emoji.
        </p>
        <PictureChoices />
      </section>

      <section class="access-tab__section">
        <h2 class="access-tab__heading">Start again</h2>
        <button
          type="button"
          class="parent-mode-screen__button"
          disabled={theme.preset === 'standard' && Object.keys(theme.wordColours).length === 0}
          onClick={() => save({ preset: 'standard', custom: { ...THEME_PRESETS.standard.colours }, wordColours: {} })}
        >
          Put everything back to the usual look
        </button>
      </section>
    </div>
  );
}
