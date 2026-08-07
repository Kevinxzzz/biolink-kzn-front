"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import styles from "./register.module.scss";

export default function RegisterPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleTokenSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/register/invite/${token.trim()}`);
    }
  };

  return (
    <AuthLayout
      footerText="Já tem uma conta?"
      footerLinkText="Entrar"
      footerLinkHref="/login"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Criar conta</h1>
        <p className={styles.subtitle}>Escolha como deseja começar</p>

        <div className={styles.options}>
          <a href="/register/company" className={styles.option}>
            <div className={styles.optionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className={styles.optionContent}>
              <h2 className={styles.optionTitle}>Criar uma empresa</h2>
              <p className={styles.optionDescription}>
                Registre sua empresa e torne-se o administrador principal.
              </p>
            </div>
            <div className={styles.optionArrow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>
        </div>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <div className={styles.tokenSection}>
          <p className={styles.tokenLabel}>Já tem um convite? Informe o token abaixo</p>
          <form className={styles.tokenForm} onSubmit={handleTokenSubmit}>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ex: KZN-A1B2C3D4"
              className={styles.tokenInput}
              aria-label="Token de convite"
            />
            <button
              type="submit"
              className={styles.tokenButton}
              disabled={!token.trim()}
            >
              Validar
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
