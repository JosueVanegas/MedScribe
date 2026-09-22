"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import type { ProviderDefinition } from "@/core/ai/providers";
import { inputClass } from "./ModelChoiceField";

type Verification =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok" }
  | { state: "error"; message: string };

type ApiKeyFieldProps = {
  provider: ProviderDefinition;
  value: string;
  onChange: (value: string) => void;
};

export function ApiKeyField({ provider, value, onChange }: ApiKeyFieldProps) {
  const [visible, setVisible] = useState(false);
  const [verification, setVerification] = useState<Verification>({ state: "idle" });

  const verify = async () => {
    setVerification({ state: "checking" });
    try {
      await provider.verifyApiKey(value.trim());
      setVerification({ state: "ok" });
    } catch (err) {
      setVerification({
        state: "error",
        message: err instanceof Error ? err.message : "No se pudo verificar la key.",
      });
    }
  };

  const inputId = `api-key-${provider.id}`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          API key de {provider.name}
        </label>
        <a
          href={provider.apiKeyUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
        >
          Obtener key <ExternalLink className="size-3" />
        </a>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id={inputId}
            type={visible ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            className={`${inputClass} pr-10 font-mono`}
            placeholder={provider.apiKeyPlaceholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setVerification({ state: "idle" });
            }}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar key" : "Mostrar key"}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-xl text-text-muted hover:text-text"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={verify}
          disabled={!value.trim() || verification.state === "checking"}
          className="neu-button shrink-0 rounded-xl px-4 text-xs font-medium text-text-muted hover:text-primary-700"
        >
          Verificar
        </button>
      </div>
      {verification.state === "checking" && (
        <p className="flex animate-enter items-center gap-1 text-xs text-text-muted">
          <Loader2 className="size-3 animate-spin" /> Verificando…
        </p>
      )}
      {verification.state === "ok" && (
        <p className="flex animate-enter items-center gap-1 text-xs font-medium text-primary-700">
          <CheckCircle2 className="size-3" /> Key válida
        </p>
      )}
      {verification.state === "error" && (
        <p className="flex animate-enter items-center gap-1 text-xs text-red-600">
          <XCircle className="size-3 shrink-0" /> {verification.message}
        </p>
      )}
    </div>
  );
}
