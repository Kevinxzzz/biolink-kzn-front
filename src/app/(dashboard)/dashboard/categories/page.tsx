"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { useCategories } from "@/hooks/category/useCategories";
import { useDeleteCategory } from "@/hooks/category/useCategoryMutations";
import type { Category } from "@/types/categoryType";
import {
  CategoriesHeader,
  CategoryItem,
  CreateCategoryModal,
  EditCategoryModal,
} from "@/components/ComponentsPage/categoriesPage";
import styles from "./categories.module.scss";

export default function CategoriesPage() {
  const { categories, isLoading, error: fetchError } = useCategories();
  const { remove, isDeleting } = useDeleteCategory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
    setIsCreateModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
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
      <CategoriesHeader onOpenCreateModal={openCreateModal} />

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

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={editingCategory}
      />

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
