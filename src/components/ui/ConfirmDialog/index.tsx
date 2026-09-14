"use client";

import { SharedModal } from "../SharedModal";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isDangerous?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
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
  isDangerous,
  isLoading = false,
  onCancel,
}: ConfirmDialogProps) {
  const handleClose = onClose ?? onCancel ?? (() => {});
  const isDestructiveAction = isDestructive || !!isDangerous;

  return (
    <SharedModal isOpen={isOpen} onClose={isLoading ? () => {} : handleClose} title={title} size="small">
      <div className={styles.container}>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose} 
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmButton} ${isDestructiveAction ? styles.destructive : styles.primary}`} 
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
