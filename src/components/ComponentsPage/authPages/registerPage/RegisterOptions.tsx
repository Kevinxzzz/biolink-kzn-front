import styles from "@/app/(auth)/register/register.module.scss";

export function RegisterOptions() {
  return (
    <div className={styles.options}>
      <a href="/register/company" className={styles.option}>
        <div className={styles.optionIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className={styles.optionContent}>
          <h2 className={styles.optionTitle}>Criar uma empresa</h2>
          <p className={styles.optionDescription}>
            Registre sua empresa e torne-se o administrador principal.
          </p>
        </div>
        <div className={styles.optionArrow}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </a>
    </div>
  );
}
