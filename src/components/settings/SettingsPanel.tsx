"use client";

import { useState, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
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
      title="Configuración de IA"
      subtitle="Elige tu proveedor y pega la API key de tu clínica."
      onClose={onClose}
      footer={(close) => (
        <>
          <button
            onClick={() => close()}
            className="neu-button rounded-full px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(sanitizeAiSettings(draft));
              close();
            }}
            disabled={!canSave}
            className="neu-primary rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Guardar
          </button>
        </>
      )}
    >
      <div className="flex flex-col gap-6">
        <Stagger index={0}>
          <div className="neu-inset flex gap-3 rounded-3xl p-4 text-xs leading-relaxed text-text">
            <ShieldCheck className="size-5 shrink-0 text-primary-600" />
            <p>
              MedScribe es gratuito: funciona con la cuenta de IA de tu clínica.
              Tu API key se guarda <strong>solo en este dispositivo</strong> y
              el audio de las consultas viaja directamente de aquí a tu
              proveedor, sin pasar por ningún servidor de MedScribe.
            </p>
          </div>
        </Stagger>

        <Stagger index={1}>
          <ModelChoiceField
            label="Transcripción de audio"
            description="Convierte la grabación en texto."
            providers={transcriptionProviders}
            modelsOf={(p) => p.transcriptionModels}
            value={draft.transcription}
            onChange={(transcription) =>
              setDraft((d) => ({ ...d, transcription }))
            }
          />
        </Stagger>

        <Stagger index={2}>
          <ModelChoiceField
            label="Resumen clínico"
            description="Genera el resumen estructurado a partir del texto."
            providers={providers}
            modelsOf={(p) => p.summaryModels}
            value={draft.summary}
            onChange={(summary) => setDraft((d) => ({ ...d, summary }))}
          />
        </Stagger>

        <Stagger index={3}>
          <div className="neu-raised flex flex-col gap-5 rounded-3xl p-5">
            <p className="text-sm font-semibold text-text">API keys</p>
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
          <li>
            Para datos de pacientes usa un plan de pago: en planes gratuitos
            algunos proveedores pueden usar los datos para entrenar sus modelos.
            Revisa la política de datos de tu proveedor.
          </li>
          <li>
            Configura un límite de gasto en la cuenta del proveedor para evitar
            sorpresas en la factura.
          </li>
          <li>
            No uses MedScribe en equipos compartidos sin cerrar sesión del
            sistema: la key queda guardada en este navegador.
          </li>
        </ul>

        {Object.keys(settings.apiKeys).length > 0 && (
          <button
            onClick={clearKeys}
            className="self-start px-2 text-xs font-medium text-red-600 hover:underline"
          >
            Borrar las API keys de este dispositivo
          </button>
        )}
      </div>
    </Sheet>
  );
}
