"use client";

import styles from "./LinksHeader.module.scss";

interface LinksHeaderProps {
  onAddLink: () => void;
}

export function LinksHeader({ onAddLink }: LinksHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <p className={styles.pageDescription}>
        Crie, edite e reordene os links da sua empresa.
      </p>
      <button className={styles.createButton} onClick={onAddLink} type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Adicionar Link
      </button>
    </div>
  );
}
