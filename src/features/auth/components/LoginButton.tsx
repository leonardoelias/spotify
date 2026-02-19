import { useTranslation } from "react-i18next";

import { useAuth } from "../hooks/useAuth";

export function LoginButton() {
  const { login } = useAuth();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => login()}
      className="px-6 py-2.5 bg-accent text-bg font-semibold text-sm rounded-full hover:bg-accent-hover transition-colors"
    >
      {t("auth.login")}
    </button>
  );
}
