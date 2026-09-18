"use client";

import { useState, useEffect } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCategories } from "@/hooks/category/useCategories";
import styles from "../LinkModals.module.scss";

interface CreateLinkModalProps {
  isOpen: boolean;
  isCreating: boolean;
  createError?: string | null;
  onClose: () => void;
  onSubmit: (data: { title: string; url: string; categoryId: string }) => Promise<void>;
}

export function CreateLinkModal({
  isOpen,
  isCreating,
  createError,
  onClose,
  onSubmit,
}: CreateLinkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { categories } = useCategories();

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setUrl("");
      setCategoryId("");
      setFormError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setFormError(null);
    if (!title.trim() || !url.trim() || !categoryId) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    await onSubmit({ title, url, categoryId });
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={isCreating ? () => {} : onClose}
      title="Adicionar Novo Link"
      error={formError || createError}
      footer={
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isCreating}
          type="button"
        >
          {isCreating ? "Salvando..." : "Criar Link"}
        </button>
      }
    >
      <div className={styles.form}>
        <Input
          id="create-link-title"
          name="title"
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Grupo VIP"
          disabled={isCreating}
        />
        <Input
          id="create-link-url"
          name="url"
          label="URL de Destino"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          disabled={isCreating}
        />
        <Select
          id="create-link-category"
          name="category"
          label="Categoria"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: "", label: "Selecione uma categoria" },
            ...(categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []),
          ]}
          disabled={isCreating}
        />
      </div>
    </SharedModal>
  );
}
