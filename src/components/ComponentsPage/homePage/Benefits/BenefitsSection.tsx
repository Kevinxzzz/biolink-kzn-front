import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeIn } from "@/components/animations/FadeIn";
import { BenefitsTabs } from "./BenefitsTabs";
import styles from "./Benefits.module.scss";

const BENEFITS_DATA = [
  {
    id: "performance",
    title: "Alta Performance",
    subtitle: "Contas com os melhores jogadores",
    description: "Nossas contas já vêm equipadas com os jogadores mais meta do jogo, permitindo que você jogue no mais alto nível competitivo desde o primeiro dia.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    )
  },
  {
    id: "security",
    title: "Entrega Segura",
    subtitle: "Transferência 100% garantida",
    description: "Sistema automatizado e seguro de transferência de contas. Suporte dedicado para garantir que você tenha acesso rápido e sem riscos ao seu novo time.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    )
  },
  {
    id: "support",
    title: "Suporte VIP",
    subtitle: "Atendimento 24/7 especializado",
    description: "Dúvidas ou problemas? Nossa equipe de suporte está pronta para te ajudar a qualquer momento. Você nunca ficará na mão.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09l2.846.813-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    )
  }
];

export function BenefitsSection() {
  return (
    <SectionWrapper id="benefits">
      <div className={styles.header}>
        <FadeIn>
          <h2 className={styles.title}>Por que comprar conosco?</h2>
          <p className={styles.subtitle}>
            Oferecemos uma experiência premium do momento da escolha 
            até o momento em que você entra em campo.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={200}>
        <BenefitsTabs benefits={BENEFITS_DATA} />
      </FadeIn>
    </SectionWrapper>
  );
}
