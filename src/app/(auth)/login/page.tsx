"use client";

import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { useLogin } from "@/hooks/useLogin";
import styles from "./login.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, status, error, isLoading } = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch {
      // error is handled by the hook
    }
  };

  return (
    <AuthLayout
      footerText="Não tem uma conta?"
      footerLinkText="Criar conta"
      footerLinkHref="/register"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre na sua conta para continuar</p>

        {status === "error" && error && (
          <div className={styles.alert + " " + styles.alertError} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {status === "success" && (
          <div className={styles.alert + " " + styles.alertSuccess} role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Login realizado com sucesso! Redirecionando...</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            id="password"
            name="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          <a href="#" className={styles.forgotPassword}>
            Esqueceu a senha?
          </a>

          <button
            type="submit"
            className={`${styles.submitButton} button primary lg`}
            disabled={isLoading || !email || !password}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "var(--accent-primary)",
              border: "none",
              borderRadius: "9999px",
              cursor: isLoading ? "wait" : "pointer",
              opacity: isLoading || !email || !password ? 0.7 : 1,
              transition: "all 0.25s ease",
            }}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
