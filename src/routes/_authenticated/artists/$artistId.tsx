import { createRoute, notFound } from "@tanstack/react-router";

import { authenticatedRoute } from "../../_authenticated";

import {
  artistDetailOptions,
  artistTopTracksOptions,
  artistAlbumsOptions,
} from "@/features/artists";
import { ApiError } from "@/shared/api/ApiError";

export const artistDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/artists/$artistId",

  loader: async ({ context: { queryClient }, params: { artistId } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(artistDetailOptions(artistId)),
        queryClient.ensureQueryData(artistTopTracksOptions(artistId, "BR")),
      ]);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw notFound();
      }
      throw error;
    }

    queryClient.prefetchQuery(artistAlbumsOptions(artistId, 20, 0));
  },
}).lazy(() => import("./$artistId.lazy").then((d) => d.Route));
