"use client";

import { useSyncExternalStore } from "react";
import { defaultAiSettings } from "@/core/ai/settings";
import { usePlatform } from "@/platform/PlatformProvider";

const getServerSnapshot = () => defaultAiSettings;
const subscribeHydration = () => () => {};

export function useAiSettings() {
  const { settings: store } = usePlatform();
  const settings = useSyncExternalStore(
    store.subscribe,
    store.get,
    getServerSnapshot
  );
  // false during prerender/hydration, so "not configured" UI doesn't flash.
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );

  return { settings, save: store.set, isHydrated };
}
