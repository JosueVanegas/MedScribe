"use client";

import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Download,
  KeyRound,
  Languages,
  Mic,
} from "lucide-react";
import { AudioDropzone } from "./AudioUpload";
import type { ConsultationLanguage } from "@/types/consultation";
import { staggerIndex } from "@/lib/utils";
import { providerNamesList } from "@/core/ai/providers";

type EmptyStateProps = {
  language: ConsultationLanguage;
  onToggleLanguage: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  onUpload: (file: File) => void;
  needsSetup: boolean;
  onOpenSettings: () => void;
  /** Only the browser version offers the installable apps. */
  showDownloadLink: boolean;
};

const pill =
  "neu-button flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted hover:text-primary-700";

export function EmptyState({
  language,
  onToggleLanguage,
  historyCount,
  onOpenHistory,
  onUpload,
  needsSetup,
  onOpenSettings,
  showDownloadLink,
}: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-7 overflow-y-auto px-6 py-6">
      <div className="animate-enter-scale">
        <div className="neu-raised flex size-24 animate-float items-center justify-center rounded-[2rem]">
          <div className="neu-inset flex size-16 items-center justify-center rounded-3xl text-primary-600">
            <Mic className="size-7" />
          </div>
        </div>
      </div>

      <div style={staggerIndex(1)} className="stagger animate-enter text-center">
        <h2 className="text-xl font-semibold tracking-tight text-text">
          Grabador de consultas
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
          Graba la consulta o sube un audio y obtén un resumen clínico
          estructurado.
        </p>
      </div>

      {needsSetup && (
        <div
          style={staggerIndex(2)}
          className="stagger flex w-full max-w-sm animate-enter justify-center"
        >
          <button
            onClick={onOpenSettings}
            className="neu-button flex w-full items-center gap-4 rounded-3xl px-5 py-4 text-left"
          >
            <span className="neu-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
              <KeyRound className="size-5" />
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-text">
                Conecta tu proveedor de IA
              </span>
              <span className="text-xs leading-relaxed text-text-muted">
                Pega la API key de tu clínica ({providerNamesList}). Solo se
                guarda en este dispositivo.
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
        className="stagger flex animate-enter items-center gap-3"
      >
        <button onClick={onToggleLanguage} className={pill}>
          <Languages className="size-3.5" />
          {language === "es" ? "Español" : "English"}
        </button>
        {historyCount > 0 && (
          <button onClick={onOpenHistory} className={pill}>
            <Clock className="size-3.5" />
            Historial ({historyCount})
          </button>
        )}
        {showDownloadLink && (
          <Link href="/descargar" className={pill}>
            <Download className="size-3.5" />
            Descargar app
          </Link>
        )}
      </div>
    </div>
  );
}
