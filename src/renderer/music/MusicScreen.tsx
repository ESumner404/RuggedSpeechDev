import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { getVoiceClip, musicVolumeSetting, songsSetting } from '../store/db';
import type { Song } from './songs';

// Music: a big tile for each song. A song plays when its tile is pressed, and
// never by itself. Pause and Stop are always in the same place, and leaving
// the screen stops the music.
export function MusicScreen() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const playing = useSignal<Song | null>(null);
  const paused = useSignal(false);
  const problem = useSignal('');
  const songs = songsSetting.signal.value;

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

  function stop(): void {
    release();
    playing.value = null;
    paused.value = false;
  }

  if (songs.length === 0) {
    return (
      <div class="game-screen game-screen--empty">
        <p class="game-screen__empty-title">No songs yet</p>
        <p class="game-screen__empty-note">An adult can add songs in Parent Mode (Music).</p>
      </div>
    );
  }

  return (
    <div class="music-screen">
      <div class="music-screen__songs">
        {songs.map((song) => (
          <button
            type="button"
            key={song.id}
            class={`music-screen__song${playing.value?.id === song.id ? ' music-screen__song--playing' : ''}`}
            aria-pressed={playing.value?.id === song.id}
            onClick={() => void play(song)}
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
