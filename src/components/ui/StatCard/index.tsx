"use client";

import { type ReactNode } from "react";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
}

export function StatCard({ title, value, icon, trend, trendLabel }: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      
      <div className={styles.value}>{value}</div>
      
      {trend !== undefined && (
        <div className={styles.trend}>
          <span
            className={`${isPositive ? styles.trendPositive : ""} ${isNegative ? styles.trendNegative : ""}`}
          >
            <span className={styles.trendIcon}>
              {isPositive ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              ) : isNegative ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                  <polyline points="16 17 22 17 22 11" />
                </svg>
              ) : null}
            </span>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
