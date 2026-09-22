/** Browser microphone capture with MediaRecorder. */

import { MicrophoneError, type AudioCapture } from "../types";
import {
  createStreamLevelReader,
  type StreamLevelReader,
} from "@/lib/audio/level";
import { getMessages } from "@/i18n/store";

const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/ogg;codecs=opus",
  "audio/mp4",
  "audio/webm",
];

function isRecordingSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

function pickMimeType(): string | undefined {
  return PREFERRED_MIME_TYPES.find((type) =>
    MediaRecorder.isTypeSupported(type)
  );
}

export function toMicrophoneError(err: unknown): MicrophoneError {
  const t = getMessages().mic;
  const name = err instanceof DOMException ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return new MicrophoneError(t.denied);
    case "NotFoundError":
    case "OverconstrainedError":
      return new MicrophoneError(t.notFound);
    case "NotReadableError":
    case "AbortError":
      return new MicrophoneError(t.busy);
    default:
      return new MicrophoneError(t.generic(err instanceof Error ? err.message : ""));
  }
}

export class WebAudioCapture implements AudioCapture {
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private meter: StreamLevelReader | null = null;

  async start(): Promise<void> {
    if (!window.isSecureContext) {
      throw new MicrophoneError(getMessages().mic.insecureContext);
    }
    if (!isRecordingSupported()) {
      throw new MicrophoneError(getMessages().mic.unsupported);
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch (err) {
      throw toMicrophoneError(err);
    }

    this.meter = createStreamLevelReader(this.stream);
    const mimeType = pickMimeType();
    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream, {
      ...(mimeType ? { mimeType } : {}),
      audioBitsPerSecond: 48_000,
    });
    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };
    // Emit chunks periodically so a crash late in the session loses little.
    this.recorder.start(1000);
  }

  /** Stops recording and resolves with the full audio, or null if nothing was captured. */
  stop(): Promise<Blob | null> {
    const recorder = this.recorder;
    if (!recorder || recorder.state === "inactive") {
      this.release();
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || this.chunks[0]?.type || "audio/webm";
        const blob = this.chunks.length ? new Blob(this.chunks, { type }) : null;
        this.release();
        resolve(blob);
      };
      recorder.stop();
    });
  }

  /** Releases the microphone without producing audio. */
  release(): void {
    this.meter?.close();
    this.meter = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }

  level(): number {
    return this.meter?.read() ?? 0;
  }
}
