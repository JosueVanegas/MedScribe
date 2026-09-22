"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/useI18n";

/** Where the "made with love" credit points to. */
export const AUTHOR_URL = "https://kioko.es";

export function Credit({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={AUTHOR_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={`${t.credit.madeWith} ${t.credit.love} ${t.credit.by} Josue Vanegas`}
      className={cn(
        "group inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-text-muted/80 transition-colors hover:text-primary-700",
        className
      )}
    >
      {t.credit.madeWith}
      <Heart
        aria-label={t.credit.love}
        className="size-3 fill-red-500 text-red-500 transition-transform duration-300 group-hover:scale-125"
      />
      {t.credit.by} <span className="font-semibold">Josue Vanegas</span>
    </a>
  );
}
