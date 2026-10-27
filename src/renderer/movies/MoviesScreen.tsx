import { useSignal } from '@preact/signals';
import { moviesSetting } from '../store/db';
import { formatLength } from './movies';

// Movies: a big tile for each one, and the device plays it full screen when a tile is pressed, never by itself.
export function MoviesScreen() {
  const movies = moviesSetting.signal.value;
  const problem = useSignal('');

  async function play(id: string): Promise<void> {
    problem.value = '';
    const ok = await window.myWords?.movies?.play(id);
    if (!ok) problem.value = 'That movie is not on this device any more. An adult can add it again in Parent Mode (Movies).';
  }

  if (movies.length === 0) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">No movies yet</p>
        <p class="game-screen__empty-note">An adult can add movies kept on this device in Parent Mode (Movies).</p>
      </div>
    );
  }

  return (
    <div class="movies-screen">
      {problem.value && (
        <p role="status" class="music-tab__message">
          {problem.value}
        </p>
      )}
      <div class="movies-screen__tiles">
        {movies.map((movie) => (
          <button type="button" class="movies-screen__tile" key={movie.id} onClick={() => void play(movie.id)}>
            <span class="movies-screen__emoji" aria-hidden="true">
              {movie.emoji || '🎬'}
            </span>
            <span class="movies-screen__title">{movie.title}</span>
            {formatLength(movie.seconds) && <span class="movies-screen__length">{formatLength(movie.seconds)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
