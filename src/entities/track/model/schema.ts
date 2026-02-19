import { z } from "zod";

import { albumSimplifiedSchema } from "@/entities/album";
import { externalUrlsSchema, artistSimplifiedSchema } from "@/entities/artist";

export const trackRestrictionsSchema = z.object({
  reason: z.string().optional(),
});

export const trackSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration_ms: z.number().int().nonnegative(),
  popularity: z.number().int().min(0).max(100),
  preview_url: z.string().url().nullable(),
  track_number: z.number().int().positive(),
  explicit: z.boolean(),
  album: albumSimplifiedSchema,
  artists: z.array(artistSimplifiedSchema),
  external_urls: externalUrlsSchema,
  is_playable: z.boolean().optional(),
  restrictions: trackRestrictionsSchema.optional(),
  type: z.literal("track").optional(),
  uri: z.string().optional(),
  href: z.string().url().optional(),
  is_local: z.boolean().optional(),
});

export const trackSimplifiedSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration_ms: z.number().int().nonnegative(),
  track_number: z.number().int().positive(),
  explicit: z.boolean(),
  preview_url: z.string().url().nullable(),
  external_urls: externalUrlsSchema,
});

export const artistTopTracksResponseSchema = z.object({
  tracks: z.array(trackSchema),
});

export const trackDurationCategorySchema = z.enum([
  "very_short",
  "short",
  "medium",
  "long",
  "very_long",
]);

export type Track = z.infer<typeof trackSchema>;
export type TrackSimplified = z.infer<typeof trackSimplifiedSchema>;
export type ArtistTopTracksResponse = z.infer<
  typeof artistTopTracksResponseSchema
>;
export type TrackDurationCategory = z.infer<typeof trackDurationCategorySchema>;
