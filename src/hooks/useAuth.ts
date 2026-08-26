"use client";

import { useEffect, useState } from "react";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { onAuthExpired } from "@/lib/auth/authEvents";

interface DecodedToken {
  sub: string;
  accountType: "USER" | "INFLUENCER";
  role?: string;
  exp?: number;
}

function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const decoded = decodeJWT(token);
      if (!decoded) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (decoded.role && (decoded.role === "OWNER" || decoded.role === "ADMIN")) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    const unsubscribe = onAuthExpired(() => {
      setIsAuthenticated(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, isLoading };
}
