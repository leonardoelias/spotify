import { it, expect } from "vitest";

import { ApiError } from "./ApiError";

it("constructor seta propriedades", () => {
  const originalError = new Error("Original");
  const apiError = new ApiError(
    "Test error",
    400,
    "BAD_REQUEST",
    originalError,
  );

  expect(apiError.message).toBe("Test error");
  expect(apiError.status).toBe(400);
  expect(apiError.code).toBe("BAD_REQUEST");
  expect(apiError.originalError).toBe(originalError);
  expect(apiError.name).toBe("ApiError");
});

it("getUserMessage - 401 unauthorized", () => {
  const error1 = new ApiError("Unauthorized", 401);
  const error2 = new ApiError("Unauthorized", undefined, "UNAUTHORIZED");

  expect(error1.getUserMessage()).toBe(
    "Sua sessão expirou. Faça login novamente.",
  );
  expect(error2.getUserMessage()).toBe(
    "Sua sessão expirou. Faça login novamente.",
  );
});

it("getUserMessage - 403 forbidden", () => {
  const error1 = new ApiError("Forbidden", 403);
  const error2 = new ApiError("Forbidden", undefined, "FORBIDDEN");

  expect(error1.getUserMessage()).toBe(
    "Você não tem permissão para acessar este recurso.",
  );
  expect(error2.getUserMessage()).toBe(
    "Você não tem permissão para acessar este recurso.",
  );
});

it("getUserMessage - 404", () => {
  const error1 = new ApiError("Not found", 404);
  const error2 = new ApiError("Not found", undefined, "NOT_FOUND");

  expect(error1.getUserMessage()).toBe("Recurso não encontrado.");
  expect(error2.getUserMessage()).toBe("Recurso não encontrado.");
});

it("getUserMessage - 429 rate limit", () => {
  const error1 = new ApiError("Rate limited", 429);
  const error2 = new ApiError("Rate limited", undefined, "RATE_LIMITED");

  expect(error1.getUserMessage()).toBe(
    "Muitas requisições. Tente novamente em alguns momentos.",
  );
  expect(error2.getUserMessage()).toBe(
    "Muitas requisições. Tente novamente em alguns momentos.",
  );
});

it("getUserMessage - 5xx", () => {
  const error500 = new ApiError("Server error", 500);
  const error502 = new ApiError("Bad gateway", 502);
  const error503 = new ApiError("Service unavailable", 503);

  const message = "Erro no servidor. Tente novamente mais tarde.";
  expect(error500.getUserMessage()).toBe(message);
  expect(error502.getUserMessage()).toBe(message);
  expect(error503.getUserMessage()).toBe(message);
});

it("getUserMessage - network error", () => {
  const error = new ApiError("Network error", undefined, "NETWORK_ERROR");

  expect(error.getUserMessage()).toBe(
    "Erro de conexão. Verifique sua internet.",
  );
});

it("getUserMessage - erro desconhecido retorna message", () => {
  const error1 = new ApiError("Something went wrong", 400);
  const error2 = new ApiError("Custom message", undefined, "UNKNOWN");

  expect(error1.getUserMessage()).toBe("Something went wrong");
  expect(error2.getUserMessage()).toBe("Custom message");
});

it("getErrorType - network", () => {
  const error = new ApiError("Network error", undefined, "NETWORK_ERROR");

  expect(error.getErrorType()).toBe("network");
});

it("getErrorType - auth para 401 e 403", () => {
  const error401 = new ApiError("Unauthorized", 401);
  const error403 = new ApiError("Forbidden", 403);

  expect(error401.getErrorType()).toBe("auth");
  expect(error403.getErrorType()).toBe("auth");
});

it("getErrorType - server para 5xx", () => {
  const error500 = new ApiError("Server error", 500);
  const error502 = new ApiError("Bad gateway", 502);

  expect(error500.getErrorType()).toBe("server");
  expect(error502.getErrorType()).toBe("server");
});

it("getErrorType - client para 4xx (exceto auth)", () => {
  const error400 = new ApiError("Bad request", 400);
  const error404 = new ApiError("Not found", 404);

  expect(error400.getErrorType()).toBe("client");
  expect(error404.getErrorType()).toBe("client");
});

it("getErrorType - unknown sem status", () => {
  const error = new ApiError("Unknown error", undefined, "UNKNOWN");

  expect(error.getErrorType()).toBe("unknown");
});

it("isAuthError - true para 401", () => {
  const error1 = new ApiError("Unauthorized", 401);
  const error2 = new ApiError("Unauthorized", undefined, "UNAUTHORIZED");

  expect(error1.isAuthError()).toBe(true);
  expect(error2.isAuthError()).toBe(true);
});

it("isAuthError - false para outros", () => {
  const error1 = new ApiError("Bad request", 400);
  const error2 = new ApiError("Server error", 500);

  expect(error1.isAuthError()).toBe(false);
  expect(error2.isAuthError()).toBe(false);
});

it("isNetworkError - true para NETWORK_ERROR", () => {
  const error = new ApiError("Network error", undefined, "NETWORK_ERROR");

  expect(error.isNetworkError()).toBe(true);
});

it("isNetworkError - false para outros", () => {
  const error1 = new ApiError("Server error", 500);
  const error2 = new ApiError("Bad request", 400);

  expect(error1.isNetworkError()).toBe(false);
  expect(error2.isNetworkError()).toBe(false);
});

it("isRetryable - true para network", () => {
  const error = new ApiError("Network error", undefined, "NETWORK_ERROR");

  expect(error.isRetryable()).toBe(true);
});

it("isRetryable - true para 429", () => {
  const error = new ApiError("Rate limited", 429);

  expect(error.isRetryable()).toBe(true);
});

it("isRetryable - true para 5xx", () => {
  const error500 = new ApiError("Server error", 500);
  const error502 = new ApiError("Bad gateway", 502);
  const error503 = new ApiError("Service unavailable", 503);

  expect(error500.isRetryable()).toBe(true);
  expect(error502.isRetryable()).toBe(true);
  expect(error503.isRetryable()).toBe(true);
});

it("isRetryable - false para 4xx", () => {
  const error400 = new ApiError("Bad request", 400);
  const error401 = new ApiError("Unauthorized", 401);
  const error403 = new ApiError("Forbidden", 403);
  const error404 = new ApiError("Not found", 404);

  expect(error400.isRetryable()).toBe(false);
  expect(error401.isRetryable()).toBe(false);
  expect(error403.isRetryable()).toBe(false);
  expect(error404.isRetryable()).toBe(false);
});
