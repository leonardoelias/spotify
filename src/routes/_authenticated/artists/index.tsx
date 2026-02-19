import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authenticatedRoute } from "../../_authenticated";

import { artistSearchOptions, albumSearchOptions } from "@/features/artists";
import { PAGINATION } from "@/shared/config/constants";

const ITEMS_PER_PAGE = PAGINATION.ARTISTS_PAGE_SIZE;

const searchParamsSchema = z.object({
  q: z.string().catch(""),
  type: z.enum(["artists", "albums"]).catch("artists"),
  page: z.number().catch(1),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export const artistsIndexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/artists",

  validateSearch: (search): SearchParams => searchParamsSchema.parse(search),

  loaderDeps: ({ search }) => ({ search }),

  loader: ({ context: { queryClient }, deps: { search } }) => {
    const { q, type, page } = search;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    if (q) {
      if (type === "artists") {
        void queryClient.prefetchQuery(
          artistSearchOptions({ query: q, limit: ITEMS_PER_PAGE, offset }),
        );
      } else {
        void queryClient.prefetchQuery(
          albumSearchOptions({ query: q, limit: ITEMS_PER_PAGE, offset }),
        );
      }
    }
  },
}).lazy(() => import("./index.lazy").then((d) => d.Route));
