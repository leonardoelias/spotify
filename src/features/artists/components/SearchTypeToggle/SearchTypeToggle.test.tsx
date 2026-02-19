import { fireEvent } from "@testing-library/react";
import { it, expect, describe, vi } from "vitest";

import { render, screen } from "../../../../test/test-utils";

import { SearchTypeToggle } from "./SearchTypeToggle";

describe("SearchTypeToggle", () => {
  it("should render both toggle options", () => {
    render(<SearchTypeToggle type="artists" onChange={vi.fn()} />);

    expect(screen.getByText("artists.searchArtists")).toBeInTheDocument();
    expect(screen.getByText("artists.searchAlbums")).toBeInTheDocument();
  });

  it("should highlight active type", () => {
    render(<SearchTypeToggle type="artists" onChange={vi.fn()} />);

    const artistsBtn = screen.getByText("artists.searchArtists");
    const albumsBtn = screen.getByText("artists.searchAlbums");

    expect(artistsBtn).toHaveClass("bg-accent");
    expect(albumsBtn).not.toHaveClass("bg-accent");
  });

  it("should highlight albums when type is albums", () => {
    render(<SearchTypeToggle type="albums" onChange={vi.fn()} />);

    const artistsBtn = screen.getByText("artists.searchArtists");
    const albumsBtn = screen.getByText("artists.searchAlbums");

    expect(albumsBtn).toHaveClass("bg-accent");
    expect(artistsBtn).not.toHaveClass("bg-accent");
  });

  it("should call onChange with 'albums' when albums button is clicked", () => {
    const onChange = vi.fn();
    render(<SearchTypeToggle type="artists" onChange={onChange} />);

    fireEvent.click(screen.getByText("artists.searchAlbums"));

    expect(onChange).toHaveBeenCalledWith("albums");
  });

  it("should call onChange with 'artists' when artists button is clicked", () => {
    const onChange = vi.fn();
    render(<SearchTypeToggle type="albums" onChange={onChange} />);

    fireEvent.click(screen.getByText("artists.searchArtists"));

    expect(onChange).toHaveBeenCalledWith("artists");
  });
});
