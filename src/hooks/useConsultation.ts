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

type PendingAudio = {
  blob: Blob;
  fileName: string;
  source: AudioSource;
};

type UseConsultationOptions = {
  api: ConsultationApi;
  onCompleted?: (consultation: SavedConsultation) => void;
};

const speechLocales: Record<ConsultationLanguage, string> = {
  es: "es-ES",
  en: "en-US",
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
export function useConsultation({ api, onCompleted }: UseConsultationOptions) {
  const {
    start: startRecorder,
    stop: stopRecorder,
    elapsedSeconds,
  } = useAudioRecorder();
  const captions = useLiveCaptions();
  const { start: startCaptions, stop: stopCaptions } = captions;

  const [status, setStatus] = useState<ConsultationStatus>("idle");
  const [language, setLanguage] = useState<ConsultationLanguage>("es");
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
        setError(errorMessage(err, "No se pudo generar el resumen."));
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
        setError(errorMessage(err, "No se pudo transcribir el audio."));
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
      setError(errorMessage(err, "No se pudo acceder al micrófono."));
      return;
    }
    setError(null);
    setSummary(null);
    setTranscript("");
    setPendingAudio(null);
    startCaptions(speechLocales[language]);
    setStatus("recording");
  }, [startRecorder, startCaptions, language]);

  const stopRecording = useCallback(async () => {
    stopCaptions();
    const blob = await stopRecorder();
    if (!blob || blob.size === 0) {
      setStatus("idle");
      setError("No se capturó audio. Intenta de nuevo.");
      return;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    await processAudio({
      blob,
      fileName: `consulta-${stamp}.${extensionFor(blob.type)}`,
      source: "recording",
    });
  }, [stopCaptions, stopRecorder, processAudio]);

  const uploadAudio = useCallback(
    async (file: File) => {
      if (!isAcceptedAudio(file)) {
        setError(
          "Formato no soportado. Usa MP3, M4A, WAV, OGG, OPUS, WEBM, AAC o FLAC."
        );
        return;
      }
      if (file.size > MAX_AUDIO_BYTES) {
        setError(`El archivo supera el límite de ${MAX_AUDIO_MB} MB.`);
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

  const toggleLanguage = useCallback(
    () => setLanguage((prev) => (prev === "es" ? "en" : "es")),
    []
  );

  const isBusy = status === "transcribing" || status === "summarizing";

  return {
    status,
    isBusy,
    language,
    transcript,
    summary,
    error,
    pendingAudio,
    canRetry: status === "idle" && !summary && !!(transcript || pendingAudio),
    elapsedSeconds,
    liveCaptions: captions,
    startRecording,
    stopRecording,
    uploadAudio,
    retry,
    reset,
    toggleLanguage,
  };
}
