import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";

import { render, screen } from "../../../test/test-utils";

import { SearchBar } from "./SearchBar";

it("submete query no enter", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} placeholder="Search artists" />);

  const input = screen.getByPlaceholderText("Search artists");
  await user.type(input, "Coldplay");
  await user.keyboard("{Enter}");

  expect(onSearch).toHaveBeenCalledWith("Coldplay");
});

it("faz trim no texto", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} />);

  const input = screen.getByPlaceholderText("Buscar...");
  await user.type(input, "  The Beatles  ");
  await user.keyboard("{Enter}");

  expect(onSearch).toHaveBeenCalledWith("The Beatles");
});

it("nao submete vazio", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} />);

  const input = screen.getByRole("textbox");
  input.focus();
  await user.keyboard("{Enter}");

  expect(onSearch).not.toHaveBeenCalled();
});

it("nao submete so espacos", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} />);

  const input = screen.getByRole("textbox");
  await user.type(input, "   ");
  await user.keyboard("{Enter}");

  expect(onSearch).not.toHaveBeenCalled();
});

it("mostra defaultValue", () => {
  const onSearch = vi.fn();

  render(<SearchBar onSearch={onSearch} defaultValue="Queen" />);

  const input = screen.getByDisplayValue("Queen");
  expect(input).toBeInTheDocument();
});
