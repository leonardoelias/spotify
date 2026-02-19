import type {
  favoriteArtistSchema,
  favoriteAlbumSchema,
  favoriteItemSchema,
  librarySchema,
} from "./schema";
import type { z } from "zod";

export type FavoriteArtist = z.infer<typeof favoriteArtistSchema>;
export type FavoriteAlbum = z.infer<typeof favoriteAlbumSchema>;
export type FavoriteItem = z.infer<typeof favoriteItemSchema>;
export type Library = z.infer<typeof librarySchema>;
