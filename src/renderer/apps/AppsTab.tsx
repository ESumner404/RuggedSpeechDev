import { useSignal } from '@preact/signals';
import { appsSetting } from '../store/db';
import { MAX_APPS, PRESETS, appFromForm, deviceKind, type MyApp, type Preset } from './apps';

// Add links to other apps on this device. A link opens an app and nothing else: web addresses are refused.
export function AppsTab() {
  const apps = appsSetting.signal.value;
  const message = useSignal('');
  const name = useSignal('');
  const emoji = useSignal('');
  const link = useSignal('');
  const canOpen = Boolean(window.myWords?.apps);
  const presets = PRESETS[deviceKind()];

  async function add(app: MyApp): Promise<void> {
    if (appsSetting.signal.value.length >= MAX_APPS) {
      message.value = `There is room for ${MAX_APPS} apps.`;
      return;
    }
    await appsSetting.set([...appsSetting.signal.value, app]);
    message.value = `Added ${app.name}.`;
  }

  function addPreset(preset: Preset): void {
    const made = appFromForm(preset.name, preset.emoji, preset.link);
    if ('problem' in made) message.value = made.problem;
    else void add(made);
  }

  function submit(event: Event): void {
    event.preventDefault();
    const made = appFromForm(name.value, emoji.value, link.value);
    if ('problem' in made) {
      message.value = made.problem;
      return;
    }
    void add(made);
    name.value = '';
    emoji.value = '';
    link.value = '';
  }

  function update(id: string, changes: Partial<MyApp>): void {
    void appsSetting.set(appsSetting.signal.value.map((app) => (app.id === id ? { ...app, ...changes } : app)));
  }

  async function test(app: MyApp): Promise<void> {
    const ok = await window.myWords?.apps?.open(app.link);
    message.value = ok ? `Opened ${app.name}.` : `${app.name} did not open. Check the link, and that the app is on this device.`;
  }

  if (!canOpen) {
    return (
      <div class="parent-mode-screen__body apps-tab">
        <p class="about-tab__hint">This device cannot open other apps from here.</p>
      </div>
    );
  }

  return (
    <div class="parent-mode-screen__body apps-tab">
      <p class="about-tab__hint">
        Put other apps on this device a press away: a call, photos, a favourite game. Each shows as a big tile on the Apps
        screen, which you can put in the top row in Quick Access. An app opens only when the child presses its tile. Only
        links that open an app can be added, never a web address, so nothing here goes onto the internet. The list is
        for this device and is not part of a backup.
      </p>
      {presets.length > 0 && (
        <section class="access-tab__section" aria-labelledby="apps-presets">
          <h3 class="access-tab__heading" id="apps-presets">
            Apps that come with this device
          </h3>
          <div class="movies-tab__add">
            {presets.map((preset) => (
              <button type="button" class="parent-mode-screen__button" key={preset.name} onClick={() => addPreset(preset)}>
                Add {preset.name}
              </button>
            ))}
          </div>
        </section>
      )}
      <section class="access-tab__section" aria-labelledby="apps-custom">
        <h3 class="access-tab__heading" id="apps-custom">
          Add another app
        </h3>
        <p class="about-tab__hint">
          Most apps have a link that looks like "mygame://" (the app's help page or its maker will say). A link like
          "facetime:" opens FaceTime.
        </p>
        <form class="apps-tab__form" onSubmit={submit}>
          <label>
            Name
            <input type="text" value={name.value} onInput={(event) => (name.value = (event.target as HTMLInputElement).value)} />
          </label>
          <label>
            Emoji
            <input
              class="parent-mode-screen__emoji-input"
              type="text"
              value={emoji.value}
              onInput={(event) => (emoji.value = (event.target as HTMLInputElement).value)}
            />
          </label>
          <label>
            Link
            <input type="text" value={link.value} onInput={(event) => (link.value = (event.target as HTMLInputElement).value)} />
          </label>
          <button type="submit" class="parent-mode-screen__button">
            Add app
          </button>
        </form>
      </section>
      <p role="status" class="music-tab__message">
        {message.value}
      </p>
      <ul class="movies-tab__list">
        {apps.map((app) => (
          <li key={app.id}>
            <input
              class="parent-mode-screen__emoji-input"
              type="text"
              aria-label={`Emoji for ${app.name}`}
              value={app.emoji}
              onInput={(event) => update(app.id, { emoji: (event.target as HTMLInputElement).value })}
            />
            <input
              type="text"
              aria-label="Name"
              value={app.name}
              onInput={(event) => update(app.id, { name: (event.target as HTMLInputElement).value })}
            />
            <code>{app.link}</code>
            <button type="button" class="parent-mode-screen__button" aria-label={`Try ${app.name}`} onClick={() => void test(app)}>
              Try it
            </button>
            <button
              type="button"
              class="parent-mode-screen__button"
              aria-label={`Remove ${app.name}`}
              onClick={() => void appsSetting.set(appsSetting.signal.value.filter((a) => a.id !== app.id))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
