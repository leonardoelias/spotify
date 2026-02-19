import { useSuspenseQuery } from "@tanstack/react-query";

import { artistTopTracksOptions } from "./queries";

export function useArtistTopTracks(artistId: string, market?: string) {
  return useSuspenseQuery(artistTopTracksOptions(artistId, market));
}
