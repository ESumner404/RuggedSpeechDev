import { useSignal } from '@preact/signals';
import { deleteVoiceClip, musicVolumeSetting, saveVoiceClip, songsSetting } from '../store/db';
import {
  BIG_LIBRARY_BYTES,
  MAX_SONGS,
  MAX_SONG_BYTES,
  formatSize,
  isAudioFile,
  titleFromFile,
  type Song,
} from '../music/songs';

const EMOJIS = ['🎵', '🎶', '🎤', '🎸', '🥁', '🎹', '🎺', '🐑', '⭐', '🌙', '🚌', '🐸', '🦆', '🌈', '🎄', '💤'];

// Add songs from files on this computer. MP3 is the usual, and others work
// too. The songs stay on this computer and play without the internet.
export function MusicTab() {
  const message = useSignal('');
  const adding = useSignal(false);
  const songs = songsSetting.signal.value;
  const total = songs.reduce((sum, song) => sum + song.bytes, 0);

  async function addFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0) return;
    adding.value = true;
    const notes: string[] = [];
    let list = [...songsSetting.signal.value];
    for (const file of Array.from(files)) {
      if (!isAudioFile(file)) {
        notes.push(`${file.name} is not a sound file.`);
        continue;
      }
      if (file.size > MAX_SONG_BYTES) {
        notes.push(`${file.name} is bigger than ${formatSize(MAX_SONG_BYTES)}.`);
        continue;
      }
      if (list.length >= MAX_SONGS) {
        notes.push(`There is room for ${MAX_SONGS} songs. ${file.name} was not added.`);
        continue;
      }
      const blobId = await saveVoiceClip(file);
      const song: Song = {
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: titleFromFile(file.name) || 'Song',
        emoji: '🎵',
        blobId,
        bytes: file.size,
      };
      list = [...list, song];
      await songsSetting.set(list);
    }
    adding.value = false;
    message.value = notes.length > 0 ? notes.join(' ') : `Added ${files.length === 1 ? 'the song' : `${files.length} songs`}.`;
  }

  function update(id: string, changes: Partial<Song>): void {
    void songsSetting.set(songsSetting.signal.value.map((song) => (song.id === id ? { ...song, ...changes } : song)));
  }

  function move(index: number, by: -1 | 1): void {
    const list = [...songsSetting.signal.value];
    const target = index + by;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target]!, list[index]!];
    void songsSetting.set(list);
  }

  async function remove(song: Song): Promise<void> {
    await songsSetting.set(songsSetting.signal.value.filter((s) => s.id !== song.id));
    await deleteVoiceClip(song.blobId);
  }

  return (
    <div class="parent-mode-screen__body music-tab">
      <p class="about-tab__hint">
        Add songs from files on this computer, such as MP3s. They stay on this computer and play with no internet.
        There is no Spotify or Apple Music: those need an account and an internet connection, which this app never
        uses. Songs you have bought as ordinary files, songs copied from a CD, and recordings of someone singing
        all work. Songs that are locked to a streaming app cannot be added.
      </p>

      <label class="parent-mode-screen__button music-tab__add">
        {adding.value ? 'Adding…' : 'Add songs from this computer'}
        <input
          type="file"
          accept="audio/*,.mp3,.m4a,.wav,.ogg,.opus,.flac"
          multiple
          class="music-tab__file"
          onChange={(event) => {
            const input = event.target as HTMLInputElement;
            void addFiles(input.files).then(() => (input.value = ''));
          }}
        />
      </label>
      <p role="status" class="music-tab__message">
        {message.value}
      </p>

      <label class="access-tab__slider-row">
        Music volume {Math.round(musicVolumeSetting.signal.value * 100)}%
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={musicVolumeSetting.signal.value}
          onInput={(event) => void musicVolumeSetting.set(Number((event.target as HTMLInputElement).value))}
        />
      </label>

      {songs.length === 0 ? (
        <p>No songs yet.</p>
      ) : (
        <ul class="music-tab__list">
          {songs.map((song, index) => (
            <li class="music-tab__song" key={song.id}>
              <select
                class="music-tab__emoji"
                aria-label={`Picture for ${song.title}`}
                value={song.emoji}
                onChange={(event) => update(song.id, { emoji: (event.target as HTMLSelectElement).value })}
              >
                {EMOJIS.map((emoji) => (
                  <option value={emoji} key={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
              <input
                type="text"
                class="parent-mode-screen__label-input"
                aria-label={`Name of ${song.title}`}
                value={song.title}
                onInput={(event) => update(song.id, { title: (event.target as HTMLInputElement).value })}
              />
              <span class="music-tab__size">{formatSize(song.bytes)}</span>
              <button type="button" class="parent-mode-screen__button" aria-label={`Move ${song.title} up`} disabled={index === 0} onClick={() => move(index, -1)}>
                ▲
              </button>
              <button type="button" class="parent-mode-screen__button" aria-label={`Move ${song.title} down`} disabled={index === songs.length - 1} onClick={() => move(index, 1)}>
                ▼
              </button>
              <button type="button" class="parent-mode-screen__button" aria-label={`Remove ${song.title}`} onClick={() => void remove(song)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p class="access-tab__hint">
        {songs.length} of {MAX_SONGS} songs, {formatSize(total)} in all.
        {total > BIG_LIBRARY_BYTES && ' This is a lot of music: a backup will be large, and slow to save.'}
      </p>
    </div>
  );
}
