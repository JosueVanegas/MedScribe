"use client";

import { useState } from "react";
import type { ProviderDefinition } from "@/core/ai/providers";
import type { ModelChoice } from "@/core/ai/settings";

const CUSTOM = "__custom__";

type ModelChoiceFieldProps = {
  label: string;
  description: string;
  providers: ProviderDefinition[];
  modelsOf: (provider: ProviderDefinition) => { id: string; label: string }[];
  value: ModelChoice;
  onChange: (value: ModelChoice) => void;
};

export const inputClass =
  "neu-inset w-full rounded-xl px-4 py-2.5 text-sm text-text outline-none placeholder:text-text-muted/60 focus:ring-2 focus:ring-primary-300";

export function ModelChoiceField({
  label,
  description,
  providers,
  modelsOf,
  value,
  onChange,
}: ModelChoiceFieldProps) {
  const provider = providers.find((p) => p.id === value.provider) ?? providers[0];
  const models = modelsOf(provider);
  const isKnownModel = models.some((m) => m.id === value.model);
  const [customMode, setCustomMode] = useState(!isKnownModel);
  const showCustom = customMode || !isKnownModel;

  return (
    <fieldset className="neu-raised flex flex-col gap-3 rounded-3xl p-5">
      <legend className="sr-only">{label}</legend>
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        <p className="mt-0.5 text-xs text-text-muted">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          aria-label={`${label}: proveedor`}
          className={inputClass}
          value={provider.id}
          onChange={(e) => {
            const next = providers.find((p) => p.id === e.target.value)!;
            setCustomMode(false);
            onChange({ provider: next.id, model: modelsOf(next)[0]?.id ?? "" });
          }}
        >
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          aria-label={`${label}: modelo`}
          className={inputClass}
          value={showCustom ? CUSTOM : value.model}
          onChange={(e) => {
            if (e.target.value === CUSTOM) {
              setCustomMode(true);
              return;
            }
            setCustomMode(false);
            onChange({ ...value, model: e.target.value });
          }}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
          <option value={CUSTOM}>Otro modelo…</option>
        </select>
      </div>
      {showCustom && (
        <input
          aria-label={`${label}: ID del modelo`}
          className={inputClass}
          placeholder="ID exacto del modelo, p. ej. gemini-3.6-flash"
          value={value.model}
          onChange={(e) => onChange({ ...value, model: e.target.value })}
        />
      )}
    </fieldset>
  );
}
