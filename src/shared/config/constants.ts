export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
] as const;

export const STORAGE_KEYS = {
  CODE_VERIFIER: "spotify_code_verifier",
  ACCESS_TOKEN: "spotify_access_token",
  REFRESH_TOKEN: "spotify_refresh_token",
  TOKEN_EXPIRY: "spotify_token_expiry",
} as const;

export const PAGINATION = {
  ARTISTS_PAGE_SIZE: 20,
  ALBUMS_PAGE_SIZE: 20,
  ALBUMS_PER_PAGE: 5,
} as const;

export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 10 * 60 * 1000,
  LONG: 30 * 60 * 1000,
} as const;
