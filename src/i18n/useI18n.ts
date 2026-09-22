"use client";

import { useCallback, useSyncExternalStore } from "react";
import { defaultLocale } from "./locales";
import { messages } from "./messages";
import { formatDateTimeIn, getLocale, setLocale, subscribe } from "./store";

/** Current interface language + its messages; re-renders when it changes. */
export function useI18n() {
  const locale = useSyncExternalStore(subscribe, getLocale, () => defaultLocale);
  const formatDateTime = useCallback(
    (iso: string) => formatDateTimeIn(locale, iso),
    [locale]
  );
  return { locale, t: messages[locale], setLocale, formatDateTime };
}
