import axios from "axios";

import type { TokenResponse, UserProfile } from "@/entities/auth";

import { tokenResponseSchema, userProfileSchema } from "@/entities/auth";
import { spotifyApi } from "@/shared/api";
import { env } from "@/shared/config";
import {
  SPOTIFY_AUTH_URL,
  SPOTIFY_TOKEN_URL,
  STORAGE_KEYS,
} from "@/shared/config/constants";
import { generateCodeVerifier, generateCodeChallenge } from "@/shared/utils";

export async function initiateSpotifyLogin(
  scopes: readonly string[],
): Promise<void> {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

    const params = new URLSearchParams({
      client_id: env.spotify.clientId,
      response_type: "code",
      redirect_uri: env.spotify.redirectUri,
      scope: scopes.join(" "),
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
    window.location.href = authUrl;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao iniciar login do Spotify";
    throw new Error(message);
  }
}

export async function exchangeCodeForToken(
  code: string,
): Promise<TokenResponse> {
  const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);

  if (!codeVerifier) {
    throw new Error("Code verifier not found");
  }

  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);

  const response = await axios.post(
    SPOTIFY_TOKEN_URL,
    new URLSearchParams({
      client_id: env.spotify.clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: env.spotify.redirectUri,
      code_verifier: codeVerifier,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const validatedData = tokenResponseSchema.parse(response.data);

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, validatedData.access_token);

  if (validatedData.refresh_token) {
    localStorage.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      validatedData.refresh_token,
    );
  }

  const expiresAt = Date.now() + validatedData.expires_in * 1000;
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString());

  return validatedData;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await spotifyApi.get("/me");

  return userProfileSchema.parse(response.data);
}

export function hasValidToken(): boolean {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiryStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

  if (!token || !expiryStr) {
    return false;
  }

  const expiry = parseInt(expiryStr, 10);
  return Date.now() < expiry;
}

export function clearAuthTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);

  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
}
