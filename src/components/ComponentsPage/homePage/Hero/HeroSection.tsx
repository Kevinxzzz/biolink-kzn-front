import { HeroContent } from "./HeroContent";
import styles from "./Hero.module.scss";

interface HeroSectionProps {
  onOpenCategoryModal?: () => void;
}

export function HeroSection({ onOpenCategoryModal }: HeroSectionProps) {
  return (
    <section className={styles.hero} id="hero">
      <HeroContent onOpenCategoryModal={onOpenCategoryModal} />
    </section>
  );
}
