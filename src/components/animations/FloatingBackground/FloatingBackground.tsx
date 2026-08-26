import styles from "./FloatingBackground.module.scss";

export function FloatingBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.noise} />
      <div className={`${styles.blob} ${styles.blobPrimary}`} />
      <div className={`${styles.blob} ${styles.blobSecondary}`} />
      <div className={`${styles.blob} ${styles.blobAccent}`} />
    </div>
  );
}
