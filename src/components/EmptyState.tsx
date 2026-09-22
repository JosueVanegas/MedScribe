"use client";

import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Download,
  KeyRound,
  Mic,
  Volume2,
} from "lucide-react";
import { AudioDropzone } from "./AudioUpload";
import { LanguageSelect } from "./LanguageSelect";
import { useI18n } from "@/i18n/useI18n";
import type { ConsultationLanguage } from "@/types/consultation";
import { staggerIndex } from "@/lib/utils";
import { providerNamesList } from "@/core/ai/providers";

type EmptyStateProps = {
  language: ConsultationLanguage;
  onLanguageChange: (language: ConsultationLanguage) => void;
  historyCount: number;
  onOpenHistory: () => void;
  onUpload: (file: File) => void;
  needsSetup: boolean;
  onOpenSettings: () => void;
  onTestMic: () => void;
  /** Only the browser version offers the installable apps. */
  showDownloadLink: boolean;
};

const pill =
  "neu-button flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted hover:text-primary-700";

export function EmptyState({
  language,
  onLanguageChange,
  historyCount,
  onOpenHistory,
  onUpload,
  needsSetup,
  onOpenSettings,
  onTestMic,
  showDownloadLink,
}: EmptyStateProps) {
  const { t, locale } = useI18n();
  return (
    // Scrolls only as a last resort; `m-auto` centres without clipping the
    // top when the content is taller than the screen (unlike justify-center).
    <div className="-mx-4 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4">
      <div className="m-auto flex w-full max-w-sm flex-col items-center gap-4 py-2 sm:gap-7 sm:py-6">
        {/* The hero is decoration: dropped on short screens to fit everything. */}
        <div className="animate-enter-scale [@media(max-height:760px)]:hidden">
          <div className="neu-raised flex size-24 animate-float items-center justify-center rounded-[2rem]">
            <div className="neu-inset flex size-16 items-center justify-center rounded-3xl text-primary-600">
              <Mic className="size-7" />
            </div>
          </div>
        </div>

        <div style={staggerIndex(1)} className="stagger animate-enter text-center">
          <h2 className="text-lg font-semibold tracking-tight text-text sm:text-xl">
            {t.empty.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-balance text-text-muted sm:mt-2">
            {t.empty.description}
          </p>
        </div>

        {needsSetup && (
          <div
            style={staggerIndex(2)}
            className="stagger flex w-full animate-enter justify-center"
          >
            <button
              onClick={onOpenSettings}
              className="neu-button flex w-full items-center gap-3 rounded-3xl px-4 py-3.5 text-left sm:gap-4 sm:px-5 sm:py-4"
            >
              <span className="neu-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
                <KeyRound className="size-5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-text">
                  {t.empty.setupTitle}
                </span>
                <span className="text-xs leading-relaxed text-text-muted">
                  {t.empty.setupBody}
                  <span className="hidden sm:inline"> ({providerNamesList(locale)})</span>.{" "}
                  {t.empty.setupPrivacy}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-text-muted" />
            </button>
          </div>
        )}

        <div
          style={staggerIndex(3)}
          className="stagger flex w-full animate-enter justify-center"
        >
          <AudioDropzone onFile={onUpload} />
        </div>

        <div
          style={staggerIndex(4)}
          className="stagger flex animate-enter flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          <LanguageSelect
            value={language}
            onChange={onLanguageChange}
            label={t.language.consultation}
          />
          <button onClick={onTestMic} className={pill}>
            <Volume2 className="size-3.5" />
            {t.empty.testMic}
          </button>
          {historyCount > 0 && (
            <button onClick={onOpenHistory} className={pill}>
              <Clock className="size-3.5" />
              {t.empty.history(historyCount)}
            </button>
          )}
          {showDownloadLink && (
            <Link href="/descargar" className={pill}>
              <Download className="size-3.5" />
              {t.empty.downloadApp}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
