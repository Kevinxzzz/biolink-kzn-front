import { FloatingBackground } from "@/components/animations/FloatingBackground";
import Link from "next/link";
import styles from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export function AuthLayout({
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className={styles.layout}>
      <FloatingBackground />

      <Link href="/" className={styles.logo} aria-label="KZN - Página inicial">
        K<span className={styles.logoAccent}>Z</span>N
      </Link>

      <div className={styles.content}>
        {children}
      </div>

      {footerText && footerLinkHref && (
        <div className={styles.footer}>
          <a href={footerLinkHref} className={styles.footerLink}>
            {footerText} <strong>{footerLinkText}</strong>
          </a>
        </div>
      )}
    </div>
  );
}
