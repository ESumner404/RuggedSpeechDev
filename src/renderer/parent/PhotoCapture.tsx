import { useSignal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { downscaleToBlob } from './imageProcessing';

type Props = {
  onCapture: (blob: Blob) => void;
};

/** Camera where one exists, file import otherwise (docs/build-plan.md Phase 4), both
 * are offered here rather than picking one, since only the adult knows
 * which the machine actually has. */
export function PhotoCapture({ onCapture }: Props) {
  // The stream lives in a signal, not just a ref, so the effect below can
  // react to it. Assigning videoRef.current.srcObject directly in the same
  // synchronous flow that turns the camera on doesn't work: the signal
  // write only schedules a re-render, so the <video> element doesn't exist
  // in the DOM yet on the very next line, the effect runs after commit,
  // once it does.
  const stream = useSignal<MediaStream | null>(null);
  const error = useSignal<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!stream.value || !video) return;
    video.srcObject = stream.value;
    void video.play();
  }, [stream.value]);

  async function startCamera(): Promise<void> {
    error.value = null;
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Camera unavailable';
    }
  }

  function stopCamera(): void {
    for (const track of stream.value?.getTracks() ?? []) track.stop();
    stream.value = null;
  }

  async function capture(): Promise<void> {
    const video = videoRef.current;
    if (!video) return;
    // A tap right as the preview appears can land before the stream's
    // metadata has loaded, wait briefly for real dimensions rather than
    // capturing an empty 0×0 frame.
    const start = Date.now();
    while (video.videoWidth === 0 && Date.now() - start < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    if (video.videoWidth === 0) {
      error.value = 'Camera not ready yet. Try again.';
      return;
    }
    try {
      const blob = await downscaleToBlob(video, video.videoWidth, video.videoHeight);
      stopCamera();
      onCapture(blob);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Could not capture that photo';
    }
  }

  async function handleFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    error.value = null;
    try {
      const bitmap = await createImageBitmap(file);
      const blob = await downscaleToBlob(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      onCapture(blob);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Could not read that image';
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div class="photo-capture">
      {stream.value ? (
        <div class="photo-capture__camera">
          <video ref={videoRef} class="photo-capture__video" muted playsInline />
          <div class="photo-capture__row">
            <button type="button" class="photo-capture__button" onClick={() => void capture()}>
              Take photo
            </button>
            <button type="button" class="photo-capture__button" onClick={stopCamera}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div class="photo-capture__row">
          <button type="button" class="photo-capture__button" onClick={() => void startCamera()}>
            Use camera
          </button>
          <button type="button" class="photo-capture__button" onClick={() => fileInputRef.current?.click()}>
            Import photo
          </button>
          <input
            ref={fileInputRef}
            class="photo-capture__file-input"
            type="file"
            accept="image/*"
            onChange={(event) => void handleFileChange(event)}
          />
        </div>
      )}
      {error.value && <p class="photo-capture__error">{error.value}</p>}
    </div>
  );
}
