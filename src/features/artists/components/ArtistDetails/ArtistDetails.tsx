import { useTranslation } from "react-i18next";

import type { Artist } from "@/entities/artist";

import { useLibrary, FavoriteButton } from "@/features/library";

interface ArtistDetailsProps {
  artist: Artist;
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  const imageUrl = artist.images[0]?.url || "/placeholder-artist.png";
  const { isArtistFavorite, addArtist, removeArtist } = useLibrary();
  const { t, i18n } = useTranslation();

  const isFavorite = isArtistFavorite(artist.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeArtist(artist.id);
    } else {
      addArtist(artist);
    }
  };

  const formatFollowers = (count: number) => {
    return new Intl.NumberFormat(i18n.language).format(count);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-black/20">
          <img
            src={imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {artist.name}
              </h1>
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={handleToggleFavorite}
                itemName={artist.name}
              />
            </div>
            {artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-elevated text-text-secondary rounded-full text-sm capitalize"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-xl p-4">
              <div className="text-text-secondary text-xs mb-1">
                {t("artists.followers")}
              </div>
              <div className="text-2xl font-bold text-white">
                {formatFollowers(artist.followers.total)}
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4">
              <div className="text-text-secondary text-xs mb-1">
                {t("artists.popularity")}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-white">
                  {artist.popularity}
                </div>
                <div className="flex-1 bg-elevated rounded-full h-1.5">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <a
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            {t("artists.openInSpotify")}
          </a>
        </div>
      </div>
    </div>
  );
}
