"use client";

import { useState } from "react";
import { useScroll } from "@/hooks/useScroll";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./Header.module.scss";

const NAV_LINKS = [
  { label: "Influenciadores", href: "#influencers" },
  { label: "Benefícios", href: "#benefits" },
  { label: "Sobre", href: "#about" },
  { label: "Dúvidas", href: "#faq" },
];

export function Header() {
  const { isScrolled } = useScroll(60);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerClasses = [
    styles.header,
    isScrolled && styles.scrolled,
  ]
    .filter(Boolean)
    .join(" ");

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={headerClasses}>
        <div className={styles.inner}>
          <a href="#" className={styles.logo} aria-label="KZN - Página inicial">
            K<span className={styles.logoAccent}>Z</span>N
          </a>

          <nav className={styles.nav} aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />
            <ButtonLink href="#cta" variant="primary" size="sm">
              Entrar no Grupo
            </ButtonLink>
            <button
              className={styles.menuButton}
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              type="button"
            >
              <svg className={styles.menuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <button className={styles.closeButton} onClick={closeMobile} aria-label="Fechar menu" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.mobileNavLink}
            onClick={closeMobile}
          >
            {link.label}
          </a>
        ))}
        <ButtonLink href="#cta" variant="primary" size="lg" onClick={closeMobile}>
          Entrar no Grupo
        </ButtonLink>
      </div>
    </>
  );
}
