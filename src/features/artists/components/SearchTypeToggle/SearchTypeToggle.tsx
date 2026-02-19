import { useTranslation } from "react-i18next";

import { cn } from "@/shared/utils";

type SearchType = "artists" | "albums";

interface SearchTypeToggleProps {
  type: SearchType;
  onChange: (type: SearchType) => void;
}

export function SearchTypeToggle({ type, onChange }: SearchTypeToggleProps) {
  const { t } = useTranslation();

  const options: { value: SearchType; label: string }[] = [
    { value: "artists", label: t("artists.searchArtists") },
    { value: "albums", label: t("artists.searchAlbums") },
  ];

  return (
    <div className="flex gap-1.5">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            type === value
              ? "bg-accent text-bg"
              : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-white",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
