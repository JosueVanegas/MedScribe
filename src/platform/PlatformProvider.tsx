"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Platform } from "./types";
import { createWebPlatform } from "./web";

/**
 * Picks the implementation for the current runtime. Native shells (Tauri,
 * Capacitor) will be detected here and return their own Platform; the rest
 * of the app never changes.
 */
function resolvePlatform(): Platform {
  return createWebPlatform();
}

const PlatformContext = createContext<Platform | null>(null);

export function PlatformProvider({
  children,
  platform,
}: {
  children: ReactNode;
  /** Override for tests or previews. */
  platform?: Platform;
}) {
  const [value] = useState(() => platform ?? resolvePlatform());
  return (
    <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
  );
}

export function usePlatform(): Platform {
  const platform = useContext(PlatformContext);
  if (!platform) throw new Error("usePlatform must be used inside <PlatformProvider>");
  return platform;
}
