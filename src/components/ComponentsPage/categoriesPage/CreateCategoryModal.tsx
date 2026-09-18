"use client";

import { useState } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useCreateCategory } from "@/hooks/useCategoryMutations";
import styles from "@/app/(dashboard)/dashboard/categories/categories.module.scss";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const { create, isCreating } = useCreateCategory();
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
      toast.success("Categoria criada com sucesso!");
      setFormName("");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar categoria.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao criar." });
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={() => {
        setFormName("");
        setFormError(null);
        onClose();
      }}
      title="Adicionar Nova Categoria"
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
  );
}
