import { useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';

type Props = {
  onRecorded: (blob: Blob) => void;
};

/** Records a short clip so a button can speak in a familiar person's own
 * voice instead of the synthesiser (PLAN.md Phase 4). */
export function VoiceClipRecorder({ onRecorded }: Props) {
  const recording = useSignal(false);
  const error = useSignal<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording(): Promise<void> {
    error.value = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        for (const track of stream.getTracks()) track.stop();
        onRecorded(blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      recording.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Microphone unavailable';
    }
  }

  function stopRecording(): void {
    recorderRef.current?.stop();
    recording.value = false;
  }

  return (
    <div class="voice-clip-recorder">
      {recording.value ? (
        <button
          type="button"
          class="voice-clip-recorder__button voice-clip-recorder__button--recording"
          onClick={stopRecording}
        >
          Stop recording
        </button>
      ) : (
        <button type="button" class="voice-clip-recorder__button" onClick={() => void startRecording()}>
          Record voice clip
        </button>
      )}
      {error.value && <p class="voice-clip-recorder__error">{error.value}</p>}
    </div>
  );
}
