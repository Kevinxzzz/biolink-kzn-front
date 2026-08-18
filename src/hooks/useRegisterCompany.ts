"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanyRegisterData } from "@/types/enterpriseType";
import * as registerService from "@/service/enterpriseService";

type RegisterStatus = "idle" | "loading" | "success" | "error";

export function useRegisterCompany() {
  const [status, setStatus] = useState<RegisterStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: CompanyRegisterData) => {
    setStatus("loading");
    setError(null);

    try {
      await registerService.registerCompany(data);
      setStatus("success");

      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
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
