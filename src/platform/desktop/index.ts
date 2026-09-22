import { localStorageHistoryRepository } from "@/lib/storage/history-repository";
import { localStorageSettingsRepository } from "@/lib/storage/settings-repository";
import type { Platform } from "../types";
import { WebAudioCapture } from "../web/web-audio-capture";
import { createWebWakeLock } from "../web/web-wake-lock";
import { tauriFileSaver } from "./tauri-file-saver";

/**
 * Tauri desktop app (Windows WebView2 / macOS WebKit). The WebView already
 * records and keeps storage per app, so only file saving is native.
 */
export function createDesktopPlatform(): Platform {
  return {
    id: "desktop",
    createAudioCapture: () => new WebAudioCapture(),
    files: tauriFileSaver,
    wakeLock: createWebWakeLock(),
    settings: localStorageSettingsRepository,
    history: localStorageHistoryRepository,
    // Files ship inside the app; Web Speech has no backend in WebViews.
    supportsServiceWorker: false,
    supportsLiveCaptions: false,
  };
}
