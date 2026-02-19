import { it, expect, vi } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { ErrorBoundary } from "./ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error message");
};

const SafeComponent = () => <div>Safe content</div>;

it("renderiza children sem erro", () => {
  render(
    <ErrorBoundary>
      <SafeComponent />
    </ErrorBoundary>,
  );

  expect(screen.getByText("Safe content")).toBeInTheDocument();
});

it("mostra fallback de erro padrao", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  );

  expect(screen.getByText("errors.generic")).toBeInTheDocument();
  expect(screen.getByText("Test error message")).toBeInTheDocument();

  vi.restoreAllMocks();
});

it("exibe mensagem do erro no fallback", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  );

  expect(screen.getByText("Test error message")).toBeInTheDocument();

  vi.restoreAllMocks();
});

it("renderiza fallback customizado", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  const customFallback = (error: Error) => (
    <div>
      <p>Custom error: {error.message}</p>
    </div>
  );

  render(
    <ErrorBoundary fallback={customFallback}>
      <ThrowError />
    </ErrorBoundary>,
  );

  expect(
    screen.getByText("Custom error: Test error message"),
  ).toBeInTheDocument();

  vi.restoreAllMocks();
});

it("tem botao de retry no fallback", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>,
  );

  const retryButton = screen.getByRole("button", { name: "common.retry" });
  expect(retryButton).toBeInTheDocument();

  vi.restoreAllMocks();
});
