import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import axiosRateLimit from "axios-rate-limit";

import { ApiError } from "./ApiError";

import {
  SPOTIFY_API_BASE_URL,
  SPOTIFY_TOKEN_URL,
  STORAGE_KEYS,
} from "@/shared/config/constants";
import { env } from "@/shared/config";

interface SpotifyRequestConfig extends InternalAxiosRequestConfig {
  shouldRefreshToken?: boolean;
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        client_id: env.spotify.clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    const { access_token, expires_in } = response.data;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    const expiresAt = Date.now() + expires_in * 1000;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString());

    return access_token;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    window.location.href = "/";
    throw error;
  }
}

const baseSpotifyApi = axios.create({
  baseURL: SPOTIFY_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

baseSpotifyApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const spotifyConfig = config as SpotifyRequestConfig;
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

    if (token && spotifyConfig.headers) {
      spotifyConfig.headers.Authorization = `Bearer ${token}`;
    }

    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10);
      const timeUntilExpiry = expiryTime - Date.now();

      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        spotifyConfig.shouldRefreshToken = true;
      }
    }

    return spotifyConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

baseSpotifyApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as SpotifyRequestConfig;
    if (config.shouldRefreshToken && !isRefreshing) {
      isRefreshing = true;
      refreshAccessToken()
        .then((newToken) => {
          isRefreshing = false;
          onTokenRefreshed(newToken);
        })
        .catch(() => {
          isRefreshing = false;
        });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as SpotifyRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return spotifyApi(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(spotifyApi(originalRequest));
          });
        });
      }
    }

    const apiError = new ApiError(
      (error.response?.data as { error?: { message?: string } })?.error
        ?.message ||
        error.message ||
        "Unknown error",
      error.response?.status,
      error.code,
      error,
    );

    return Promise.reject(apiError);
  },
);
export const spotifyApi = axiosRateLimit(baseSpotifyApi, {
  maxRequests: 50,
  perMilliseconds: 1000,
});
