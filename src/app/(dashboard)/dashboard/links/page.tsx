"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLinks } from "@/hooks/useLinks";
import { useCreateLink, useUpdateLink, useDeleteLink, useReorderLinks } from "@/hooks/useLinkMutations";
import { SharedModal } from "@/components/ui/SharedModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import type { Link } from "@/types/link";

// dnd-kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from "./links.module.scss";

// Sortable Item Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortableLinkItem({ link, onEdit, onDelete, onToggleEnabled, onTogglePool }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 1 : 0, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={styles.linkItem}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      
      <div className={styles.linkContent}>
        <div className={styles.linkInfo}>
          <div className={styles.linkTitle}>
            {link.title}
            {link.isActive && <span className={styles.activeBadge}>Ativo Agora</span>}
          </div>
          <div className={styles.linkUrl}>{link.url}</div>
        </div>

        <div className={styles.linkMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Cliques</span>
            <span className={styles.metricValue}>{link.clicks.toLocaleString()}</span>
          </div>
          
          <div className={styles.toggles}>
            <Toggle checked={link.isEnabled} onChange={(c) => onToggleEnabled(link.id, c)} label="Habilitado" />
            <Toggle checked={link.rotationPool} onChange={(c) => onTogglePool(link.id, c)} label="No Pool" />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={`${styles.iconButton} ${styles.editButton}`} onClick={() => onEdit(link)} title="Editar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
        </button>
        <button className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => onDelete(link)} title="Excluir" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function LinksPage() {
  const { links: initialLinks, isLoading, refetch } = useLinks();
  const { create, isCreating } = useCreateLink();
  const { update } = useUpdateLink();
  const { remove, isDeleting } = useDeleteLink();
  const { reorder } = useReorderLinks();

  const [localLinks, setLocalLinks] = useState<Link[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<Link | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formEnabled, setFormEnabled] = useState(true);
  const [formPool, setFormPool] = useState(true);

  // Sync initial links to local state for drag and drop
  if (initialLinks.length > 0 && localLinks.length === 0 && !isLoading) {
    setLocalLinks(initialLinks);
  }

  // DND Setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localLinks.findIndex((l) => l.id === active.id);
      const newIndex = localLinks.findIndex((l) => l.id === over.id);
      const newOrder = arrayMove(localLinks, oldIndex, newIndex);
      setLocalLinks(newOrder);
      reorder(newOrder.map(l => l.id)); // Background sync
    }
  };

  const handleCreateSubmit = async () => {
    try {
      await create({ title: formTitle, url: formUrl, isEnabled: formEnabled, rotationPool: formPool });
      setIsCreateModalOpen(false);
      refetch();
    } catch {}
  };

  const handleEditSubmit = async () => {
    if (!editingLink) return;
    try {
      await update(editingLink.id, { title: formTitle, url: formUrl, isEnabled: formEnabled, rotationPool: formPool });
      setIsEditModalOpen(false);
      refetch();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteConfirmLink) return;
    try {
      await remove(deleteConfirmLink.id);
      setDeleteConfirmLink(null);
      refetch();
    } catch {}
  };

  const openCreateModal = () => {
    setFormTitle(""); setFormUrl(""); setFormEnabled(true); setFormPool(true);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (link: Link) => {
    setEditingLink(link);
    setFormTitle(link.title); setFormUrl(link.url); setFormEnabled(link.isEnabled); setFormPool(link.rotationPool);
    setIsEditModalOpen(true);
  };

  const onToggleEnabled = async (id: string, checked: boolean) => {
    setLocalLinks(prev => prev.map(l => l.id === id ? { ...l, isEnabled: checked } : l));
    await update(id, { isEnabled: checked });
  };

  const onTogglePool = async (id: string, checked: boolean) => {
    setLocalLinks(prev => prev.map(l => l.id === id ? { ...l, rotationPool: checked } : l));
    await update(id, { rotationPool: checked });
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
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adicionar Link
        </button>
      </div>

      {localLinks.length === 0 ? (
        <EmptyState 
          title="Nenhum link encontrado"
          description="Você ainda não possui links cadastrados. Adicione o seu primeiro link para começar a gerar tráfego."
          actionLabel="Adicionar Link"
          onAction={openCreateModal}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localLinks.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.linksList}>
              {localLinks.map(link => (
                <SortableLinkItem 
                  key={link.id} 
                  link={link} 
                  onEdit={openEditModal} 
                  onDelete={setDeleteConfirmLink}
                  onToggleEnabled={onToggleEnabled}
                  onTogglePool={onTogglePool}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create Modal */}
      <SharedModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Adicionar Novo Link"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={handleCreateSubmit} disabled={isCreating}>
            {isCreating ? "Salvando..." : "Criar Link"}
          </button>
        }
      >
        <div className={styles.form}>
          <Input id="title" name="title" label="Título" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Ex: Grupo VIP" />
          <Input id="url" name="url" label="URL de Destino" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://" />
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
            <Toggle checked={formEnabled} onChange={setFormEnabled} label="Habilitado (Pode receber tráfego)" />
            <Toggle checked={formPool} onChange={setFormPool} label="Adicionar ao Pool de Rotação Automática" />
          </div>
        </div>
      </SharedModal>

      {/* Edit Modal */}
      <SharedModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Link"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={handleEditSubmit}>
            Salvar Alterações
          </button>
        }
      >
        <div className={styles.form}>
          <Input id="edit-title" name="title" label="Título" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <Input id="edit-url" name="url" label="URL de Destino" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} />
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
            <Toggle checked={formEnabled} onChange={setFormEnabled} label="Habilitado" />
            <Toggle checked={formPool} onChange={setFormPool} label="No Pool de Rotação" />
          </div>
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
