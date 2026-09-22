import { defaultLocale, detectLocale, isLocale, localeInfo, type Locale } from "./locales";
import { messages, type Messages } from "./messages";

/**
 * Interface language. A tiny external store (not React context) so code
 * outside components — error messages, exports, dates — reads the same value.
 * The static HTML is Spanish; the client switches after hydration.
 * React components use `useI18n` (./useI18n) instead.
 */

const STORAGE_KEY = "medscribe-locale";
const listeners = new Set<() => void>();
let current: Locale | null = null;

function readInitial(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // storage blocked: fall back to detection
  }
  return detectLocale(navigator.languages ?? [navigator.language]);
}

export function getLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  current ??= readInitial();
  return current;
}

/** Messages for the current interface language (usable outside React). */
export function getMessages(): Messages {
  return messages[getLocale()];
}

export function setLocale(locale: Locale): void {
  current = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // not persisted; still applies for this session
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function formatDateTimeIn(locale: Locale, iso: string): string {
  return new Date(iso).toLocaleDateString(localeInfo[locale].bcp47, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
