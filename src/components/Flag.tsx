import type { ReactNode } from "react";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Round, simplified flags drawn as SVG: emoji flags don't render on Windows
 * (they show as "ES", "FR"…). Each language uses the flag of its variant
 * (en-US, pt-BR), matching `localeInfo`.
 */
const US_STRIPE = 24 / 13;

const flags: Record<Locale, ReactNode> = {
  es: (
    <>
      <rect width="24" height="24" fill="#c60b1e" />
      <rect y="6" width="24" height="12" fill="#ffc400" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="24" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * US_STRIPE} width="24" height={US_STRIPE} fill="#b22234" />
      ))}
      <rect width="11" height={US_STRIPE * 7} fill="#3c3b6e" />
      {[2.5, 5.5, 8.5].flatMap((x) =>
        [2.5, 6.5, 10.5].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" fill="#fff" />)
      )}
    </>
  ),
  pt: (
    <>
      <rect width="24" height="24" fill="#009c3b" />
      <path d="M1.5 12 12 4.5 22.5 12 12 19.5Z" fill="#ffdf00" />
      <circle cx="12" cy="12" r="4.6" fill="#002776" />
      <path d="M7.6 11.2q4.4-1.6 8.8 1.4" stroke="#fff" strokeWidth="0.9" fill="none" />
    </>
  ),
  it: (
    <>
      <rect width="8" height="24" fill="#009246" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#ce2b37" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="24" fill="#0055a4" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#ef4135" />
    </>
  ),
};

export function Flag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(
        "size-4 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgb(0_0_0/0.1)]",
        className
      )}
    >
      {flags[locale]}
    </svg>
  );
}
