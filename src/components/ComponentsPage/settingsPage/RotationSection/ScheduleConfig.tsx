"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useLinks } from "@/hooks/useLinks";
import { useSchedules } from "@/hooks/useSchedules";
import { useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from "@/hooks/useScheduleMutations";
import type { Schedule } from "@/types/scheduleType";
import { ScheduleList } from "./ScheduleList";
import { ScheduleEditModal } from "./ScheduleEditModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import styles from "./ScheduleConfig.module.scss";

export function ScheduleConfig() {
  const { links } = useLinks();
  const { schedules } = useSchedules();
  const { create: createSchedule, isCreating } = useCreateSchedule();
  const { update: updateSchedule, isUpdating } = useUpdateSchedule();
  const { remove: deleteSchedule, isDeleting } = useDeleteSchedule();

  const [scheduledLinkId, setScheduledLinkId] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    if (links && links.length > 0 && !scheduledLinkId) {
      setScheduledLinkId(links[0].id);
    }
  }, [links, scheduledLinkId]);

  const handleCreateSchedule = async () => {
    if (!scheduledLinkId || !scheduledDate) return;
    try {
      await createSchedule({
        enterpriseUrlId: scheduledLinkId,
        dateTime: new Date(scheduledDate).toISOString(),
      });
      toast.success("Agendamento criado com sucesso!");
      setScheduledDate("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao criar agendamento." });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSchedule) return;
    try {
      await deleteSchedule(deletingSchedule.id);
      toast.success("Agendamento excluído com sucesso!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Tente novamente.";
      toast.error(msg, { title: "Erro ao excluir agendamento." });
    } finally {
      setDeletingSchedule(null);
    }
  };

  const linkOptions = links.map((link) => ({
    value: link.id,
    label: link.title ? `${link.title} (${link.url})` : link.url,
  }));

  return (
    <div className={styles.formGrid}>
      <Select
        id="scheduled-link"
        name="scheduledLink"
        label="Selecione o Link para Agendamento"
        value={scheduledLinkId}
        onChange={(e) => setScheduledLinkId(e.target.value)}
        options={
          linkOptions.length > 0
            ? linkOptions
            : [{ value: "", label: "Nenhum link cadastrado" }]
        }
        disabled={linkOptions.length === 0}
      />

      <Input
        id="scheduled-date"
        name="scheduledDate"
        label="Dia e Horário do Agendamento"
        type="datetime-local"
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
      />

      <div className={`${styles.fullWidth} ${styles.hintBox}`}>
        <span>📅</span>
        <span>
          No dia e horário especificados, o link selecionado será ativado automaticamente.
        </span>
      </div>

      <div className={styles.fullWidth} style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className={styles.createButton}
          onClick={handleCreateSchedule}
          disabled={isCreating || !scheduledLinkId || !scheduledDate}
          type="button"
        >
          {isCreating ? "Criando..." : "Criar Agendamento"}
        </button>
      </div>

      <ScheduleList
        schedules={schedules}
        onEdit={(schedule) => setEditingSchedule(schedule)}
        onDelete={(schedule) => setDeletingSchedule(schedule)}
      />

      <ScheduleEditModal
        schedule={editingSchedule}
        linkOptions={linkOptions}
        isUpdating={isUpdating}
        onClose={() => setEditingSchedule(null)}
        onUpdate={updateSchedule}
      />

      <ConfirmDialog
        isOpen={!!deletingSchedule}
        onClose={() => setDeletingSchedule(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Agendamento"
        description="Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
