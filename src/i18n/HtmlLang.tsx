"use client";

import { useEffect } from "react";
import { useI18n } from "./useI18n";

/** Keeps <html lang> in sync with the interface language (screen readers, spellcheck). */
export function HtmlLang() {
  const { locale } = useI18n();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
