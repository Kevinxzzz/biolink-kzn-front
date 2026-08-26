"use client";

import { useState, useEffect } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LinksHeader,
  LinksList,
  CreateLinkModal,
  EditLinkModal,
} from "@/components/ComponentsPage/linksPage";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { useLinks } from "@/hooks/useLinks";
import {
  useCreateLink,
  useUpdateLink,
  useDeleteLink,
  useReorderLinks,
  useActivateLink,
} from "@/hooks/useLinkMutations";
import type { Link } from "@/types/linkType";
import styles from "./links.module.scss";

export default function LinksPage() {
  const { links: initialLinks, isLoading, error: fetchError } = useLinks();
  const { create, isCreating, error: createError } = useCreateLink();
  const { update, isUpdating, error: updateError } = useUpdateLink();
  const { remove, isDeleting } = useDeleteLink();
  const { reorder, isReordering } = useReorderLinks();
  const { activate, isActivating, error: activateError } = useActivateLink();

  const [localLinks, setLocalLinks] = useState<Link[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<Link | null>(null);

  // Sync initial links to local state for instant drag and drop feedback
  useEffect(() => {
    if (initialLinks && !isLoading) {
      setLocalLinks(initialLinks);
    }
  }, [initialLinks, isLoading]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localLinks.findIndex((l) => l.id === active.id);
      const newIndex = localLinks.findIndex((l) => l.id === over.id);

      const previousOrder = [...localLinks];
      const newOrder = arrayMove(localLinks, oldIndex, newIndex);

      setLocalLinks(newOrder);

      try {
        await reorder(newOrder.map((l) => l.id));
        toast.success("Ordem dos links atualizada!");
      } catch (err) {
        setLocalLinks(previousOrder);
        const msg = err instanceof Error ? err.message : "Erro ao reordenar links.";
        toast.error(msg, { title: "Erro ao reordenar." });
      }
    }
  };

  const handleCreateSubmit = async (data: { title: string; url: string }) => {
    try {
      await create(data);
      setIsCreateModalOpen(false);
      toast.success("Link criado com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar link.";
      toast.error(msg, { title: "Erro ao criar link." });
    }
  };

  const handleEditSubmit = async (id: string, data: { title: string; url: string }) => {
    try {
      await update(id, data);
      setEditingLink(null);
      toast.success("Link atualizado com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar link.";
      toast.error(msg, { title: "Erro ao atualizar link." });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmLink) return;
    try {
      await remove(deleteConfirmLink.id);
      setDeleteConfirmLink(null);
      toast.success("Link excluído com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir link.";
      toast.error(msg, { title: "Erro ao excluir link." });
    }
  };

  const handleActivate = async (link: Link) => {
    try {
      await activate(link.id);
      toast.success(`Link "${link.title}" ativado agora!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao ativar link.";
      toast.error(msg, { title: "Erro ao ativar link." });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Links">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Gerenciamento de Links">
      <div className={styles.page}>
        <LinksHeader onAddLink={() => setIsCreateModalOpen(true)} />

        {fetchError && (
          <div className={`${styles.alert} ${styles.alertError}`} role="alert">
            <span>{fetchError}</span>
          </div>
        )}

        {activateError && (
          <div className={`${styles.alert} ${styles.alertError}`} role="alert">
            <span>{activateError}</span>
          </div>
        )}

        {localLinks.length === 0 ? (
          <EmptyState
            title="Nenhum link encontrado"
            description="Você ainda não possui links cadastrados. Adicione o seu primeiro link para começar a gerar tráfego."
            actionLabel="Adicionar Link"
            onAction={() => setIsCreateModalOpen(true)}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            }
          />
        ) : (
          <LinksList
            links={localLinks}
            isReordering={isReordering}
            isActivating={isActivating}
            onDragEnd={handleDragEnd}
            onEdit={(link) => setEditingLink(link)}
            onDelete={(link) => setDeleteConfirmLink(link)}
            onActivate={handleActivate}
          />
        )}

        <CreateLinkModal
          isOpen={isCreateModalOpen}
          isCreating={isCreating}
          createError={createError}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />

        <EditLinkModal
          isOpen={!!editingLink}
          link={editingLink}
          isUpdating={isUpdating}
          updateError={updateError}
          onClose={() => setEditingLink(null)}
          onSubmit={handleEditSubmit}
        />

        <ConfirmDialog
          isOpen={!!deleteConfirmLink}
          onClose={() => setDeleteConfirmLink(null)}
          onConfirm={handleDeleteConfirm}
          title="Excluir link?"
          description={`Tem certeza que deseja excluir o link "${deleteConfirmLink?.title}"? Esta ação não pode ser desfeita.`}
          isDestructive
          isLoading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
