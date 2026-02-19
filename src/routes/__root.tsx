import {
  Outlet,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";

const TanStackRouterDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@tanstack/router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null;

import type { AuthContextValue } from "@/entities/auth";
import type { QueryClient } from "@tanstack/react-query";

import { useAuth, UserMenu } from "@/features/auth";
import { LanguageSelector } from "@/shared/components";

interface MyRouterContext {
  auth: AuthContextValue;
  queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const auth = useAuth();
  const { isAuthenticated, isLoading } = auth;
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-lg font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity"
              activeProps={{ className: "text-lg font-extrabold tracking-tight text-white" }}
            >
              [spotify artists]
            </Link>

            {isAuthenticated && (
              <nav className="flex items-center gap-1">
                <Link
                  to="/artists"
                  search={{ q: "", type: "artists", page: 1 }}
                  className="px-3.5 py-1.5 text-sm text-text-secondary hover:text-white rounded-lg hover:bg-surface transition-all"
                  activeProps={{ className: "px-3.5 py-1.5 text-sm text-white font-medium rounded-lg bg-surface" }}
                >
                  {t("navigation.search")}
                </Link>
                <Link
                  to="/library"
                  className="px-3.5 py-1.5 text-sm text-text-secondary hover:text-white rounded-lg hover:bg-surface transition-all"
                  activeProps={{ className: "px-3.5 py-1.5 text-sm text-white font-medium rounded-lg bg-surface" }}
                >
                  {t("navigation.library")}
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            {isAuthenticated && !isLoading && <UserMenu />}
          </div>
        </div>
      </header>

      <main className="pt-16">
        <Outlet />
      </main>

      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </div>
  );
}
