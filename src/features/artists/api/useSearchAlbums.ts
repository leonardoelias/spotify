import { useSuspenseQuery } from "@tanstack/react-query";

import { albumSearchOptions, type AlbumSearchFilters } from "./queries";

export function useSearchAlbums(filters: AlbumSearchFilters) {
  return useSuspenseQuery(albumSearchOptions(filters));
}
