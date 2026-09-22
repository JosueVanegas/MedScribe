import { Capacitor } from "@capacitor/core";
import { MicrophoneError, type AudioCapture } from "../types";
import { amplitudeToLevel } from "@/lib/audio/level";
import { getMessages } from "@/i18n/store";
import { ConsultationRecorder } from "./consultation-recorder";

const MAX_AMPLITUDE = 32767;
const LEVEL_POLL_MS = 90;

function errorCode(err: unknown): string | undefined {
  return (err as { code?: string } | null)?.code;
}

/**
 * Native recording through a foreground service: keeps going with the
 * screen locked, unlike MediaRecorder inside the WebView.
 */
export class AndroidAudioCapture implements AudioCapture {
  private recording = false;
  private currentLevel = 0;
  private levelTimer: ReturnType<typeof setInterval> | null = null;

  async start(): Promise<void> {
    try {
      await ConsultationRecorder.start();
      this.recording = true;
      this.startLevelPolling();
    } catch (err) {
      const t = getMessages().mic;
      throw new MicrophoneError(
        errorCode(err) === "PERMISSION_DENIED"
          ? t.androidDenied
          : t.androidStartFailed(err instanceof Error ? err.message : "")
      );
    }
  }

  async stop(): Promise<Blob | null> {
    if (!this.recording) return null;
    this.recording = false;
    this.stopLevelPolling();

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
    this.stopLevelPolling();
    if (!this.recording) return;
    this.recording = false;
    void ConsultationRecorder.cancel();
  }

  level(): number {
    return this.currentLevel;
  }

  // The bridge is async, so the level is sampled here and read synchronously.
  private startLevelPolling() {
    this.stopLevelPolling();
    this.levelTimer = setInterval(() => {
      ConsultationRecorder.getLevel()
        .then(({ amplitude }) => {
          if (this.recording) {
            this.currentLevel = amplitudeToLevel(amplitude / MAX_AMPLITUDE);
          }
        })
        .catch(() => {});
    }, LEVEL_POLL_MS);
  }

  private stopLevelPolling() {
    if (this.levelTimer) clearInterval(this.levelTimer);
    this.levelTimer = null;
    this.currentLevel = 0;
  }
}
