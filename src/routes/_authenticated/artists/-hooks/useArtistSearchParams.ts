import { useNavigate } from "@tanstack/react-router";
import { startTransition, useCallback } from "react";

import { artistsIndexRoute } from "../index";

import { type SEARCH_DEFAULTS } from "@/shared/config";

type SearchType = typeof SEARCH_DEFAULTS.type | "albums";

export function useArtistSearchParams() {
  const { q, type, page } = artistsIndexRoute.useSearch();
  const navigate = useNavigate({ from: "/artists" });

  const updateSearch = useCallback(
    (updates: { q?: string; type?: SearchType; page?: number }) => {
      startTransition(() => {
        void navigate({
          search: (prev) => ({
            ...prev,
            q: updates.q ?? prev.q,
            type: (updates.type ?? prev.type) as typeof SEARCH_DEFAULTS.type,

            page:
              updates.q !== undefined || updates.type !== undefined
                ? 1
                : (updates.page ?? prev.page),
          }),
        });
      });
    },
    [navigate],
  );

  return {
    query: q,
    type: type as SearchType,
    page,
    setQuery: (q: string) => updateSearch({ q }),
    setType: (type: SearchType) => updateSearch({ type }),
    setPage: (page: number) => updateSearch({ page }),
    reset: () => updateSearch({}),
  };
}
