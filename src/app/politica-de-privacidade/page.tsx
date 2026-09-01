import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import styles from "./PoliticaDePrivacidade.module.scss";

export const metadata: Metadata = {
  title: "Política de Privacidade | KZN GG",
  description: "Política de Privacidade da plataforma KZN GG.",
};

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Política de Privacidade</h1>
        <p className={styles.lastUpdate}>Última atualização: 31/08/2026</p>

        <div className={styles.content}>


          <p>
            A privacidade e a proteção de dados pessoais são pilares fundamentais da
            <strong> KZN </strong> ("nós", "nosso", "Plataforma").
          </p>
          <p>
            Esta Política de Privacidade foi elaborada em conformidade com a Lei Geral de
            Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) e explica como lidamos com os dados de
            nossos Usuários Administrativos (empresas e influenciadores cadastrados) e as práticas relacionadas
            aos Visitantes Finais (público que interage com as campanhas e links).
          </p>

          <h2>1. Escopo de Atuação (Controlador e Operador)</h2>
          <p>Para fins da LGPD, esclarecemos nossos diferentes papéis no tratamento de dados:</p>
          <ul>
            <li>
              <strong>Para Usuários Administrativos:</strong> [VALIDAR JURIDICAMENTE] A KZN atua como <strong>Controladora</strong>
              em relação aos dados cadastrais fornecidos pelas empresas, funcionários e influenciadores no momento do registro na Plataforma.
            </li>
            <li>
              <strong>Para Visitantes Finais (Cliques em Campanhas):</strong> [VALIDAR JURIDICAMENTE] A KZN atua primordialmente na posição de
              <strong>Operadora</strong>, fornecendo a infraestrutura tecnológica para que o cliente (empresa controladora) direcione seu público.
            </li>
          </ul>

          <h2>2. Dados Coletados</h2>

          <h3>2.1. Dados de Usuários Administrativos e Influenciadores</h3>
          <p>Ao se cadastrar na Plataforma para utilizar os serviços, coletamos ativamente os seguintes dados fornecidos por você:</p>
          <ul>
            <li>Nome completo ou corporativo;</li>
            <li>Endereço de e-mail corporativo;</li>
            <li>Senha (armazenada de forma criptografada);</li>
            <li>Número de telefone associado à empresa;</li>
            <li>Informações e links de perfis em plataformas de terceiros (quando aplicável ao perfil do influenciador).</li>
          </ul>

          <h3>2.2. Interações de Visitantes Finais</h3>
          <p>
            Quando o público interage com os links (Biolinks) administrados pelos clientes na nossa Plataforma, o sistema de redirecionamento foca
            em contabilizar métricas puramente quantitativas para garantir o funcionamento adequado da rotação de links.
          </p>
          <p>
            Com base na implementação atual da plataforma:
          </p>
          <ul>
            <li>Não mantemos rotinas próprias na aplicação para armazenamento ou identificação de IP, localização exata ou rastreamento cruzado de dispositivo individual do visitante.</li>
            <li>São processadas apenas métricas agregadas (ex: volume de cliques diários, cliques por categoria de campanha).</li>
          </ul>

          <h2>3. Finalidades e Bases Legais</h2>
          <p>[VALIDAR JURIDICAMENTE] Os dados pessoais coletados são utilizados unicamente para as seguintes finalidades, amparadas pela legislação:</p>
          <ul>
            <li><strong>Execução de Contrato e Diligências Preliminares:</strong> Criação, autenticação de conta, manutenção técnica da Plataforma, suporte técnico e gestão dos serviços contratados.</li>
            <li><strong>Legítimo Interesse:</strong> Geração de estatísticas agregadas de desempenho, monitoramento de saúde do sistema e prevenção de fraudes operacionais ou abusos automatizados.</li>
            <li><strong>Obrigação Legal:</strong> Guarda de registros de acesso quando legalmente exigível por provedores de nuvem ou requisições de autoridades judiciais.</li>
          </ul>

          <h2>4. Armazenamento e Compartilhamento de Dados</h2>
          <p>
            Seus dados cadastrais ficam armazenados em infraestrutura de nuvem segura mantida por provedores tecnológicos qualificados (servidores de hospedagem, bancos de dados e serviços de cache temporário).
          </p>
          <p>
            Não comercializamos, alugamos ou compartilhamos dados pessoais com anunciantes. O compartilhamento ocorre estritamente quando necessário com:
          </p>
          <ul>
            <li>Provedores de tecnologia que suportam a infraestrutura operacional da Plataforma.</li>
            <li>Autoridades públicas em cumprimento a ordens judiciais ou obrigações legais impostas à KZN.</li>
          </ul>

          <h2>5. Cookies e Tecnologias de Armazenamento</h2>
          <p>
            A KZN preza pelo mínimo armazenamento possível no navegador do usuário. De acordo com a configuração atual do sistema:
          </p>
          <ul>
            <li><strong>Para Usuários Administrativos:</strong> Utilizamos o `localStorage` do navegador exclusivamente para manter tokens criptografados essenciais (autenticação JWT) e preferências de interface (modo claro/escuro). Estes são estritamente necessários para a segurança e uso do dashboard.</li>
            <li><strong>Para Visitantes Finais:</strong> A área pública da Plataforma (redirecionamento de links) não injeta cookies próprios destinados ao rastreamento individual, remarketing ou criação de perfil comportamental do visitante.</li>
          </ul>
          <p>
            Ressaltamos que os links hospedados redirecionam para sites de terceiros, que por sua vez possuem suas próprias políticas de cookies.
          </p>

          <h2>6. Segurança da Informação</h2>
          <p>
            Empregamos medidas técnicas e organizacionais compatíveis com os padrões de mercado para proteger as contas e as métricas. Isso inclui criptografia de senhas, acesso segmentado, banco de dados segregado por lógicas de acesso e uso de cache rápido (Redis) para processamento volátil, protegendo os registros duradouros contra sobrecargas e ataques.
          </p>

          <h2>7. Direitos dos Titulares (LGPD)</h2>
          <p>
            Você, enquanto titular de dados (cliente da Plataforma), possui o direito de solicitar a qualquer momento:
          </p>
          <ul>
            <li>A confirmação da existência de tratamento de seus dados;</li>
            <li>Acesso e correção de dados incompletos, inexatos ou desatualizados diretamente pelo painel administrativo;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>A portabilidade de seus dados a outro fornecedor, mediante requisição expressa.</li>
          </ul>
          <p>
            Para exercer tais direitos, entre em contato através dos canais oficiais listados abaixo.
          </p>

          <h2>8. Retenção dos Dados</h2>
          <p>
            Manteremos as informações das contas e campanhas enquanto os clientes estiverem ativos.
            [PREENCHER / VALIDAR] Em caso de cancelamento da conta, os dados poderão ser retidos por
            um período adicional de <strong>[PREENCHER PRAZO]</strong> visando cumprimento de obrigações
            fiscais e legais, ou exercício regular de direitos em processos judiciais.
          </p>

          <h2>9. Contato do Encarregado (DPO)</h2>
          <p>
            Se você tiver dúvidas, reclamações ou desejar exercer seus direitos relacionados à privacidade, entre em contato com nosso Encarregado pelo Tratamento de Dados Pessoais (DPO):
          </p>
          <ul>
            <li><strong>Nome / Responsável:</strong> Kauã Vital da Silva</li>
            <li><strong>E-mail:</strong> kauavital96@gmail.com</li>
          </ul>

          <h2>10. Atualizações da Política</h2>
          <p>
            Reservamo-nos o direito de atualizar este documento periodicamente. Mudanças significativas que impactem o tratamento
            de seus dados pessoais serão previamente comunicadas por e-mail corporativo ou mediante aviso no dashboard.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
