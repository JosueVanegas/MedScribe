import type { Locale } from "../locales";
import es, { type Messages } from "./es";
import en from "./en";
import pt from "./pt";
import it from "./it";
import fr from "./fr";

export type { Messages };

// All bundled: a few KB of text each, and the app works offline.
export const messages: Record<Locale, Messages> = { es, en, pt, it, fr };
