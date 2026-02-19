import { http, HttpResponse } from "msw";

const API = "https://api.spotify.com/v1";

const mockArtist = (id = "1", name = "Artist 1") => ({
  id,
  name,
  type: "artist" as const,
  external_urls: {
    spotify: `https://open.spotify.com/artist/${id}`,
  },
  followers: {
    href: null,
    total: 1000000 + Math.floor(Math.random() * 2000000),
  },
  genres: ["rock", "alternative", "indie"],
  href: `${API}/artists/${id}`,
  images: [
    {
      height: 640,
      url: `https://i.scdn.co/image/${id}`,
      width: 640,
    },
  ],
  popularity: 70 + Math.floor(Math.random() * 30),
  uri: `spotify:artist:${id}`,
});

const mockAlbum = (id = "alb1", artistId = "1") => ({
  id,
  name: "Album 1",
  type: "album" as const,
  album_type: "album" as const,
  artists: [mockArtist(artistId)],
  external_urls: {
    spotify: `https://open.spotify.com/album/${id}`,
  },
  href: `${API}/albums/${id}`,
  images: [
    {
      height: 640,
      url: `https://i.scdn.co/image/${id}`,
      width: 640,
    },
  ],
  release_date: "2023-01-15",
  release_date_precision: "day" as const,
  total_tracks: 12,
  uri: `spotify:album:${id}`,
});

const mockTrack = (id = "track1", artistId = "1", albumId = "alb1") => ({
  id,
  name: "Track 1",
  type: "track" as const,
  album: mockAlbum(albumId, artistId),
  artists: [mockArtist(artistId)],
  disc_number: 1,
  duration_ms: 180000,
  explicit: false,
  external_urls: {
    spotify: `https://open.spotify.com/track/${id}`,
  },
  href: `${API}/tracks/${id}`,
  is_local: false,
  popularity: 75,
  preview_url: `https://p.scdn.co/mp3-preview/${id}`,
  track_number: 1,
  uri: `spotify:track:${id}`,
});

function paginationUrl(baseUrl: string, offset: number, limit: number) {
  const url = new URL(baseUrl);
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("limit", String(limit));
  return url.toString();
}

