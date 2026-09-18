import styles from "@/app/(dashboard)/dashboard/invitations/invitations.module.scss";

interface InvitationsHeaderProps {
  onOpenCreateModal: () => void;
}

export function InvitationsHeader({ onOpenCreateModal }: InvitationsHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <p className={styles.pageDescription}>
        Gere e gerencie convites para adicionar membros à sua empresa.
      </p>
      <button className={styles.createButton} onClick={onOpenCreateModal} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Gerar convite
      </button>
    </div>
  );
}
