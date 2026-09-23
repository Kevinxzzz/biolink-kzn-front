"use client";

import { useState, useEffect } from "react";
import { usePublicCategories } from "@/hooks/category/useCategories";
import { linkService } from "@/service/linkService";
import styles from "./CategorySelectionModal.module.scss";

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencerSlug?: string;
}

// Decorative hexagonal icon — purely visual, no semantic meaning
function HexIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon
        points="14,2 24,7.5 24,20.5 14,26 4,20.5 4,7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(139,92,246,0.08)"
      />
      <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function CategorySelectionModal({ isOpen, onClose, influencerSlug }: CategorySelectionModalProps) {
  const { categories, isLoading, error } = usePublicCategories();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fix Back/Forward Cache issue where state remains stuck
  useEffect(() => {
    const handlePageShow = () => {
      setSelectedId(null);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setSelectedId(null);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!isOpen) return null;

  const handleSelect = (categoryId: string) => {
    if (selectedId) return; // Previne múltiplos cliques
    setSelectedId(categoryId);
    window.location.assign(linkService.getRedirectUrl(categoryId, influencerSlug));
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Aurora Background — decorativo */}
        <div className={styles.auroraBackground} aria-hidden="true">
          <div className={`${styles.auroraBlob} ${styles.auroraBlobPrimary}`} />
          <div className={`${styles.auroraBlob} ${styles.auroraBlobSecondary}`} />
          <div className={styles.auroraNoise} />
          <div className={styles.auroraGlow} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.titleGroup}>
              {/* Badge decorativo acima do título */}
              <div className={styles.titleBadge} aria-hidden="true">
                <span className={styles.titleBadgeDot} />
                Selecione abaixo
              </div>

              <h2 id="category-modal-title" className={styles.title}>
                Escolha seu{" "}
                <span className={styles.titleAccent}>segmento</span>
              </h2>
              <p className={styles.description}>
                Selecione a categoria para continuar o acesso.
              </p>
            </div>

            <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.divider} aria-hidden="true" />
        </div>

        {/* Área Principal */}
        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Carregando comunidades disponíveis...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className={styles.errorState} role="alert">
              Não foi possível carregar as categorias no momento. Tente novamente mais tarde.
            </div>
          )}

          {!isLoading && !error && categories.length === 0 && (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>Nenhuma categoria disponível no momento.</p>
            </div>
          )}

          {!isLoading && !error && categories.length > 0 && (
            <div className={styles.selectionGrid}>
              {categories.map((category, index) => {
                const isSelected = selectedId === category.id;
                // Zero-padded order number — purely decorative

                return (
                  <button
                    key={category.id}
                    className={`${styles.categoryCard} ${isSelected ? styles.categoryCardSelected : ""}`}
                    onClick={() => handleSelect(category.id)}
                    disabled={!!selectedId}
                    aria-pressed={isSelected}
                  >


                    <div className={styles.categoryInfo}>
                      {/* Ícone geométrico decorativo */}
                      <div className={styles.categoryIcon}>
                        <HexIcon />
                      </div>

                      <h3 className={styles.categoryName}>
                        {isSelected ? "Redirecionando..." : category.name}
                      </h3>
                    </div>

                    {isSelected ? (
                      <div className={styles.loadingLabel} aria-live="polite">
                        <div className={styles.smallSpinner} />
                      </div>
                    ) : (
                      <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
