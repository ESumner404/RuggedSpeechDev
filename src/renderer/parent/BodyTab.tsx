import { myBodySetting } from '../store/db';
import { BodyFigure, HeadPreview } from '../body/BodyFigure';
import {
  CLOTHES_COLOURS,
  DEFAULT_BODY_LOOK,
  EQUIPMENT,
  FIGURE_STARTS,
  HAIR_COLOURS,
  HAIR_STYLES,
  HEADWEAR,
  OUTFITS,
  SKIN_TONES,
  withDefaults,
  type BodyLook,
  type EquipmentId,
  type Figure,
} from '../body/look';

function Swatches({ label, colours, value, onChoose }: { label: string; colours: string[]; value: string; onChoose: (hex: string) => void }) {
  return (
    <div class="body-tab__swatches" role="group" aria-label={label}>
      {colours.map((hex) => (
        <button
          type="button"
          key={hex}
          class={`body-tab__swatch${value === hex ? ' body-tab__swatch--on' : ''}`}
          style={{ background: hex }}
          aria-label={`${label} ${hex}`}
          aria-pressed={value === hex}
          onClick={() => onChoose(hex)}
        />
      ))}
    </div>
  );
}

// Make the figure in My body look like the child: skin, hair, clothes, a
// wheelchair, glasses. It is always drawn clothed, and the private area is
// only ever shown as "Under my pants".
export function BodyTab() {
  const look = withDefaults(myBodySetting.signal.value);

  function update(changes: Partial<BodyLook>): void {
    void myBodySetting.set({ ...withDefaults(myBodySetting.signal.value), ...changes });
  }

  function toggleExtra(id: EquipmentId, on: boolean): void {
    const current = withDefaults(myBodySetting.signal.value).extras;
    update({ extras: on ? [...current.filter((e) => e !== id), id] : current.filter((e) => e !== id) });
  }

  return (
    <div class="parent-mode-screen__body body-tab">
      <div class="body-tab__controls">
        <p class="about-tab__hint">
          Make the figure on <strong>My body</strong> look like the child, so it is easier for them to point to
          themselves. The child finds it in <strong>Feelings &amp; Help</strong> on the Home screen, under <strong>My body</strong>,
          and you can also put it on the top bar in Quick Access. The figure is always dressed.
          The private area is only ever called <strong>Under my pants</strong>, and nothing the child points to
          is saved, flagged or sent anywhere. If a child tells you something that worries you, follow your
          safeguarding procedure.
        </p>

        <h2 class="access-tab__heading">Figure</h2>
        <div class="body-tab__choices" role="group" aria-label="Figure">
          {(Object.keys(FIGURE_STARTS) as Figure[]).map((figure) => (
            <button
              type="button"
              key={figure}
              class={`body-tab__choice${look.figure === figure ? ' body-tab__choice--on' : ''}`}
              aria-pressed={look.figure === figure}
              onClick={() => update(FIGURE_STARTS[figure].changes)}
            >
              <HeadPreview look={{ ...look, ...FIGURE_STARTS[figure].changes }} />
              {FIGURE_STARTS[figure].label}
            </button>
          ))}
        </div>
        <p class="access-tab__hint">Choosing a figure also picks hair and clothes to start from. Change any of them below.</p>

        <h2 class="access-tab__heading">Skin</h2>
        <Swatches label="Skin" colours={SKIN_TONES} value={look.skin} onChoose={(skin) => update({ skin })} />

        <h2 class="access-tab__heading">Hair</h2>
        <Swatches label="Hair" colours={HAIR_COLOURS} value={look.hair} onChoose={(hair) => update({ hair })} />
        <div class="body-tab__choices" role="group" aria-label="Hair style">
          {HAIR_STYLES.map((style) => (
            <button
              type="button"
              key={style.id}
              class={`body-tab__choice${look.hairStyle === style.id ? ' body-tab__choice--on' : ''}`}
              aria-pressed={look.hairStyle === style.id}
              onClick={() => update({ hairStyle: style.id })}
            >
              <HeadPreview look={{ ...look, hairStyle: style.id, headwear: 'none' }} />
              {style.label}
            </button>
          ))}
        </div>

        <h2 class="access-tab__heading">Head covering</h2>
        <div class="body-tab__choices" role="group" aria-label="Head covering">
          {HEADWEAR.map((item) => (
            <button
              type="button"
              key={item.id}
              class={`body-tab__choice${look.headwear === item.id ? ' body-tab__choice--on' : ''}`}
              aria-pressed={look.headwear === item.id}
              onClick={() => update({ headwear: item.id })}
            >
              <HeadPreview look={{ ...look, headwear: item.id }} />
              {item.label}
            </button>
          ))}
        </div>
        {look.headwear !== 'none' && (
          <Swatches label="Head covering colour" colours={CLOTHES_COLOURS} value={look.headwearColour} onChoose={(headwearColour) => update({ headwearColour })} />
        )}
        <p class="access-tab__hint">
          {HEADWEAR.find((item) => item.id === look.headwear)?.hint || 'Only if the child wears one. A hijab, a turban or a kippah can be shown.'}
        </p>

        <h2 class="access-tab__heading">Clothes</h2>
        <div class="body-tab__choices" role="group" aria-label="Bottoms">
          {OUTFITS.map((outfit) => (
            <button
              type="button"
              key={outfit.id}
              class={`body-tab__choice${look.outfit === outfit.id ? ' body-tab__choice--on' : ''}`}
              aria-pressed={look.outfit === outfit.id}
              onClick={() => update({ outfit: outfit.id })}
            >
              {outfit.label}
            </button>
          ))}
        </div>
        <Swatches label="Top" colours={CLOTHES_COLOURS} value={look.top} onChoose={(top) => update({ top })} />
        <Swatches label="Bottoms" colours={CLOTHES_COLOURS} value={look.bottom} onChoose={(bottom) => update({ bottom })} />

        <h2 class="access-tab__heading">Wheelchair and glasses</h2>
        <label class="access-tab__checkbox">
          <input type="checkbox" checked={look.wheelchair} onChange={(event) => update({ wheelchair: (event.target as HTMLInputElement).checked })} />
          Uses a wheelchair
        </label>
        <label class="access-tab__checkbox">
          <input type="checkbox" checked={look.glasses} onChange={(event) => update({ glasses: (event.target as HTMLInputElement).checked })} />
          Wears glasses
        </label>

        <h2 class="access-tab__heading">Equipment and aids</h2>
        <p class="access-tab__hint">
          Show what the child uses. Each one can then be pointed to on My body, to say it hurts, is too tight or is not
          working.
        </p>
        {EQUIPMENT.map((item) => {
          const unavailable = Boolean(item.notWithChair) && look.wheelchair;
          return (
            <label class="access-tab__checkbox" key={item.id}>
              <input
                type="checkbox"
                checked={look.extras.includes(item.id) && !unavailable}
                disabled={unavailable}
                onChange={(event) => toggleExtra(item.id, (event.target as HTMLInputElement).checked)}
              />
              {item.label} <span class="access-tab__preset-hint">{item.hint}</span>
            </label>
          );
        })}
        <button type="button" class="parent-mode-screen__button" onClick={() => void myBodySetting.set({ ...DEFAULT_BODY_LOOK })}>
          Put the figure back to how it started
        </button>
      </div>

      <div class="body-tab__preview" aria-label="How the figure looks">
        <BodyFigure look={look} view="front" />
      </div>
    </div>
  );
}
