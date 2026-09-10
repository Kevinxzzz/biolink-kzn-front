import { useQuery } from "@tanstack/react-query";
import { SharedModal } from "../SharedModal";
import { categoryService } from "@/service/categoryService";
import { linkService } from "@/service/linkService";
import styles from "./PublicCategoryModal.module.scss";

interface PublicCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublicCategoryModal({ isOpen, onClose }: PublicCategoryModalProps) {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: () => categoryService.getPublicCategories(),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const handleCategoryClick = (categoryId: string) => {
    window.location.assign(linkService.getRedirectUrl(categoryId));
  };

  return (
    <SharedModal isOpen={isOpen} onClose={onClose} title="Selecione uma Categoria" size="small">
      <div className={styles.container}>
        {isLoading && <p className={styles.message}>Carregando categorias...</p>}
        
        {isError && <p className={`${styles.message} ${styles.error}`}>Erro ao carregar categorias. Tente novamente mais tarde.</p>}
        
        {!isLoading && !isError && (!categories || categories.length === 0) && (
          <p className={styles.message}>Nenhuma categoria disponível no momento.</p>
        )}
        
        {!isLoading && !isError && categories && categories.length > 0 && (
          <ul className={styles.list}>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button 
                  className={styles.categoryButton} 
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SharedModal>
  );
}
