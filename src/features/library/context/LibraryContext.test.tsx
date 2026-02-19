import { renderHook, act } from "@testing-library/react";
import { it, expect, describe, beforeEach } from "vitest";

import { LibraryProvider, useLibrary } from "./LibraryContext";

import type { Artist } from "@/entities/artist";
import type { Album } from "@/entities/album";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LibraryProvider>{children}</LibraryProvider>
);

const mockArtist: Artist = {
  id: "artist-1",
  name: "The Beatles",
  genres: ["rock"],
  images: [{ url: "https://img.com/1.jpg", height: 300, width: 300 }],
  followers: { total: 1000 },
  popularity: 80,
  external_urls: { spotify: "https://open.spotify.com/artist/1" },
  uri: "spotify:artist:1",
  href: "https://api.spotify.com/v1/artists/1",
  type: "artist",
};

const mockAlbum: Album = {
  id: "album-1",
  name: "Abbey Road",
  images: [{ url: "https://img.com/album.jpg", height: 300, width: 300 }],
  release_date: "1969-09-26",
  release_date_precision: "day",
  total_tracks: 17,
  album_type: "album",
  artists: [
    {
      id: "artist-1",
      name: "The Beatles",
      external_urls: { spotify: "https://open.spotify.com/artist/1" },
    },
  ],
  external_urls: { spotify: "https://open.spotify.com/album/1" },
  type: "album",
  uri: "spotify:album:1",
  href: "https://api.spotify.com/v1/albums/1",
};

describe("LibraryContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should throw when useLibrary is used outside provider", () => {
    expect(() => renderHook(() => useLibrary())).toThrow(
      "useLibrary must be used within LibraryProvider",
    );
  });

  it("should start with empty library", () => {
    const { result } = renderHook(() => useLibrary(), { wrapper });

    expect(result.current.library.artists).toHaveLength(0);
    expect(result.current.library.albums).toHaveLength(0);
  });

  describe("Artists", () => {
    it("should add an artist", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addArtist(mockArtist);
      });

      expect(result.current.library.artists).toHaveLength(1);
      expect(result.current.library.artists[0].item.name).toBe("The Beatles");
    });

    it("should not add duplicate artist", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addArtist(mockArtist);
        result.current.addArtist(mockArtist);
      });

      expect(result.current.library.artists).toHaveLength(1);
    });

    it("should remove an artist", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addArtist(mockArtist);
      });

      act(() => {
        result.current.removeArtist("artist-1");
      });

      expect(result.current.library.artists).toHaveLength(0);
    });

    it("should check if artist is favorite", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      expect(result.current.isArtistFavorite("artist-1")).toBe(false);

      act(() => {
        result.current.addArtist(mockArtist);
      });

      expect(result.current.isArtistFavorite("artist-1")).toBe(true);
    });
  });

  describe("Albums", () => {
    it("should add an album", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addAlbum(mockAlbum);
      });

      expect(result.current.library.albums).toHaveLength(1);
      expect(result.current.library.albums[0].item.name).toBe("Abbey Road");
    });

    it("should not add duplicate album", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addAlbum(mockAlbum);
        result.current.addAlbum(mockAlbum);
      });

      expect(result.current.library.albums).toHaveLength(1);
    });

    it("should remove an album", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addAlbum(mockAlbum);
      });

      act(() => {
        result.current.removeAlbum("album-1");
      });

      expect(result.current.library.albums).toHaveLength(0);
    });

    it("should check if album is favorite", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      expect(result.current.isAlbumFavorite("album-1")).toBe(false);

      act(() => {
        result.current.addAlbum(mockAlbum);
      });

      expect(result.current.isAlbumFavorite("album-1")).toBe(true);
    });
  });

  describe("clearLibrary", () => {
    it("should clear all artists and albums", () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.addArtist(mockArtist);
        result.current.addAlbum(mockAlbum);
      });

      expect(result.current.library.artists).toHaveLength(1);
      expect(result.current.library.albums).toHaveLength(1);

      act(() => {
        result.current.clearLibrary();
      });

      expect(result.current.library.artists).toHaveLength(0);
      expect(result.current.library.albums).toHaveLength(0);
    });
  });
});
