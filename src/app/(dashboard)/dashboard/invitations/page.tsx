"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInvitations, useRevokeInvitation } from "@/hooks/invitation/useInvitations";
import { useAuth } from "@/hooks/auth/useAuth";
import type { InvitationToken } from "@/types/invitationType";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/ui/Toast";
import {
  InvitationsHeader,
  GeneratedTokenBanner,
  InvitationCard,
  CreateInvitationModal,
} from "@/components/ComponentsPage/invitationsPage";
import styles from "./invitations.module.scss";

export default function InvitationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const { invitations, isLoading, error: fetchError } = useInvitations();
  const { revoke, isRevoking } = useRevokeInvitation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<InvitationToken | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [tokenToRevoke, setTokenToRevoke] = useState<string | null>(null);

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError, { title: "Erro ao carregar convites" });
    }
  }, [fetchError]);

  if (user?.role === "ADMIN") {
    return null;
  }

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

  return (
    <DashboardLayout pageTitle="Tokens de convite">
      <InvitationsHeader onOpenCreateModal={() => setShowCreateModal(true)} />

      {generatedToken && (
        <GeneratedTokenBanner
          token={generatedToken}
          copiedField={copiedField}
          onCopy={handleCopy}
          onDismiss={() => setGeneratedToken(null)}
        />
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
          {invitations.map((inv) => (
            <InvitationCard
              key={inv.id}
              invitation={inv}
              copiedField={copiedField}
              onCopy={handleCopy}
              onRevoke={setTokenToRevoke}
              isRevoking={isRevoking && tokenToRevoke === inv.id}
            />
          ))}
        </div>
      )}

      <CreateInvitationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(token) => {
          setGeneratedToken(token);
          setShowCreateModal(false);
        }}
      />

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
