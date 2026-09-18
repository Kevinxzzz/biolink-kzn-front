"use client";

import { useState } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useCreateInfluencer } from "@/hooks/influencer/useInfluencerMutations";
import styles from "@/app/(dashboard)/dashboard/influencers/influencers.module.scss";

interface CreateInfluencerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInfluencerModal({ isOpen, onClose, onSuccess }: CreateInfluencerModalProps) {
  const { create, isCreating } = useCreateInfluencer();
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateSubmit = async () => {
    setFormError(null);
    if (!formName.trim() || !formSlug.trim()) {
      setFormError("Nome e Slug são obrigatórios.");
      return;
    }

    try {
      await create({
        name: formName.trim(),
        slug: formSlug.trim(),
      });
      toast.success("Influenciador adicionado com sucesso!");
      setFormName("");
      setFormSlug("");
      onClose();
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao adicionar influenciador.";
      setFormError(msg);
      toast.error(msg, { title: "Erro ao adicionar." });
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={() => {
        setFormName("");
        setFormSlug("");
        setFormError(null);
        onClose();
      }}
      title="Adicionar Influenciador"
      error={formError}
      footer={
        <button
          style={{
            padding: "8px 16px", borderRadius: "99px", background: "var(--accent-primary)",
            color: "#fff", border: "none", fontWeight: 600, cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.7 : 1
          }}
          onClick={handleCreateSubmit}
          disabled={isCreating}
        >
          {isCreating ? "Criando..." : "Criar Influenciador"}
        </button>
      }
    >
      <div className={styles.form}>
        <Input id="create-name" name="name" label="Nome Completo" value={formName} onChange={(e) => setFormName(e.target.value)} disabled={isCreating} required />
        <Input id="create-slug" name="slug" label="Slug (Identificador)" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} disabled={isCreating} required />
      </div>
    </SharedModal>
  );
}
