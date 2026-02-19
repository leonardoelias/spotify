import type { Album, AlbumSimplified, AlbumType } from "./schema";

export type { Album, AlbumSimplified, AlbumType };

export interface AlbumsByYear {
  year: number;
  albums: Album[];
  count: number;
}

export interface AlbumFilters {
  include_groups?: AlbumType[];
  market?: string;
  limit?: number;
  offset?: number;
}
