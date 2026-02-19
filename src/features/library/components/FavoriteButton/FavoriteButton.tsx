import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/shared/components";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  itemName?: string;
  ariaLabel?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  itemName,
  ariaLabel,
}: FavoriteButtonProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isFavorite) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }

    onToggle();

    if (isFavorite) {
      toast.success(
        itemName
          ? t("library.removedFromLibraryWithName", { name: itemName })
          : t("library.removedFromLibrary"),
      );
    } else {
      toast.success(
        itemName
          ? t("library.addedToLibraryWithName", { name: itemName })
          : t("library.addedToLibrary"),
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={
        ariaLabel ??
        (isFavorite
          ? t("library.removeFromFavorites")
          : t("library.addToFavorites"))
      }
      className="p-2 rounded-full hover:bg-surface-hover/50 transition-colors group"
    >
      {isFavorite ? (
        <svg
          className={`w-5 h-5 text-accent ${animating ? "animate-heart-pulse" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors"
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
      )}
    </button>
  );
}
