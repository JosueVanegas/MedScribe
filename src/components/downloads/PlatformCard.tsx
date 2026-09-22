"use client";

import type { ReactNode } from "react";
import { cn, staggerIndex } from "@/lib/utils";
import { useI18n } from "@/i18n/useI18n";

type PlatformCardProps = {
  icon: ReactNode;
  title: string;
  requirement: string;
  recommended: boolean;
  action: ReactNode;
  steps: ReactNode[];
  footnote?: ReactNode;
  index: number;
};

export function PlatformCard({
  icon,
  title,
  requirement,
  recommended,
  action,
  steps,
  footnote,
  index,
}: PlatformCardProps) {
  const { t } = useI18n();
  return (
    <section
      style={staggerIndex(index)}
      className={cn(
        "neu-raised stagger flex animate-enter flex-col gap-5 rounded-3xl p-5 sm:p-6",
        recommended && "ring-2 ring-primary-300"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="neu-inset-sm flex size-12 shrink-0 items-center justify-center rounded-2xl text-primary-600">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-text">
              {title}
            </h2>
            {recommended && (
              <span className="neu-inset-sm rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-primary-700">
                {t.downloads.yourDevice}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-text-muted">{requirement}</p>
        </div>
      </div>

      {action}

      <ol className="flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-text">
            <span className="neu-inset-sm flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-text-muted">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      {footnote && (
        <div className="text-xs leading-relaxed text-text-muted">{footnote}</div>
      )}
    </section>
  );
}
