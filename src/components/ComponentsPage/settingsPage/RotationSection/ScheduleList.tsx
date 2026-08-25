"use client";

import type { Schedule } from "@/types/scheduleType";
import styles from "./ScheduleConfig.module.scss";

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
}

export function ScheduleList({ schedules, onEdit }: ScheduleListProps) {
  return (
    <div className={`${styles.fullWidth} ${styles.scheduleListContainer}`}>
      <h3 className={styles.scheduleListTitle}>Agendamentos Cadastrados</h3>
      {schedules.length === 0 ? (
        <p className={styles.emptyText}>Nenhum agendamento encontrado.</p>
      ) : (
        <div className={styles.scheduleList}>
          {schedules.map((schedule) => (
            <div key={schedule.id} className={styles.scheduleItem}>
              <div className={styles.scheduleItemInfo}>
                <span className={styles.scheduleItemDate}>
                  {new Date(schedule.dateTime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                <span className={styles.scheduleItemLink}>
                  {schedule.enterpriseUrl?.title ||
                    schedule.enterpriseUrl?.url ||
                    "Link excluído"}
                </span>
              </div>
              <div className={styles.scheduleItemActions}>
                <span
                  className={`${styles.statusBadge} ${
                    schedule.active ? styles.active : styles.inactive
                  }`}
                >
                  {schedule.active ? "Ativo" : "Inativo"}
                </span>
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(schedule)}
                  type="button"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
