"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, FileAudio } from "lucide-react";
import { AUDIO_ACCEPT_ATTR, MAX_AUDIO_MB } from "@/lib/audio/formats";
import { cn } from "@/lib/utils";

type AudioUploadProps = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

function useFilePicker(onFile: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null);

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={AUDIO_ACCEPT_ATTR}
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow picking the same file again
        if (file) onFile(file);
      }}
    />
  );

  return { input, open: () => inputRef.current?.click() };
}

/** Large drop well shown on the start screen. */
export function AudioDropzone({ onFile, disabled }: AudioUploadProps) {
  const { input, open } = useFilePicker(onFile);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !disabled) onFile(file);
  };

  return (
    <button
      type="button"
      onClick={open}
      disabled={disabled}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "neu-inset flex w-full max-w-sm items-center gap-4 rounded-3xl px-5 py-4 text-left transition-transform duration-300 ease-[var(--ease-spring)] disabled:opacity-40",
        isDragging && "scale-[1.03] ring-2 ring-primary-400"
      )}
    >
      {input}
      <span className="neu-raised-sm flex size-11 shrink-0 items-center justify-center rounded-2xl text-primary-600">
        <FileAudio className="size-5" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text">
          ¿Grabaste con otro dispositivo?
        </span>
        <span className="text-xs leading-relaxed text-text-muted">
          Arrastra el audio o pulsa para subirlo. MP3, M4A, WAV, OGG, OPUS…
          hasta {MAX_AUDIO_MB} MB.
        </span>
      </span>
    </button>
  );
}

/** Compact button used next to the record button. */
export function AudioUploadButton({ onFile, disabled }: AudioUploadProps) {
  const { input, open } = useFilePicker(onFile);

  return (
    <button
      type="button"
      onClick={open}
      disabled={disabled}
      title="Subir audio"
      aria-label="Subir audio"
      className="neu-button flex size-12 items-center justify-center rounded-full text-text-muted hover:text-primary-700"
    >
      {input}
      <Upload className="size-[18px]" />
    </button>
  );
}