export const apiHandlers = [
  http.get(`${API}/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const type = url.searchParams.get("type") || "artist";
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    if (type === "artist") {
      return HttpResponse.json({
        artists: {
          href: request.url,
          items: Array.from({ length: Math.min(limit, 20) }, (_, i) =>
            mockArtist(
              `artist-${offset + i}`,
              `${q || "Artist"} ${offset + i + 1}`,
            ),
          ),
          limit,
          next: offset + limit < 100 ? paginationUrl(request.url, offset + limit, limit) : null,
          offset,
          previous:
            offset > 0 ? paginationUrl(request.url, Math.max(0, offset - limit), limit) : null,
          total: 100,
        },
      });
    }

    if (type === "album") {
      return HttpResponse.json({
        albums: {
          href: request.url,
          items: Array.from({ length: Math.min(limit, 20) }, (_, i) =>
            mockAlbum(`album-${offset + i}`),
          ),
          limit,
          next: offset + limit < 100 ? paginationUrl(request.url, offset + limit, limit) : null,
          offset,
          previous:
            offset > 0 ? paginationUrl(request.url, Math.max(0, offset - limit), limit) : null,
          total: 100,
        },
      });
    }

    return HttpResponse.json({});
  }),

  http.get(`${API}/artists/:id/albums`, ({ params, request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const artistId = params.id as string;

    return HttpResponse.json({
      href: request.url,
      items: Array.from({ length: Math.min(limit, 10) }, (_, i) =>
        mockAlbum(`album-${offset + i}`, artistId),
      ),
      limit,
      next: offset + limit < 50 ? paginationUrl(request.url, offset + limit, limit) : null,
      offset,
      previous: offset > 0 ? paginationUrl(request.url, Math.max(0, offset - limit), limit) : null,
      total: 50,
    });
  }),

  http.get(`${API}/artists/:id/top-tracks`, ({ params }) => {
    const artistId = params.id as string;
    return HttpResponse.json({
      tracks: Array.from({ length: 10 }, (_, i) =>
        mockTrack(`track-${i}`, artistId),
      ),
    });
  }),

  http.get(`${API}/artists/:id`, ({ params }) => {
    const id = params.id as string;
    return HttpResponse.json(mockArtist(id));
  }),

  http.get(`${API}/artists`, ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get("ids") || "";
    const artistIds = ids.split(",").filter(Boolean);

    return HttpResponse.json({
      artists: artistIds.map((id) => mockArtist(id.trim())),
    });
  }),

  http.get(`${API}/albums/:id/tracks`, ({ params, request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    return HttpResponse.json({
      href: request.url,
      items: Array.from({ length: Math.min(limit, 12) }, (_, i) =>
        mockTrack(`track-${offset + i}`, "1", params.id as string),
      ),
      limit,
      next: offset + limit < 50 ? paginationUrl(request.url, offset + limit, limit) : null,
      offset,
      previous: offset > 0 ? paginationUrl(request.url, Math.max(0, offset - limit), limit) : null,
      total: 50,
    });
  }),

  http.get(`${API}/albums/:id`, ({ params }) => {
    return HttpResponse.json(mockAlbum(params.id as string));
  }),

  http.get(`${API}/albums`, ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get("ids") || "";
    const albumIds = ids.split(",").filter(Boolean);

    return HttpResponse.json({
      albums: albumIds.map((id) => mockAlbum(id.trim())),
    });
  }),

  http.get(`${API}/tracks/:id`, ({ params }) => {
    return HttpResponse.json(mockTrack(params.id as string));
  }),

  http.get(`${API}/tracks`, ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get("ids") || "";
    const trackIds = ids.split(",").filter(Boolean);

    return HttpResponse.json({
      tracks: trackIds.map((id) => mockTrack(id.trim())),
    });
  }),

  http.get(`${API}/me`, () => {
    return HttpResponse.json({
      id: "current-user",
      display_name: "Test User",
      email: "test@example.com",
      external_urls: {
        spotify: "https://open.spotify.com/user/current-user",
      },
      followers: {
        href: null,
        total: 0,
      },
      href: `${API}/users/current-user`,
      images: [{ url: "https://i.scdn.co/image/test-user", height: 64, width: 64 }],
      type: "user",
      uri: "spotify:user:current-user",
      product: "premium",
    });
  }),

  http.get(`${API}/me/top/artists`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    return HttpResponse.json({
      href: request.url,
      items: Array.from({ length: Math.min(limit, 10) }, (_, i) =>
        mockArtist(`top-artist-${offset + i}`, `Top Artist ${offset + i + 1}`),
      ),
      limit,
      next: offset + limit < 50 ? paginationUrl(request.url, offset + limit, limit) : null,
      offset,
      previous: offset > 0 ? paginationUrl(request.url, Math.max(0, offset - limit), limit) : null,
      total: 50,
    });
  }),

  http.get(`${API}/me/top/tracks`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    return HttpResponse.json({
      href: request.url,
      items: Array.from({ length: Math.min(limit, 10) }, (_, i) =>
        mockTrack(`top-track-${offset + i}`),
      ),
      limit,
      next: null,
      offset,
      previous: null,
      total: 10,
    });
  }),

  http.get(`${API}/me/player/recently-played`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");

    return HttpResponse.json({
      items: Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        track: mockTrack(`recent-track-${i}`),
        played_at: new Date(Date.now() - i * 3600000).toISOString(),
        context: null,
      })),
      next: null,
      cursors: { after: "cursor", before: "cursor" },
      limit,
    });
  }),

  http.get(`${API}/me/tracks`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    return HttpResponse.json({
      href: request.url,
      items: Array.from({ length: Math.min(limit, 5) }, (_, i) =>
        mockTrack(`liked-track-${offset + i}`),
      ),
      limit,
      next: null,
      offset,
      previous: null,
      total: 5,
    });
  }),

  http.post("https://accounts.spotify.com/api/token", () => {
    return HttpResponse.json({
      access_token: "mock-access-token",
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      scope: "user-read-private user-read-email user-top-read user-read-recently-played",
    });
  }),
];
