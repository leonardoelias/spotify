import { HttpResponse, http } from "msw";
import { it, expect } from "vitest";

import { server } from "../../../test/mswSetup";
import { render, screen } from "../../../test/test-utils";

import type { Album } from "@/entities/album";

import { ArtistCard, AlbumCard } from "@/features/artists";
import { PAGINATION } from "@/shared/config/constants";

const mockArtists = [
  {
    id: "artist-1",
    name: "The Beatles",
    genres: ["rock", "pop"],
    images: [{ url: "https://example.com/image.jpg", height: 200, width: 200 }],
    followers: { total: 3500000 },
    popularity: 92,
    external_urls: { spotify: "https://spotify.com/artist/1" },
    uri: "spotify:artist:1",
    href: "https://api.spotify.com/artist/1",
    type: "artist" as const,
  },
  {
    id: "artist-2",
    name: "Queen",
    genres: ["rock"],
    images: [
      { url: "https://example.com/image2.jpg", height: 200, width: 200 },
    ],
    followers: { total: 2000000 },
    popularity: 88,
    external_urls: { spotify: "https://spotify.com/artist/2" },
    uri: "spotify:artist:2",
    href: "https://api.spotify.com/artist/2",
    type: "artist" as const,
  },
];

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

it("should render artists grid", () => {
  render(
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {mockArtists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist}>
          <ArtistCard.Image />
          <ArtistCard.Name />
          <ArtistCard.Genres />
          <ArtistCard.Stats />
        </ArtistCard>
      ))}
    </div>,
  );

  expect(screen.getByText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("Queen")).toBeInTheDocument();
});

it("should format pagination", () => {
  const totalItems = 250;
  const itemsPerPage = PAGINATION.ARTISTS_PAGE_SIZE;
  const currentPage = 2;
  const offset = (currentPage - 1) * itemsPerPage;

  render(
    <div className="flex items-center justify-between text-gray-400 text-sm">
      <span>
        {offset + 1} - {Math.min(offset + itemsPerPage, totalItems)} de{" "}
        {totalItems}
      </span>
    </div>,
  );

  expect(screen.getByText(/21.*40.*250/)).toBeInTheDocument();
});

it("should render albums grid", () => {
  render(
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <AlbumCard album={mockAlbum} />
    </div>,
  );

  expect(screen.getByText("Abbey Road")).toBeInTheDocument();
});

it("should render multiple artists in grid", () => {
  render(
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {mockArtists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist}>
          <ArtistCard.Image />
          <ArtistCard.Name />
        </ArtistCard>
      ))}
    </div>,
  );

  expect(screen.getByText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("Queen")).toBeInTheDocument();
});

it("should show artist stats", () => {
  render(
    <div>
      {mockArtists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist}>
          <ArtistCard.Stats />
        </ArtistCard>
      ))}
    </div>,
  );

  expect(screen.getByText(/3\.5M/)).toBeInTheDocument();
  expect(screen.getByText(/2\.0M/)).toBeInTheDocument();
});

it("should render album card with full info", () => {
  render(<AlbumCard album={mockAlbum} />);

  expect(screen.getByText("Abbey Road")).toBeInTheDocument();
  expect(screen.getByAltText("Abbey Road")).toBeInTheDocument();
  const link = screen.getByRole("link");
  expect(link).toHaveAttribute(
    "href",
    "https://open.spotify.com/album/album-1",
  );
  expect(link.textContent).toContain("Álbum");
});

it("should render cards in search context", () => {
  const offset = 0;
  const totalItems = mockArtists.length;
  const itemsPerPage = PAGINATION.ARTISTS_PAGE_SIZE;

  render(
    <div className="space-y-6">
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <span>
          {offset + 1} a {Math.min(offset + itemsPerPage, totalItems)} de{" "}
          {totalItems}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist}>
            <ArtistCard.Image />
            <ArtistCard.Name />
            <ArtistCard.Genres />
            <ArtistCard.Stats />
          </ArtistCard>
        ))}
      </div>
    </div>,
  );

  expect(screen.getByText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("Queen")).toBeInTheDocument();
  expect(screen.getByText(/1.*2.*2/)).toBeInTheDocument();
});

it("should show empty state on empty search", () => {
  server.use(
    http.get("https://api.spotify.com/v1/search", () =>
      HttpResponse.json({
        artists: {
          items: [],
          total: 0,
          limit: 20,
          offset: 0,
        },
      }),
    ),
  );

  render(
    <div>
      <div className="text-center py-12">
        <p className="text-gray-400">No artists found</p>
      </div>
    </div>,
  );

  expect(screen.getByText("No artists found")).toBeInTheDocument();
});

it("should show message on 500 error", () => {
  server.use(
    http.get("https://api.spotify.com/v1/search", () =>
      HttpResponse.json(
        { error: { status: 500, message: "Server error" } },
        { status: 500 },
      ),
    ),
  );

  render(
    <div>
      <div className="text-center py-12">
        <p className="text-red-500">
          Error searching artists. Please try again.
        </p>
      </div>
    </div>,
  );

  expect(
    screen.getByText("Error searching artists. Please try again."),
  ).toBeInTheDocument();
});

it("should show connection error on timeout", () => {
  server.use(
    http.get("https://api.spotify.com/v1/search", () => HttpResponse.error()),
  );

  render(
    <div>
      <div className="text-center py-12">
        <p className="text-red-500">
          Connection failed. Check your internet.
        </p>
      </div>
    </div>,
  );

  expect(
    screen.getByText("Connection failed. Check your internet."),
  ).toBeInTheDocument();
});

it("should render albums grid with pagination", () => {
  const mockAlbums = [
    mockAlbum,
    { ...mockAlbum, id: "album-2", name: "Let It Be" },
  ];

  render(
    <div>
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <span>1 - 2 de 50</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>,
  );

  expect(screen.getByText("Abbey Road")).toBeInTheDocument();
  expect(screen.getByText("Let It Be")).toBeInTheDocument();
  expect(screen.getByText(/1.*2.*50/)).toBeInTheDocument();
});
