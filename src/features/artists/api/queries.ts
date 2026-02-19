import { queryOptions } from "@tanstack/react-query";

import {
  searchArtists,
  searchAlbums,
  getArtistDetails,
  getArtistTopTracks,
  getArtistAlbums,
} from "./client";
import { artistKeys } from "./keys";

import type { ArtistFilters } from "@/entities/artist";

import { albumKeys } from "@/features/albums/api/keys";
import { CACHE_TIME } from "@/shared/config/constants";

export interface AlbumSearchFilters {
  query: string;
  limit?: number;
  offset?: number;
}

export const artistSearchOptions = (filters: ArtistFilters) =>
  queryOptions({
    queryKey: artistKeys.list(filters),
    queryFn: () => searchArtists(filters),
    staleTime: CACHE_TIME.SHORT,
    enabled: !!filters.query,
  });

export const albumSearchOptions = (filters: AlbumSearchFilters) =>
  queryOptions({
    queryKey: albumKeys.list(filters.query, filters.limit, filters.offset),
    queryFn: () => searchAlbums(filters.query, filters.limit, filters.offset),
    staleTime: CACHE_TIME.SHORT,
    enabled: !!filters.query,
  });

export const artistDetailOptions = (artistId: string) =>
  queryOptions({
    queryKey: artistKeys.detail(artistId),
    queryFn: () => getArtistDetails(artistId),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!artistId,
  });

export const artistTopTracksOptions = (artistId: string, market?: string) =>
  queryOptions({
    queryKey: artistKeys.topTracks(artistId, market),
    queryFn: () => getArtistTopTracks(artistId, market),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!artistId,
  });

export const artistAlbumsOptions = (
  artistId: string,
  limit?: number,
  offset?: number,
) =>
  queryOptions({
    queryKey: artistKeys.albums(artistId, limit, offset),
    queryFn: () => getArtistAlbums(artistId, limit, offset),
    staleTime: CACHE_TIME.MEDIUM,
    enabled: !!artistId,
  });
