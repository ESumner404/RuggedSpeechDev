import { useSignal } from '@preact/signals';
import { moviesSetting } from '../store/db';
import { MAX_MOVIES, formatLength, movieFromPick } from './movies';

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 * 1024 ? `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB` : `${Math.max(1, Math.round(bytes / (1024 * 1024)))} MB`;
}

// Add movies kept on this device, from Photos or from Files. Each is copied into the app so it plays with no internet.
export function MoviesTab() {
  const movies = moviesSetting.signal.value;
  const library = window.myWords?.movies;
  const message = useSignal('');
  const busy = useSignal(false);
  const total = movies.reduce((sum, movie) => sum + movie.bytes, 0);

  async function add(source: 'photos' | 'files'): Promise<void> {
    if (!library) return;
    busy.value = true;
    message.value = '';
    const picked = await library.pick(source);
    const room = Math.max(0, MAX_MOVIES - moviesSetting.signal.value.length);
    const fresh = picked.slice(0, room);
    for (const left of picked.slice(room)) await library.remove(left.id);
    if (fresh.length > 0) await moviesSetting.set([...moviesSetting.signal.value, ...fresh.map(movieFromPick)]);
    message.value =
      picked.length === 0
        ? 'Nothing was added.'
        : fresh.length < picked.length
          ? `Added ${fresh.length}. There is room for ${MAX_MOVIES} movies.`
          : `Added ${fresh.length === 1 ? 'the movie' : `${fresh.length} movies`}.`;
    busy.value = false;
  }

  async function remove(id: string): Promise<void> {
    await moviesSetting.set(moviesSetting.signal.value.filter((movie) => movie.id !== id));
    await library?.remove(id);
  }

  function update(id: string, changes: { title?: string; emoji?: string }): void {
    void moviesSetting.set(moviesSetting.signal.value.map((movie) => (movie.id === id ? { ...movie, ...changes } : movie)));
  }

  if (!library) {
    return (
      <div class="parent-mode-screen__body movies-tab">
        <p class="about-tab__hint">Movies kept on the device are available in the iPhone and iPad app.</p>
      </div>
    );
  }

  return (
    <div class="parent-mode-screen__body movies-tab">
      <p class="about-tab__hint">
        Add movies already on this device, from Photos or from Files. Each is copied into the app, so it plays with no
        internet and nothing is sent anywhere. Films you bought or rented in the TV app are locked to that app and cannot
        be added. A movie plays only when the child presses it. Movies are not part of a backup, because they are too big.
      </p>
      <div class="movies-tab__add">
        <button type="button" class="parent-mode-screen__button" disabled={busy.value} onClick={() => void add('photos')}>
          {busy.value ? 'Adding…' : 'Add from Photos'}
        </button>
        <button type="button" class="parent-mode-screen__button" disabled={busy.value} onClick={() => void add('files')}>
          Add from Files
        </button>
      </div>
      <p role="status" class="music-tab__message">
        {message.value}
      </p>
      {movies.length > 0 && <p class="about-tab__hint">{movies.length} {movies.length === 1 ? 'movie' : 'movies'}, {formatBytes(total)} on this device.</p>}
      <ul class="movies-tab__list">
        {movies.map((movie) => (
          <li key={movie.id}>
            <input
              class="parent-mode-screen__emoji-input"
              type="text"
              aria-label={`Emoji for ${movie.title}`}
              value={movie.emoji}
              onInput={(event) => update(movie.id, { emoji: (event.target as HTMLInputElement).value })}
            />
            <input
              type="text"
              aria-label="Name"
              value={movie.title}
              onInput={(event) => update(movie.id, { title: (event.target as HTMLInputElement).value })}
            />
            <span>
              {formatLength(movie.seconds)} {formatBytes(movie.bytes)}
            </span>
            <button type="button" class="parent-mode-screen__button" aria-label={`Remove ${movie.title}`} onClick={() => void remove(movie.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
