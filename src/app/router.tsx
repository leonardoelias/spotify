import type { NotFoundRouteProps } from "@tanstack/react-router";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "@/shared/components/DefaultCatchBoundary";
import { NotFound } from "@/shared/components/NotFound";
import { Loading } from "@/shared/components/Loading";

function DefaultNotFound(_props: NotFoundRouteProps) {
  return <NotFound />;
}

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: DefaultNotFound,
  defaultPendingComponent: Loading,
  defaultPendingMs: 500,
  defaultPendingMinMs: 200,
  defaultStructuralSharing: true,
  context: {
    auth: undefined!,
    queryClient: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
