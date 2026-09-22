"use client";

import { useCallback, useState } from "react";
import { useAudioRecorder } from "./useAudioRecorder";
import { useLiveCaptions } from "./useLiveCaptions";
import type { ConsultationApi } from "@/lib/api/consultation-api";
import {
  MAX_AUDIO_BYTES,
  MAX_AUDIO_MB,
  isAcceptedAudio,
} from "@/lib/audio/formats";
import type {
  AudioSource,
  ConsultationLanguage,
  ConsultationStatus,
  ConsultationSummary,
  SavedConsultation,
} from "@/types/consultation";
import { localeInfo } from "@/i18n/locales";
import { getMessages } from "@/i18n/store";

type PendingAudio = {
  blob: Blob;
  fileName: string;
  source: AudioSource;
};

type UseConsultationOptions = {
  api: ConsultationApi;
  /** Language spoken in the consultation; chosen by the app. */
  language: ConsultationLanguage;
  onCompleted?: (consultation: SavedConsultation) => void;
};

function extensionFor(mimeType: string): string {
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "m4a";
  return "webm";
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/**
 * Orchestrates a consultation: audio in (microphone or file) → transcript →
 * structured summary. UI components only render what this hook exposes.
 */
export function useConsultation({ api, language, onCompleted }: UseConsultationOptions) {
  const {
    start: startRecorder,
    stop: stopRecorder,
    elapsedSeconds,
    readLevel,
  } = useAudioRecorder();
  const captions = useLiveCaptions();
  const { start: startCaptions, stop: stopCaptions } = captions;

  const [status, setStatus] = useState<ConsultationStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState<ConsultationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Kept until a summary is produced, so a failed request never loses the audio.
  const [pendingAudio, setPendingAudio] = useState<PendingAudio | null>(null);

  const summarize = useCallback(
    async (text: string, audio: PendingAudio | null) => {
      setStatus("summarizing");
      setError(null);
      try {
        const result = await api.summarize(text, language);
        setSummary(result);
        setStatus("done");
        setPendingAudio(null);
        onCompleted?.({
          id: `c-${Date.now()}`,
          date: new Date().toISOString(),
          transcript: text,
          summary: result,
          source: audio?.source,
          fileName: audio?.source === "upload" ? audio.fileName : undefined,
        });
      } catch (err) {
        setError(errorMessage(err, getMessages().errors.summarizeFailed));
        setStatus("idle");
      }
    },
    [api, language, onCompleted]
  );

  const processAudio = useCallback(
    async (audio: PendingAudio) => {
      setPendingAudio(audio);
      setTranscript("");
      setSummary(null);
      setError(null);
      setStatus("transcribing");

      let text: string;
      try {
        text = await api.transcribe(audio.blob, language);
      } catch (err) {
        setError(errorMessage(err, getMessages().errors.transcribeFailed));
        setStatus("idle");
        return;
      }

      setTranscript(text);
      await summarize(text, audio);
    },
    [api, language, summarize]
  );

  const startRecording = useCallback(async () => {
    try {
      await startRecorder();
    } catch (err) {
      // Keep whatever was on screen; just explain why the mic failed.
      setError(errorMessage(err, getMessages().errors.micUnavailable));
      return;
    }
    setError(null);
    setSummary(null);
    setTranscript("");
    setPendingAudio(null);
    startCaptions(localeInfo[language].bcp47);
    setStatus("recording");
  }, [startRecorder, startCaptions, language]);

  const stopRecording = useCallback(async () => {
    stopCaptions();
    const blob = await stopRecorder();
    if (!blob || blob.size === 0) {
      setStatus("idle");
      setError(getMessages().errors.noAudio);
      return;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    await processAudio({
      blob,
      fileName: `${getMessages().export.fileName}-${stamp}.${extensionFor(blob.type)}`,
      source: "recording",
    });
  }, [stopCaptions, stopRecorder, processAudio]);

  const uploadAudio = useCallback(
    async (file: File) => {
      if (!isAcceptedAudio(file)) {
        setError(getMessages().errors.unsupportedFormat);
        return;
      }
      if (file.size > MAX_AUDIO_BYTES) {
        setError(getMessages().errors.fileTooLarge(MAX_AUDIO_MB));
        return;
      }
      await processAudio({ blob: file, fileName: file.name, source: "upload" });
    },
    [processAudio]
  );

  const retry = useCallback(async () => {
    if (transcript) return summarize(transcript, pendingAudio);
    if (pendingAudio) return processAudio(pendingAudio);
  }, [transcript, pendingAudio, summarize, processAudio]);

  const reset = useCallback(() => {
    stopCaptions();
    setStatus("idle");
    setTranscript("");
    setSummary(null);
    setError(null);
    setPendingAudio(null);
  }, [stopCaptions]);

  const isBusy = status === "transcribing" || status === "summarizing";

  return {
    status,
    isBusy,
    transcript,
    summary,
    error,
    pendingAudio,
    canRetry: status === "idle" && !summary && !!(transcript || pendingAudio),
    elapsedSeconds,
    readLevel,
    liveCaptions: captions,
    startRecording,
    stopRecording,
    uploadAudio,
    retry,
    reset,
  };
}
