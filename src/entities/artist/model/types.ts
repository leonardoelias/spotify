import type { Artist, ArtistSimplified, ArtistFilters } from "./schema";

export type { Artist, ArtistSimplified, ArtistFilters };

export interface ArtistStats {
  followers: number;
  popularity: number;
  totalTracks?: number;
  totalAlbums?: number;
}

export interface ArtistSearchItem extends Artist {
  _searchScore?: number;
  _isFavorite?: boolean;
}
