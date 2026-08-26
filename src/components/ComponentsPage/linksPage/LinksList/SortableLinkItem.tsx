"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Link } from "@/types/linkType";
import styles from "./LinksList.module.scss";

interface SortableLinkItemProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
  onActivate: (link: Link) => void;
}

export function SortableLinkItem({
  link,
  onEdit,
  onDelete,
  onActivate,
}: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.linkItem}>
      <div className={styles.dragHandle} {...attributes} {...listeners} aria-label="Arrastar para reordenar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>

      <div className={styles.linkContent}>
        <div className={styles.linkInfo}>
          <div className={styles.linkTitle}>
            <span>{link.title}</span>
            {link.active && <span className={styles.activeBadge}>Ativo Agora</span>}
            {!link.inRotationPool && (
              <span className={styles.notInPoolBadge} title="Contrato API">
                (Não está no pool)
              </span>
            )}
          </div>
          <div className={styles.linkUrl}>{link.url}</div>
        </div>

        <div className={styles.linkMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Cliques</span>
            <span className={styles.metricValue}>
              {(link.countClicks || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {!link.active && link.inRotationPool && (
          <button
            className={`${styles.iconButton} ${styles.activateButton}`}
            onClick={() => onActivate(link)}
            title="Ativar Link"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}
        <button
          className={`${styles.iconButton} ${styles.editButton}`}
          onClick={() => onEdit(link)}
          title="Editar"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button
          className={`${styles.iconButton} ${styles.deleteButton}`}
          onClick={() => onDelete(link)}
          title="Excluir"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
