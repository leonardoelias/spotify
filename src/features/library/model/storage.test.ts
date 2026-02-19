import { it, expect, describe, beforeEach } from "vitest";

import { loadLibrary, saveLibrary, clearLibrary } from "./storage";

import type { Library } from "@/entities/favorites";

const STORAGE_KEY = "spotify-artists:library";

const validLibrary: Library = {
  artists: [
    {
      type: "artist",
      item: {
        id: "1",
        name: "Artist 1",
        genres: ["rock"],
        images: [{ url: "https://img.com/1.jpg", height: 300, width: 300 }],
        followers: { total: 1000 },
        popularity: 80,
        external_urls: { spotify: "https://open.spotify.com/artist/1" },
        uri: "spotify:artist:1",
        href: "https://api.spotify.com/v1/artists/1",
        type: "artist",
      },
      addedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  albums: [],
};

describe("loadLibrary", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return empty library when nothing stored", () => {
    const result = loadLibrary();
    expect(result).toEqual({ artists: [], albums: [] });
  });

  it("should return stored library when valid data exists", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validLibrary));
    const result = loadLibrary();
    expect(result.artists).toHaveLength(1);
    expect(result.artists[0].item.name).toBe("Artist 1");
  });

  it("should return empty library when stored data is invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const result = loadLibrary();
    expect(result).toEqual({ artists: [], albums: [] });
  });

  it("should return empty library when stored data fails schema validation", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: true }));
    const result = loadLibrary();
    expect(result).toEqual({ artists: [], albums: [] });
  });
});

describe("saveLibrary", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should save valid library to localStorage", () => {
    saveLibrary(validLibrary);
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(validLibrary);
  });

  it("should not throw on invalid data", () => {
    expect(() => saveLibrary({} as Library)).not.toThrow();
  });
});

describe("clearLibrary", () => {
  it("should remove library from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validLibrary));
    clearLibrary();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("should not throw when nothing stored", () => {
    expect(() => clearLibrary()).not.toThrow();
  });
});
