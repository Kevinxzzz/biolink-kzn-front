"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { useAuth } from "@/hooks/auth/useAuth";
import { logout as apiLogout } from "@/service/authService";

export default function DashboardLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Evitar deslogar o usuário por erro 500 ou queda de internet.
      if (error && error.statusCode !== 401 && error.statusCode !== 403) {
        return;
      }

      if (error?.statusCode === 403) {
        if (error.redirect) {
          // Se o backend forneceu o redirect, envia o usuário pra lá
          apiLogout();
          tokenStorage.removeAccessToken();
          window.location.href = error.redirect;
          return;
        }
      }
      
      // Qualquer outro caso não autenticado (incluindo 401, erro sem token)
      apiLogout(); // Remove o cookie de autenticação do servidor
      tokenStorage.removeAccessToken();
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, error, router]);

  if (error && error.statusCode !== 401 && error.statusCode !== 403) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        width: "100%",
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
          <span style={{ fontSize: "1rem", color: "var(--text-secondary, #a8a29e)" }}>
            Não foi possível conectar ao servidor.
          </span>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--accent-primary, #d97706)",
              color: "#fff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer"
            }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !isAuthenticated) {
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
