import { it, expect } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { Loading } from "./Loading";

it("should render spinner", () => {
  render(<Loading />);

  const spinnerDiv =
    screen.getByText("common.loading").parentElement?.parentElement;
  expect(spinnerDiv).toBeInTheDocument();
});

it("should render custom message", () => {
  render(<Loading message="Loading artists..." />);

  expect(screen.getByText("Loading artists...")).toBeInTheDocument();
});

it("should occupy full screen when fullScreen is true", () => {
  render(<Loading fullScreen={true} />);

  expect(
    screen.getByText("common.loading").closest(".min-h-screen"),
  ).toBeInTheDocument();
});

it("should use default padding when fullScreen is false", () => {
  render(<Loading fullScreen={false} />);

  expect(
    screen.getByText("common.loading").closest(".py-16"),
  ).toBeInTheDocument();
});

it("should show default message without message prop", () => {
  render(<Loading />);

  expect(screen.getByText("common.loading")).toBeInTheDocument();
});
