"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SharedModal } from "@/components/ui/SharedModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategoryMutations";
import type { Category } from "@/types/categoryType";

import styles from "./categories.module.scss";

function CategoryItem({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  return (
    <div className={styles.categoryItem}>
      <div className={styles.categoryContent}>
        <div className={styles.categoryInfo}>
          <div className={styles.categoryTitle}>{category.name}</div>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.iconButton} ${styles.editButton}`}
          onClick={() => onEdit(category)}
          title="Editar"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button
          className={`${styles.iconButton} ${styles.deleteButton}`}
          onClick={() => onDelete(category)}
          title="Excluir"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, isLoading, error: fetchError } = useCategories();
  const { create, isCreating } = useCreateCategory();
  const { update, isUpdating } = useUpdateCategory();
  const { remove, isDeleting } = useDeleteCategory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateSubmit = async () => {
    setFormError(null);
    if (!formName.trim()) {
      setFormError("O nome da categoria é obrigatório.");
      return;
    }

    try {
      await create({ name: formName.trim() });
      setIsCreateModalOpen(false);
      toast.success("Categoria criada com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar categoria.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao criar." });
    }
  };

  const handleEditSubmit = async () => {
    setFormError(null);
    if (!editingCategory) return;
    if (!formName.trim()) {
      setFormError("O nome da categoria é obrigatório.");
      return;
    }

    try {
      await update(editingCategory.id, { name: formName.trim() });
      setIsEditModalOpen(false);
      toast.success("Categoria atualizada com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar categoria.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao atualizar." });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmCategory) return;

    try {
      await remove(deleteConfirmCategory.id);
      setDeleteConfirmCategory(null);
      toast.success("Categoria excluída com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir categoria.";
      toast.error(msg, { title: "Erro ao excluir." });
    }
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

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Categorias">
        <div
          className="loadingState"
          style={{ display: "flex", justifyContent: "center", padding: "3rem" }}
        >
          Carregando categorias...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Gerenciamento de Categorias">
      <div className={styles.pageHeader}>
        <p className={styles.pageDescription}>
          Crie, edite e organize as categorias da sua empresa.
        </p>
        <button className={styles.createButton} onClick={openCreateModal} type="button">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Categoria
        </button>
      </div>

      {fetchError && (
        <div
          role="alert"
          style={{
            marginBottom: "1rem",
            color: "var(--danger)",
            padding: "1rem",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "8px",
          }}
        >
          <span>{fetchError}</span>
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria encontrada"
          description="Você ainda não possui categorias cadastradas. Adicione a sua primeira categoria para organizar seus links."
          actionLabel="Adicionar Categoria"
          onAction={openCreateModal}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
            </svg>
          }
        />
      ) : (
        <div className={styles.categoriesList}>
          {categories.map((category) => (
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
      <SharedModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Adicionar Nova Categoria"
        footer={
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "99px",
              background: "var(--accent-primary)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: isCreating ? "not-allowed" : "pointer",
              opacity: isCreating ? 0.7 : 1,
            }}
            onClick={handleCreateSubmit}
            disabled={isCreating}
          >
            {isCreating ? "Criando..." : "Criar Categoria"}
          </button>
        }
      >
        <div className={styles.form}>
          {formError && (
            <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>
              {formError}
            </div>
          )}
          <Input
            id="name"
            name="name"
            label="Nome da Categoria"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Ex: Grupo VIP"
            disabled={isCreating}
          />
        </div>
      </SharedModal>

      {/* Edit Modal */}
      <SharedModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Categoria"
        footer={
          <button
            style={{
              padding: "8px 16px",
              borderRadius: "99px",
              background: "var(--accent-primary)",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.7 : 1,
            }}
            onClick={handleEditSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? "Salvando..." : "Salvar Alterações"}
          </button>
        }
      >
        <div className={styles.form}>
          {formError && (
            <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>
              {formError}
            </div>
          )}
          <Input
            id="edit-name"
            name="name"
            label="Nome da Categoria"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            disabled={isUpdating}
          />
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
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
