import { useSuspenseQuery } from "@tanstack/react-query";

import { artistDetailOptions } from "./queries";

export function useArtistDetails(artistId: string) {
  return useSuspenseQuery(artistDetailOptions(artistId));
}
