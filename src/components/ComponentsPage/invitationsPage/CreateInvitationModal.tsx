"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useCreateInvitation } from "@/hooks/invitation/useInvitations";
import type { InvitationToken } from "@/types/invitationType";
import styles from "@/app/(dashboard)/dashboard/invitations/invitations.module.scss";

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: InvitationToken) => void;
}

export function CreateInvitationModal({ isOpen, onClose, onSuccess }: CreateInvitationModalProps) {
  const { create, isCreating } = useCreateInvitation();
  const [expiresInHours, setExpiresInHours] = useState<number>(72);
  const [maxUses, setMaxUses] = useState<number>(1);

  const handleCreate = async () => {
    try {
      const token = await create({ expiresInHours, maxUses });
      onSuccess(token);
      toast.success("Convite gerado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar convite.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Gerar novo convite</h2>
        <div className={styles.modalForm}>
          <div style={{ display: "flex", gap: "1rem", flexDirection: "column", marginBottom: "1rem" }}>
            <Input
              id="expiresInHours"
              name="expiresInHours"
              label="Expiração (em horas)"
              type="number"
              min={1}
              value={expiresInHours.toString()}
              onChange={(e) => setExpiresInHours(Number(e.target.value))}
            />
            <Input
              id="maxUses"
              name="maxUses"
              label="Limite de usos"
              type="number"
              min={1}
              value={maxUses.toString()}
              onChange={(e) => setMaxUses(Number(e.target.value))}
            />
          </div>

          <div style={{
            padding: "1rem",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "8px",
            color: "#3b82f6",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem"
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ width: "18px", height: "18px", flexShrink: 0, marginTop: "2px" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            O usuário que utilizar este convite será cadastrado como Administrador.
          </div>
          <div className={styles.modalActions}>
            <button className={styles.modalCancel} onClick={onClose} type="button">
              Cancelar
            </button>
            <button className={styles.modalSubmit} onClick={handleCreate} disabled={isCreating} type="button">
              {isCreating ? <span className={styles.spinner} /> : "Gerar convite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
