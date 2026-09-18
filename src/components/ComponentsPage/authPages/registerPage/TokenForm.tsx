"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(auth)/register/register.module.scss";

export function TokenForm() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleTokenSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/register/invite/${token.trim()}`);
    }
  };

  return (
    <div className={styles.tokenSection}>
      <p className={styles.tokenLabel}>Já tem um convite? Informe o token abaixo</p>
      <form className={styles.tokenForm} onSubmit={handleTokenSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ex: KZN-A1B2C3D4"
          className={styles.tokenInput}
          aria-label="Token de convite"
        />
        <button
          type="submit"
          className={styles.tokenButton}
          disabled={!token.trim()}
        >
          Validar
        </button>
      </form>
    </div>
  );
}
