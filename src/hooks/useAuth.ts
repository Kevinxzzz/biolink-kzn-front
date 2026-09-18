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
      // O evento de auth expirado é disparado em caso de 401.
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
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
