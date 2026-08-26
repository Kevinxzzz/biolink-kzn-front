import { SectionWrapper } from "@/components/ui/SectionWrapper";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <SectionWrapper as="div">
        <div className={styles.inner}>
          <a href="#" className={styles.logo} aria-label="KZN">
            K<span className={styles.logoAccent}>Z</span>N
          </a>
          
          <div className={styles.links}>
            <a href="#influencers" className={styles.link}>Influenciadores</a>
            <a href="#benefits" className={styles.link}>Benefícios</a>
            <a href="#about" className={styles.link}>Sobre Nós</a>
            <a href="#faq" className={styles.link}>FAQ</a>
            <a href="#" className={styles.link}>Termos de Uso</a>
            <a href="#" className={styles.link}>Privacidade</a>
          </div>
        </div>
        
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} KZN. Todos os direitos reservados.
        </p>
      </SectionWrapper>
    </footer>
  );
}
