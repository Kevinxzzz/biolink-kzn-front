"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInfluencers } from "@/hooks/influencer/useInfluencers";
import { useDeleteInfluencer } from "@/hooks/influencer/useInfluencerMutations";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/auth/useAuth";
import type { Influencer } from "@/types/influencerType";
import {
  InfluencersHeader,
  InfluencerCard,
  CreateInfluencerModal,
  EditInfluencerModal,
} from "@/components/ComponentsPage/influencersPage";
import styles from "./influencers.module.scss";

export default function InfluencersPage() {
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  const { influencers, isLoading, error: fetchError, refetch } = useInfluencers();
  const { remove, isDeleting } = useDeleteInfluencer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmInfluencer, setDeleteConfirmInfluencer] = useState<Influencer | null>(null);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);

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
    setIsCreateModalOpen(true);
  };

  const openEditModal = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setIsEditModalOpen(true);
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
      <InfluencersHeader onOpenCreateModal={openCreateModal} />

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
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              isOwner={isOwner}
              onEdit={openEditModal}
              onDelete={setDeleteConfirmInfluencer}
            />
          ))}
        </div>
      )}

      <CreateInfluencerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />

      <EditInfluencerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refetch}
        influencer={editingInfluencer}
      />

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
