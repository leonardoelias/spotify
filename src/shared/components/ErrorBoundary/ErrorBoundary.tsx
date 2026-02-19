import { Component, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

type ErrorType = "network" | "auth" | "notFound" | "server" | "unknown";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorType: ErrorType;
}

function getErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  if (
    message.includes("network") ||
    message.includes("fetch") ||
    name.includes("network")
  ) {
    return "network";
  }
  if (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("auth")
  ) {
    return "auth";
  }
  if (message.includes("404") || message.includes("not found")) {
    return "notFound";
  }
  if (message.includes("500") || message.includes("server")) {
    return "server";
  }
  return "unknown";
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorType: "unknown" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorType: getErrorType(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorType: "unknown" });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorType={this.state.errorType}
          reset={this.reset}
          retryLabel={this.props.retryLabel}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  errorType: ErrorType;
  reset: () => void;
  retryLabel?: string;
}

const errorStyle: Record<
  ErrorType,
  { color: string; bgColor: string; borderColor: string }
> = {
  network: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-500",
  },
  auth: {
    color: "text-orange-500",
    bgColor: "bg-orange-900/20",
    borderColor: "border-orange-500",
  },
  notFound: {
    color: "text-blue-500",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500",
  },
  server: {
    color: "text-red-500",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-500",
  },
  unknown: {
    color: "text-red-500",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-500",
  },
};

const errorTitleKey: Record<ErrorType, string> = {
  network: "errors.networkError",
  auth: "errors.unauthorized",
  notFound: "errors.notFound",
  server: "errors.generic",
  unknown: "errors.generic",
};

function ErrorIcon({
  type,
  className,
}: {
  type: ErrorType;
  className?: string;
}) {
  const iconClass = `w-6 h-6 ${errorStyle[type].color} flex-shrink-0 ${className || ""}`;

  switch (type) {
    case "network":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
          />
        </svg>
      );
    case "auth":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      );
    case "notFound":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      );
    case "server":
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      );
    default:
      return (
        <svg
          className={iconClass}
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
      );
  }
}

function DefaultErrorFallback({
  error,
  errorType,
  reset,
  retryLabel,
}: DefaultErrorFallbackProps) {
  const { t } = useTranslation();
  const style = errorStyle[errorType];

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div
        className={`max-w-md w-full ${style.bgColor} border ${style.borderColor}/40 rounded-2xl p-6`}
      >
        <div className="flex items-start gap-4">
          <ErrorIcon type={errorType} className="mt-0.5" />
          <div className="flex-1">
            <h2
              className={`text-xl font-semibold mb-2 ${style.color.replace("text-", "text-").replace("-500", "-200")}`}
            >
              {t(errorTitleKey[errorType] as any)}
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              {error.message || t("errors.genericDescription")}
            </p>
            {import.meta.env.DEV && (
              <details className="mb-4">
                <summary className="text-text-tertiary text-xs cursor-pointer hover:text-text-secondary">
                  Stack trace
                </summary>
                <pre className="mt-2 text-xs text-text-tertiary bg-bg/50 p-2 rounded-lg overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={reset}
                className={`px-4 py-2 ${style.color.replace("text-", "bg-").replace("-500", "-600")} hover:opacity-90 text-white rounded-xl text-sm transition-colors font-medium`}
              >
                {retryLabel || t("common.retry")}
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
