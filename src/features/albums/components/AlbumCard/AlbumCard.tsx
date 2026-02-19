import type { Album } from "@/entities/album";

import { useLibrary, FavoriteButton } from "@/features/library";
import { formatDate, getAlbumTypeLabel } from "@/shared/utils";

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const imageUrl = album.images[0]?.url || "/placeholder.png";
  const { isAlbumFavorite, addAlbum, removeAlbum } = useLibrary();

  const isFavorite = isAlbumFavorite(album.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeAlbum(album.id);
    } else {
      addAlbum(album);
    }
  };

  return (
    <a
      href={album.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-surface rounded-2xl p-4 hover:bg-surface-hover hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
        <img
          src={imageUrl}
          alt={album.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleToggleFavorite}
            itemName={album.name}
          />
        </div>

        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg
            className="w-14 h-14 text-white/90"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-accent transition-colors">
          {album.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="px-2 py-0.5 bg-elevated rounded-full">
            {getAlbumTypeLabel(album.album_type)}
          </span>
          <span>·</span>
          <span>{formatDate(album.release_date)}</span>
        </div>

        <div className="text-xs text-text-secondary">
          {album.total_tracks} {album.total_tracks === 1 ? "faixa" : "faixas"}
        </div>
      </div>
    </a>
  );
}
