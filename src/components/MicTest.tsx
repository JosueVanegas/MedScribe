"use client";

import { CheckCircle2, Mic, MicOff, RefreshCw } from "lucide-react";
import { Sheet } from "./ui/Sheet";
import { LevelMeter } from "./LevelMeter";
import { LoadingDots } from "./LoadingDots";
import { useMicTest } from "@/hooks/useMicTest";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/useI18n";

/** Live check that the microphone works before a consultation. Records nothing. */
export function MicTest({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { state, readLevel, retry } = useMicTest();
  const heard = state.phase === "listening" && state.heard;

  return (
    <Sheet
      title={t.micTest.title}
      subtitle={t.micTest.subtitle}
      onClose={onClose}
      footer={(close) => (
        <button
          onClick={() => close()}
          className="neu-primary rounded-full px-6 py-2.5 text-sm font-semibold"
        >
          {t.common.done}
        </button>
      )}
    >
      <div className="flex flex-col items-center gap-5 pb-2 text-center">
        <div
          className={cn(
            "flex size-16 items-center justify-center rounded-3xl transition-colors duration-500",
            state.phase === "error"
              ? "neu-inset text-red-500"
              : heard
                ? "neu-primary"
                : "neu-inset text-primary-600"
          )}
        >
          <span key={`${state.phase}-${heard}`} className="flex animate-enter-scale">
            {state.phase === "error" ? (
              <MicOff className="size-7" />
            ) : heard ? (
              <CheckCircle2 className="size-7" />
            ) : (
              <Mic className="size-7" />
            )}
          </span>
        </div>

        {state.phase === "starting" && (
          <div className="flex flex-col items-center gap-3">
            <LoadingDots />
            <p className="text-sm text-text-muted">{t.micTest.requesting}</p>
          </div>
        )}

        {state.phase === "listening" && (
          <>
            <div className="neu-inset w-full rounded-3xl px-4 py-3">
              <LevelMeter read={readLevel} barStep={6} className="h-20" />
            </div>
            <div className="flex flex-col gap-1">
              <p
                key={String(heard)}
                className={cn(
                  "animate-fade text-sm font-semibold",
                  heard ? "text-primary-700" : "text-text"
                )}
              >
                {heard ? t.micTest.heard : t.micTest.speak}
              </p>
              <p className="text-xs break-words text-text-muted">
                {state.deviceLabel || t.micTest.defaultDevice}
              </p>
            </div>
          </>
        )}

        {state.phase === "error" && (
          <>
            <p className="max-w-sm text-sm leading-relaxed text-red-600">{state.message}</p>
            <button
              onClick={() => void retry()}
              className="neu-button flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted hover:text-primary-700"
            >
              <RefreshCw className="size-3.5" />
              {t.common.retry}
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}
