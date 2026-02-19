import { createRoute } from "@tanstack/react-router";

import { authenticatedRoute } from "../_authenticated";

export const libraryRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/library",
}).lazy(() => import("./library.lazy").then((d) => d.Route));
