import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import styles from "./TermosDeUso.module.scss";

export const metadata: Metadata = {
  title: "Termos de Uso | KZN GG",
  description: "Termos de Uso da plataforma KZN GG.",
};

export default function TermosDeUso() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Termos de Uso</h1>
        <p className={styles.lastUpdate}>Última atualização: [PREENCHER DATA]</p>

        <div className={styles.content}>
          <div className={styles.warningBox}>
            <p>
              ⚠️ AVISO INTERNO: Este documento é um modelo funcional baseado na
              arquitetura da plataforma. Ele deve ser obrigatoriamente REVISADO e
              VALIDADO pelo departamento jurídico antes da operação em produção.
            </p>
          </div>

          <h2>1. Sobre a Plataforma</h2>
          <p>
            A <strong>[PREENCHER NOME DA EMPRESA OU KZN GG]</strong> inscrita no CNPJ sob o n.º 
            <strong> [PREENCHER CNPJ]</strong>, com sede em <strong>[PREENCHER ENDEREÇO]</strong>, 
            oferece uma plataforma corporativa ("Plataforma") de gerenciamento de links, 
            permitindo a organização de campanhas, agregação de influenciadores e direcionamento de tráfego.
          </p>
          <p>
            Ao utilizar a Plataforma, seja como cliente que administra campanhas (Usuário Administrativo) 
            ou como visitante que acessa as páginas públicas, você concorda com estes Termos de Uso.
          </p>

          <h2>2. Cadastro e Conta (Para Usuários Administrativos)</h2>
          <p>
            Para administrar campanhas e influenciadores, é necessária a criação de uma conta corporativa vinculada 
            a uma empresa na Plataforma. O cliente é inteiramente responsável por:
          </p>
          <ul>
            <li>Manter o sigilo e a segurança de suas credenciais de acesso.</li>
            <li>Fornecer informações verdadeiras e atualizadas durante o cadastro.</li>
            <li>Todas as ações realizadas a partir de sua conta, incluindo atividades de usuários convidados ou administradores adicionais.</li>
          </ul>

          <h2>3. Responsabilidade sobre Conteúdo e Links</h2>
          <p>
            A Plataforma permite a inclusão de URLs externas, imagens e textos nas campanhas. 
            <strong>A KZN não controla, não modera previamente e não garante a procedência ou legalidade do conteúdo hospedado em sites de terceiros.</strong>
          </p>
          <p>
            É dever exclusivo do cliente garantir que:
          </p>
          <ul>
            <li>Possui os direitos autorais, autorizações de imagem e propriedades intelectuais necessárias para utilizar as imagens, logos, marcas e nomes (incluindo de influenciadores) cadastrados na Plataforma.</li>
            <li>Os links adicionados não direcionam para conteúdos ilícitos, fraudulentos, maliciosos ou que violem a legislação brasileira.</li>
          </ul>
          <p>
            A KZN reserva-se o direito de, a qualquer momento e sem aviso prévio, remover conteúdos ou bloquear links que, a seu exclusivo critério, violem estes Termos ou representem risco à segurança da Plataforma ou de seus usuários.
          </p>

          <h2>4. Uso Adequado da Plataforma</h2>
          <p>É expressamente proibido ao utilizar nossos serviços:</p>
          <ul>
            <li>Tentar explorar vulnerabilidades, realizar ataques de negação de serviço (DDoS) ou interferir na infraestrutura técnica.</li>
            <li>Manipular os mecanismos de rotação de links, cliques ou métricas de forma automatizada (ex: bots, scrapers).</li>
            <li>Utilizar a Plataforma para envio de spam, distribuição de malware ou esquemas de fraude.</li>
          </ul>

          <h2>5. Métricas e Rotações de Tráfego</h2>
          <p>
            A Plataforma fornece funcionalidades de rotação automática de tráfego baseadas em limites de cliques, 
            agendamentos e temporizadores, além da exibição de contadores e estatísticas no dashboard.
          </p>
          <p>
            Embora nos esforcemos para garantir a precisão de nossos sistemas, <strong>as métricas e direcionamentos possuem natureza estimativa</strong> e estão sujeitas a limitações técnicas, 
            caches de rede, firewalls e provedores externos. A KZN não garante 100% de precisão milimétrica na exatidão de cliques bloqueados ou computados simultaneamente.
          </p>

          <h2>6. Disponibilidade e Manutenção</h2>
          <p>
            A Plataforma é fornecida "no estado em que se encontra" (as is). Esforçamo-nos para manter o sistema operante e contínuo, 
            mas não garantimos que a Plataforma estará disponível 100% do tempo.
          </p>
          <p>
            Interrupções temporárias podem ocorrer para manutenções programadas, atualizações de segurança ou falhas em provedores de nuvem de terceiros.
          </p>

          <h2>7. Alterações nestes Termos</h2>
          <p>
            Estes Termos de Uso poderão ser modificados a qualquer momento. Em caso de alterações significativas, 
            os clientes administrativos serão notificados através de avisos no dashboard ou por e-mail.
          </p>

          <h2>8. Contato e Foro</h2>
          <p>
            Em caso de dúvidas sobre estes Termos, entre em contato através de: <strong>[PREENCHER E-MAIL DE CONTATO, ex: contato@kzn.gg]</strong>.
          </p>
          <p>
            [VALIDAR JURIDICAMENTE] Fica eleito o foro da Comarca de <strong>[PREENCHER CIDADE/ESTADO]</strong> para dirimir quaisquer 
            controvérsias oriundas da utilização da Plataforma, com renúncia expressa a qualquer outro.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
