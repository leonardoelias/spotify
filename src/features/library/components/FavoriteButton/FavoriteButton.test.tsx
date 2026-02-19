import { fireEvent } from "@testing-library/react";
import { toast } from "sonner";
import { it, expect, describe, vi, beforeEach } from "vitest";

import { render, screen } from "../../../../test/test-utils";

import { FavoriteButton } from "./FavoriteButton";

vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockedToast = vi.mocked(toast);

describe("FavoriteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render unfavorited state", () => {
    render(<FavoriteButton isFavorite={false} onToggle={vi.fn()} />);

    expect(
      screen.getByLabelText("library.addToFavorites"),
    ).toBeInTheDocument();
  });

  it("should render favorited state", () => {
    render(<FavoriteButton isFavorite={true} onToggle={vi.fn()} />);

    expect(
      screen.getByLabelText("library.removeFromFavorites"),
    ).toBeInTheDocument();
  });

  it("should call onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByLabelText("library.addToFavorites"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("should use custom ariaLabel when provided", () => {
    render(
      <FavoriteButton
        isFavorite={false}
        onToggle={vi.fn()}
        ariaLabel="Favoritar Beatles"
      />,
    );

    expect(screen.getByLabelText("Favoritar Beatles")).toBeInTheDocument();
  });

  it("should stop event propagation on click", () => {
    const parentClick = vi.fn();
    const onToggle = vi.fn();

    render(
      <div onClick={parentClick}>
        <FavoriteButton isFavorite={false} onToggle={onToggle} />
      </div>,
    );

    fireEvent.click(screen.getByLabelText("library.addToFavorites"));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("should show toast when adding to favorites", () => {
    render(<FavoriteButton isFavorite={false} onToggle={vi.fn()} />);

    fireEvent.click(screen.getByLabelText("library.addToFavorites"));

    expect(mockedToast.success).toHaveBeenCalledWith("library.addedToLibrary");
  });

  it("should show toast with name when removing from favorites", () => {
    render(
      <FavoriteButton
        isFavorite={true}
        onToggle={vi.fn()}
        itemName="Beatles"
      />,
    );

    fireEvent.click(screen.getByLabelText("library.removeFromFavorites"));

    expect(mockedToast.success).toHaveBeenCalledWith(
      "library.removedFromLibraryWithName",
    );
  });
});
