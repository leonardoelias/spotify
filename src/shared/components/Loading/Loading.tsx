import { useTranslation } from "react-i18next";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({ fullScreen = false, message }: LoadingProps) {
  const { t } = useTranslation();
  const displayMessage = message ?? t("common.loading");

  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-16"}`}
    >
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-elevated border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary text-sm">{displayMessage}</p>
      </div>
    </div>
  );
}
