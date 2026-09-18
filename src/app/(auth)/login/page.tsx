"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/ComponentsPage/authPages/loginPage";
import styles from "./login.module.scss";

export default function LoginPage() {
  return (
    <AuthLayout
      footerText="Não tem uma conta?"
      footerLinkText="Criar conta"
      footerLinkHref="/register"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre na sua conta para continuar</p>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
