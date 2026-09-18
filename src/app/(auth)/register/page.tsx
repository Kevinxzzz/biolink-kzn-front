import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterOptions, TokenForm } from "@/components/ComponentsPage/authPages/registerPage";
import styles from "./register.module.scss";

export default function RegisterPage() {
  return (
    <AuthLayout
      footerText="Já tem uma conta?"
      footerLinkText="Entrar"
      footerLinkHref="/login"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Criar conta</h1>
        <p className={styles.subtitle}>Escolha como deseja começar</p>

        <RegisterOptions />

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <TokenForm />
      </div>
    </AuthLayout>
  );
}
