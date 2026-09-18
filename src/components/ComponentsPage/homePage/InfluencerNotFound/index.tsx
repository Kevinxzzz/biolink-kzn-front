import styles from "./InfluencerNotFound.module.scss";

export function InfluencerNotFound() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 11-12.728 0M12 9v4m0 4h.01"
              />
            </svg>
          </div>

          <h1 className={styles.title}>Influenciador não encontrado</h1>

          <p className={styles.description}>
            O link que você acessou está incorreto ou o influenciador não está
            mais disponível na plataforma.
          </p>

          <a href="/" className={styles.cta}>
            Voltar para o início
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.ctaIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
