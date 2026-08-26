import styles from "./Benefits.module.scss";

interface BenefitContentProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  isActive: boolean;
}

export function BenefitContent({
  title,
  subtitle,
  description,
  icon,
  isActive,
}: BenefitContentProps) {
  return (
    <div
      className={`${styles.contentInner} ${isActive ? styles.active : ""}`}
      role="tabpanel"
      aria-hidden={!isActive}
    >
      {/* Ambient background glow & subtle watermark behind text */}
      <div className={styles.cardGlow} aria-hidden="true">
        {icon && <div className={styles.watermarkIcon}>{icon}</div>}
      </div>

      {/* Main content body */}
      <div className={styles.contentBody}>
        {subtitle && (
          <span className={styles.contentBadge}>{subtitle}</span>
        )}
        <h3 className={styles.contentTitle}>{title}</h3>
        <p className={styles.contentDescription}>{description}</p>
      </div>
    </div>
  );
}
