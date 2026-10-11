import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { getVoiceClip, musicVolumeSetting, playlistsSetting, songsSetting } from '../store/db';
import { songsInPlaylist, type Song } from './songs';

// Music: a big tile for each song. A song plays when its tile is pressed, and
// never by itself. If an adult has made playlists, they are choices along the
// top (Everything first), and "Play all" plays that list through, once, from the
// press. Pause and Stop are always in the same place, and leaving the screen
// stops the music.
export function MusicScreen() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const playing = useSignal<Song | null>(null);
  const paused = useSignal(false);
  const problem = useSignal('');
  const queue = useRef<Song[]>([]);
  const listId = useSignal('all');
  const allSongs = songsSetting.signal.value;
  const playlists = playlistsSetting.signal.value;
  const chosenList = playlists.find((list) => list.id === listId.value);
  const songs = chosenList ? songsInPlaylist(chosenList, allSongs) : allSongs;

  function release(): void {
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
  }

  useEffect(() => release, []);

  // Changing the volume is heard straight away.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = musicVolumeSetting.signal.value;
  }, [musicVolumeSetting.signal.value]);

  async function play(song: Song): Promise<void> {
    release();
    problem.value = '';
    const blob = await getVoiceClip(song.blobId);
    if (!blob) {
      problem.value = 'That song could not be found.';
      playing.value = null;
      return;
    }
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    const audio = new Audio(url);
    audio.volume = musicVolumeSetting.signal.value;
    audio.addEventListener('ended', () => {
      const next = queue.current.shift();
      if (next) {
        void play(next);
        return;
      }
      playing.value = null;
      paused.value = false;
    });
    audio.addEventListener('error', () => {
      problem.value = 'That song will not play on this computer.';
      playing.value = null;
    });
    audioRef.current = audio;
    playing.value = song;
    paused.value = false;
    void audio.play().catch(() => {
      problem.value = 'That song will not play on this computer.';
      playing.value = null;
    });
  }

  function togglePause(): void {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      paused.value = false;
    } else {
      audio.pause();
      paused.value = true;
    }
  }

  /** A press on one song plays just that song. */
  function playOne(song: Song): void {
    queue.current = [];
    void play(song);
  }

  /** A press on "Play all" plays the list through once, in order. */
  function playAll(): void {
    const [first, ...rest] = songs;
    if (!first) return;
    queue.current = rest;
    void play(first);
  }

  function stop(): void {
    queue.current = [];
    release();
    playing.value = null;
    paused.value = false;
  }

  if (allSongs.length === 0) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">No songs yet</p>
        <p class="game-screen__empty-note">An adult can add songs in Parent Mode (Music).</p>
      </div>
    );
  }

  return (
    <div class="music-screen">
      {playlists.length > 0 && (
        <div class="music-screen__lists" role="group" aria-label="Playlists">
          {[{ id: 'all', name: 'Everything', emoji: '🎵' }, ...playlists].map((list) => (
            <button
              type="button"
              key={list.id}
              class={`music-screen__list${listId.value === list.id ? ' music-screen__list--chosen' : ''}`}
              aria-pressed={listId.value === list.id}
              onClick={() => (listId.value = list.id)}
            >
              <span aria-hidden="true">{list.emoji || '🎵'}</span> {list.name}
            </button>
          ))}
          <button type="button" class="music-screen__list music-screen__play-all" disabled={songs.length === 0} onClick={playAll}>
            Play all
          </button>
        </div>
      )}
      <div class="music-screen__songs">
        {songs.length === 0 && <p class="music-screen__none">No songs in this playlist yet.</p>}
        {songs.map((song) => (
          <button
            type="button"
            key={song.id}
            class={`music-screen__song${playing.value?.id === song.id ? ' music-screen__song--playing' : ''}`}
            aria-pressed={playing.value?.id === song.id}
            onClick={() => playOne(song)}
          >
            <span class="music-screen__emoji" aria-hidden="true">
              {song.emoji || '🎵'}
            </span>
            <span class="music-screen__title">{song.title}</span>
          </button>
        ))}
      </div>
      <div class="music-screen__bar">
        <p class="music-screen__now" role="status">
          {problem.value || (playing.value ? `${paused.value ? 'Paused' : 'Playing'}: ${playing.value.title}` : 'Press a song to play it.')}
        </p>
        <button type="button" class="game-screen__button" onClick={togglePause} disabled={!playing.value}>
          {paused.value ? 'Carry on' : 'Pause'}
        </button>
        <button type="button" class="game-screen__button" onClick={stop} disabled={!playing.value}>
          Stop
        </button>
      </div>
    </div>
  );
}
