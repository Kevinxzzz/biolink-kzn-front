import { Button, ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import styles from "./Hero.module.scss";

interface HeroCTAProps {
  onOpenCategoryModal?: () => void;
}

export function HeroCTA({ onOpenCategoryModal }: HeroCTAProps) {
  return (
    <FadeIn delay={400} className={styles.cta}>
      <Button 
        variant="primary" 
        size="lg" 
        onClick={onOpenCategoryModal}
      >
        Entrar no Grupo
      </Button>
      <ButtonLink href="#benefits" variant="ghost" size="lg">
        Ver Benefícios
      </ButtonLink>
    </FadeIn>
  );
}
