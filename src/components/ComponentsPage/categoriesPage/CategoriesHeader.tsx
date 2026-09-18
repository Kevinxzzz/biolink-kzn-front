import styles from "@/app/(dashboard)/dashboard/categories/categories.module.scss";

interface CategoriesHeaderProps {
  onOpenCreateModal: () => void;
}

export function CategoriesHeader({ onOpenCreateModal }: CategoriesHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <p className={styles.pageDescription}>
        Crie, edite e organize as categorias da sua empresa.
      </p>
      <button className={styles.createButton} onClick={onOpenCreateModal} type="button">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Adicionar Categoria
      </button>
    </div>
  );
}
