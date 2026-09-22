"use client";

import { useMemo, useState } from "react";
import { Header } from "./Header";
import { Toolbar, type ViewTab } from "./Toolbar";
import { EmptyState } from "./EmptyState";
import { ControlBar } from "./ControlBar";
import { Transcript } from "./Transcript";
import { Summary } from "./Summary";
import { History } from "./History";
import { LoadingDots } from "./LoadingDots";
import { SettingsPanel } from "./settings/SettingsPanel";
import { useConsultation } from "@/hooks/useConsultation";
import { useConsultationHistory } from "@/hooks/useConsultationHistory";
import { useAiSettings } from "@/hooks/useAiSettings";
import { createDirectConsultationApi } from "@/lib/api/consultation-api";
import { isConfigured } from "@/core/ai/settings";
import { createSummaryFile } from "@/lib/export/summary-export";
import { usePlatform } from "@/platform/PlatformProvider";
import type { TranscriptEntry } from "@/types/consultation";

function toParagraphs(text: string): TranscriptEntry[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => ({ id: `p-${i}`, text: line, timestamp: 0, isFinal: true }));
}

export function ConsultationApp() {
  const { history, add: addToHistory, remove: removeFromHistory } =
    useConsultationHistory();
  const { files } = usePlatform();
  const { settings, save: saveSettings, isHydrated } = useAiSettings();
  const api = useMemo(() => createDirectConsultationApi(settings), [settings]);
  const configured = isConfigured(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = () => setSettingsOpen(true);

  const consultation = useConsultation({ api, onCompleted: addToHistory });
  const {
    status,
    isBusy,
    transcript,
    summary,
    pendingAudio,
    liveCaptions,
  } = consultation;

  // null = let the flow decide (summary when ready, otherwise transcript).
  const [requestedTab, setRequestedTab] = useState<ViewTab | null>(null);
  const activeTab: ViewTab =
    requestedTab === "summary" && !summary
      ? "transcript"
      : (requestedTab ?? (summary ? "summary" : "transcript"));

  const withAutoTab =
    <A extends unknown[]>(fn: (...args: A) => unknown) =>
    (...args: A) => {
      setRequestedTab(null);
      void fn(...args);
    };

  // Actions that call the AI provider need a key first.
  const requiringSetup =
    <A extends unknown[]>(fn: (...args: A) => unknown) =>
    (...args: A) => {
      if (!configured) return openSettings();
      withAutoTab(fn)(...args);
    };

  const paragraphs = useMemo(() => toParagraphs(transcript), [transcript]);
  const isRecording = status === "recording";

  const transcriptEmptyMessage = isRecording
    ? liveCaptions.isAvailable
      ? "Escuchando... Comienza a hablar."
      : "Grabando audio. La transcripción aparecerá al terminar."
    : status === "transcribing"
      ? pendingAudio?.source === "upload"
        ? `Transcribiendo "${pendingAudio.fileName}"...`
        : "Transcribiendo la grabación..."
      : "Pulsa el micrófono para grabar o sube un audio.";

  const hasContent =
    status !== "idle" ||
    !!transcript ||
    !!summary ||
    !!pendingAudio ||
    activeTab === "history";

  return (
    <div className="flex h-dvh flex-col">
      <Header status={status} onOpenSettings={openSettings} />

      {hasContent && (
        <Toolbar
          activeTab={activeTab}
          onTabChange={setRequestedTab}
          hasSummary={!!summary}
          hasHistory={history.length > 0}
          language={consultation.language}
          onToggleLanguage={consultation.toggleLanguage}
          onExport={() => {
            if (!summary) return;
            const { file, fileName } = createSummaryFile(summary, transcript);
            void files.save(file, fileName);
          }}
          locked={isRecording || isBusy}
        />
      )}

      <main className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-4 overflow-hidden px-4 py-3">
        {/* Keyed wrapper: each view change plays a soft enter transition. */}
        <div
          key={hasContent ? activeTab : "empty"}
          className="flex min-h-0 flex-1 animate-enter flex-col"
        >
          {!hasContent ? (
            <EmptyState
              language={consultation.language}
              onToggleLanguage={consultation.toggleLanguage}
              historyCount={history.length}
              onOpenHistory={() => setRequestedTab("history")}
              onUpload={requiringSetup(consultation.uploadAudio)}
              needsSetup={isHydrated && !configured}
              onOpenSettings={openSettings}
            />
          ) : activeTab === "history" ? (
            <History
              consultations={history}
              onDelete={removeFromHistory}
            />
          ) : activeTab === "summary" && summary ? (
            <Summary summary={summary} />
          ) : (
            <Transcript
              entries={isRecording ? liveCaptions.entries : paragraphs}
              interimText={isRecording ? liveCaptions.interimText : ""}
              emptyMessage={transcriptEmptyMessage}
            />
          )}
        </div>

        {isBusy && (
          <div
            role="status"
            className="neu-raised-sm mx-auto flex animate-enter-scale items-center gap-3 rounded-full px-5 py-3"
          >
            <LoadingDots />
            <p className="text-xs font-medium text-text-muted">
              {status === "transcribing"
                ? "Transcribiendo el audio de la consulta…"
                : "Generando el resumen clínico…"}
            </p>
          </div>
        )}
      </main>

      <ControlBar
        status={status}
        elapsedSeconds={consultation.elapsedSeconds}
        error={consultation.error}
        canRetry={consultation.canRetry}
        canReset={hasContent && !isRecording && !isBusy}
        canDownloadAudio={
          status === "idle" && pendingAudio?.source === "recording"
        }
        onStart={requiringSetup(consultation.startRecording)}
        onStop={withAutoTab(consultation.stopRecording)}
        onUpload={requiringSetup(consultation.uploadAudio)}
        onRetry={requiringSetup(consultation.retry)}
        onDownloadAudio={() =>
          pendingAudio && void files.save(pendingAudio.blob, pendingAudio.fileName)
        }
        onReset={withAutoTab(consultation.reset)}
        onOpenSettings={openSettings}
      />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSave={saveSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
