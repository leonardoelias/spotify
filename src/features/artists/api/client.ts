import {
  artistAlbumsResponseSchema,
  albumSearchResponseSchema,
  type ArtistAlbumsResponse,
  type AlbumSearchResponse,
} from "@/entities/album";
import {
  artistSearchResponseSchema,
  artistSchema,
  type Artist,
  type ArtistFilters,
  type ArtistSearchResponse,
} from "@/entities/artist";
import {
  artistTopTracksResponseSchema,
  type ArtistTopTracksResponse,
} from "@/entities/track";
import { spotify } from "@/shared/api";

export async function searchArtists(
  filters: ArtistFilters,
): Promise<ArtistSearchResponse> {
  const { query, limit = 20, offset = 0 } = filters;

  if (!query || !query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const response = await spotify.get<ArtistSearchResponse>(
    "/search",
    {
      params: {
        q: query.trim(),
        type: "artist",
        limit,
        offset,
      },
    },
  );

  return artistSearchResponseSchema.parse(response);
}

export async function getArtistDetails(artistId: string): Promise<Artist> {
  const response = await spotify.get<Artist>(`/artists/${artistId}`);

  return artistSchema.parse(response);
}

export async function getArtistTopTracks(
  artistId: string,
  market = "BR",
): Promise<ArtistTopTracksResponse> {
  const response = await spotify.get<ArtistTopTracksResponse>(
    `/artists/${artistId}/top-tracks`,
    { params: { market } },
  );

  return artistTopTracksResponseSchema.parse(response);
}

export async function getArtistAlbums(
  artistId: string,
  limit = 20,
  offset = 0,
): Promise<ArtistAlbumsResponse> {
  const response = await spotify.get<ArtistAlbumsResponse>(
    `/artists/${artistId}/albums`,
    {
      params: {
        limit,
        offset,
        include_groups: "album,single",
      },
    },
  );

  return artistAlbumsResponseSchema.parse(response);
}

export async function searchAlbums(
  query: string,
  limit = 20,
  offset = 0,
): Promise<AlbumSearchResponse> {
  if (!query || !query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const response = await spotify.get<AlbumSearchResponse>("/search", {
    params: {
      q: query.trim(),
      type: "album",
      limit,
      offset,
    },
  });

  return albumSearchResponseSchema.parse(response);
}
