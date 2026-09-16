"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useCreateInfluencer, useUpdateInfluencer, useDeleteInfluencer } from "@/hooks/useInfluencerMutations";
import { SharedModal } from "@/components/ui/SharedModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import type { Influencer } from "@/types/influencerType";
import styles from "./influencers.module.scss";

export default function InfluencersPage() {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const { influencers, isLoading, error: fetchError, refetch } = useInfluencers();
  const { create, isCreating } = useCreateInfluencer();
  const { update, isUpdating } = useUpdateInfluencer();
  const { remove, isDeleting } = useDeleteInfluencer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmInfluencer, setDeleteConfirmInfluencer] = useState<Influencer | null>(null);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateSubmit = async () => {
    setFormError(null);
    if (!formName.trim() || !formSlug.trim()) {
      setFormError("Nome e Slug são obrigatórios.");
      return;
    }

    try {
      await create({
        name: formName.trim(),
        slug: formSlug.trim(),
        email: null,
        urlImgProfile: null
      });
      setIsCreateModalOpen(false);
      toast.success("Influenciador adicionado com sucesso!");
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao adicionar influenciador.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao adicionar." });
    }
  };

  const handleEditSubmit = async () => {
    setFormError(null);
    if (!editingInfluencer) return;
    if (!formName.trim() || !formSlug.trim()) {
      setFormError("Nome e Slug são obrigatórios.");
      return;
    }

    try {
      await update(editingInfluencer.id, {
        name: formName.trim(),
        slug: formSlug.trim(),
        email: editingInfluencer.email, // preserve existing data
        urlImgProfile: editingInfluencer.urlImgProfile
      });
      setIsEditModalOpen(false);
      toast.success("Influenciador atualizado com sucesso!");
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar influenciador.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao atualizar." });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmInfluencer) return;

    try {
      await remove(deleteConfirmInfluencer.id);
      setDeleteConfirmInfluencer(null);
      toast.success("Influenciador excluído com sucesso!");
      refetch();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir influenciador.";
      toast.error(msg, { title: "Erro ao excluir." });
    }
  };

  const openCreateModal = () => {
    setFormName("");
    setFormSlug("");
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setFormName(influencer.name);
    setFormSlug(influencer.slug);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleCopyLink = async (influencer: Influencer) => {
    // Se quiser que copie a URL gerada com o slug ou a personalUrl
    const urlToCopy = influencer.personalUrl || `${window.location.origin}/${influencer.slug}`;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedId(influencer.id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("URL copiada para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar URL.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Influenciadores">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Influenciadores">
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p className={styles.pageDescription}>Acompanhe e gerencie os influenciadores associados à sua empresa.</p>
          <button
            onClick={openCreateModal}
            type="button"
            className={styles.createButton}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem",
              fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: "var(--accent-primary)",
              border: "none", borderRadius: "9999px", cursor: "pointer"
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar influenciador
          </button>
        </div>
      </div>

      {fetchError && (
        <div role="alert" style={{ marginBottom: "1rem", color: "var(--danger)", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>
          <span>{fetchError}</span>
        </div>
      )}

      {influencers.length === 0 ? (
        <EmptyState
          title="Nenhum influenciador vinculado"
          description="Você ainda não possui influenciadores vinculados à sua empresa."
          actionLabel="Adicionar influenciador"
          onAction={openCreateModal}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
      ) : (
        <div className={styles.grid}>
          {influencers.map(influencer => (
            <div key={influencer.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.profileSection}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                      {influencer.urlImgProfile ? <img src={influencer.urlImgProfile} alt={influencer.name} /> : influencer.name.charAt(0)}
                    </div>
                  </div>
                  <div className={styles.profileInfo}>
                    <h3 className={styles.name}>{influencer.name}</h3>
                    {influencer.email && <span className={styles.email}>{influencer.email}</span>}
                  </div>
                </div>

                {isOwner && (
                  <div className={styles.actions}>
                    <button
                      className={`${styles.iconButton} ${styles.editButton}`}
                      onClick={() => openEditModal(influencer)}
                      title="Editar"
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      onClick={() => setDeleteConfirmInfluencer(influencer)}
                      title="Excluir"
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.linkSection}>
                  <span className={styles.linkSectionLabel}>Link Pessoal</span>
                  <div className={styles.publicLinkBox}>
                    <div className={styles.publicLinkUrl}>
                      <span>{influencer.personalUrl}</span>
                    </div>
                    <button
                      className={`${styles.copyBtn} ${copiedId === influencer.id ? styles.copied : ""}`}
                      onClick={() => handleCopyLink(influencer)}
                      type="button"
                    >
                      {copiedId === influencer.id ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                          Copiado!
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copiar link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.metric}>
                  <div className={styles.metricIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                      <path d="M13 13l6 6" />
                    </svg>
                  </div>
                  <div className={styles.metricData}>
                    <span className={styles.metricLabel}>Total de Cliques</span>
                    <span className={styles.metricValue}>{(influencer.counterEntries || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <SharedModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Adicionar Influenciador"
        error={formError}
        footer={
          <button
            style={{
              padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)",
              color: "#fff", border: "none", fontWeight: 600, cursor: isCreating ? "not-allowed" : "pointer",
              opacity: isCreating ? 0.7 : 1
            }}
            onClick={handleCreateSubmit}
            disabled={isCreating}
          >
            {isCreating ? "Criando..." : "Criar Influenciador"}
          </button>
        }
      >
        <div className={styles.form}>
          <Input id="create-name" name="name" label="Nome Completo" value={formName} onChange={(e) => setFormName(e.target.value)} disabled={isCreating} required />
          <Input id="create-slug" name="slug" label="Slug (Identificador)" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} disabled={isCreating} required />
        </div>
      </SharedModal>

      {/* Edit Modal */}
      <SharedModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Influenciador"
        error={formError}
        footer={
          <button
            style={{
              padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)",
              color: "#fff", border: "none", fontWeight: 600, cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.7 : 1
            }}
            onClick={handleEditSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? "Salvando..." : "Salvar Alterações"}
          </button>
        }
      >
        <div className={styles.form}>
          <Input id="edit-name" name="name" label="Nome Completo" value={formName} onChange={(e) => setFormName(e.target.value)} disabled={isUpdating} required />
          <Input id="edit-slug" name="slug" label="Slug (Identificador)" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} disabled={isUpdating} required />
        </div>
      </SharedModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmInfluencer}
        onClose={() => setDeleteConfirmInfluencer(null)}
        onConfirm={handleDelete}
        title="Excluir influenciador?"
        description={`Tem certeza que deseja excluir o influenciador "${deleteConfirmInfluencer?.name}"? Esta ação não pode ser desfeita.`}
        isDestructive
        isLoading={isDeleting}
      />

    </DashboardLayout>
  );
}
