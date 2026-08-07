import { HeroContent } from "./HeroContent";
import styles from "./Hero.module.scss";

export function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
      <HeroContent />
    </section>
  );
}
