"use client";

import { useState } from "react";
import type { InviteRegisterData } from "@/types/register";
import * as registerService from "@/service/registerService";

type RegisterStatus = "idle" | "loading" | "success" | "error";

export function useRegisterInvite() {
  const [status, setStatus] = useState<RegisterStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const register = async (data: InviteRegisterData) => {
    setStatus("loading");
    setError(null);

    try {
      await registerService.registerWithInvite(data);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao realizar cadastro.";
      setError(message);
      setStatus("error");
      throw err;
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  return { register, status, error, isLoading: status === "loading", reset };
}
