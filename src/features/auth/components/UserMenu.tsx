import * as Ariakit from "@ariakit/react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../hooks/useAuth";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user?.display_name) return null;

  const userImage = user.images?.[0]?.url;
  const displayName = user.display_name;

  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton className="flex items-center gap-2 px-2.5 py-1.5 bg-surface hover:bg-surface-hover rounded-full transition-colors">
        {userImage ? (
          <img
            src={userImage}
            alt={displayName}
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-bg text-xs font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-white text-sm font-medium hidden sm:block">
          {displayName}
        </span>
        <Ariakit.MenuButtonArrow className="w-3.5 h-3.5 text-text-tertiary" />
      </Ariakit.MenuButton>

      <Ariakit.Menu
        gutter={8}
        className="z-50 w-48 bg-elevated rounded-xl shadow-lg shadow-black/30 border border-border-subtle py-1 outline-none"
      >
        <Ariakit.MenuGroup>
          <Ariakit.MenuGroupLabel className="px-4 py-2.5 border-b border-border-subtle">
            <p className="text-white text-sm font-medium truncate">{displayName}</p>
            {user.email && (
              <p className="text-text-secondary text-xs truncate">{user.email}</p>
            )}
          </Ariakit.MenuGroupLabel>

          <Ariakit.MenuItem
            onClick={logout}
            className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-surface-hover data-[active-item]:bg-surface-hover transition-colors flex items-center gap-2 outline-none cursor-pointer text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {t("auth.logout")}
          </Ariakit.MenuItem>
        </Ariakit.MenuGroup>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
