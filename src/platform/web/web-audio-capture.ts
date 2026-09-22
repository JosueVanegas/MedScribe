/** Browser microphone capture with MediaRecorder. */

import { MicrophoneError, type AudioCapture } from "../types";

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

function toMicrophoneError(err: unknown): MicrophoneError {
  const name = err instanceof DOMException ? err.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return new MicrophoneError(
        "Acceso al micrófono denegado. Permítelo desde el icono del candado en la barra de direcciones."
      );
    case "NotFoundError":
    case "OverconstrainedError":
      return new MicrophoneError(
        "No se encontró ningún micrófono conectado."
      );
    case "NotReadableError":
    case "AbortError":
      return new MicrophoneError(
        "El micrófono está en uso por otra aplicación. Ciérrala e inténtalo de nuevo."
      );
    default:
      return new MicrophoneError(
        `No se pudo acceder al micrófono${err instanceof Error ? `: ${err.message}` : "."}`
      );
  }
}

export class WebAudioCapture implements AudioCapture {
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];

  async start(): Promise<void> {
    if (!window.isSecureContext) {
      throw new MicrophoneError(
        "El micrófono solo funciona en HTTPS o en localhost. Abre la app con https:// (o usa `npm run dev -- --experimental-https`)."
      );
    }
    if (!isRecordingSupported()) {
      throw new MicrophoneError(
        "Este navegador no permite grabar audio. Usa Chrome, Edge, Firefox o Safari actualizados, o sube un audio."
      );
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch (err) {
      throw toMicrophoneError(err);
    }

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
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }
}
