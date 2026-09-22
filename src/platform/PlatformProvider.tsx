"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Capacitor } from "@capacitor/core";
import { isTauri } from "@tauri-apps/api/core";
import type { Platform } from "./types";
import { createAndroidPlatform } from "./android";
import { createDesktopPlatform } from "./desktop";
import { createWebPlatform } from "./web";

/** Picks the implementation for the current runtime; the rest of the app never changes. */
function resolvePlatform(): Platform {
  if (typeof window === "undefined") return createWebPlatform();
  if (isTauri()) return createDesktopPlatform();
  if (Capacitor.getPlatform() === "android") return createAndroidPlatform();
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
