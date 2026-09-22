import { z } from "zod/v4";
import type { ConsultationSummary } from "@/types/consultation";

// Every field is required (strict structured output on some providers);
// the model writes "" for anything the consultation doesn't mention.
const patientSchema = z
  .object({
    name: z.string().describe("Patient's full name if said, otherwise empty string"),
    age: z
      .string()
      .describe("Patient's age as stated, e.g. '45 años' or '8 months', otherwise empty string"),
    sex: z.string().describe("Patient's sex or gender if stated or clearly implied, otherwise empty string"),
    details: z
      .string()
      .describe(
        "Other patient data mentioned, in one short line: ID/record number, occupation, weight, allergies, relevant medical history. Empty string if none"
      ),
  })
  .describe("Patient data mentioned in the consultation");

export const consultationSummarySchema = z.object({
  patient: patientSchema,
  reasonForVisit: z
    .string()
    .describe("Main reason the patient came to the consultation"),
  symptoms: z
    .array(z.string())
    .describe("List of symptoms mentioned by the patient"),
  findings: z
    .string()
    .describe(
      "Physical examination findings or observations made during the consultation"
    ),
  diagnosis: z
    .string()
    .describe("Diagnosis or diagnostic impression discussed"),
  treatmentPlan: z
    .string()
    .describe("Treatment plan or recommendations given"),
  medications: z
    .array(z.string())
    .describe("Medications prescribed or discussed, with dosage if mentioned"),
  followUp: z
    .string()
    .describe("Follow-up instructions, next appointment, or referrals"),
  additionalNotes: z
    .string()
    .describe(
      "Any other relevant information from the consultation. Empty string if there is nothing else."
    ),
  // Last on purpose: the model writes it after extracting the details above.
  overview: z
    .string()
    .describe(
      "Brief narrative summary of the whole consultation in 1-2 sentences (max ~40 words): who consulted, for what, the diagnosis and the plan. Used as a preview in the history list."
    ),
}) satisfies z.ZodType<ConsultationSummary>;
