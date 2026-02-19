import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, afterAll, beforeAll, vi } from "vitest";

import { server } from "./mswSetup";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    Link: React.forwardRef(
      ({ children, to, params, ...props }: any, ref: any) => {
        const href =
          typeof to === "string"
            ? to.replace(
                /\$(\w+)/g,
                (match: string, param: string) => params?.[param] || match,
              )
            : "/";
        return React.createElement("a", { ref, href, ...props }, children);
      },
    ),
  };
});

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

afterEach(() => {
  cleanup();
});
