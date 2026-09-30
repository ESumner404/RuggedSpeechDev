import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { FEELINGS_ITEMS, HELP_ITEMS, INTENSITIES, type Intensity } from '../vocab/feelingsHelp';
import { announceItem, announceText } from '../speech/announce';
import { CalmTab } from '../calm/CalmTab';
import type { Item } from '../store/types';

export type FeelingsHelpTab = 'feelings' | 'help' | 'calm';

type Props = {
  // Controlled by App, not owned here — the route ("feelings") doesn't
  // change when Quick Access's Help button switches the tab, so an
  // internal signal seeded once from an initial prop would go stale.
  tab: FeelingsHelpTab;
  onTabChange: (tab: FeelingsHelpTab) => void;
};

export function FeelingsHelpScreen({ tab, onTabChange }: Props) {
  const chosenFeeling = useSignal<Item | null>(null);

  useEffect(() => {
    chosenFeeling.value = null;
  }, [tab]);

  function pressFeeling(item: Item): void {
    chosenFeeling.value = item;
    announceText(`I feel ${item.label}`);
  }

  function pressIntensity(intensity: Intensity): void {
    if (!chosenFeeling.value) return;
    announceText(`I feel ${chosenFeeling.value.label}, ${intensity}`);
  }

  function pressHelp(item: Item): void {
    void announceItem(item);
  }

  return (
    <div class="feelings-help-screen">
      <div class="page-tabs">
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab === 'feelings'}
          onClick={() => onTabChange('feelings')}
        >
          Feelings
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab === 'help'}
          onClick={() => onTabChange('help')}
        >
          Help
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab === 'calm'}
          onClick={() => onTabChange('calm')}
        >
          Calm
        </button>
      </div>

      {tab === 'feelings' && (
        <div class="feelings-help-screen__body">
          <div class="board-grid feelings-help-screen__grid">
            {FEELINGS_ITEMS.map((item) => (
              <button
                type="button"
                class="board-button"
                key={item.id}
                style={{ backgroundColor: item.background_color }}
                onClick={() => pressFeeling(item)}
                aria-pressed={chosenFeeling.value?.id === item.id}
              >
                {item.image?.kind === 'emoji' && (
                  <span class="board-button__emoji" aria-hidden="true">
                    {item.image.char}
                  </span>
                )}
                <span class="board-button__label">{item.label}</span>
              </button>
            ))}
          </div>
          <div class="intensity-row">
            {INTENSITIES.map((intensity) => (
              <button
                type="button"
                class="intensity-row__button"
                key={intensity}
                disabled={!chosenFeeling.value}
                onClick={() => pressIntensity(intensity)}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'help' && (
        <div class="board-grid feelings-help-screen__grid feelings-help-screen__grid--help">
          {HELP_ITEMS.map((item) => (
            <button
              type="button"
              class="board-button"
              key={item.id}
              style={{ backgroundColor: item.background_color }}
              onClick={() => pressHelp(item)}
            >
              {item.image?.kind === 'emoji' && (
                <span class="board-button__emoji" aria-hidden="true">
                  {item.image.char}
                </span>
              )}
              <span class="board-button__label">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'calm' && <CalmTab />}
    </div>
  );
}
