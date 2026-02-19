import { HttpResponse, http } from "msw";
import { it, expect } from "vitest";

import { server } from "../../test/mswSetup";
import { render, screen } from "../../test/test-utils";

import type { Album } from "@/entities/album";
import type { Artist } from "@/entities/artist";

import { ArtistCard, AlbumCard } from "@/features/artists";
import { EmptyState } from "@/shared/components";

const mockArtist: Artist = {
  id: "artist-1",
  name: "The Beatles",
  genres: ["rock", "pop"],
  images: [{ url: "https://example.com/image.jpg", height: 200, width: 200 }],
  followers: { total: 3500000 },
  popularity: 92,
  external_urls: { spotify: "https://spotify.com/artist/1" },
  uri: "spotify:artist:1",
  href: "https://api.spotify.com/artist/1",
  type: "artist",
};

const mockAlbum: Album = {
  id: "album-1",
  name: "Abbey Road",
  album_type: "album",
  artists: [
    {
      id: "artist-1",
      name: "The Beatles",
      external_urls: { spotify: "https://spotify.com/artist/1" },
      uri: "spotify:artist:1",
      href: "https://api.spotify.com/artist/1",
      type: "artist",
    },
  ],
  release_date: "1969-09-26",
  release_date_precision: "day",
  images: [
    { url: "https://example.com/abbey-road.jpg", height: 300, width: 300 },
  ],
  total_tracks: 17,
  external_urls: { spotify: "https://open.spotify.com/album/album-1" },
  uri: "spotify:album:album-1",
  href: "https://api.spotify.com/album/album-1",
  type: "album",
};

it("should show empty state with empty library", () => {
  render(
    <EmptyState
      title="library.emptyTitle"
      description="library.emptyMessage"
    />,
  );

  expect(screen.getByText("library.emptyTitle")).toBeInTheDocument();
  expect(screen.getByText("library.emptyMessage")).toBeInTheDocument();
});

it("should render favorite artists section", () => {
  const favoritedArtists = [
    { item: mockArtist, addedAt: new Date() },
    {
      item: {
        ...mockArtist,
        id: "artist-2",
        name: "Queen",
      },
      addedAt: new Date(),
    },
  ];

  render(
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          library.favoriteArtists
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoritedArtists.map((fav) => (
            <ArtistCard key={fav.item.id} artist={fav.item}>
              <ArtistCard.Image />
              <ArtistCard.Name />
              <ArtistCard.Genres />
              <ArtistCard.Stats />
            </ArtistCard>
          ))}
        </div>
      </section>
    </div>,
  );

  expect(screen.getByText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("Queen")).toBeInTheDocument();
});

it("should render favorite albums section", () => {
  const favoritedAlbums = [{ item: mockAlbum, addedAt: new Date() }];

  render(
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          library.favoriteAlbums
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoritedAlbums.map((fav) => (
            <AlbumCard key={fav.item.id} album={fav.item} />
          ))}
        </div>
      </section>
    </div>,
  );

  expect(screen.getByText("Abbey Road")).toBeInTheDocument();
});

it("should show summary with count", () => {
  const artistCount = 3;
  const albumCount = 5;

  render(
    <p className="text-gray-400">
      {artistCount} artists • {albumCount} albums
    </p>,
  );

  expect(screen.getByText(/3 artists • 5 albums/)).toBeInTheDocument();
});

