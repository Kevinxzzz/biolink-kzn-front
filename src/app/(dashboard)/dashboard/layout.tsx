"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function DashboardLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Ouvir o evento de expiração de autenticação (se ocorrer 401 durante a sessão)
    const unsubscribe = onAuthExpired(() => {
      tokenStorage.removeAccessToken();
      router.push("/login");
    });

    // 2. Validar token atual de acesso
    const token = tokenStorage.getAccessToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeJWT(token);

    if (!decoded) {
      tokenStorage.removeAccessToken();
      router.push("/login");
      return;
    }

    // Verificar expiração se presente
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      tokenStorage.removeAccessToken();
      router.push("/login");
      return;
    }

    // Verificar roles permitidas (OWNER, ADMIN)
    if (!decoded.role || (decoded.role !== "OWNER" && decoded.role !== "ADMIN")) {
      tokenStorage.removeAccessToken();
      router.push("/login");
      return;
    }

    setIsAuthorized(true);
    setLoading(false);

    return () => unsubscribe();
  }, [router]);

  if (loading || !isAuthorized) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "var(--bg-primary, #0c0a09)",
        color: "var(--text-primary, #f5f5f4)",
        fontFamily: "var(--font-inter, sans-serif)"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div style={{
            width: "2.5rem",
            height: "2.5rem",
            border: "3px solid var(--border-subtle, #292524)",
            borderTopColor: "var(--accent-primary, #d97706)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary, #a8a29e)" }}>
            Verificando autenticação...
          </span>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
