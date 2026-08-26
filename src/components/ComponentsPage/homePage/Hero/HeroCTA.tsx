import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { linkService } from "@/service/linkService";
import styles from "./Hero.module.scss";

export function HeroCTA() {
  return (
    <FadeIn delay={400} className={styles.cta}>
      <ButtonLink href={linkService.getEfootballRedirectUrl()} variant="primary" size="lg">
        Entrar no Grupo
      </ButtonLink>
      <ButtonLink href="#benefits" variant="ghost" size="lg">
        Ver Benefícios
      </ButtonLink>
    </FadeIn>
  );
}
