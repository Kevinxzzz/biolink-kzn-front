"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { useInviteToken } from "@/hooks/useInviteToken";
import { useRegisterInvite } from "@/hooks/useRegisterInvite";
import styles from "./invite.module.scss";

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  invalid: {
    title: "Convite inválido",
    description: "O token informado não é válido. Verifique se copiou o link corretamente.",
  },
  expired: {
    title: "Convite expirado",
    description: "Este convite expirou e não pode mais ser utilizado. Solicite um novo convite ao administrador.",
  },
  used: {
    title: "Convite já utilizado",
    description: "Este convite já foi utilizado para criar uma conta. Cada convite pode ser usado apenas uma vez.",
  },
  revoked: {
    title: "Convite revogado",
    description: "Este convite foi revogado pelo administrador e não pode mais ser utilizado.",
  },
  error: {
    title: "Erro de conexão",
    description: "Não foi possível validar o convite. Verifique sua conexão e tente novamente.",
  },
};

function accountTypeLabel(): string {
  return "Administrador";
}

export default function InviteRegisterPage() {
  const params = useParams();
  const token = params.token as string;
  const { pageStatus, tokenData, retry } = useInviteToken(token);
  const { register, status: registerStatus, error: registerError, isLoading: registerLoading } = useRegisterInvite();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Nome é obrigatório.";
    if (!email.trim()) errors.email = "Email é obrigatório.";
    if (!password) errors.password = "Senha é obrigatória.";
    if (password.length > 0 && password.length < 6) errors.password = "Senha deve ter no mínimo 6 caracteres.";
    if (password !== confirmPassword) errors.confirmPassword = "As senhas não coincidem.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ name, email, password, confirmPassword, token });
    } catch {
      // handled by hook
    }
  };

  // Loading state
  if (pageStatus === "loading") {
    return (
      <AuthLayout>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Validando convite...</p>
        </div>
      </AuthLayout>
    );
  }

  // Error states (invalid, expired, used, revoked, error)
  if (pageStatus !== "valid") {
    const msg = ERROR_MESSAGES[pageStatus] || ERROR_MESSAGES.error;
    return (
      <AuthLayout>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className={styles.errorTitle}>{msg.title}</h1>
          <p className={styles.errorDescription}>{msg.description}</p>
          <div className={styles.errorActions}>
            <a href="/login" className={`${styles.errorLink} ${styles.errorLinkPrimary}`}>
              Ir para login
            </a>
            {pageStatus === "error" && (
              <button onClick={retry} className={`${styles.errorLink} ${styles.errorLinkSecondary}`} type="button">
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Valid state — show form

  return (
    <AuthLayout
      footerText="Já tem uma conta?"
      footerLinkText="Entrar"
      footerLinkHref="/login"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Você foi convidado</h1>
        <p className={styles.subtitle}>Complete seu cadastro para começar</p>

        <div className={styles.inviteInfo}>
          <span className={styles.inviteLabel}>Empresa</span>
          <span className={styles.inviteValue}>{tokenData?.enterpriseName}</span>
          <div className={styles.inviteDivider} />
          <span className={styles.inviteLabel}>Tipo de acesso</span>
          <span className={`${styles.typeBadge} ${styles.typeBadgeAdmin}`}>
            {accountTypeLabel()}
          </span>
        </div>

        {registerStatus === "error" && registerError && (
          <div className={`${styles.alert} ${styles.alertError}`} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{registerError}</span>
          </div>
        )}

        {registerStatus === "success" && (
          <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Conta criada com sucesso! Redirecionando...</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input id="name" name="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" required error={validationErrors.name} autoComplete="name" disabled={registerLoading} />
          <Input id="email" name="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required error={validationErrors.email} autoComplete="email" disabled={registerLoading} />
          <Input id="password" name="password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required error={validationErrors.password} autoComplete="new-password" disabled={registerLoading} />
          <Input id="confirmPassword" name="confirmPassword" label="Confirmar senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required error={validationErrors.confirmPassword} autoComplete="new-password" disabled={registerLoading} />

          <button
            type="submit"
            disabled={registerLoading}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              width: "100%", padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: 600,
              color: "#ffffff", background: "var(--accent-primary)", border: "none",
              borderRadius: "9999px", cursor: registerLoading ? "wait" : "pointer",
              opacity: registerLoading ? 0.7 : 1, transition: "all 0.25s ease",
            }}
          >
            {registerLoading ? (
              <><span className={styles.spinner} />Criando conta...</>
            ) : (
              "Criar conta"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
