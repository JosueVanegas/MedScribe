/**
 * Languages MedScribe speaks. The same codes are used for the app's interface
 * and for the language a consultation is held in (chosen independently).
 */
export const locales = ["es", "en", "pt", "it", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

type LocaleInfo = {
  /** Shown in language pickers, always in its own language. */
  nativeName: string;
  /** Used in AI prompts ("Respond entirely in …"). */
  englishName: string;
  /** Speech recognition, transcription hints and date formatting. */
  bcp47: string;
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  es: { nativeName: "Español", englishName: "Spanish", bcp47: "es-ES" },
  en: { nativeName: "English", englishName: "English", bcp47: "en-US" },
  pt: { nativeName: "Português", englishName: "Portuguese", bcp47: "pt-BR" },
  it: { nativeName: "Italiano", englishName: "Italian", bcp47: "it-IT" },
  fr: { nativeName: "Français", englishName: "French", bcp47: "fr-FR" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** First supported language in the browser's preference list ("pt-PT" → "pt"). */
export function detectLocale(preferred: readonly string[]): Locale {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
