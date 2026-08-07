"use client";

import { useState } from "react";
import type { CompanyRegisterData } from "@/types/register";
import * as registerService from "@/service/registerService";

type RegisterStatus = "idle" | "loading" | "success" | "error";

export function useRegisterCompany() {
  const [status, setStatus] = useState<RegisterStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const register = async (data: CompanyRegisterData) => {
    setStatus("loading");
    setError(null);

    try {
      await registerService.registerCompany(data);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar empresa.";
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
