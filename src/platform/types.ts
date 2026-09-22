import type { AiSettings } from "@/core/ai/settings";
import type { Store } from "@/lib/storage/local-storage-store";
import type { SavedConsultation } from "@/types/consultation";

/**
 * Everything that depends on where MedScribe runs (browser, Tauri desktop,
 * Capacitor mobile). The UI only talks to these interfaces; each runtime
 * provides its own implementation in `src/platform/<runtime>/`.
 */

export type PlatformId = "web" | "desktop" | "android" | "ios";

/** Thrown by AudioCapture.start() with a message ready to show the user. */
export class MicrophoneError extends Error {}

export interface AudioCapture {
  /** Starts recording; rejects with MicrophoneError if the mic is unavailable. */
  start(): Promise<void>;
  /** Stops and resolves with the whole recording, or null if nothing was captured. */
  stop(): Promise<Blob | null>;
  /** Frees the microphone without producing audio. */
  release(): void;
}

export interface FileSaver {
  /** Saves (or shares) a file. Resolves false if the user cancelled. */
  save(file: Blob, fileName: string): Promise<boolean>;
}

/** Keeps the screen on while recording so the OS doesn't suspend the capture. */
export interface ScreenWakeLock {
  acquire(): Promise<void>;
  release(): Promise<void>;
}

export interface Platform {
  id: PlatformId;
  createAudioCapture(): AudioCapture;
  files: FileSaver;
  wakeLock: ScreenWakeLock;
  /** AI provider settings, including API keys. */
  settings: Store<AiSettings>;
  history: Store<SavedConsultation[]>;
  /** Offline cache for the web build; native apps ship their files already. */
  supportsServiceWorker: boolean;
  /** Web Speech preview; unavailable inside native WebViews. */
  supportsLiveCaptions: boolean;
}
