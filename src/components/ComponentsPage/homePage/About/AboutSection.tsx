import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeIn } from "@/components/animations/FadeIn";
import { AboutCardDeck, AboutPillar } from "./AboutCardDeck";
import styles from "./About.module.scss";

const ABOUT_PILLARS: AboutPillar[] = [
  {
    id: "missao",
    number: "01",
    tag: "Propósito",
    title: "Missão",
    description:
      "Entregar contas de altíssimo nível para jogadores que buscam dominar o eFootball, garantindo segurança total e suporte excepcional em cada etapa.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
      </svg>
    ),
  },
  {
    id: "valores",
    number: "02",
    tag: "Compromisso",
    title: "Valores",
    description:
      "Transparência nas negociações, segurança dos dados dos nossos clientes e compromisso inabalável com a qualidade das contas que selecionamos.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: "objetivo",
    number: "03",
    tag: "Visão",
    title: "Objetivo",
    description:
      "Tornar a KZN a maior referência nacional em contas competitivas de eFootball, construindo a maior comunidade de jogadores de elite do Brasil.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
];

export function AboutSection() {
  return (
    <SectionWrapper id="about">
      <div className={styles.header}>
        <FadeIn>
          <h2 className={styles.title}>Quem somos</h2>
          <p className={styles.subtitle}>
            A KZN nasceu da paixão pelo eFootball e do desejo de proporcionar 
            as melhores contas do cenário competitivo.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={150}>
        <AboutCardDeck pillars={ABOUT_PILLARS} />
      </FadeIn>
    </SectionWrapper>
  );
}
