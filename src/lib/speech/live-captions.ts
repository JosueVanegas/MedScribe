/**
 * Best-effort live captions with the browser Web Speech API. They are only a
 * preview while recording — the real transcript comes from the recorded
 * audio — so any failure simply turns the preview off instead of breaking
 * the recording.
 */

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

export type LiveCaptionListener = {
  onFinal: (text: string) => void;
  onInterim: (text: string) => void;
  onUnavailable: () => void;
};

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, SpeechRecognitionCtor | undefined>;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function areLiveCaptionsSupported(): boolean {
  return getRecognitionCtor() !== null;
}

const MAX_CONSECUTIVE_RESTARTS = 5;

export class LiveCaptionSession {
  private recognition: SpeechRecognitionInstance | null = null;
  private active = false;
  private restartsWithoutResult = 0;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly lang: string;
  private readonly listener: LiveCaptionListener;

  constructor(lang: string, listener: LiveCaptionListener) {
    this.lang = lang;
    this.listener = listener;
  }

  start(): void {
    this.active = true;
    this.restartsWithoutResult = 0;
    this.spawn();
  }

  stop(): void {
    this.active = false;
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = null;
    const recognition = this.recognition;
    this.recognition = null;
    try {
      recognition?.abort();
    } catch {
      // already stopped
    }
    this.listener.onInterim("");
  }

  private fail(): void {
    this.stop();
    this.listener.onUnavailable();
  }

  private spawn(): void {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return this.fail();

    // Exactly one instance at a time: handlers ignore events from stale ones.
    const recognition = new Ctor();
    this.recognition = recognition;
    const isCurrent = () => this.active && this.recognition === recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = this.lang;

    recognition.onresult = (event) => {
      if (!isCurrent()) return;
      this.restartsWithoutResult = 0;
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();
        if (result.isFinal) {
          if (text) this.listener.onFinal(text);
        } else {
          interim += result[0].transcript;
        }
      }
      this.listener.onInterim(interim);
    };

    recognition.onerror = (event) => {
      if (!isCurrent()) return;
      if (event.error === "no-speech" || event.error === "aborted") return;
      // network / not-allowed / audio-capture / service-not-allowed…
      this.fail();
    };

    recognition.onend = () => {
      if (!isCurrent()) return;
      // Chrome ends sessions after silence; restart, but never loop forever.
      if (++this.restartsWithoutResult > MAX_CONSECUTIVE_RESTARTS) {
        return this.fail();
      }
      this.restartTimer = setTimeout(() => {
        if (isCurrent()) this.spawn();
      }, 250);
    };

    try {
      recognition.start();
    } catch {
      this.fail();
    }
  }
}
