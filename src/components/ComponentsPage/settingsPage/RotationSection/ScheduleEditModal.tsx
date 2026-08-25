"use client";

import { useState, useEffect } from "react";
import { SharedModal } from "@/components/ui/SharedModal";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import type { Schedule, UpdateSchedulePayload } from "@/types/scheduleType";
import styles from "./ScheduleConfig.module.scss";

interface LinkOption {
  value: string;
  label: string;
}

interface ScheduleEditModalProps {
  schedule: Schedule | null;
  linkOptions: LinkOption[];
  isUpdating: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateSchedulePayload) => Promise<unknown>;
}

export function ScheduleEditModal({
  schedule,
  linkOptions,
  isUpdating,
  onClose,
  onUpdate,
}: ScheduleEditModalProps) {
  const [editLinkId, setEditLinkId] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [editActive, setEditActive] = useState<string>("true");

  useEffect(() => {
    if (schedule) {
      setEditLinkId(schedule.enterpriseUrlId);

      const d = new Date(schedule.dateTime);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setEditDate(d.toISOString().slice(0, 16));

      setEditActive(schedule.active ? "true" : "false");
    }
  }, [schedule]);

  const handleSave = async () => {
    if (!schedule || !editLinkId || !editDate) return;
    try {
      await onUpdate(schedule.id, {
        enterpriseUrlId: editLinkId,
        dateTime: new Date(editDate).toISOString(),
        active: editActive === "true",
      });
      toast.success("Agendamento atualizado com sucesso!");
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao atualizar agendamento." });
    }
  };

  return (
    <SharedModal
      isOpen={!!schedule}
      onClose={onClose}
      title="Editar Agendamento"
      size="small"
    >
      <div className={styles.modalForm}>
        <Select
          id="edit-scheduled-link"
          name="editScheduledLink"
          label="Link vinculado"
          value={editLinkId}
          onChange={(e) => setEditLinkId(e.target.value)}
          options={linkOptions}
        />
        <Input
          id="edit-scheduled-date"
          name="editScheduledDate"
          label="Dia e Horário"
          type="datetime-local"
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
        />
        <Select
          id="edit-scheduled-status"
          name="editScheduledStatus"
          label="Status"
          value={editActive}
          onChange={(e) => setEditActive(e.target.value)}
          options={[
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
          ]}
        />
        <button
          className={styles.modalSaveButton}
          onClick={handleSave}
          disabled={isUpdating || !editLinkId || !editDate}
          type="button"
        >
          {isUpdating ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </SharedModal>
  );
}
