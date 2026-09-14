"use client";

import { useState, useEffect } from "react";
import { usePublicCategories } from "@/hooks/useCategories";
import { linkService } from "@/service/linkService";
import styles from "./CategorySelectionModal.module.scss";

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategorySelectionModal({ isOpen, onClose }: CategorySelectionModalProps) {
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
    window.location.assign(linkService.getRedirectUrl(categoryId));
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Exclusivo e Tipograficamente Forte */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 id="category-modal-title" className={styles.title}>
              Escolha seu segmento
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
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>Nenhuma categoria disponível no momento.</p>
            </div>
          )}

          {!isLoading && !error && categories.length > 0 && (
            <div className={styles.selectionGrid}>
              {categories.map((category) => {
                const isSelected = selectedId === category.id;
                
                return (
                  <button
                    key={category.id}
                    className={`${styles.categoryCard} ${isSelected ? styles.categoryCardSelected : ""}`}
                    onClick={() => handleSelect(category.id)}
                    disabled={!!selectedId} // Desabilita todos se algum for selecionado
                    aria-pressed={isSelected}
                  >
                    <div className={styles.categoryInfo}>
                      <h3 className={styles.categoryName}>
                        {category.name}
                      </h3>
                    </div>
                    
                    {isSelected ? (
                      <div className={styles.loadingLabel} aria-live="polite">
                        <span>Redirecionando...</span>
                        <div className={styles.smallSpinner} />
                      </div>
                    ) : (
                      <svg className={styles.arrowIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
