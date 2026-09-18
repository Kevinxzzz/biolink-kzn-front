"use client";

import { useState, useEffect } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useUpdateInfluencer } from "@/hooks/influencer/useInfluencerMutations";
import type { Influencer } from "@/types/influencerType";
import styles from "@/app/(dashboard)/dashboard/influencers/influencers.module.scss";

interface EditInfluencerModalProps {
  influencer: Influencer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditInfluencerModal({ influencer, isOpen, onClose, onSuccess }: EditInfluencerModalProps) {
  const { update, isUpdating } = useUpdateInfluencer();
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (influencer && isOpen) {
      setFormName(influencer.name);
      setFormSlug(influencer.slug);
      setFormError(null);
    }
  }, [influencer, isOpen]);

  const handleEditSubmit = async () => {
    setFormError(null);
    if (!influencer) return;
    if (!formName.trim() || !formSlug.trim()) {
      setFormError("Nome e Slug são obrigatórios.");
      return;
    }

    const trimmedName = formName.trim();
    const trimmedSlug = formSlug.trim();

    const payload: { name?: string; slug?: string } = {};
    if (trimmedName !== influencer.name) {
      payload.name = trimmedName;
    }
    if (trimmedSlug !== influencer.slug) {
      payload.slug = trimmedSlug;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      await update(influencer.id, payload);
      toast.success("Influenciador atualizado com sucesso!");
      onClose();
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar influenciador.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao atualizar." });
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Influenciador"
      error={formError}
      footer={
        <button
          style={{
            padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)",
            color: "#fff", border: "none", fontWeight: 600, cursor: isUpdating ? "not-allowed" : "pointer",
            opacity: isUpdating ? 0.7 : 1
          }}
          onClick={handleEditSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? "Salvando..." : "Salvar Alterações"}
        </button>
      }
    >
      <div className={styles.form}>
        <Input id="edit-name" name="name" label="Nome Completo" value={formName} onChange={(e) => setFormName(e.target.value)} disabled={isUpdating} required />
        <Input id="edit-slug" name="slug" label="Slug (Identificador)" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} disabled={isUpdating} required />
      </div>
    </SharedModal>
  );
}
