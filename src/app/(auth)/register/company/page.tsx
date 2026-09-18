import { AuthLayout } from "@/components/layout/AuthLayout";
import { CompanyRegisterForm } from "@/components/ComponentsPage/authPages/registerCompanyPage";
import styles from "./company.module.scss";

export default function RegisterCompanyPage() {
  return (
    <AuthLayout
      footerText="Já tem uma conta?"
      footerLinkText="Entrar"
      footerLinkHref="/login"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Criar empresa</h1>
        <p className={styles.subtitle}>Registre sua empresa e comece a gerenciar seus links</p>
        <CompanyRegisterForm />
      </div>
    </AuthLayout>
  );
}
