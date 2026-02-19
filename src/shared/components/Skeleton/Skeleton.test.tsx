import { it, expect, describe } from "vitest";

import { render, screen } from "../../../test/test-utils";

import {
  Skeleton,
  ArtistCardSkeleton,
  AlbumCardSkeleton,
  ArtistGridSkeleton,
  AlbumGridSkeleton,
  TrackRowSkeleton,
  TrackListSkeleton,
} from "./Skeleton";

describe("Skeleton", () => {
  it("should render with aria-hidden", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);
    const el = container.querySelector("[aria-hidden='true']");
    expect(el).toHaveClass("h-4", "w-full");
  });

  it("should have shimmer animation class", () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector("[aria-hidden='true']");
    expect(el).toHaveClass("animate-shimmer");
  });
});

describe("ArtistCardSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<ArtistCardSkeleton />);
    expect(container.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(0);
  });
});

describe("AlbumCardSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<AlbumCardSkeleton />);
    expect(container.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(0);
  });
});

describe("ArtistGridSkeleton", () => {
  it("should render default 10 items", () => {
    const { container } = render(<ArtistGridSkeleton />);
    const skeletons = container.querySelectorAll(".bg-surface");
    expect(skeletons).toHaveLength(10);
  });

  it("should render custom count", () => {
    const { container } = render(<ArtistGridSkeleton count={3} />);
    const skeletons = container.querySelectorAll(".bg-surface");
    expect(skeletons).toHaveLength(3);
  });
});

describe("AlbumGridSkeleton", () => {
  it("should render default 10 items", () => {
    const { container } = render(<AlbumGridSkeleton />);
    const skeletons = container.querySelectorAll(".bg-surface");
    expect(skeletons).toHaveLength(10);
  });

  it("should render custom count", () => {
    const { container } = render(<AlbumGridSkeleton count={5} />);
    const skeletons = container.querySelectorAll(".bg-surface");
    expect(skeletons).toHaveLength(5);
  });
});

describe("TrackRowSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<TrackRowSkeleton />);
    expect(container.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(0);
  });
});

describe("TrackListSkeleton", () => {
  it("should render default 5 rows", () => {
    const { container } = render(<TrackListSkeleton />);
    const rows = container.querySelectorAll(".flex.items-center");
    expect(rows).toHaveLength(5);
  });

  it("should render custom count", () => {
    const { container } = render(<TrackListSkeleton count={3} />);
    const rows = container.querySelectorAll(".flex.items-center");
    expect(rows).toHaveLength(3);
  });
});
