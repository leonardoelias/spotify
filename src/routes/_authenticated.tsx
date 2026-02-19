import { createRoute, redirect, Outlet } from "@tanstack/react-router";

import { rootRoute } from "./__root";

import { useAuth } from "@/features/auth";
import { Loading } from "@/shared/components";

export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: async ({ context, location }) => {
    const { auth } = context;

    if (auth.isLoading) {
      return;
    }

    if (!auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}
