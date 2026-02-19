import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createLazyRoute,
  getRouteApi,
  useRouter,
} from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";

import {
  useArtistDetails,
  useArtistTopTracks,
  artistAlbumsOptions,
  ArtistDetails,
  TrackList,
  AlbumCard,
  ArtistCharts,
} from "@/features/artists";
import { Pagination, ErrorBoundary, NotFound } from "@/shared/components";
import { PAGINATION } from "@/shared/config/constants";

const route = getRouteApi("/_authenticated/artists/$artistId");

export const Route = createLazyRoute("/_authenticated/artists/$artistId")({
  component: ArtistDetailPage,
  notFoundComponent: ArtistNotFound,
});

function ArtistNotFound() {
  const { t } = useTranslation();
  return (
    <NotFound
      title={t("errors.artistNotFound")}
      description={t("errors.artistNotFoundDescription")}
    />
  );
}

function ArtistDetailPage() {
  const { artistId } = route.useParams();
  const router = useRouter();
  const { t } = useTranslation();

  const { data: artist } = useArtistDetails(artistId);
  const { data: topTracks } = useArtistTopTracks(artistId, "BR");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <button
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-secondary bg-surface rounded-full hover:bg-surface-hover hover:text-white mb-8 transition-all"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t("common.back")}
      </button>

      <ArtistDetails artist={artist} />

      <section className="mt-14">
        <h2 className="text-xl font-bold text-white mb-5">
          {t("artists.topTracks")}
        </h2>
        <TrackList tracks={topTracks.tracks} />
      </section>

      <section className="mt-14">
        <ArtistCharts tracks={topTracks.tracks} artistName={artist.name} />
      </section>

      <ErrorBoundary retryLabel="Carregar álbuns novamente">
        <Suspense fallback={<AlbumsLoadingSkeleton />}>
          <ArtistAlbumsSection artistId={artistId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function AlbumsLoadingSkeleton() {
  const { t } = useTranslation();

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-white mb-5">
        {t("artists.albums")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-surface rounded-xl mb-3" />
            <div className="h-3.5 bg-surface rounded-lg w-3/4 mb-2" />
            <div className="h-3 bg-surface rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ArtistAlbumsSection({ artistId }: { artistId: string }) {
  const [albumsPage, setAlbumsPage] = useState(1);
  const albumsPerPage = PAGINATION.ALBUMS_PER_PAGE;
  const { t } = useTranslation();

  const { data: albums } = useSuspenseQuery(
    artistAlbumsOptions(
      artistId,
      albumsPerPage,
      (albumsPage - 1) * albumsPerPage,
    ),
  );

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-white mb-5">
        {t("artists.albums")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {albums?.items?.map((album, i) => (
          <div
            key={album.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <AlbumCard album={album} />
          </div>
        ))}
      </div>

      {albums && albums.total > albumsPerPage && (
        <div className="mt-8">
          <Pagination
            currentPage={albumsPage}
            totalItems={albums.total}
            itemsPerPage={albumsPerPage}
            onPageChange={setAlbumsPage}
          />
        </div>
      )}
    </section>
  );
}
