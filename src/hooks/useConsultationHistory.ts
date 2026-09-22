"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MAX_HISTORY_ITEMS } from "@/lib/storage/history-repository";
import { usePlatform } from "@/platform/PlatformProvider";
import type { SavedConsultation } from "@/types/consultation";

// localStorage does not exist during prerendering.
const EMPTY: SavedConsultation[] = [];
const getServerSnapshot = () => EMPTY;

export function useConsultationHistory() {
  const { history: repository } = usePlatform();
  const history = useSyncExternalStore(
    repository.subscribe,
    repository.get,
    getServerSnapshot
  );

  const add = useCallback(
    (consultation: SavedConsultation) =>
      repository.set(
        [consultation, ...repository.get()].slice(0, MAX_HISTORY_ITEMS)
      ),
    [repository]
  );

  const remove = useCallback(
    (id: string) => repository.set(repository.get().filter((c) => c.id !== id)),
    [repository]
  );

  return { history, add, remove };
}
