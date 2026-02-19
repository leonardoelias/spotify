import type { ArtistFilters } from "@/entities/artist";

export const artistKeys = {
  all: ["artists"] as const,

  lists: () => [...artistKeys.all, "list"] as const,
  list: (filters: ArtistFilters) => [...artistKeys.lists(), filters] as const,

  details: () => [...artistKeys.all, "detail"] as const,
  detail: (id: string) => [...artistKeys.details(), id] as const,

  topTracks: (id: string, market?: string) =>
    [...artistKeys.detail(id), "top-tracks", market] as const,

  albums: (id: string, limit?: number, offset?: number) =>
    [...artistKeys.detail(id), "albums", { limit, offset }] as const,
};
