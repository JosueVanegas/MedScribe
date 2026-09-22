"use client";

import { useState, type ReactNode } from "react";
import { Languages, ShieldCheck } from "lucide-react";
import {
  getProvider,
  providers,
  transcriptionProviders,
} from "@/core/ai/providers";
import {
  isConfigured,
  requiredProviders,
  sanitizeAiSettings,
  type AiSettings,
} from "@/core/ai/settings";
import { ModelChoiceField } from "./ModelChoiceField";
import { ApiKeyField } from "./ApiKeyField";
import { staggerIndex } from "@/lib/utils";
import { Sheet } from "../ui/Sheet";
import { LanguageSelect } from "../LanguageSelect";
import { Rich } from "@/i18n/Rich";
import { useI18n } from "@/i18n/useI18n";

function Stagger({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div style={staggerIndex(index)} className="stagger animate-enter">
      {children}
    </div>
  );
}

type SettingsPanelProps = {
  settings: AiSettings;
  onSave: (settings: AiSettings) => void;
  onClose: () => void;
};

export function SettingsPanel({
  settings,
  onSave,
  onClose,
}: SettingsPanelProps) {
  const { t, locale, setLocale } = useI18n();
  const [draft, setDraft] = useState<AiSettings>(settings);
  const needed = requiredProviders(draft);
  const canSave =
    isConfigured(draft) &&
    !!draft.summary.model.trim() &&
    !!draft.transcription.model.trim();

  const setKey = (providerId: string, key: string) =>
    setDraft((d) => ({ ...d, apiKeys: { ...d.apiKeys, [providerId]: key } }));

  const clearKeys = () => {
    const cleared = { ...draft, apiKeys: {} };
    setDraft(cleared);
    onSave(sanitizeAiSettings(cleared));
  };

  return (
    <Sheet
      title={t.settings.title}
      subtitle={t.settings.subtitle}
      onClose={onClose}
      footer={(close) => (
        <>
          <button
            onClick={() => close()}
            className="neu-button rounded-full px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={() => {
              onSave(sanitizeAiSettings(draft));
              close();
            }}
            disabled={!canSave}
            className="neu-primary rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            {t.common.save}
          </button>
        </>
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Applies immediately (not on Save): a device preference, like the keys. */}
        <Stagger index={0}>
          <div className="neu-raised flex items-center justify-between gap-3 rounded-3xl p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-text">
              <Languages className="size-4 text-primary-600" />
              {t.language.app}
            </p>
            <LanguageSelect value={locale} onChange={setLocale} label={t.language.app} />
          </div>
        </Stagger>

        <Stagger index={1}>
          <div className="neu-inset flex gap-3 rounded-3xl p-4 text-xs leading-relaxed text-text">
            <ShieldCheck className="size-5 shrink-0 text-primary-600" />
            <p>
              <Rich text={t.settings.privacy} />
            </p>
          </div>
        </Stagger>

        <Stagger index={2}>
          <ModelChoiceField
            label={t.settings.transcription}
            description={t.settings.transcriptionDescription}
            providers={transcriptionProviders}
            modelsOf={(p) => p.transcriptionModels}
            value={draft.transcription}
            onChange={(transcription) =>
              setDraft((d) => ({ ...d, transcription }))
            }
          />
        </Stagger>

        <Stagger index={3}>
          <ModelChoiceField
            label={t.settings.summary}
            description={t.settings.summaryDescription}
            providers={providers}
            modelsOf={(p) => p.summaryModels}
            value={draft.summary}
            onChange={(summary) => setDraft((d) => ({ ...d, summary }))}
          />
        </Stagger>

        <Stagger index={4}>
          <div className="neu-raised flex flex-col gap-5 rounded-3xl p-4 sm:p-5">
            <p className="text-sm font-semibold text-text">{t.settings.apiKeys}</p>
            {needed.map((id) => (
              <div key={id} className="animate-enter">
                <ApiKeyField
                  provider={getProvider(id)}
                  value={draft.apiKeys[id] ?? ""}
                  onChange={(key) => setKey(id, key)}
                />
              </div>
            ))}
          </div>
        </Stagger>

        <ul className="list-disc space-y-1.5 px-2 pl-6 text-xs leading-relaxed text-text-muted">
          {t.settings.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>

        {Object.keys(settings.apiKeys).length > 0 && (
          <button
            onClick={clearKeys}
            className="self-start px-2 text-xs font-medium text-red-600 hover:underline"
          >
            {t.settings.clearKeys}
          </button>
        )}
      </div>
    </Sheet>
  );
}
