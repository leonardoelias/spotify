import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface NotFoundProps {
  title?: string;
  description?: string;
}

export function NotFound({ title, description }: NotFoundProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="text-8xl font-bold text-surface mb-6">404</div>
        <h1 className="text-xl font-bold text-white mb-2">
          {title ?? t("errors.notFound")}
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          {description ?? t("errors.notFoundDescription")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg font-semibold text-sm rounded-full hover:bg-accent-hover transition-colors"
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {t("errors.goHome")}
        </Link>
      </div>
    </div>
  );
}
