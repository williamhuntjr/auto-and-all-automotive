import { useCallback, useMemo, useSyncExternalStore } from "react";
import { seedParts } from "./seed-parts";
import type { Part } from "./types";

const STORAGE_KEY = "auto-and-all-chatgpt-inventory";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const readRaw = () => window.localStorage.getItem(STORAGE_KEY);

function parseParts(raw: string | null): Part[] {
  if (!raw) return seedParts;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedParts;
  } catch {
    // Keep the included sample records when local data is invalid.
    return seedParts;
  }
}

/** Inventory records persisted in this browser's localStorage. */
export function useStoredParts() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const parts = useMemo(() => parseParts(raw), [raw]);

  const updateParts = useCallback((update: (current: Part[]) => Part[]) => {
    const next = update(parseParts(readRaw()));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  }, []);

  return [parts, updateParts] as const;
}
