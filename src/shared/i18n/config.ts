import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "./locales/en-US.json";
import ptBR from "./locales/pt-BR.json";

export const SUPPORTED_LANGUAGES = ["pt-BR", "en-US"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "pt-BR";

const STORAGE_KEY = "spotify-artists:language";

function detectLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  const browserLang = navigator.language;
  if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  const langPrefix = browserLang.split("-")[0];
  const matchedLang = SUPPORTED_LANGUAGES.find((lang) =>
    lang.startsWith(langPrefix),
  );
  if (matchedLang) {
    return matchedLang;
  }

  return DEFAULT_LANGUAGE;
}

export function saveLanguage(language: SupportedLanguage): void {
  localStorage.setItem(STORAGE_KEY, language);
}

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    "en-US": { translation: enUS },
  },
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
