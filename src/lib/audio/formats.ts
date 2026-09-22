/** Shared by the upload UI and the /api/transcribe route. */

export const MAX_AUDIO_MB = 20;
export const MAX_AUDIO_BYTES = MAX_AUDIO_MB * 1024 * 1024;

export const ACCEPTED_AUDIO_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".mp4",
  ".aac",
  ".wav",
  ".ogg",
  ".oga",
  ".opus",
  ".webm",
  ".flac",
];

/** Value for `<input accept>`; extensions cover browsers with odd MIME types. */
export const AUDIO_ACCEPT_ATTR = ["audio/*", ...ACCEPTED_AUDIO_EXTENSIONS].join(
  ","
);

export function isAcceptedAudio(file: { name: string; type: string }): boolean {
  if (file.type.startsWith("audio/")) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_AUDIO_EXTENSIONS.some((ext) => name.endsWith(ext));
}
