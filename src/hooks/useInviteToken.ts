"use client";

import { useState, useEffect } from "react";
import type { InvitationTokenValidation } from "@/types/invitation";
import * as registerService from "@/service/registerService";

type TokenPageStatus = "loading" | "valid" | "invalid" | "expired" | "used" | "revoked" | "error";

export function useInviteToken(token: string) {
  const [pageStatus, setPageStatus] = useState<TokenPageStatus>("loading");
  const [tokenData, setTokenData] = useState<InvitationTokenValidation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const validate = async () => {
      setPageStatus("loading");
      setError(null);

      try {
        const result = await registerService.validateToken(token);

        if (cancelled) return;

        setTokenData(result);

        switch (result.status) {
          case "VALID":
            setPageStatus("valid");
            break;
          case "INVALID":
            setPageStatus("invalid");
            break;
          case "EXPIRED":
            setPageStatus("expired");
            break;
          case "USED":
            setPageStatus("used");
            break;
          case "REVOKED":
            setPageStatus("revoked");
            break;
          default:
            setPageStatus("error");
        }
      } catch {
        if (cancelled) return;
        setError("Não foi possível validar o convite. Tente novamente.");
        setPageStatus("error");
      }
    };

    validate();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const retry = () => {
    setPageStatus("loading");
    setError(null);
    registerService.validateToken(token).then((result) => {
      setTokenData(result);
      setPageStatus(result.status === "VALID" ? "valid" : result.status.toLowerCase() as TokenPageStatus);
    }).catch(() => {
      setError("Não foi possível validar o convite. Tente novamente.");
      setPageStatus("error");
    });
  };

  return { pageStatus, tokenData, error, isLoading: pageStatus === "loading", retry };
}
