"use client";

import styles from "./SubTitleDashboard.module.scss";

export interface SubTitleDashboardProps {
  subtitle: string;
  description?: string;
  className?: string;
}

export function SubTitleDashboard({
  subtitle,
  description,
  className = "",
}: SubTitleDashboardProps) {
  return (
    <div className={`${styles.header} ${className}`}>
      <h2 className={styles.subtitle}>{subtitle}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
