"use client";

import { useParams } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterInviteForm } from "@/components/ComponentsPage/authPages/registerInvitePage";
import { useInviteToken } from "@/hooks/useInviteToken";
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

        <RegisterInviteForm token={token} />
      </div>
    </AuthLayout>
  );
}
