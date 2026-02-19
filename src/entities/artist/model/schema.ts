import { z } from "zod";

export const spotifyImageSchema = z.object({
  url: z.string().url(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

export const externalUrlsSchema = z.object({
  spotify: z.string().url(),
});

export const followersSchema = z.object({
  total: z.number().int().nonnegative(),
});

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(spotifyImageSchema),
  followers: followersSchema,
  popularity: z.number().int().min(0).max(100),
  genres: z.array(z.string()),
  external_urls: externalUrlsSchema,
  type: z.literal("artist").optional(),
  uri: z.string().optional(),
  href: z.string().url().optional(),
});

export const artistSimplifiedSchema = z.object({
  id: z.string(),
  name: z.string(),
  external_urls: externalUrlsSchema,
  type: z.literal("artist").optional(),
  uri: z.string().optional(),
  href: z.string().url().optional(),
});

export const artistSearchResponseSchema = z.object({
  artists: z.object({
    items: z.array(artistSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
  }),
});

export const artistFiltersSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(50).optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0),
});

export type Artist = z.infer<typeof artistSchema>;
export type ArtistSimplified = z.infer<typeof artistSimplifiedSchema>;
export type ArtistSearchResponse = z.infer<typeof artistSearchResponseSchema>;
export type ArtistFilters = z.infer<typeof artistFiltersSchema>;