it("should render artists and albums together", () => {
  const favoritedArtists = [{ item: mockArtist, addedAt: new Date() }];
  const favoritedAlbums = [{ item: mockAlbum, addedAt: new Date() }];

  render(
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          Favorite Artists
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoritedArtists.map((fav) => (
            <ArtistCard key={fav.item.id} artist={fav.item}>
              <ArtistCard.Image />
              <ArtistCard.Name />
            </ArtistCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Favorite Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoritedAlbums.map((fav) => (
            <AlbumCard key={fav.item.id} album={fav.item} />
          ))}
        </div>
      </section>
    </div>,
  );

  expect(screen.getByText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("Abbey Road")).toBeInTheDocument();
  expect(screen.getByText("Favorite Artists")).toBeInTheDocument();
  expect(screen.getByText("Favorite Albums")).toBeInTheDocument();
});

it("should show empty library with explore link", () => {
  render(
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-xl font-semibold text-white mb-2">
        Your library is empty
      </h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Start by adding artists and albums to your favorites
      </p>
      <a
        href="/artists"
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full"
      >
        Explore Artists
      </a>
    </div>,
  );

  expect(screen.getByText("Your library is empty")).toBeInTheDocument();
  expect(
    screen.getByText("Start by adding artists and albums to your favorites"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Explore Artists" }),
  ).toBeInTheDocument();
});

it("should show singular label", () => {
  render(<p className="text-gray-400">1 artist • 2 albums</p>);

  expect(screen.getByText(/1 artist • 2 albums/)).toBeInTheDocument();
});

it("should show error when adding artist", () => {
  server.use(
    http.post("https://api.spotify.com/v1/me/top/tracks", () =>
      HttpResponse.json(
        { error: { status: 500, message: "Server error" } },
        { status: 500 },
      ),
    ),
  );

  render(
    <div className="text-center py-12">
      <p className="text-red-500">Error adding artist to favorites</p>
    </div>,
  );

  expect(
    screen.getByText("Error adding artist to favorites"),
  ).toBeInTheDocument();
});

it("should show error when adding album", () => {
  server.use(
    http.post("https://api.spotify.com/v1/me/albums", () =>
      HttpResponse.json(
        { error: { status: 500, message: "Server error" } },
        { status: 500 },
      ),
    ),
  );

  render(
    <div className="text-center py-12">
      <p className="text-red-500">Error adding album to favorites</p>
    </div>,
  );

  expect(
    screen.getByText("Error adding album to favorites"),
  ).toBeInTheDocument();
});

it("should show error when removing favorite", () => {
  server.use(
    http.delete("https://api.spotify.com/v1/me/artists", () =>
      HttpResponse.json(
        { error: { status: 500, message: "Server error" } },
        { status: 500 },
      ),
    ),
  );

  render(
    <div className="text-center py-12">
      <p className="text-red-500">Error removing from favorites</p>
    </div>,
  );

  expect(screen.getByText("Error removing from favorites")).toBeInTheDocument();
});

it("should show network error when loading", () => {
  server.use(
    http.get("https://api.spotify.com/v1/me/tracks", () =>
      HttpResponse.error(),
    ),
  );

  render(
    <div className="text-center py-12">
      <p className="text-red-500">
        Failed to load library. Check your connection.
      </p>
    </div>,
  );

  expect(
    screen.getByText("Failed to load library. Check your connection."),
  ).toBeInTheDocument();
});

it("should render library with many favorites", () => {
  const favoritedArtists = Array.from({ length: 5 }, (_, i) => ({
    item: { ...mockArtist, id: `artist-${i}`, name: `Artist ${i + 1}` },
    addedAt: new Date(),
  }));

  const favoritedAlbums = Array.from({ length: 5 }, (_, i) => ({
    item: { ...mockAlbum, id: `album-${i}`, name: `Album ${i + 1}` },
    addedAt: new Date(),
  }));

  render(
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          Favorite Artists
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoritedArtists.map((fav) => (
            <ArtistCard key={fav.item.id} artist={fav.item}>
              <ArtistCard.Image />
              <ArtistCard.Name />
            </ArtistCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Favorite Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favoritedAlbums.map((fav) => (
            <AlbumCard key={fav.item.id} album={fav.item} />
          ))}
        </div>
      </section>
    </div>,
  );

  expect(screen.getByText("Artist 1")).toBeInTheDocument();
  expect(screen.getByText("Artist 5")).toBeInTheDocument();
  expect(screen.getByText("Album 1")).toBeInTheDocument();
  expect(screen.getByText("Album 5")).toBeInTheDocument();
});
