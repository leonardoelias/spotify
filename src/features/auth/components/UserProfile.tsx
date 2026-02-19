import { useTranslation } from "react-i18next";

import { useAuth } from "../hooks/useAuth";

export function UserProfile() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const userImage = user.images?.[0]?.url;

  return (
    <div className="flex items-center gap-4 p-4 bg-surface rounded-xl">
      {userImage && (
        <img
          src={userImage}
          alt={user.display_name || "User"}
          className="w-12 h-12 rounded-full"
        />
      )}

      <div className="flex-1">
        <h3 className="text-white font-semibold text-sm">
          {user.display_name || "Spotify User"}
        </h3>
        {user.email && <p className="text-text-secondary text-xs">{user.email}</p>}
      </div>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500/80 text-white text-sm rounded-full hover:bg-red-500 transition-colors"
      >
        {t("auth.logout")}
      </button>
    </div>
  );
}
