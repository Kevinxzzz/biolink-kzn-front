"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeIn } from "@/components/animations/FadeIn";
import { FaqItem } from "./FaqItem";
import styles from "./Faq.module.scss";


const FAQ_DATA = [
  {
    question: "Como recebo a minha conta após a compra?",
    answer: "Assim que o pagamento é aprovado, nosso sistema verifica e envia os dados para o seu e-mail enviado durante o atendimento em até 5 minutos. Junto com os dados, enviamos um tutorial passo a passo de como vincular a conta de forma segura."
  },
  {
    question: "Vocês fazem trocas?",
    answer: "Sim, mas aceitando sua conta como uma parte do pagamento em outra melhor."
  },
  {
    question: "Compram contas com Play Games/ Game Center?",
    answer: "Não. Priorizamos a segurança de nossos clientes. Por isso, trabalhamos somente com contas que possuem vínculo exclusivo com a KONAMI ID."
  },
  {
    question: "Quais formas de pagamento?",
    answer: "Aceitamos Pix (com aprovação imediata), Cartão de Crédito em até 12x (processado via Stripe/Mercado Pago)."
  },
  {
    question: "Posso jogar em qualquer plataforma (Mobile/Console)?",
    answer: "Depende da conta. A maioria das nossas contas é focada no Mobile, mas sempre especificamos na descrição se a conta possui vínculo disponível para consoles (PlayStation/Xbox/PC). Sempre verifique as informações na página da conta antes de comprar."
  },
  {
    question: "E se eu tiver problemas para acessar a conta?",
    answer: "Caso tenha qualquer problema, dificuldade ou dúvida relacionada ao acesso da sua conta, você poderá contar com nosso suporte especializado para auxiliar em todo o processo e encontrar a solução para você."
  },
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
