"use client";

import { useEffect } from "react";
import { usePlatform } from "@/platform/PlatformProvider";

/** Registers the offline/installable service worker in production builds. */
export function ServiceWorkerRegistration() {
  const { supportsServiceWorker } = usePlatform();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !supportsServiceWorker) return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Not fatal: the app works without offline support.
    });
  }, [supportsServiceWorker]);

  return null;
}
