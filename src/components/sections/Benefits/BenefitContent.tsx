import styles from "./Benefits.module.scss";

interface BenefitContentProps {
  title: string;
  description: string;
  isActive: boolean;
}

export function BenefitContent({ title, description, isActive }: BenefitContentProps) {
  return (
    <div
      className={`${styles.contentInner} ${isActive ? styles.active : ""}`}
      role="tabpanel"
      aria-hidden={!isActive}
    >
      <h3 className={styles.contentTitle}>{title}</h3>
      <p className={styles.contentDescription}>{description}</p>
      
      {/* Abstract decorative illustration for each benefit */}
      <div className={styles.illustration} aria-hidden="true" />
    </div>
  );
}
