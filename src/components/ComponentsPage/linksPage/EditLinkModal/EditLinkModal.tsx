"use client";

import { useState, useEffect } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import type { Link } from "@/types/linkType";
import styles from "../LinkModals.module.scss";

interface EditLinkModalProps {
  isOpen: boolean;
  link: Link | null;
  isUpdating: boolean;
  updateError?: string | null;
  onClose: () => void;
  onSubmit: (id: string, data: { title: string; url: string }) => Promise<void>;
}

export function EditLinkModal({
  isOpen,
  link,
  isUpdating,
  updateError,
  onClose,
  onSubmit,
}: EditLinkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (link) {
      setTitle(link.title || "");
      setUrl(link.url || "");
      setFormError(null);
    }
  }, [link]);

  const handleSubmit = async () => {
    if (!link) return;
    setFormError(null);
    if (!title.trim() || !url.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }
    await onSubmit(link.id, { title, url });
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={isUpdating ? () => {} : onClose}
      title="Editar Link"
      footer={
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isUpdating}
          type="button"
        >
          {isUpdating ? "Salvando..." : "Salvar Alterações"}
        </button>
      }
    >
      <div className={styles.form}>
        {(formError || updateError) && (
          <div className={styles.errorMessage}>
            {formError || updateError}
          </div>
        )}
        <Input
          id="edit-link-title"
          name="title"
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUpdating}
        />
        <Input
          id="edit-link-url"
          name="url"
          label="URL de Destino"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isUpdating}
        />
      </div>
    </SharedModal>
  );
}
