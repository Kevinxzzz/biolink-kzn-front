"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SharedModal } from "@/components/ui/SharedModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";

import styles from "./categories.module.scss";

// Tipagem temporária para o frontend (será movida para types/ futuramente)
interface Category {
  id: string;
  name: string;
  rotationType: "LIMITCLICKS" | "TIMER" | "NONE";
}

// Mock inicial
const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Free Fire", rotationType: "LIMITCLICKS" },
  { id: "2", name: "eFootball", rotationType: "TIMER" }
];

function CategoryItem({ category, onEdit, onDelete }: { category: Category; onEdit: (c: Category) => void; onDelete: (c: Category) => void }) {
  return (
    <div className={styles.categoryItem}>
      <div className={styles.categoryContent}>
        <div className={styles.categoryInfo}>
          <div className={styles.categoryTitle}>
            {category.name}
            {category.rotationType !== "NONE" && (
              <span className={styles.rotationBadge}>
                Rotação: {category.rotationType}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={`${styles.iconButton} ${styles.editButton}`} onClick={() => onEdit(category)} title="Editar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => onDelete(category)} title="Excluir" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateSubmit = () => {
    setFormError(null);
    if (!formName.trim()) {
      setFormError("O nome da categoria é obrigatório.");
      return;
    }

    const newCategory: Category = {
      id: Math.random().toString(36).substring(2, 9),
      name: formName.trim(),
      rotationType: "NONE"
    };

    setCategories([...categories, newCategory]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = () => {
    setFormError(null);
    if (!editingCategory) return;
    if (!formName.trim()) {
      setFormError("O nome da categoria é obrigatório.");
      return;
    }

    setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: formName.trim() } : c));
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmCategory) return;
    setCategories(categories.filter(c => c.id !== deleteConfirmCategory.id));
    setDeleteConfirmCategory(null);
  };

  const openCreateModal = () => {
    setFormName(""); 
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name); 
    setFormError(null);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout pageTitle="Gerenciamento de Categorias">
      <div className={styles.pageHeader}>
        <p className={styles.pageDescription}>Crie, edite e organize as categorias da sua empresa.</p>
        <button className={styles.createButton} onClick={openCreateModal} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Categoria
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria encontrada"
          description="Você ainda não possui categorias cadastradas. Adicione a sua primeira categoria para organizar seus links."
          actionLabel="Adicionar Categoria"
          onAction={openCreateModal}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg>}
        />
      ) : (
        <div className={styles.categoriesList}>
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={openEditModal}
              onDelete={setDeleteConfirmCategory}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <SharedModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Adicionar Nova Categoria"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={handleCreateSubmit}>
            Criar Categoria
          </button>
        }
      >
        <div className={styles.form}>
          {formError && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{formError}</div>}
          <Input id="name" name="name" label="Nome da Categoria" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Grupo VIP" />
        </div>
      </SharedModal>

      {/* Edit Modal */}
      <SharedModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Categoria"
        footer={
          <button style={{ padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={handleEditSubmit}>
            Salvar Alterações
          </button>
        }
      >
        <div className={styles.form}>
          {formError && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{formError}</div>}
          <Input id="edit-name" name="name" label="Nome da Categoria" value={formName} onChange={(e) => setFormName(e.target.value)} />
        </div>
      </SharedModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmCategory}
        onClose={() => setDeleteConfirmCategory(null)}
        onConfirm={handleDelete}
        title="Excluir categoria?"
        description={`Tem certeza que deseja excluir a categoria "${deleteConfirmCategory?.name}"? Esta ação não pode ser desfeita e irá deletar permanentemente todos os links atrelados a ela.`}
        isDestructive
        isLoading={false}
      />
    </DashboardLayout>
  );
}
