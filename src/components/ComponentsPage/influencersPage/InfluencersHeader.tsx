import styles from "@/app/(dashboard)/dashboard/influencers/influencers.module.scss";

interface InfluencersHeaderProps {
  onOpenCreateModal: () => void;
}

export function InfluencersHeader({ onOpenCreateModal }: InfluencersHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <p className={styles.pageDescription}>Acompanhe e gerencie os influenciadores associados à sua empresa.</p>
        <button
          onClick={onOpenCreateModal}
          type="button"
          className={styles.createButton}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem",
            fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: "var(--accent-primary)",
            border: "none", borderRadius: "9999px", cursor: "pointer"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar influenciador
        </button>
      </div>
    </div>
  );
}
