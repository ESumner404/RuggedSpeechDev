import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  clearRecent,
  getFavourites,
  getRecentEntries,
  isRecentEnabled,
  recentVersion,
  setRecentEnabled,
} from '../store/db';
import { announceItem, announceText } from '../speech/announce';
import type { Item, RecentEntry } from '../store/types';

export type FavouritesTab = 'favourites' | 'recent';

type Props = {
  // Controlled by App, not owned here — see FeelingsHelpScreen for why an
  // internal signal seeded from an initial prop isn't safe when the route
  // name can stay the same across a tab change.
  tab: FavouritesTab;
  onTabChange: (tab: FavouritesTab) => void;
};

export function FavouritesScreen({ tab, onTabChange }: Props) {
  const favourites = useSignal<Item[]>([]);
  const recentEnabled = useSignal(false);
  const recentEntries = useSignal<RecentEntry[]>([]);

  useEffect(() => {
    void getFavourites().then((items) => {
      favourites.value = items;
    });
  }, []);

  async function refreshRecent(): Promise<void> {
    recentEnabled.value = await isRecentEnabled();
    recentEntries.value = await getRecentEntries();
  }

  // Reading .value here (not just inside the effect below) is what makes
  // this component re-render when a Recent entry is recorded elsewhere —
  // e.g. Quick Access's Yes/No — while this tab is already on screen.
  const version = recentVersion.value;

  useEffect(() => {
    if (tab === 'recent') void refreshRecent();
  }, [tab, version]);

  async function toggleRecentEnabled(): Promise<void> {
    await setRecentEnabled(!recentEnabled.value);
    await refreshRecent();
  }

  async function handleClearRecent(): Promise<void> {
    await clearRecent();
    await refreshRecent();
  }

  return (
    <div class="favourites-screen">
      <div class="page-tabs">
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab === 'favourites'}
          onClick={() => onTabChange('favourites')}
        >
          Favourites
        </button>
        <button
          type="button"
          class="page-tabs__tab"
          aria-pressed={tab === 'recent'}
          onClick={() => onTabChange('recent')}
        >
          Recent
        </button>
      </div>

      {tab === 'favourites' ? (
        <div class="board-grid favourites-screen__grid">
          {favourites.value.map((item) => (
            <button
              type="button"
              class="board-button"
              key={item.id}
              style={{ backgroundColor: item.background_color }}
              onClick={() => void announceItem(item)}
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
      ) : (
        <div class="recent-screen">
          <div class="recent-screen__controls">
            <button type="button" class="recent-screen__toggle" onClick={() => void toggleRecentEnabled()}>
              Recent history: {recentEnabled.value ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              class="recent-screen__clear"
              onClick={() => void handleClearRecent()}
              disabled={recentEntries.value.length === 0}
            >
              Clear
            </button>
          </div>
          {recentEnabled.value ? (
            <ul class="recent-screen__list">
              {recentEntries.value.length === 0 && (
                <li class="recent-screen__empty">Nothing said yet.</li>
              )}
              {recentEntries.value.map((entry) => (
                <li key={entry.id}>
                  <button type="button" class="recent-screen__entry" onClick={() => announceText(entry.text)}>
                    {entry.text}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p class="recent-screen__empty">
              Recent history is off. Turning it on remembers what's spoken here on this device only.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
