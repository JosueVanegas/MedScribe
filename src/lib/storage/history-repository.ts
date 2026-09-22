import type { SavedConsultation } from "@/types/consultation";
import { createLocalStorageStore, type Store } from "./local-storage-store";

export type HistoryRepository = Store<SavedConsultation[]>;

export const MAX_HISTORY_ITEMS = 50;

export const localStorageHistoryRepository: HistoryRepository =
  createLocalStorageStore("medscribe-history", (raw) =>
    Array.isArray(raw) ? (raw as SavedConsultation[]) : []
  );
