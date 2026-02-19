import {
  createContext,
  useCallback,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

import {
  initiateSpotifyLogin,
  exchangeCodeForToken,
  fetchUserProfile,
  hasValidToken,
  clearAuthTokens,
} from "../api/client";

import type { AuthContextValue, UserProfile } from "@/entities/auth";

import { SPOTIFY_SCOPES } from "@/shared/config";

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

type AuthState = { user: UserProfile | null; isLoading: boolean };

type AuthAction =
  | { type: "LOADING" }
  | { type: "AUTHENTICATED"; user: UserProfile }
  | { type: "UNAUTHENTICATED" };

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOADING":
      return { user: null, isLoading: true };
    case "AUTHENTICATED":
      return { user: action.user, isLoading: false };
    case "UNAUTHENTICATED":
      return { user: null, isLoading: false };
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const hasToken = hasValidToken();

      if (!hasToken) {
        if (mounted) dispatch({ type: "UNAUTHENTICATED" });
        return;
      }

      try {
        const userProfile = await fetchUserProfile();
        if (mounted) dispatch({ type: "AUTHENTICATED", user: userProfile });
      } catch {
        clearAuthTokens();
        if (mounted) dispatch({ type: "UNAUTHENTICATED" });
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async () => {
    await initiateSpotifyLogin(SPOTIFY_SCOPES);
  }, []);

  const handleCallback = useCallback(async (code: string) => {
    dispatch({ type: "LOADING" });
    try {
      await exchangeCodeForToken(code);
      const userProfile = await fetchUserProfile();
      dispatch({ type: "AUTHENTICATED", user: userProfile });
    } catch (error) {
      dispatch({ type: "UNAUTHENTICATED" });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    dispatch({ type: "UNAUTHENTICATED" });
  }, []);

  const value: AuthContextValue = {
    user: state.user,
    isAuthenticated: state.user !== null,
    isLoading: state.isLoading,
    login,
    logout,
    handleCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
