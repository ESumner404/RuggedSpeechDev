import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getMovieFile, moviesSetting } from '../store/db';
import { formatLength } from './movies';

// Movies: a big tile for each one. On a phone or tablet the device plays it full screen when a tile is pressed; on a computer
// the page shows a player with its own play button. Either way it never starts by itself.
export function MoviesScreen() {
  const movies = moviesSetting.signal.value;
  const problem = useSignal('');
  const playing = useSignal<{ title: string; url: string } | null>(null);

  // The address a video is played from is only good while the player is open.
  useEffect(
    () => () => {
      if (playing.value) URL.revokeObjectURL(playing.value.url);
    },
    [],
  );

  function close(): void {
    if (playing.value) URL.revokeObjectURL(playing.value.url);
    playing.value = null;
  }

  async function play(id: string, title: string): Promise<void> {
    problem.value = '';
    const native = window.myWords?.movies;
    if (native) {
      if (!(await native.play(id))) problem.value = 'That movie is not on this device any more. An adult can add it again in Parent Mode (Movies).';
      return;
    }
    const file = await getMovieFile(id);
    if (!file) {
      problem.value = 'That movie is not on this device any more. An adult can add it again in Parent Mode (Movies).';
      return;
    }
    playing.value = { title, url: URL.createObjectURL(file) };
  }

  if (playing.value) {
    return (
      <div class="movies-player">
        <div class="movies-player__bar">
          <button type="button" class="movies-player__close" onClick={close}>
            Close
          </button>
          <span class="movies-player__title">{playing.value.title}</span>
        </div>
        <video class="movies-player__video" src={playing.value.url} controls preload="metadata" />
      </div>
    );
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
          <button type="button" class="movies-screen__tile" key={movie.id} onClick={() => void play(movie.id, movie.title)}>
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
