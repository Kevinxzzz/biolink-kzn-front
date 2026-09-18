"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";
import type { Influencer } from "@/types/influencerType";
import styles from "@/app/(dashboard)/dashboard/influencers/influencers.module.scss";

interface InfluencerCardProps {
  influencer: Influencer;
  isOwner: boolean;
  onEdit: (inf: Influencer) => void;
  onDelete: (inf: Influencer) => void;
}

export function InfluencerCard({ influencer, isOwner, onEdit, onDelete }: InfluencerCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async () => {
    const urlToCopy = influencer.personalUrl || `${window.location.origin}/${influencer.slug}`;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedId(influencer.id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("URL copiada para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar URL.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {influencer.urlImgProfile ? <img src={influencer.urlImgProfile} alt={influencer.name} /> : influencer.name.charAt(0)}
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h3 className={styles.name}>{influencer.name}</h3>
            {influencer.email && <span className={styles.email}>{influencer.email}</span>}
          </div>
        </div>

        {isOwner && (
          <div className={styles.actions}>
            <button
              className={`${styles.iconButton} ${styles.editButton}`}
              onClick={() => onEdit(influencer)}
              title="Editar"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
            <button
              className={`${styles.iconButton} ${styles.deleteButton}`}
              onClick={() => onDelete(influencer)}
              title="Excluir"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.linkSection}>
          <span className={styles.linkSectionLabel}>Link Pessoal</span>
          <div className={styles.publicLinkBox}>
            <div className={styles.publicLinkUrl}>
              <span>{influencer.personalUrl}</span>
            </div>
            <button
              className={`${styles.copyBtn} ${copiedId === influencer.id ? styles.copied : ""}`}
              onClick={handleCopyLink}
              type="button"
            >
              {copiedId === influencer.id ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  Copiar link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
              <path d="M13 13l6 6" />
            </svg>
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Total de Cliques</span>
            <span className={styles.metricValue}>{(influencer.counterEntries || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
