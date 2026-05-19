"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi, tokenStorage, usersApi } from "@/lib/api";
import type { LoginRequest, RegisterRequest, User } from "@/types";

const CURRENT_USER_KEY = ["auth", "me"] as const;

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ─── Current user query ───────────────────────────────────────────────
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: () => usersApi.getProfile() as Promise<User>,
    enabled: !!tokenStorage.getAccessToken(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  // ─── Login mutation ───────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
      router.push("/dashboard");
    },
  });

  // ─── Register mutation ────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      router.push("/login?registered=true");
    },
  });

  // ─── Logout ───────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => null);
    }
    tokenStorage.clearTokens();
    queryClient.clear();
    router.push("/login");
  }, [router, queryClient]);

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
}
