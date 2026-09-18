"use client";

import type { InvitationToken } from "@/types/invitationType";
import styles from "@/app/(dashboard)/dashboard/invitations/invitations.module.scss";

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    VALID: "Ativo",
    USED: "Utilizado",
    EXPIRED: "Expirado",
    REVOKED: "Revogado",
  };
  return map[status] ?? status;
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    VALID: styles.statusValid,
    USED: styles.statusUsed,
    EXPIRED: styles.statusExpired,
    REVOKED: styles.statusRevoked,
  };
  return map[status] ?? "";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface InvitationCardProps {
  invitation: InvitationToken;
  copiedField: string | null;
  onCopy: (text: string, id: string, field: "token" | "link") => void;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}

export function InvitationCard({ invitation, copiedField, onCopy, onRevoke, isRevoking }: InvitationCardProps) {
  const rowLink = `${window.location.origin}/register/invite/${invitation.token}`;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Token</span>
        <span className={`${styles.statusBadge} ${statusClass(invitation.status)}`}>
          {statusLabel(invitation.status)}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHighlightRow}>
          <span className={styles.cardHighlightValue}>{invitation.token}</span>
          <button
            className={`${styles.copyButton} ${copiedField === `${invitation.id}-token` ? styles.copied : ""}`}
            onClick={() => onCopy(invitation.token, invitation.id, "token")}
            type="button"
            title="Copiar token"
          >
            {copiedField === `${invitation.id}-token` ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

        <div className={styles.cardLinkRow}>
          <span className={styles.cardLinkValue}>{rowLink}</span>
          <button
            className={`${styles.copyButton} ${copiedField === `${invitation.id}-link` ? styles.copied : ""}`}
            onClick={() => onCopy(rowLink, invitation.id, "link")}
            type="button"
          >
            {copiedField === `${invitation.id}-link` ? (
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
                Copiar
              </>
            )}
          </button>
        </div>

        <div className={styles.cardStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Usos</span>
            <span className={styles.statValue}>
              {invitation.uses} / {invitation.maxUses}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Criado em</span>
            <span className={styles.statValue}>{formatDate(invitation.createdAt)}</span>
          </div>
          {invitation.expiresAt && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Expira em</span>
              <span className={styles.statValue}>{formatDate(invitation.expiresAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={styles.revokeButton}
          onClick={() => onRevoke(invitation.id)}
          type="button"
          disabled={isRevoking}
        >
          Excluir convite
        </button>
      </div>
    </div>
  );
}
