import { useSuspenseQuery } from "@tanstack/react-query";

import { artistSearchOptions } from "./queries";

import type { ArtistFilters } from "@/entities/artist";

export function useSearchArtists(filters: ArtistFilters) {
  return useSuspenseQuery(artistSearchOptions(filters));
}
