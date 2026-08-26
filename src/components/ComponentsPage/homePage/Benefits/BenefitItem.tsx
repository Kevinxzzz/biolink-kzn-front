import { forwardRef } from "react";
import styles from "./Benefits.module.scss";

interface BenefitItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const BenefitItem = forwardRef<HTMLButtonElement, BenefitItemProps>(
  function BenefitItem({ title, subtitle, icon, isActive, onClick }, ref) {
    return (
      <button
        ref={ref}
        className={`${styles.tabItem} ${isActive ? styles.active : ""}`}
        onClick={onClick}
        role="tab"
        aria-selected={isActive}
        type="button"
      >
        <div className={styles.iconWrapper}>
          {icon}
        </div>
        <div className={styles.tabText}>
          <span className={styles.tabTitle}>{title}</span>
          <span className={styles.tabSubtitle}>{subtitle}</span>
        </div>
      </button>
    );
  }
);
