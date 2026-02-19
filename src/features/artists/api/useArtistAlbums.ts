import { useSuspenseQuery } from "@tanstack/react-query";

import { artistAlbumsOptions } from "./queries";

export function useArtistAlbums(
  artistId: string,
  limit?: number,
  offset?: number,
) {
  return useSuspenseQuery(artistAlbumsOptions(artistId, limit, offset));
}
