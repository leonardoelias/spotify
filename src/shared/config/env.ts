export const env = {
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
  },
} as const;

if (!env.spotify.clientId || !env.spotify.redirectUri) {
  throw new Error(
    "Missing required environment variables. Please check your .env file.",
  );
}
