import Link from "next/link";
import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <SectionWrapper as="div">
        <div className={styles.inner}>
          <a href="#" className={styles.logo} aria-label="KZN">
            <Image
              src="/logos/KZN-ROXO.png"
              alt="KZN"
              width={120}
              height={51}
              className={styles.logoImage}
            />
          </a>
          
          <div className={styles.links}>
            <a href="#influencers" className={styles.link}>Influenciadores</a>
            <a href="#benefits" className={styles.link}>Benefícios</a>
            <a href="#about" className={styles.link}>Sobre Nós</a>
            <a href="#faq" className={styles.link}>FAQ</a>
            <Link href="/termos-de-uso" className={styles.link}>Termos de Uso</Link>
            <Link href="/politica-de-privacidade" className={styles.link}>Privacidade</Link>
          </div>
        </div>
        
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} KZN. Todos os direitos reservados.
        </p>
      </SectionWrapper>
    </footer>
  );
}
