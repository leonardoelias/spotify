import type { Library } from "@/entities/favorites";

import { librarySchema } from "@/entities/favorites";

const STORAGE_KEY = "spotify-artists:library";

export function loadLibrary(): Library {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { artists: [], albums: [] };
    }

    const parsed = JSON.parse(stored);
    return librarySchema.parse(parsed);
  } catch {
    return { artists: [], albums: [] };
  }
}

export function saveLibrary(library: Library): void {
  try {
    const validated = librarySchema.parse(library);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch {}
}

export function clearLibrary(): void {
  localStorage.removeItem(STORAGE_KEY);
}
