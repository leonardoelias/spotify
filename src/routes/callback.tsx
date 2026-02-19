import { createRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { rootRoute } from "./__root";

export const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/callback",
  beforeLoad: async ({ context }) => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (params.get("error") || !code) {
      throw redirect({ to: "/", replace: true });
    }

    await context.auth.handleCallback(code);
    throw redirect({ to: "/", replace: true });
  },
  errorComponent: CallbackError,
  pendingComponent: CallbackPending,
  component: () => null,
});

function CallbackPending() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-elevated border-t-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm">{t("auth.completingAuth")}</p>
      </div>
    </div>
  );
}

function CallbackError() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <svg
          className="w-8 h-8 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <p className="text-xl text-red-400">{t("auth.loginError")}</p>
      </div>
    </div>
  );
}
