import { useSignal } from '@preact/signals';
import { appsSetting } from '../store/db';

// Other apps on this device: a big tile for each one an adult has added. The device opens that app when a tile is
// pressed, never by itself, and only to an app, never to a web page.
export function AppsScreen() {
  const apps = appsSetting.signal.value;
  const problem = useSignal('');

  async function open(link: string): Promise<void> {
    problem.value = '';
    const ok = await window.myWords?.apps?.open(link);
    if (!ok) problem.value = 'That app did not open. It may not be on this device. An adult can check in Parent Mode (My apps).';
  }

  if (apps.length === 0) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">No apps yet</p>
        <p class="game-screen__empty-note">An adult can add the apps on this device in Parent Mode (My apps).</p>
      </div>
    );
  }

  return (
    <div class="apps-screen">
      {problem.value && (
        <p role="status" class="music-tab__message">
          {problem.value}
        </p>
      )}
      <div class="apps-screen__tiles">
        {apps.map((app) => (
          <button type="button" class="apps-screen__tile" key={app.id} onClick={() => void open(app.link)}>
            <span class="apps-screen__emoji" aria-hidden="true">
              {app.emoji}
            </span>
            <span class="apps-screen__title">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
