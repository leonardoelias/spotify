import {
  ErrorComponent,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-red-900/20 border border-red-500/40 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <svg
            className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 text-red-200">
              {t("errors.generic")}
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              {t("errors.genericDescription")}
            </p>
            {import.meta.env.DEV && (
              <details className="mb-4">
                <summary className="text-text-tertiary text-xs cursor-pointer hover:text-text-secondary">
                  <ErrorComponent error={error} />
                </summary>
                <pre className="mt-2 text-xs text-text-tertiary bg-bg/50 p-2 rounded-lg overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  reset();
                  router.invalidate();
                }}
                className="px-4 py-2 bg-red-600 hover:opacity-90 text-white rounded-xl text-sm transition-colors font-medium"
              >
                {t("errors.tryAgain")}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-surface hover:bg-surface-hover text-white rounded-xl text-sm transition-colors font-medium"
              >
                {t("errors.reloadPage")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
