"use client";

import { useState, useEffect } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import styles from "../LinkModals.module.scss";

interface CreateLinkModalProps {
  isOpen: boolean;
  isCreating: boolean;
  createError?: string | null;
  onClose: () => void;
  onSubmit: (data: { title: string; url: string }) => Promise<void>;
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
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setUrl("");
      setFormError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setFormError(null);
    if (!title.trim() || !url.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    await onSubmit({ title, url });
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={isCreating ? () => {} : onClose}
      title="Adicionar Novo Link"
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
        {(formError || createError) && (
          <div className={styles.errorMessage}>
            {formError || createError}
          </div>
        )}
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
      </div>
    </SharedModal>
  );
}
