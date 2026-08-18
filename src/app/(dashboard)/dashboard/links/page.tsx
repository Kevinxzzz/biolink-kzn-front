"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLinks } from "@/hooks/useLinks";
import { useCreateLink, useUpdateLink, useDeleteLink, useReorderLinks, useActivateLink } from "@/hooks/useLinkMutations";
import { SharedModal } from "@/components/ui/SharedModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import type { Link } from "@/types/linkType";

// dnd-kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from "./links.module.scss";

// Sortable Item Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortableLinkItem({ link, onEdit, onDelete, onActivate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 1 : 0, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={styles.linkItem}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
        </svg>
      </div>

      <div className={styles.linkContent}>
        <div className={styles.linkInfo}>
          <div className={styles.linkTitle}>
            {link.title}
            {link.active && <span className={styles.activeBadge}>Ativo Agora</span>}
            {!link.inRotationPool && <span style={{ marginLeft: "8px", fontSize: "10px", color: "var(--text-tertiary)" }} title="Contrato API">(Não está no pool)</span>}
          </div>
          <div className={styles.linkUrl}>{link.url}</div>
        </div>

        <div className={styles.linkMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Cliques</span>
            <span className={styles.metricValue}>{(link.countClicks || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {!link.active && link.inRotationPool && (
          <button className={`${styles.iconButton} ${styles.activateButton}`} onClick={() => onActivate(link)} title="Ativar Link" type="button" style={{ color: "var(--success)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}
        <button className={`${styles.iconButton} ${styles.editButton}`} onClick={() => onEdit(link)} title="Editar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => onDelete(link)} title="Excluir" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function LinksPage() {
  const { links: initialLinks, isLoading, error: fetchError } = useLinks();
  const { create, isCreating, error: createError } = useCreateLink();
  const { update, isUpdating, error: updateError } = useUpdateLink();
  const { remove, isDeleting } = useDeleteLink();
  const { reorder, isReordering } = useReorderLinks();
  const { activate, isActivating, error: activateError } = useActivateLink();

  const [localLinks, setLocalLinks] = useState<Link[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<Link | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initial links to local state for drag and drop
  useEffect(() => {
    if (initialLinks && !isLoading) {
      setLocalLinks(initialLinks);
    }
  }, [initialLinks, isLoading]);

  // DND Setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localLinks.findIndex((l) => l.id === active.id);
      const newIndex = localLinks.findIndex((l) => l.id === over.id);
      
      const previousOrder = [...localLinks];
      const newOrder = arrayMove(localLinks, oldIndex, newIndex);
      
      // Atualiza UI instantaneamente (Optimistic Update Local)
      setLocalLinks(newOrder);
      
      try {
        await reorder(newOrder.map(l => l.id));
      } catch (err) {
        // Rollback para ordem anterior em caso de falha
        setLocalLinks(previousOrder);
        alert(err instanceof Error ? err.message : "Erro ao reordenar links.");
      }
    }
  };

  const handleCreateSubmit = async () => {
    setFormError(null);
    if (!formTitle.trim() || !formUrl.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await create({ title: formTitle, url: formUrl });
      setIsCreateModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao criar link.");
    }
  };

  const handleEditSubmit = async () => {
    setFormError(null);
    if (!editingLink) return;
    if (!formTitle.trim() || !formUrl.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await update(editingLink.id, { title: formTitle, url: formUrl });
      setIsEditModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao atualizar link.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmLink) return;
    try {
      await remove(deleteConfirmLink.id);
      setDeleteConfirmLink(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir link.");
    }
  };

  const handleActivate = async (link: Link) => {
    try {
      await activate(link.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao ativar link.");
    }
  };

  const openCreateModal = () => {
    setFormTitle(""); 
    setFormUrl(""); 
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (link: Link) => {
    setEditingLink(link);
    setFormTitle(link.title); 
    setFormUrl(link.url);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <DashboardLayout pageTitle="Links"><div className={styles.loadingState}><div className={styles.spinner} /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout pageTitle="Gerenciamento de Links">
      <div className={styles.pageHeader}>
        <p className={styles.pageDescription}>Crie, edite e reordene os links da sua empresa.</p>
        <button className={styles.createButton} onClick={openCreateModal} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Link
        </button>
      </div>

      {fetchError && (
        <div className={`${styles.alert} ${styles.alertError}`} role="alert" style={{ marginBottom: "1rem" }}>
          <span>{fetchError}</span>
        </div>
      )}

      {activateError && (
        <div className={`${styles.alert} ${styles.alertError}`} role="alert" style={{ marginBottom: "1rem" }}>
          <span>{activateError}</span>
        </div>
      )}

      {localLinks.length === 0 ? (
        <EmptyState
          title="Nenhum link encontrado"
          description="Você ainda não possui links cadastrados. Adicione o seu primeiro link para começar a gerar tráfego."
          actionLabel="Adicionar Link"
          onAction={openCreateModal}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
        />
      ) : (
        <div style={{ opacity: isReordering || isActivating ? 0.7 : 1, pointerEvents: isReordering ? "none" : "auto", transition: "opacity 0.2s" }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localLinks.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className={styles.linksList}>
                {localLinks.map(link => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onEdit={openEditModal}
                    onDelete={setDeleteConfirmLink}
                    onActivate={handleActivate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Create Modal */}
      <SharedModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Adicionar Novo Link"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", opacity: isCreating ? 0.7 : 1 }} onClick={handleCreateSubmit} disabled={isCreating}>
            {isCreating ? "Salvando..." : "Criar Link"}
          </button>
        }
      >
        <div className={styles.form}>
          {formError && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{formError}</div>}
          {createError && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{createError}</div>}
          <Input id="title" name="title" label="Título" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Ex: Grupo VIP" disabled={isCreating} />
          <Input id="url" name="url" label="URL de Destino" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://" disabled={isCreating} />
        </div>
      </SharedModal>

      {/* Edit Modal */}
      <SharedModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Link"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", opacity: isUpdating ? 0.7 : 1 }} onClick={handleEditSubmit} disabled={isUpdating}>
            {isUpdating ? "Salvando..." : "Salvar Alterações"}
          </button>
        }
      >
        <div className={styles.form}>
          {formError && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{formError}</div>}
          {updateError && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{updateError}</div>}
          <Input id="edit-title" name="title" label="Título" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} disabled={isUpdating} />
          <Input id="edit-url" name="url" label="URL de Destino" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} disabled={isUpdating} />
        </div>
      </SharedModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmLink}
        onClose={() => setDeleteConfirmLink(null)}
        onConfirm={handleDelete}
        title="Excluir link?"
        description={`Tem certeza que deseja excluir o link "${deleteConfirmLink?.title}"? Esta ação não pode ser desfeita.`}
        isDestructive
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
