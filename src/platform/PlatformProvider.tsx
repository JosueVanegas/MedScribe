"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { isTauri } from "@tauri-apps/api/core";
import type { Platform } from "./types";
import { createDesktopPlatform } from "./desktop";
import { createWebPlatform } from "./web";

/**
 * Picks the implementation for the current runtime; the rest of the app
 * never changes. (Android via Capacitor will be detected here next.)
 */
function resolvePlatform(): Platform {
  if (typeof window !== "undefined" && isTauri()) return createDesktopPlatform();
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
