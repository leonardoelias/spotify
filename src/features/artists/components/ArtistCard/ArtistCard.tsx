import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type ReactNode, memo, type FC } from "react";
import { useTranslation } from "react-i18next";

import { ArtistCardContext, useArtistCardContext } from "./context";

import type { Artist } from "@/entities/artist";

import { artistAlbumsOptions } from "@/features/artists/api/queries";

interface ArtistCardProps {
  artist: Artist;
  children: ReactNode;
}

function ArtistCardComponent({ artist, children }: ArtistCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery(artistAlbumsOptions(artist.id, 5));
  };

  return (
    <ArtistCardContext.Provider value={{ artist }}>
      <Link
        to="/artists/$artistId"
        params={{ artistId: artist.id }}
        className="block bg-surface rounded-2xl p-4 hover:bg-surface-hover hover:-translate-y-0.5 transition-all duration-200 group"
        activeProps={{
          className:
            "block bg-surface rounded-2xl p-4 ring-1 ring-accent/40 transition-all duration-200 group",
        }}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </Link>
    </ArtistCardContext.Provider>
  );
}

const Image: FC = function Image() {
  const { artist } = useArtistCardContext();
  const imageUrl = artist.images[0]?.url || "/placeholder-artist.png";

  return (
    <div className="aspect-square rounded-xl overflow-hidden mb-3">
      <img
        src={imageUrl}
        alt={artist.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

const Name: FC = function Name() {
  const { artist } = useArtistCardContext();

  return (
    <h3 className="text-sm font-semibold text-white mb-1.5 line-clamp-1">
      {artist.name}
    </h3>
  );
};

interface GenresProps {
  max?: number;
}

const Genres: FC<GenresProps> = function Genres({ max = 2 }) {
  const { artist } = useArtistCardContext();
  const genres = artist.genres.slice(0, max);

  if (genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-1.5">
      {genres.map((genre) => (
        <span
          key={genre}
          className="text-xs px-2 py-0.5 bg-elevated text-text-secondary rounded-full"
        >
          {genre}
        </span>
      ))}
    </div>
  );
};

const Stats: FC = function Stats() {
  const { artist } = useArtistCardContext();
  const { t } = useTranslation();

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-center justify-between text-xs text-text-secondary">
      <span>
        {formatFollowers(artist.followers.total)} {t("artists.followers")}
      </span>
      <span className="flex items-center gap-1">
        <svg
          className="w-3.5 h-3.5 text-accent"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {artist.popularity}
      </span>
    </div>
  );
};

type ArtistCardType = typeof MemoizedArtistCard & {
  Image: typeof Image;
  Name: typeof Name;
  Genres: typeof Genres;
  Stats: typeof Stats;
};

const MemoizedArtistCard = memo(ArtistCardComponent, (prev, next) => {
  return prev.artist.id === next.artist.id;
});

MemoizedArtistCard.displayName = "ArtistCard";

export const ArtistCard = MemoizedArtistCard as ArtistCardType;
ArtistCard.Image = Image;
ArtistCard.Name = Name;
ArtistCard.Genres = Genres;
ArtistCard.Stats = Stats;
