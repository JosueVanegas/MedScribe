/**
 * Minimal persisted store compatible with React's useSyncExternalStore.
 * `get()` returns the same reference until the value changes.
 */
export interface Store<T> {
  get(): T;
  set(value: T): void;
  subscribe(listener: () => void): () => void;
}

export function createLocalStorageStore<T>(
  key: string,
  parse: (raw: unknown) => T
): Store<T> {
  let cache: T | undefined;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  const read = (): T => {
    try {
      const raw = localStorage.getItem(key);
      return parse(raw ? JSON.parse(raw) : undefined);
    } catch {
      return parse(undefined);
    }
  };

  // Keep several open tabs/windows in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    cache = undefined;
    notify();
  };

  return {
    get() {
      if (cache === undefined) cache = read();
      return cache;
    },

    set(value) {
      cache = value;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // storage full or unavailable — keep the in-memory copy
      }
      notify();
    },

    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          window.removeEventListener("storage", onStorage);
        }
      };
    },
  };
}
