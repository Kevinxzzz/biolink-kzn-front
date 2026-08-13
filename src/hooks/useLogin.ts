"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginCredentials } from "@/types/authType";
import * as authService from "@/service/authService";
import { tokenStorage } from "@/lib/auth/tokenStorage";

type LoginStatus = "idle" | "loading" | "success" | "error";

export function useLogin() {
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setStatus("loading");
    setError(null);

    try {
      const response = await authService.login(credentials);

      tokenStorage.setAccessToken(response.token);
      setStatus("success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao realizar login.";
      setError(message);
      setStatus("error");
      throw err;
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  return { login, status, error, isLoading: status === "loading", reset };
}
