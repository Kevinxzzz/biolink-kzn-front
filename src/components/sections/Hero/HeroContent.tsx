import { FadeIn } from "@/components/animations/FadeIn";
import { HeroCTA } from "./HeroCTA";
import styles from "./Hero.module.scss";

export function HeroContent() {
  return (
    <div className={styles.inner}>
      <div className={styles.content}>
        <FadeIn delay={0}>
          <h1 className={styles.title}>
            Sua jornada para o topo <span>começa aqui.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={200}>
          <p className={styles.description}>
            Contas de eFootball premium para jogadores que buscam performance, 
            confiança e exclusividade. Eleve seu nível hoje mesmo.
          </p>
        </FadeIn>
        
        <HeroCTA />
      </div>
    </div>
  );
}
