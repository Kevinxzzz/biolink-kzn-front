"use client";

import { useState } from "react";
import type { LoginCredentials } from "@/types/auth";
import * as authService from "@/service/authService";

type LoginStatus = "idle" | "loading" | "success" | "error";

export function useLogin() {
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setStatus("loading");
    setError(null);

    try {
      const response = await authService.login(credentials);
      setStatus("success");
      // TODO: Salvar token e redirecionar
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
