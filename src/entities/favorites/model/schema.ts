import { z } from "zod";

import { albumSchema } from "@/entities/album";
import { artistSchema } from "@/entities/artist";

export const favoriteArtistSchema = z.object({
  type: z.literal("artist"),
  item: artistSchema,
  addedAt: z.string().datetime(),
});

export const favoriteAlbumSchema = z.object({
  type: z.literal("album"),
  item: albumSchema,
  addedAt: z.string().datetime(),
});

export const favoriteItemSchema = z.discriminatedUnion("type", [
  favoriteArtistSchema,
  favoriteAlbumSchema,
]);

export const librarySchema = z.object({
  artists: z.array(favoriteArtistSchema),
  albums: z.array(favoriteAlbumSchema),
});
