"use client";

import type { InvitationToken } from "@/types/invitationType";
import styles from "@/app/(dashboard)/dashboard/invitations/invitations.module.scss";

interface GeneratedTokenBannerProps {
  token: InvitationToken;
  copiedField: string | null;
  onCopy: (text: string, id: string, field: "token" | "link") => void;
  onDismiss: () => void;
}

export function GeneratedTokenBanner({ token, copiedField, onCopy, onDismiss }: GeneratedTokenBannerProps) {
  const inviteLink = `${window.location.origin}/register/invite/${token.token}`;

  return (
    <div className={styles.generatedToken}>
      <div className={styles.generatedTitle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        Token gerado com sucesso
      </div>

      <div className={styles.tokenRow}>
        <span className={styles.tokenValue}>{token.token}</span>
        <button
          className={`${styles.copyButton} ${copiedField === `generated-token` ? styles.copied : ""}`}
          onClick={() => onCopy(token.token, "generated", "token")}
          type="button"
        >
          {copiedField === `generated-token` ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copiar token
            </>
          )}
        </button>
      </div>

      <div className={styles.tokenRow}>
        <span className={styles.tokenValue}>{inviteLink}</span>
        <button
          className={`${styles.copyButton} ${copiedField === `generated-link` ? styles.copied : ""}`}
          onClick={() => onCopy(inviteLink, "generated", "link")}
          type="button"
        >
          {copiedField === `generated-link` ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Copiar link
            </>
          )}
        </button>
      </div>

      <button className={styles.generatedDismiss} onClick={onDismiss} type="button">
        Fechar
      </button>
    </div>
  );
}
