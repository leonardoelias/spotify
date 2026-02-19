import { z } from "zod";

import {
  spotifyImageSchema,
  externalUrlsSchema,
  artistSimplifiedSchema,
} from "@/entities/artist";

export const albumTypeSchema = z.enum(["album", "single", "compilation"]);

export const releaseDatePrecisionSchema = z.enum(["year", "month", "day"]);

export const albumSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(spotifyImageSchema),
  release_date: z.string(),
  release_date_precision: releaseDatePrecisionSchema,
  total_tracks: z.number().int().nonnegative(),
  album_type: albumTypeSchema,
  artists: z.array(artistSimplifiedSchema),
  external_urls: externalUrlsSchema,
  type: z.literal("album").optional(),
  uri: z.string().optional(),
  href: z.string().url().optional(),
});

export const albumSimplifiedSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(spotifyImageSchema),
  release_date: z.string(),
  total_tracks: z.number().int().nonnegative(),
  album_type: albumTypeSchema,
  external_urls: externalUrlsSchema,
});

export const artistAlbumsResponseSchema = z.object({
  items: z.array(albumSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
});

export const albumSearchResponseSchema = z.object({
  albums: z.object({
    items: z.array(albumSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
  }),
});

export type Album = z.infer<typeof albumSchema>;
export type AlbumSimplified = z.infer<typeof albumSimplifiedSchema>;
export type AlbumType = z.infer<typeof albumTypeSchema>;
export type ReleaseDatePrecision = z.infer<typeof releaseDatePrecisionSchema>;
export type ArtistAlbumsResponse = z.infer<typeof artistAlbumsResponseSchema>;
export type AlbumSearchResponse = z.infer<typeof albumSearchResponseSchema>;
