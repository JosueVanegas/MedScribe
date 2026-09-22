import { Capacitor } from "@capacitor/core";
import { MicrophoneError, type AudioCapture } from "../types";
import { ConsultationRecorder } from "./consultation-recorder";

function errorCode(err: unknown): string | undefined {
  return (err as { code?: string } | null)?.code;
}

/**
 * Native recording through a foreground service: keeps going with the
 * screen locked, unlike MediaRecorder inside the WebView.
 */
export class AndroidAudioCapture implements AudioCapture {
  private recording = false;

  async start(): Promise<void> {
    try {
      await ConsultationRecorder.start();
      this.recording = true;
    } catch (err) {
      throw new MicrophoneError(
        errorCode(err) === "PERMISSION_DENIED"
          ? "Permiso de micrófono denegado. Actívalo en Ajustes → Apps → MedScribe → Permisos."
          : `No se pudo iniciar la grabación${err instanceof Error ? `: ${err.message}` : "."}`
      );
    }
  }

  async stop(): Promise<Blob | null> {
    if (!this.recording) return null;
    this.recording = false;

    let audio;
    try {
      audio = await ConsultationRecorder.stop();
    } catch (err) {
      if (errorCode(err) === "EMPTY_RECORDING") return null;
      throw err;
    }

    try {
      // The native file is served to the WebView from the app's own origin.
      const res = await fetch(Capacitor.convertFileSrc(`file://${audio.path}`));
      const data = await res.blob();
      return new Blob([data], { type: audio.mimeType });
    } finally {
      // The Blob now lives in memory; keep no copy of patient audio on disk.
      void ConsultationRecorder.discard({ path: audio.path });
    }
  }

  release(): void {
    if (!this.recording) return;
    this.recording = false;
    void ConsultationRecorder.cancel();
  }
}
