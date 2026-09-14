"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInvitations, useCreateInvitation, useRevokeInvitation } from "@/hooks/useInvitations";
import type { InvitationToken } from "@/types/invitationType";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import styles from "./invitations.module.scss";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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

export default function InvitationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && user.role === "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const { invitations, isLoading, error: fetchError } = useInvitations();
  const { create, isCreating } = useCreateInvitation();
  const { revoke, isRevoking } = useRevokeInvitation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<InvitationToken | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [expiresInHours, setExpiresInHours] = useState<number>(72);
  const [maxUses, setMaxUses] = useState<number>(1);
  
  const [tokenToRevoke, setTokenToRevoke] = useState<string | null>(null);

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError, { title: "Erro ao carregar convites" });
    }
  }, [fetchError]);

  if (user?.role === "ADMIN") {
    return null;
  }

  const handleCreate = async () => {
    try {
      const token = await create({ expiresInHours, maxUses });
      setGeneratedToken(token);
      setShowCreateModal(false);
      toast.success("Convite gerado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar convite.");
    }
  };

  const handleCopy = async (text: string, id: string, field: "token" | "link") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(`${id}-${field}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRevoke = async () => {
    if (!tokenToRevoke) return;
    try {
      await revoke(tokenToRevoke);
      toast.success("Convite excluído com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir convite.");
    } finally {
      setTokenToRevoke(null);
    }
  };

  const inviteLink = generatedToken
    ? `${window.location.origin}/register/invite/${generatedToken.token}`
    : "";

  return (
    <DashboardLayout pageTitle="Tokens de convite">
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
              className={`${styles.copyButton} ${copiedField === `generated-token` ? styles.copied : ""}`}
              onClick={() => handleCopy(generatedToken.token, "generated", "token")}
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
              className={`${styles.copyButton} ${copiedField === `generated-link` ? styles.copied : ""}`}
              onClick={() => handleCopy(inviteLink, "generated", "link")}
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

          <button className={styles.generatedDismiss} onClick={() => setGeneratedToken(null)} type="button">
            Fechar
          </button>
        </div>
      )}

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
        <div className={styles.cardsGrid}>
          {invitations.map((inv) => {
            const rowLink = `${window.location.origin}/register/invite/${inv.token}`;
            return (
              <div key={inv.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>Token</span>
                  <span className={`${styles.statusBadge} ${statusClass(inv.status)}`}>
                    {statusLabel(inv.status)}
                  </span>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.cardHighlightRow}>
                    <span className={styles.cardHighlightValue}>{inv.token}</span>
                    <button
                      className={`${styles.copyButton} ${copiedField === `${inv.id}-token` ? styles.copied : ""}`}
                      onClick={() => handleCopy(inv.token, inv.id, "token")}
                      type="button"
                      title="Copiar token"
                    >
                      {copiedField === `${inv.id}-token` ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className={styles.cardLinkRow}>
                    <span className={styles.cardLinkValue}>{rowLink}</span>
                    <button
                      className={`${styles.copyButton} ${copiedField === `${inv.id}-link` ? styles.copied : ""}`}
                      onClick={() => handleCopy(rowLink, inv.id, "link")}
                      type="button"
                    >
                      {copiedField === `${inv.id}-link` ? (
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
                        {inv.uses} / {inv.maxUses}
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Criado em</span>
                      <span className={styles.statValue}>{formatDate(inv.createdAt)}</span>
                    </div>
                    {inv.expiresAt && (
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Expira em</span>
                        <span className={styles.statValue}>{formatDate(inv.expiresAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                  <div className={styles.cardFooter}>
                    <button className={styles.revokeButton} onClick={() => setTokenToRevoke(inv.id)} type="button" disabled={isRevoking}>
                      Excluir convite
                    </button>
                  </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Gerar novo convite</h2>
            <div className={styles.modalForm}>
              <div style={{ display: "flex", gap: "1rem", flexDirection: "column", marginBottom: "1rem" }}>
                <Input
                  id="expiresInHours"
                  name="expiresInHours"
                  label="Expiração (em horas)"
                  type="number"
                  min={1}
                  value={expiresInHours.toString()}
                  onChange={(e) => setExpiresInHours(Number(e.target.value))}
                />
                <Input
                  id="maxUses"
                  name="maxUses"
                  label="Limite de usos"
                  type="number"
                  min={1}
                  value={maxUses.toString()}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                />
              </div>

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
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
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

      {tokenToRevoke && (
        <ConfirmDialog
          isOpen={true}
          title="Excluir convite"
          description="Tem certeza que deseja excluir este convite? Ele não poderá mais ser utilizado para cadastros."
          confirmText={isRevoking ? "Excluindo..." : "Sim, excluir"}
          cancelText="Cancelar"
          isDestructive={true}
          isLoading={isRevoking}
          onConfirm={handleRevoke}
          onClose={() => setTokenToRevoke(null)}
        />
      )}
    </DashboardLayout>
  );
}
