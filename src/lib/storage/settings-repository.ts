import { sanitizeAiSettings, type AiSettings } from "@/core/ai/settings";
import { createLocalStorageStore, type Store } from "./local-storage-store";

/**
 * Web storage for AI settings (API keys stay on this device). Native builds
 * provide their own store through `Platform.settings` (OS keychain).
 */
export type SettingsRepository = Store<AiSettings>;

export const localStorageSettingsRepository: SettingsRepository =
  createLocalStorageStore("medscribe-settings", sanitizeAiSettings);
