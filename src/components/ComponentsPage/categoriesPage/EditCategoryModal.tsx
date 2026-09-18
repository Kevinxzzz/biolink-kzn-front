"use client";

import { useState, useEffect } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useUpdateCategory } from "@/hooks/useCategoryMutations";
import type { Category } from "@/types/categoryType";
import styles from "@/app/(dashboard)/dashboard/categories/categories.module.scss";

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCategoryModal({ category, isOpen, onClose }: EditCategoryModalProps) {
  const { update, isUpdating } = useUpdateCategory();
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (category && isOpen) {
      setFormName(category.name);
      setFormError(null);
    }
  }, [category, isOpen]);

  const handleEditSubmit = async () => {
    setFormError(null);
    if (!category) return;
    if (!formName.trim()) {
      setFormError("O nome da categoria é obrigatório.");
      return;
    }

    try {
      await update(category.id, { name: formName.trim() });
      toast.success("Categoria atualizada com sucesso!");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar categoria.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao atualizar." });
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Categoria"
      error={formError}
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
  );
}
