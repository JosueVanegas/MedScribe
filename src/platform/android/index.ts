import { localStorageHistoryRepository } from "@/lib/storage/history-repository";
import { localStorageSettingsRepository } from "@/lib/storage/settings-repository";
import type { Platform, ScreenWakeLock } from "../types";
import { AndroidAudioCapture } from "./android-audio-capture";
import { androidFileSaver } from "./android-file-saver";

// The foreground service keeps recording with the screen off; no lock needed.
const noWakeLock: ScreenWakeLock = {
  acquire: async () => {},
  release: async () => {},
};

/** Capacitor Android app. WebView storage is private to the app sandbox. */
export function createAndroidPlatform(): Platform {
  return {
    id: "android",
    createAudioCapture: () => new AndroidAudioCapture(),
    files: androidFileSaver,
    wakeLock: noWakeLock,
    settings: localStorageSettingsRepository,
    history: localStorageHistoryRepository,
    supportsServiceWorker: false,
    supportsLiveCaptions: false,
  };
}
