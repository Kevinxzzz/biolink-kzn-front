"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import styles from "./ComingSoon.module.scss";

export interface ComingSoonProps {
  title?: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

function DefaultSparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export function ComingSoon({
  title = "Conteúdo disponível em breve",
  description = "Estamos preparando novidades e funcionalidades incríveis para esta seção. Fique atento!",
  badge = "Em desenvolvimento",
  icon,
  action,
  className = "",
}: ComingSoonProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.glowBackground} aria-hidden="true" />

      {badge && (
        <span className={styles.badge}>
          <span>✨</span>
          <span>{badge}</span>
        </span>
      )}

      <div className={styles.iconWrapper}>
        {icon || <DefaultSparkleIcon />}
      </div>

      <h2 className={styles.title}>{title}</h2>

      {description && <p className={styles.description}>{description}</p>}

      {action && (
        <>
          {action.href ? (
            <Link href={action.href} className={styles.actionButton}>
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              className={styles.actionButton}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}
