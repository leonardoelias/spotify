import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { rootRoute } from "./__root";

import { useAuth, LoginButton } from "@/features/auth";
import { useLibrary } from "@/features/library";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { library } = useLibrary();
  const [searchQuery, setSearchQuery] = useState("");

  const recentFavorites = [
    ...library.artists.map((f) => ({ ...f, itemType: "artist" as const })),
    ...library.albums.map((f) => ({ ...f, itemType: "album" as const })),
  ]
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
    )
    .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/artists",
        search: { q: searchQuery.trim(), type: "artists", page: 1 },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-2xl w-full space-y-10 animate-fade-in-up">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{t("home.title")}</h1>
          <p className="text-text-secondary text-sm">{t("home.subtitle")}</p>
        </div>

        {isAuthenticated ? (
          <div className="space-y-10">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface text-white rounded-xl border border-transparent focus:border-border-subtle focus:ring-2 focus:ring-accent-muted outline-none transition-all text-sm placeholder:text-text-tertiary"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-accent text-bg font-semibold rounded-full hover:bg-accent-hover transition-colors text-sm"
                  >
                    {t("search.button")}
                  </button>
                )}
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/artists"
                search={{ q: "", type: "artists", page: 1 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface text-white text-sm font-medium rounded-full hover:bg-surface-hover transition-colors"
              >
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {t("home.searchArtists")}
              </Link>
              <Link
                to="/library"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface text-white text-sm font-medium rounded-full hover:bg-surface-hover transition-colors"
              >
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {t("home.myLibrary")}
              </Link>
            </div>

            {recentFavorites.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold">
                    {t("home.recentFavorites")}
                  </h2>
                  <Link
                    to="/library"
                    className="text-xs text-text-secondary hover:text-white transition-colors"
                  >
                    {t("home.seeAll")}
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {recentFavorites.map((favorite, i) => (
                    <Link
                      key={`${favorite.itemType}-${favorite.item.id}`}
                      to="/artists/$artistId"
                      params={{
                        artistId:
                          favorite.itemType === "artist"
                            ? favorite.item.id
                            : (favorite.item as any).artists?.[0]?.id || "",
                      }}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-surface mb-2.5">
                        <img
                          src={
                            favorite.item.images?.[0]?.url ||
                            "/placeholder-artist.png"
                          }
                          alt={favorite.item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                        {favorite.item.name}
                      </p>
                      <p className="text-xs text-text-secondary capitalize">
                        {favorite.itemType === "artist"
                          ? t("home.artist")
                          : t("home.album")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <p className="text-text-secondary text-sm text-center">{t("home.loginPrompt")}</p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
