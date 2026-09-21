"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { getMe } from "@/service/authService";
import { useEffect } from "react";
import { onAuthExpired } from "@/lib/auth/authEvents";
import { ApiError } from "@/service/httpClient";

export function useAuth() {
  const queryClient = useQueryClient();
  const token = typeof window !== 'undefined' ? tokenStorage.getAccessToken() : null;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache em memória
  });

  useEffect(() => {
    const unsubscribe = onAuthExpired(() => {
      // Previne loop do React Query: em vez de remover a query e causar re-fetch imediato,
      // removemos o token local e avisamos a query que os dados não existem mais.
      tokenStorage.removeAccessToken();
      queryClient.setQueryData(["auth", "me"], null);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return {
    user,
    isAuthenticated: !!user && (user.role === "OWNER" || user.role === "ADMIN"),
    isLoading: !!token && isLoading, 
    error: error as ApiError | null
  };
}
