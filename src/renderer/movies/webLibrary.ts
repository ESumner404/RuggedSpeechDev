import { deleteMovieFile, saveMovieFile } from '../store/db';

// Movies on a computer: the adult chooses video files, each is copied into the app's own storage, and the page plays it
// itself when the child presses it. Nothing is streamed or sent anywhere. (The iPhone and iPad app does the same job
// through the device's own player; see MovieLibraryBridge.)

/** A video bigger than this is left out: a computer's browser storage cannot be trusted to hold more. */
export const MAX_VIDEO_BYTES = 1.5 * 1024 * 1024 * 1024;

export type PickedMovie = { id: string; title: string; bytes: number; seconds: number };
export type PickResult = { movies: PickedMovie[]; tooBig: number };

/** How long a video file is, in seconds, or 0 if it cannot be told. */
function lengthOf(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    if (typeof URL.createObjectURL !== 'function') return resolve(0);
    const url = URL.createObjectURL(blob);
    const video = document.createElement('video');
    const finish = (seconds: number): void => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(seconds) ? seconds : 0);
    };
    const timer = setTimeout(() => finish(0), 4000);
    video.preload = 'metadata';
    video.onloadedmetadata = () => finish(video.duration);
    video.onerror = () => finish(0);
    video.src = url;
  });
}

/** "Holiday at the beach.mp4" becomes "Holiday at the beach". */
export const titleFromFileName = (name: string): string => name.replace(/\.[^.]+$/, '').replace(/[_]+/g, ' ').trim();

/** Stores each video and says what was added. Pulled out of the file dialog so it can be tested. */
export async function storeVideos(files: File[]): Promise<PickResult> {
  const movies: PickedMovie[] = [];
  let tooBig = 0;
  for (const file of files) {
    if (file.size > MAX_VIDEO_BYTES) {
      tooBig += 1;
      continue;
    }
    const id = `movie-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await saveMovieFile(id, file);
    movies.push({ id, title: titleFromFileName(file.name), bytes: file.size, seconds: await lengthOf(file) });
  }
  return { movies, tooBig };
}

/** Asks for video files with the system's own file chooser. An empty list if the adult backs out. */
export function pickVideos(): Promise<PickResult> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true;
    input.onchange = () => void storeVideos(Array.from(input.files ?? [])).then(resolve);
    input.oncancel = () => resolve({ movies: [], tooBig: 0 });
    input.click();
  });
}

export const removeVideo = (id: string): Promise<void> => deleteMovieFile(id);
