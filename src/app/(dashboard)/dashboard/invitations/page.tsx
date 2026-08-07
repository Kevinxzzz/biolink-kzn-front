"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInvitations } from "@/hooks/useInvitations";
import type { InvitationToken } from "@/types/invitation";
import styles from "./invitations.module.scss";



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

function typeLabel(): string {
  return "Administrador";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function InvitationsPage() {
  const { invitations, isLoading, create, revoke } = useInvitations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<InvitationToken | null>(null);
  const [copiedField, setCopiedField] = useState<"token" | "link" | null>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const token = await create({ accountType: "ADMIN" });
      setGeneratedToken(token);
      setShowCreateModal(false);
    } catch {
      // TODO: error handling
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (text: string, field: "token" | "link") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    try {
      await revoke(id);
    } catch {
      // TODO: error handling
    }
  };

  const inviteLink = generatedToken
    ? `${window.location.origin}/register/invite/${generatedToken.token}`
    : "";

  return (
    <DashboardLayout pageTitle="Tokens de convite">
      {/* Header */}
      <div className={styles.pageHeader}>
        <p className={styles.pageDescription}>
          Gere e gerencie convites para adicionar membros à sua empresa.
        </p>
        <button className={styles.createButton} onClick={() => setShowCreateModal(true)} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Gerar convite
        </button>
      </div>

      {/* Generated token feedback */}
      {generatedToken && (
        <div className={styles.generatedToken}>
          <div className={styles.generatedTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Token gerado com sucesso
          </div>

          <div className={styles.tokenRow}>
            <span className={styles.tokenValue}>{generatedToken.token}</span>
            <button
              className={`${styles.copyButton} ${copiedField === "token" ? styles.copied : ""}`}
              onClick={() => handleCopy(generatedToken.token, "token")}
              type="button"
            >
              {copiedField === "token" ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copiar token
                </>
              )}
            </button>
          </div>

          <div className={styles.tokenRow}>
            <span className={styles.tokenValue}>{inviteLink}</span>
            <button
              className={`${styles.copyButton} ${copiedField === "link" ? styles.copied : ""}`}
              onClick={() => handleCopy(inviteLink, "link")}
              type="button"
            >
              {copiedField === "link" ? (
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

          <button className={styles.generatedDismiss} onClick={() => setGeneratedToken(null)} type="button">
            Fechar
          </button>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
        </div>
      ) : invitations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>Nenhum convite gerado</h2>
          <p className={styles.emptyDescription}>Gere seu primeiro convite para adicionar membros à empresa.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Token</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Utilizado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id}>
                  <td><code className={styles.tokenCode}>{inv.token}</code></td>
                  <td><span className={styles.typeBadge}>{typeLabel()}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusClass(inv.status)}`}>
                      {statusLabel(inv.status)}
                    </span>
                  </td>
                  <td>{formatDate(inv.createdAt)}</td>
                  <td>{inv.usedAt ? formatDate(inv.usedAt) : "—"}</td>
                  <td>
                    {inv.status === "VALID" && (
                      <button className={styles.revokeButton} onClick={() => handleRevoke(inv.id)} type="button">
                        Revogar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Gerar novo convite</h2>
            <div className={styles.modalForm}>
              <div style={{
                padding: "1rem",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "8px",
                color: "#3b82f6",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem"
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ width: "18px", height: "18px", flexShrink: 0, marginTop: "2px" }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                O usuário que utilizar este convite será cadastrado como Administrador.
              </div>
              <div className={styles.modalActions}>
                <button className={styles.modalCancel} onClick={() => setShowCreateModal(false)} type="button">
                  Cancelar
                </button>
                <button className={styles.modalSubmit} onClick={handleCreate} disabled={isCreating} type="button">
                  {isCreating ? <span className={styles.spinner} /> : "Gerar convite"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
