import { it, expect } from "vitest";

import {
  formatDuration,
  formatNumber,
  formatDate,
  formatDateShort,
  truncate,
  getAlbumTypeLabel,
} from "./format";

it("formatDuration - ms para MM:SS", () => {
  expect(formatDuration(0)).toBe("0:00");
  expect(formatDuration(3000)).toBe("0:03");
  expect(formatDuration(65000)).toBe("1:05");
  expect(formatDuration(125000)).toBe("2:05");
});

it("formatDuration - pad com zero", () => {
  expect(formatDuration(1000)).toBe("0:01");
  expect(formatDuration(2000)).toBe("0:02");
  expect(formatDuration(9000)).toBe("0:09");
});

it("formatNumber - abaixo de 1000", () => {
  expect(formatNumber(0)).toBe("0");
  expect(formatNumber(100)).toBe("100");
  expect(formatNumber(999)).toBe("999");
});

it("formatNumber - milhares com K", () => {
  expect(formatNumber(1000)).toBe("1.0K");
  expect(formatNumber(5500)).toBe("5.5K");
  expect(formatNumber(999999)).toBe("1000.0K");
});

it("formatNumber - milhoes com M", () => {
  expect(formatNumber(1000000)).toBe("1.0M");
  expect(formatNumber(5500000)).toBe("5.5M");
  expect(formatNumber(10000000)).toBe("10.0M");
});

it("formatDate - data completa", () => {
  const result = formatDate("2024-01-20");
  expect(result).toContain("20");
  expect(result).toContain("jan");
  expect(result).toContain("2024");
});

it("formatDate - pt-BR por padrao", () => {
  const resultPT = formatDate("2024-01-20");
  const resultEN = formatDate("2024-01-20", "en-US");
  expect(resultPT).not.toBe(resultEN);
});

it("formatDate - locale custom", () => {
  const result = formatDate("2024-01-20", "en-US");
  expect(result).toContain("20");
  expect(result).toContain("Jan");
  expect(result).toContain("2024");
});

it("formatDateShort - ano e mes", () => {
  const result = formatDateShort("2023-01-15");
  expect(result).toContain("jan");
  expect(result).toContain("2023");
  expect(result).not.toContain("15");
});

it("formatDateShort - pt-BR por padrao", () => {
  const resultPT = formatDateShort("2024-01-20");
  const resultEN = formatDateShort("2024-01-20", "en-US");
  expect(resultPT).not.toBe(resultEN);
});

it("truncate - string curta nao trunca", () => {
  expect(truncate("hello", 10)).toBe("hello");
  expect(truncate("hello", 5)).toBe("hello");
});

it("truncate - string longa adiciona ...", () => {
  expect(truncate("hello world", 5)).toBe("hello...");
  expect(truncate("this is a long string", 10)).toBe("this is a ...");
});

it("truncate - tamanho exato", () => {
  expect(truncate("exact", 5)).toBe("exact");
  expect(truncate("exact", 4)).toBe("exac...");
});

it("getAlbumTypeLabel - pt-BR", () => {
  expect(getAlbumTypeLabel("album")).toBe("Álbum");
  expect(getAlbumTypeLabel("single")).toBe("Single");
  expect(getAlbumTypeLabel("compilation")).toBe("Compilação");
});

it("getAlbumTypeLabel - en-US", () => {
  expect(getAlbumTypeLabel("album", "en-US")).toBe("Album");
  expect(getAlbumTypeLabel("single", "en-US")).toBe("Single");
  expect(getAlbumTypeLabel("compilation", "en-US")).toBe("Compilation");
});

it("getAlbumTypeLabel - tipo desconhecido retorna original", () => {
  expect(getAlbumTypeLabel("unknown")).toBe("unknown");
  expect(getAlbumTypeLabel("other", "pt-BR")).toBe("other");
});
