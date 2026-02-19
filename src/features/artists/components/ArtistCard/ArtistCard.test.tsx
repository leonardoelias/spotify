import { it, expect } from "vitest";

import { render, screen } from "../../../../test/test-utils";

import { ArtistCard } from "./ArtistCard";

import type { Artist } from "@/entities/artist";

const mockArtist: Artist = {
  id: "artist-1",
  name: "The Beatles",
  genres: ["rock", "pop", "beat"],
  images: [
    {
      url: "https://example.com/image.jpg",
      height: 200,
      width: 200,
    },
  ],
  followers: {
    total: 3500000,
  },
  popularity: 92,
  external_urls: {
    spotify: "https://spotify.com/artist/1",
  },
  uri: "spotify:artist:1",
  href: "https://api.spotify.com/artist/1",
  type: "artist",
};

it("should render artist name", () => {
  render(
    <ArtistCard artist={mockArtist}>
      <ArtistCard.Name />
    </ArtistCard>,
  );

  expect(screen.getByText("The Beatles")).toBeInTheDocument();
});

it("should render image with alt", () => {
  render(
    <ArtistCard artist={mockArtist}>
      <ArtistCard.Image />
    </ArtistCard>,
  );

  const image = screen.getByAltText("The Beatles");
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
});

it("should render genres", () => {
  render(
    <ArtistCard artist={mockArtist}>
      <ArtistCard.Genres max={2} />
    </ArtistCard>,
  );

  expect(screen.getByText("rock")).toBeInTheDocument();
  expect(screen.getByText("pop")).toBeInTheDocument();
});

it("should format followers with M", () => {
  render(
    <ArtistCard artist={mockArtist}>
      <ArtistCard.Stats />
    </ArtistCard>,
  );

  expect(screen.getByText(/3\.5M/)).toBeInTheDocument();
});

it("should show popularity", () => {
  render(
    <ArtistCard artist={mockArtist}>
      <ArtistCard.Stats />
    </ArtistCard>,
  );

  expect(screen.getByText("92")).toBeInTheDocument();
  const svg = screen.getByText("92").parentElement?.querySelector("svg");
  expect(svg).toBeInTheDocument();
});

it("should render all subcomponents together", () => {
  render(
    <ArtistCard artist={mockArtist}>
      <ArtistCard.Image />
      <ArtistCard.Name />
      <ArtistCard.Genres max={2} />
      <ArtistCard.Stats />
    </ArtistCard>,
  );

  expect(screen.getByAltText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("The Beatles")).toBeInTheDocument();
  expect(screen.getByText("rock")).toBeInTheDocument();
  expect(screen.getByText(/3\.5M/)).toBeInTheDocument();
});
