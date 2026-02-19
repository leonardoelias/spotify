import { useTranslation } from "react-i18next";

import {
  SUPPORTED_LANGUAGES,
  saveLanguage,
  type SupportedLanguage,
} from "@/shared/i18n";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
    saveLanguage(language);
  };

  return (
    <div className="relative inline-block z-50">
      <select
        value={i18n.language}
        onChange={(e) =>
          handleLanguageChange(e.target.value as SupportedLanguage)
        }
        className="appearance-none bg-surface text-white text-sm rounded-full px-3 py-1.5 pr-7 border border-transparent hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent-muted focus:border-transparent cursor-pointer transition-colors"
        aria-label={t("language.select")}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang} className="bg-elevated">
            {t(`language.${lang}`)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-tertiary">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
