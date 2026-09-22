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
import { MicTest } from "./MicTest";
import { Credit } from "./Credit";
import { LevelMeter } from "./LevelMeter";
import { useConsultation } from "@/hooks/useConsultation";
import { useConsultationHistory } from "@/hooks/useConsultationHistory";
import { useAiSettings } from "@/hooks/useAiSettings";
import { createDirectConsultationApi } from "@/lib/api/consultation-api";
import { isConfigured } from "@/core/ai/settings";
import { createSummaryFile } from "@/lib/export/summary-export";
import { usePlatform } from "@/platform/PlatformProvider";
import type { ConsultationLanguage, TranscriptEntry } from "@/types/consultation";
import { useI18n } from "@/i18n/useI18n";

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
  const { files, id: platformId } = usePlatform();
  const { settings, save: saveSettings, isHydrated } = useAiSettings();
  const api = useMemo(() => createDirectConsultationApi(settings), [settings]);
  const configured = isConfigured(settings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = () => setSettingsOpen(true);
  const [micTestOpen, setMicTestOpen] = useState(false);
  const { t, locale } = useI18n();

  // Follows the app's language until the doctor picks another one.
  const [chosenLanguage, setChosenLanguage] = useState<ConsultationLanguage | null>(null);
  const language = chosenLanguage ?? locale;

  const consultation = useConsultation({ api, language, onCompleted: addToHistory });
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
      ? t.transcript.listening
      : t.transcript.recordingNoCaptions
    : status === "transcribing"
      ? pendingAudio?.source === "upload"
        ? t.transcript.transcribingFile(pendingAudio.fileName)
        : t.transcript.transcribingRecording
      : t.transcript.idle;

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
          language={language}
          onLanguageChange={setChosenLanguage}
          onExport={() => {
            if (!summary) return;
            const { file, fileName } = createSummaryFile(summary, transcript);
            void files.save(file, fileName);
          }}
          locked={isRecording || isBusy}
        />
      )}

      <main className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 overflow-hidden px-4 py-2 sm:gap-4 sm:py-3">
        {/* Keyed wrapper: each view change plays a soft enter transition. */}
        <div
          key={hasContent ? activeTab : "empty"}
          className="flex min-h-0 flex-1 animate-enter flex-col"
        >
          {!hasContent ? (
            <EmptyState
              language={language}
              onLanguageChange={setChosenLanguage}
              historyCount={history.length}
              onOpenHistory={() => setRequestedTab("history")}
              onUpload={requiringSetup(consultation.uploadAudio)}
              needsSetup={isHydrated && !configured}
              onOpenSettings={openSettings}
              onTestMic={() => setMicTestOpen(true)}
              showDownloadLink={isHydrated && platformId === "web"}
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
              emptyVisual={
                isRecording && (
                  <LevelMeter
                    read={consultation.readLevel}
                    tone="danger"
                    barStep={6}
                    className="h-24 w-full max-w-sm animate-fade"
                  />
                )
              }
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
              {status === "transcribing" ? t.busy.transcribing : t.busy.summarizing}
            </p>
          </div>
        )}
      </main>

      <ControlBar
        status={status}
        elapsedSeconds={consultation.elapsedSeconds}
        readLevel={consultation.readLevel}
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
        footer={!hasContent && <Credit className="animate-fade" />}
      />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSave={saveSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {micTestOpen && <MicTest onClose={() => setMicTestOpen(false)} />}
    </div>
  );
}
