"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { useRegisterInvite } from "@/hooks/useRegisterInvite";
import { toast } from "@/components/ui/Toast";
import styles from "@/app/(auth)/register/invite/[token]/invite.module.scss";

export function RegisterInviteForm({ token }: { token: string }) {
  const router = useRouter();
  const { register, isLoading: registerLoading } = useRegisterInvite();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errors.name = "Nome deve ter no mínimo 3 caracteres.";
    if (!email.trim()) errors.email = "Email é obrigatório.";
    if (!password) errors.password = "Senha é obrigatória.";
    if (password.length > 0 && password.length < 6) errors.password = "Senha deve ter no mínimo 6 caracteres.";
    if (password !== confirmPassword) errors.confirmPassword = "As senhas não coincidem.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ name, email, password, confirmPassword, token });
      toast.success("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao realizar cadastro.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input id="name" name="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" required error={validationErrors.name} autoComplete="name" disabled={registerLoading} />
      <Input id="email" name="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required error={validationErrors.email} autoComplete="email" disabled={registerLoading} />
      <Input id="password" name="password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required error={validationErrors.password} autoComplete="new-password" disabled={registerLoading} />
      <Input id="confirmPassword" name="confirmPassword" label="Confirmar senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required error={validationErrors.confirmPassword} autoComplete="new-password" disabled={registerLoading} />

      <button
        type="submit"
        disabled={registerLoading}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          width: "100%", padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: 600,
          color: "#ffffff", background: "var(--accent-primary)", border: "none",
          borderRadius: "9999px", cursor: registerLoading ? "wait" : "pointer",
          opacity: registerLoading ? 0.7 : 1, transition: "all 0.25s ease",
        }}
      >
        {registerLoading ? (
          <><span className={styles.spinner} />Criando conta...</>
        ) : (
          "Criar conta"
        )}
      </button>
    </form>
  );
}
