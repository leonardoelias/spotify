import { createLazyRoute } from "@tanstack/react-router";
import { Suspense, useDeferredValue } from "react";
import { useTranslation } from "react-i18next";

import { useArtistSearchParams } from "./-hooks/useArtistSearchParams";

import {
  useSearchArtists,
  useSearchAlbums,
  ArtistCard,
  AlbumCard,
  SearchTypeToggle,
} from "@/features/artists";
import {
  Pagination,
  ArtistGridSkeleton,
  AlbumGridSkeleton,
  EmptyState,
  SearchBar,
  ErrorBoundary,
} from "@/shared/components";
import { PAGINATION } from "@/shared/config/constants";

const ITEMS_PER_PAGE = PAGINATION.ARTISTS_PAGE_SIZE;

export const Route = createLazyRoute("/_authenticated/artists")({
  component: ArtistsPage,
});

function ArtistsPage() {
  const { query, type, page, setQuery, setType, setPage } =
    useArtistSearchParams();
  const { t } = useTranslation();

  const deferredQuery = useDeferredValue(query);
  const deferredPage = useDeferredValue(page);
  const isPending = query !== deferredQuery || page !== deferredPage;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-5">
          {t("artists.title")}
        </h1>

        <SearchTypeToggle type={type} onChange={setType} />

        <div className="mt-4">
          <SearchBar
            onSearch={setQuery}
            placeholder={
              type === "artists"
                ? t("artists.searchPlaceholder")
                : t("artists.searchAlbumsPlaceholder")
            }
            defaultValue={query}
          />
        </div>
      </div>

      <div
        className={`transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}
      >
        {deferredQuery ? (
          type === "artists" ? (
            <ErrorBoundary retryLabel="Buscar novamente">
              <Suspense fallback={<ArtistGridSkeleton />}>
                <ArtistResults
                  query={deferredQuery}
                  page={deferredPage}
                  onPageChange={setPage}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <ErrorBoundary retryLabel="Buscar novamente">
              <Suspense fallback={<AlbumGridSkeleton />}>
                <AlbumResults
                  query={deferredQuery}
                  page={deferredPage}
                  onPageChange={setPage}
                />
              </Suspense>
            </ErrorBoundary>
          )
        ) : (
          <EmptyState
            title={t("artists.searchPrompt")}
            description={t("artists.searchPrompt")}
          />
        )}
      </div>
    </div>
  );
}

interface ResultsProps {
  query: string;
  page: number;
  onPageChange: (page: number) => void;
}

function ArtistResults({ query, page, onPageChange }: ResultsProps) {
  const { t } = useTranslation();
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { data } = useSearchArtists({
    query,
    limit: ITEMS_PER_PAGE,
    offset,
  });

  if (!data?.artists?.items?.length) {
    return <EmptyState title={t("artists.noResults")} />;
  }

  const totalItems = data.artists.total;

  return (
    <div className="space-y-6">
      <div className="text-text-secondary text-xs">
        {t("pagination.showing", {
          from: offset + 1,
          to: Math.min(offset + ITEMS_PER_PAGE, totalItems),
          total: totalItems,
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.artists.items.map((artist, i) => (
          <div
            key={artist.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <ArtistCard artist={artist}>
              <ArtistCard.Image />
              <ArtistCard.Name />
              <ArtistCard.Genres />
              <ArtistCard.Stats />
            </ArtistCard>
          </div>
        ))}
      </div>

      {totalItems > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function AlbumResults({ query, page, onPageChange }: ResultsProps) {
  const { t } = useTranslation();
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { data } = useSearchAlbums({
    query,
    limit: ITEMS_PER_PAGE,
    offset,
  });

  if (!data?.albums?.items?.length) {
    return <EmptyState title={t("artists.noAlbumResults")} />;
  }

  const totalItems = data.albums.total;

  return (
    <div className="space-y-6">
      <div className="text-text-secondary text-xs">
        {t("pagination.showing", {
          from: offset + 1,
          to: Math.min(offset + ITEMS_PER_PAGE, totalItems),
          total: totalItems,
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.albums.items.map((album, i) => (
          <div
            key={album.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <AlbumCard album={album} />
          </div>
        ))}
      </div>

      {totalItems > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
