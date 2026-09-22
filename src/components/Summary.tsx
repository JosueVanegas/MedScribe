"use client";

import type { ReactNode } from "react";
import {
  Stethoscope,
  ThermometerSun,
  Search,
  ClipboardCheck,
  Pill,
  CalendarClock,
  FileText,
  Activity,
  AlignLeft,
  UserRound,
} from "lucide-react";
import type { ConsultationSummary } from "@/types/consultation";
import { staggerIndex } from "@/lib/utils";
import { getOverview, getPatient } from "@/lib/format";
import { useI18n } from "@/i18n/useI18n";

type SectionProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  highlight?: boolean;
  index: number;
};

function Section({ icon, title, children, highlight, index }: SectionProps) {
  return (
    <section
      style={staggerIndex(index)}
      className="neu-raised stagger flex animate-enter gap-3 rounded-3xl p-4 sm:gap-4 sm:p-5"
    >
      <div className="neu-inset-sm flex size-10 shrink-0 items-center justify-center rounded-2xl text-primary-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1 break-words">
        <h3 className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">
          {title}
        </h3>
        <div
          className={
            highlight
              ? "mt-1.5 text-base leading-relaxed font-semibold text-primary-800"
              : "mt-1.5 text-sm leading-relaxed text-text"
          }
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-text-muted">{empty}</p>;
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PatientSection({ summary }: { summary: ConsultationSummary }) {
  const { t } = useI18n();
  const patient = getPatient(summary);
  if (!patient) return null;
  const chips = [patient.age, patient.sex].filter(Boolean);

  return (
    <Section icon={<UserRound className="size-5" />} title={t.summary.patient} index={0}>
      <div className="flex flex-col gap-2">
        {patient.name && (
          <p className="text-base font-semibold break-words text-text">{patient.name}</p>
        )}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="neu-inset-sm rounded-full px-3 py-1 text-xs font-medium text-text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
        {patient.details && <p className="text-text-muted">{patient.details}</p>}
      </div>
    </Section>
  );
}

/** The summary cards without scrolling — reused by the main view and the history popup. */
export function SummarySections({ summary }: { summary: ConsultationSummary }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <PatientSection summary={summary} />

      <Section icon={<AlignLeft className="size-5" />} title={t.summary.overview} index={0}>
        <p>{getOverview(summary)}</p>
      </Section>

      <Section
        icon={<Activity className="size-5" />}
        title={t.summary.diagnosis}
        highlight
        index={1}
      >
        <p>{summary.diagnosis}</p>
      </Section>

      <Section icon={<Stethoscope className="size-5" />} title={t.summary.reason} index={2}>
        <p>{summary.reasonForVisit}</p>
      </Section>

      <Section icon={<ThermometerSun className="size-5" />} title={t.summary.symptoms} index={3}>
        <BulletList items={summary.symptoms} empty={t.summary.noSymptoms} />
      </Section>

      <Section icon={<Search className="size-5" />} title={t.summary.findings} index={4}>
        <p>{summary.findings}</p>
      </Section>

      <Section
        icon={<ClipboardCheck className="size-5" />}
        title={t.summary.treatment}
        index={5}
      >
        <p>{summary.treatmentPlan}</p>
      </Section>

      <Section icon={<Pill className="size-5" />} title={t.summary.medications} index={6}>
        <BulletList
          items={summary.medications}
          empty={t.summary.noMedications}
        />
      </Section>

      <Section icon={<CalendarClock className="size-5" />} title={t.summary.followUp} index={7}>
        <p>{summary.followUp}</p>
      </Section>

      {summary.additionalNotes.trim() && (
        <Section icon={<FileText className="size-5" />} title={t.summary.notes} index={8}>
          <p>{summary.additionalNotes}</p>
        </Section>
      )}
    </div>
  );
}

export function Summary({ summary }: { summary: ConsultationSummary }) {
  return (
    <div className="-mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
      <SummarySections summary={summary} />
    </div>
  );
}
