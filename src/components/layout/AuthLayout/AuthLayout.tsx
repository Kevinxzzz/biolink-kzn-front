import { FloatingBackground } from "@/components/animations/FloatingBackground";
import Link from "next/link";
import Image from "next/image";
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
        <Image
          src="/logos/KZN-ROXO.png"
          alt="KZN"
          width={150}
          height={63}
          priority
          className={styles.logoImage}
        />
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
