import type { ScreenWakeLock } from "../types";

/**
 * Screen Wake Lock API (Chrome, Edge, Safari 16.4+). Best effort: where it's
 * unsupported recording still works, the screen just may turn off.
 * The browser drops the lock when the page is hidden, so it is re-requested
 * when the page becomes visible again.
 */
export function createWebWakeLock(): ScreenWakeLock {
  let sentinel: WakeLockSentinel | null = null;
  let wanted = false;

  const request = async () => {
    if (!wanted || sentinel || !("wakeLock" in navigator)) return;
    try {
      sentinel = await navigator.wakeLock.request("screen");
      sentinel.addEventListener("release", () => {
        sentinel = null;
      });
    } catch {
      // Denied (battery saver, not visible…): ignore.
    }
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") void request();
  };

  return {
    async acquire() {
      wanted = true;
      document.addEventListener("visibilitychange", onVisibilityChange);
      await request();
    },

    async release() {
      wanted = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      const current = sentinel;
      sentinel = null;
      await current?.release().catch(() => {});
    },
  };
}
