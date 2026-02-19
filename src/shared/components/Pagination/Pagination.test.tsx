import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { Pagination } from "./Pagination";

it("renderiza controles com multiplas paginas", () => {
  const onPageChange = vi.fn();

  render(
    <Pagination
      currentPage={1}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={onPageChange}
    />,
  );

  const buttons = screen.getAllByRole("button");
  expect(buttons.length).toBeGreaterThan(0);
});

it("chama onPageChange no proximo", async () => {
  const user = userEvent.setup();
  const onPageChange = vi.fn();

  render(
    <Pagination
      currentPage={1}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={onPageChange}
    />,
  );

  const nextButton = screen.getAllByRole("button")[1];
  await user.click(nextButton);

  expect(onPageChange).toHaveBeenCalledWith(2);
});

it("chama onPageChange no anterior", async () => {
  const user = userEvent.setup();
  const onPageChange = vi.fn();

  render(
    <Pagination
      currentPage={5}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={onPageChange}
    />,
  );

  const prevButton = screen.getAllByRole("button")[0];
  await user.click(prevButton);

  expect(onPageChange).toHaveBeenCalledWith(4);
});

it("desabilita anterior na primeira pagina", () => {
  const onPageChange = vi.fn();

  render(
    <Pagination
      currentPage={1}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={onPageChange}
    />,
  );

  const prevButton = screen.getAllByRole("button")[0];
  expect(prevButton).toBeDisabled();
});

it("desabilita proximo na ultima pagina", () => {
  const onPageChange = vi.fn();

  render(
    <Pagination
      currentPage={10}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={onPageChange}
    />,
  );

  const nextButton = screen.getAllByRole("button")[1];
  expect(nextButton).toBeDisabled();
});
