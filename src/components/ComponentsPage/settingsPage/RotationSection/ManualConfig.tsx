"use client";

import styles from "./RotationSection.module.scss";

export function ManualConfig() {
  return (
    <div className={styles.manualBox}>
      <div className={styles.manualBadge}>
        <span>📌 Modo Manual Ativo</span>
      </div>
      <p className={styles.manualText}>
        No modo manual, os links mantêm o estado definido por você. A rotação automática
        fica desativada e você altera o link ativo quando desejar diretamente no gerenciador.
      </p>
    </div>
  );
}
