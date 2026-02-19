import { it, expect } from "vitest";

import { cn } from "./cn";

it("should return empty string without arguments", () => {
  expect(cn()).toBe("");
});

it("should combine simple classes", () => {
  expect(cn("foo", "bar")).toBe("foo bar");
});

it("should ignore falsy values", () => {
  expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
});

it("should accept conditionals with object", () => {
  expect(cn("base", { active: true, disabled: false })).toBe("base active");
});

it("should accept arrays", () => {
  expect(cn(["foo", "bar"])).toBe("foo bar");
});

it("should merge conflicting tailwind classes", () => {
  expect(cn("px-2", "px-4")).toBe("px-4");
  expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
});

it("should preserve non-conflicting tailwind classes", () => {
  expect(cn("px-2", "py-4")).toBe("px-2 py-4");
});
