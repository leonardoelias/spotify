import { it, expect, describe } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { NotFound } from "./NotFound";

describe("NotFound", () => {
  it("should render 404 text", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("should render default title from i18n key", () => {
    render(<NotFound />);
    expect(screen.getByText("errors.notFound")).toBeInTheDocument();
  });

  it("should render default description from i18n key", () => {
    render(<NotFound />);
    expect(screen.getByText("errors.notFoundDescription")).toBeInTheDocument();
  });

  it("should render custom title when provided", () => {
    render(<NotFound title="Artist not found" />);
    expect(screen.getByText("Artist not found")).toBeInTheDocument();
  });

  it("should render custom description when provided", () => {
    render(<NotFound description="Try searching for another artist" />);
    expect(screen.getByText("Try searching for another artist")).toBeInTheDocument();
  });

  it("should render home link", () => {
    render(<NotFound />);
    const link = screen.getByText("errors.goHome");
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });
});
