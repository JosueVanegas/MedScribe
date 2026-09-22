import { localStorageHistoryRepository } from "@/lib/storage/history-repository";
import { localStorageSettingsRepository } from "@/lib/storage/settings-repository";
import type { Platform } from "../types";
import { WebAudioCapture } from "./web-audio-capture";
import { webFileSaver } from "./web-file-saver";
import { createWebWakeLock } from "./web-wake-lock";

/** Browser / installed PWA. Safe to construct during prerendering. */
export function createWebPlatform(): Platform {
  return {
    id: "web",
    createAudioCapture: () => new WebAudioCapture(),
    files: webFileSaver,
    wakeLock: createWebWakeLock(),
    settings: localStorageSettingsRepository,
    history: localStorageHistoryRepository,
    supportsServiceWorker: true,
    supportsLiveCaptions: true,
  };
}
