"use client";

import { SharedModal } from "../SharedModal";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false,
  isLoading = false
}: ConfirmDialogProps) {
  return (
    <SharedModal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} title={title} size="small">
      <div className={styles.container}>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose} 
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmButton} ${isDestructive ? styles.destructive : styles.primary}`} 
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <span className={styles.spinner} /> : confirmText}
          </button>
        </div>
      </div>
    </SharedModal>
  );
}
