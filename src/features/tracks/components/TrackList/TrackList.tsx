import type { Track } from "@/entities/track";

import { formatDuration } from "@/shared/utils";

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="space-y-1.5">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="flex items-center gap-4 p-3 bg-surface rounded-xl hover:bg-surface-hover transition-colors group"
        >
          <div className="w-7 text-center text-text-tertiary text-sm font-medium">
            {index + 1}
          </div>

          <div className="w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={track.album.images[0]?.url || "/placeholder.png"}
              alt={track.album.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
              {track.name}
            </div>
            <div className="text-xs text-text-secondary truncate">
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>

          <div className="hidden md:block flex-1 min-w-0">
            <div className="text-xs text-text-secondary truncate">
              {track.album.name}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-20">
            <div className="flex-1 bg-elevated rounded-full h-1">
              <div
                className="bg-accent h-full rounded-full"
                style={{ width: `${track.popularity}%` }}
              />
            </div>
            <span className="text-xs text-text-tertiary w-5 text-right">
              {track.popularity}
            </span>
          </div>

          <div className="text-xs text-text-secondary w-10 text-right">
            {formatDuration(track.duration_ms)}
          </div>

          {track.preview_url && (
            <a
              href={track.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-7 h-7 text-accent hover:text-accent-hover"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
