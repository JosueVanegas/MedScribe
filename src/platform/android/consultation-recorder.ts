import { registerPlugin } from "@capacitor/core";

/** Bridge to the native plugin in android/app/src/main/java/.../recorder/. */
export type RecordedAudio = {
  path: string;
  mimeType: string;
  durationMs: number;
  size: number;
};

export interface ConsultationRecorderPlugin {
  start(): Promise<void>;
  stop(): Promise<RecordedAudio>;
  cancel(): Promise<void>;
  discard(options: { path: string }): Promise<void>;
  /** Peak amplitude (0..32767) since the previous call. */
  getLevel(): Promise<{ amplitude: number }>;
}

export const ConsultationRecorder =
  registerPlugin<ConsultationRecorderPlugin>("ConsultationRecorder");
