import { createLazyRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ArtistCard, AlbumCard } from "@/features/artists";
import { useLibrary } from "@/features/library";
import { ErrorBoundary } from "@/shared/components";

export const Route = createLazyRoute("/_authenticated/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const { library } = useLibrary();
  const { t } = useTranslation();

  const hasArtists = library.artists.length > 0;
  const hasAlbums = library.albums.length > 0;
  const isEmpty = !hasArtists && !hasAlbums;

  const artistLabel =
    library.artists.length === 1
      ? t("library.artist")
      : t("library.artist_plural");
  const albumLabel =
    library.albums.length === 1
      ? t("library.album")
      : t("library.album_plural");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-1.5">
          {t("library.title")}
        </h1>
        <p className="text-text-secondary text-sm">
          {isEmpty
            ? t("library.emptyDescription")
            : `${library.artists.length} ${artistLabel} · ${library.albums.length} ${albumLabel}`}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24">
          <svg
            className="w-20 h-20 text-text-tertiary mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-white mb-2">
            {t("library.emptyTitle")}
          </h2>
          <p className="text-text-secondary text-sm mb-6 text-center max-w-sm">
            {t("library.emptyMessage")}
          </p>
          <Link
            to="/artists"
            search={{ q: "", type: "artists", page: 1 }}
            className="px-5 py-2.5 bg-accent text-bg font-semibold text-sm rounded-full hover:bg-accent-hover transition-colors"
          >
            {t("library.exploreArtists")}
          </Link>
        </div>
      ) : (
        <ErrorBoundary retryLabel="Recarregar biblioteca">
          <div className="space-y-14">
            {hasArtists && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5">
                  {t("library.favoriteArtists")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {library.artists.map((fav, i) => (
                    <div
                      key={fav.item.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <ArtistCard artist={fav.item}>
                        <ArtistCard.Image />
                        <ArtistCard.Name />
                        <ArtistCard.Genres />
                        <ArtistCard.Stats />
                      </ArtistCard>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasAlbums && (
              <section>
                <h2 className="text-xl font-bold text-white mb-5">
                  {t("library.favoriteAlbums")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {library.albums.map((fav, i) => (
                    <div
                      key={fav.item.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <AlbumCard album={fav.item} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}
