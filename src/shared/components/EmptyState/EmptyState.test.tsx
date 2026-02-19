import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { EmptyState } from "./EmptyState";

it("renderiza titulo", () => {
  render(<EmptyState title="No results found" />);

  expect(screen.getByText("No results found")).toBeInTheDocument();
});

it("renderiza descricao", () => {
  render(
    <EmptyState title="No results" description="Try a different search term" />,
  );

  expect(screen.getByText("Try a different search term")).toBeInTheDocument();
});

it("renderiza botao de acao", () => {
  const onClick = vi.fn();

  render(
    <EmptyState
      title="No results"
      action={{
        label: "Go back",
        onClick,
      }}
    />,
  );

  expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
});

it("clique no botao chama onClick", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(
    <EmptyState
      title="No results"
      action={{
        label: "Try again",
        onClick,
      }}
    />,
  );

  const button = screen.getByRole("button", { name: "Try again" });
  await user.click(button);

  expect(onClick).toHaveBeenCalled();
});

it("renderiza icone", () => {
  render(
    <EmptyState title="No results" icon={<svg data-testid="empty-icon" />} />,
  );

  expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
});
