import type { AxiosRequestConfig } from "axios";
import { spotifyApi } from "./spotify-client";

export const spotify = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig) => {
    const response = await spotifyApi.get(endpoint, config);
    return response.data as T;
  },

  post: async <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await spotifyApi.post(endpoint, data, config);
    return response.data as T;
  },

  put: async <T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await spotifyApi.put(endpoint, data, config);
    return response.data as T;
  },

  delete: async <T>(endpoint: string, config?: AxiosRequestConfig) => {
    const response = await spotifyApi.delete(endpoint, config);
    return response.data as T;
  },
};
