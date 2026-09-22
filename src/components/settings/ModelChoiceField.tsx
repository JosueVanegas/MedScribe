"use client";

import { useState, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import type { ModelOption, ProviderDefinition } from "@/core/ai/providers";
import { useI18n } from "@/i18n/useI18n";
import type { ModelChoice } from "@/core/ai/settings";

const CUSTOM = "__custom__";

type ModelChoiceFieldProps = {
  label: string;
  description: string;
  providers: ProviderDefinition[];
  modelsOf: (provider: ProviderDefinition) => ModelOption[];
  value: ModelChoice;
  onChange: (value: ModelChoice) => void;
};

// An outline (not `ring`): Tailwind rings replace box-shadow, which would
// wipe out the neumorphic inset on focus.
export const inputClass =
  "neu-inset w-full rounded-xl px-4 py-2.5 text-sm text-text outline-none placeholder:text-text-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";

/** Native select (keeps the phone's picker) with the app's own chevron. */
function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative min-w-0">
      <select
        {...props}
        className={`${inputClass} cursor-pointer appearance-none truncate pr-10 ${className ?? ""}`}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-muted"
      />
    </div>
  );
}

export function ModelChoiceField({
  label,
  description,
  providers,
  modelsOf,
  value,
  onChange,
}: ModelChoiceFieldProps) {
  const { t } = useI18n();
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
        <Select
          aria-label={`${label}: ${t.models.provider}`}
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
        </Select>
        <Select
          aria-label={`${label}: ${t.models.model}`}
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
              {m.tag ? `${m.label} (${t.models.tags[m.tag]})` : m.label}
            </option>
          ))}
          <option value={CUSTOM}>{t.models.other}</option>
        </Select>
      </div>
      {showCustom && (
        <input
          aria-label={`${label}: ${t.models.modelId}`}
          className={inputClass}
          placeholder={t.models.customPlaceholder}
          value={value.model}
          onChange={(e) => onChange({ ...value, model: e.target.value })}
        />
      )}
    </fieldset>
  );
}
