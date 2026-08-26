"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeIn } from "@/components/animations/FadeIn";
import { FaqItem } from "./FaqItem";
import styles from "./Faq.module.scss";

const FAQ_DATA = [
  {
    question: "Como recebo a minha conta após a compra?",
    answer: "Assim que o pagamento é aprovado, nosso sistema automatizado envia os dados de acesso diretamente para o seu e-mail cadastrado em até 5 minutos. Junto com os dados, enviamos um tutorial passo a passo de como vincular a conta de forma segura."
  },
  {
    question: "É seguro comprar contas de eFootball?",
    answer: "Sim! Na KZN garantimos 100% de segurança. Todas as nossas contas passam por um rigoroso processo de verificação. Além disso, oferecemos suporte total durante o processo de transferência para o seu Konami ID."
  },
  {
    question: "Posso jogar em qualquer plataforma (Mobile/Console)?",
    answer: "Depende da conta. A maioria das nossas contas é focada no Mobile, mas sempre especificamos na descrição se a conta possui vínculo disponível para consoles (PlayStation/Xbox/PC). Sempre verifique as informações na página da conta antes de comprar."
  },
  {
    question: "E se eu tiver problemas para acessar a conta?",
    answer: "Nosso suporte VIP funciona 24/7. Caso você tenha qualquer dificuldade no acesso ou na vinculação da conta, basta entrar em contato através dos nossos canais oficiais (WhatsApp ou E-mail) que resolveremos imediatamente."
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Aceitamos Pix (com aprovação imediata), Cartão de Crédito em até 12x (processado via Stripe/Mercado Pago) e Boleto Bancário (pode levar até 2 dias úteis para compensação)."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionWrapper id="faq">
      <div className={styles.header}>
        <FadeIn>
          <h2 className={styles.title}>Dúvidas Frequentes</h2>
          <p className={styles.subtitle}>
            Tudo o que você precisa saber sobre nosso processo de compra, 
            segurança e entrega.
          </p>
        </FadeIn>
      </div>

      <div className={styles.list}>
        {FAQ_DATA.map((item, index) => (
          <FadeIn key={index} delay={index * 100}>
            <FaqItem
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
