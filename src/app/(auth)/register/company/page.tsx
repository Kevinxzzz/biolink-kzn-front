"use client";

import { useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { useRegisterCompany } from "@/hooks/useRegisterCompany";
import styles from "./company.module.scss";

export default function RegisterCompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { register, status, error, isLoading } = useRegisterCompany();

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!companyName.trim()) errors.companyName = "Nome da empresa é obrigatório.";
    if (!companyEmail.trim()) errors.companyEmail = "Email da empresa é obrigatório.";
    if (!userName.trim()) errors.userName = "Seu nome é obrigatório.";
    if (!userEmail.trim()) errors.userEmail = "Seu email é obrigatório.";
    if (!userPassword) errors.userPassword = "Senha é obrigatória.";
    if (userPassword.length > 0 && userPassword.length < 6) errors.userPassword = "Senha deve ter no mínimo 6 caracteres.";
    if (userPassword !== userConfirmPassword) errors.userConfirmPassword = "As senhas não coincidem.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        company: { name: companyName, email: companyEmail, phone: companyPhone },
        user: { name: userName, email: userEmail, password: userPassword, confirmPassword: userConfirmPassword },
      });
    } catch {
      // error is handled by the hook
    }
  };

  return (
    <AuthLayout
      footerText="Já tem uma conta?"
      footerLinkText="Entrar"
      footerLinkHref="/login"
    >
      <div className={styles.page}>
        <h1 className={styles.title}>Criar empresa</h1>
        <p className={styles.subtitle}>Registre sua empresa e comece a gerenciar seus links</p>

        {status === "error" && error && (
          <div className={`${styles.alert} ${styles.alertError}`} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {status === "success" && (
          <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Empresa criada com sucesso! Redirecionando...</span>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Section: Company */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className={styles.sectionTitle}>Dados da empresa</h2>
            </div>

            <div className={styles.sectionFields}>
              <Input id="companyName" name="companyName" label="Nome da empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="KZN eSports" required error={validationErrors.companyName} autoComplete="organization" disabled={isLoading} />
              <Input id="companyEmail" name="companyEmail" label="Email da empresa" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="contato@empresa.com" required error={validationErrors.companyEmail} autoComplete="email" disabled={isLoading} />
              <Input id="companyPhone" name="companyPhone" label="Telefone" type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="(11) 99999-9999" autoComplete="tel" disabled={isLoading} />
            </div>
          </div>

          {/* Section: User */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h2 className={styles.sectionTitle}>Dados do responsável</h2>
            </div>

            <div className={styles.ownerBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Você será o administrador principal da empresa
            </div>

            <div className={styles.sectionFields}>
              <Input id="userName" name="userName" label="Seu nome" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Seu nome completo" required error={validationErrors.userName} autoComplete="name" disabled={isLoading} />
              <Input id="userEmail" name="userEmail" label="Seu email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="seu@email.com" required error={validationErrors.userEmail} autoComplete="email" disabled={isLoading} />
              <Input id="userPassword" name="userPassword" label="Senha" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required error={validationErrors.userPassword} autoComplete="new-password" disabled={isLoading} />
              <Input id="userConfirmPassword" name="userConfirmPassword" label="Confirmar senha" type="password" value={userConfirmPassword} onChange={(e) => setUserConfirmPassword(e.target.value)} placeholder="Repita a senha" required error={validationErrors.userConfirmPassword} autoComplete="new-password" disabled={isLoading} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "var(--accent-primary)",
              border: "none",
              borderRadius: "9999px",
              cursor: isLoading ? "wait" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "all 0.25s ease",
            }}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Criando empresa...
              </>
            ) : (
              "Criar empresa"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
