export class ApiError extends Error {
  status?: number;
  code?: string;
  originalError?: any;

  constructor(
    message: string,
    status?: number,
    code?: string,
    originalError?: any,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }

  getUserMessage(): string {
    if (this.status === 401 || this.code === "UNAUTHORIZED") {
      return "Sua sessão expirou. Faça login novamente.";
    }

    if (this.status === 403 || this.code === "FORBIDDEN") {
      return "Você não tem permissão para acessar este recurso.";
    }

    if (this.status === 404 || this.code === "NOT_FOUND") {
      return "Recurso não encontrado.";
    }

    if (this.status === 429 || this.code === "RATE_LIMITED") {
      return "Muitas requisições. Tente novamente em alguns momentos.";
    }

    if (this.status === 500 || this.status === 502 || this.status === 503) {
      return "Erro no servidor. Tente novamente mais tarde.";
    }

    if (this.code === "NETWORK_ERROR") {
      return "Erro de conexão. Verifique sua internet.";
    }

    return this.message || "Ocorreu um erro inesperado.";
  }

  getErrorType(): "auth" | "network" | "server" | "client" | "unknown" {
    if (this.code === "NETWORK_ERROR") return "network";
    if (this.status === 401 || this.status === 403) return "auth";
    if (this.status && this.status >= 500) return "server";
    if (this.status && this.status >= 400 && this.status < 500) return "client";
    return "unknown";
  }

  isAuthError(): boolean {
    return this.status === 401 || this.code === "UNAUTHORIZED";
  }

  isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR";
  }

  isRetryable(): boolean {
    if (this.isNetworkError()) return true;

    if (this.status === 429) return true;

    if (this.status && this.status >= 500) return true;

    return false;
  }
}
